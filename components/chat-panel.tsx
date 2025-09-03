"use client"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { motion, AnimatePresence } from "framer-motion"

type Message = { role: "user" | "assistant" | "system"; content: string }

const LOCAL_STORAGE_KEY = "cricket_chat_history"

export function ChatPanel({ player }: { player: string }) {
  const [chatStore, setChatStore] = useState<Record<string, Message[]>>({})
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load chat from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (stored) {
      setChatStore(JSON.parse(stored))
    }
  }, [])

  // Update messages when player changes
  useEffect(() => {
    setMessages(
      chatStore[player] ?? [
        { role: "system", content: "Ask anything about the selected player." },
      ]
    )
  }, [player, chatStore])

  // Save to localStorage whenever chatStore updates
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(chatStore))
  }, [chatStore])

  async function onSend() {
    const text = input.trim()
    if (!text) return
    setError(null)
    setInput("")
    const newMessages: Message[] = [...messages, { role: "user", content: text }]
    setMessages(newMessages)
    setChatStore((prev) => ({ ...prev, [player]: newMessages as Message[] }))

    setLoading(true)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ player, query: text }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || `Request failed (${res.status})`)
      }
      const data = await res.json()
      const withReply = [...newMessages, { role: "assistant" as const, content: String(data.text || "…") }]
      setMessages(withReply)
      setChatStore((prev) => ({ ...prev, [player]: withReply as Message[] }))
    } catch (e: any) {
      setError(e?.message || "Something went wrong.")
      console.log("[v0] ChatPanel error:", e?.message || e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="flex h-full flex-col">
      <div className="border-b px-4 py-3">
        <h3 className="text-sm font-semibold">Chat about {player}</h3>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={
                m.role === "assistant"
                  ? "rounded-md bg-muted px-3 py-2 text-sm"
                  : m.role === "user"
                    ? "ml-auto max-w-[80%] rounded-md bg-emerald-600 px-3 py-2 text-sm text-white"
                    : "text-xs text-muted-foreground"
              }
            >
              {m.content}
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
            Thinking…
          </motion.div>
        )}
        {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
      </div>

      <div className="border-t p-3">
        <div className="flex items-end gap-2">
          <Textarea
            placeholder="Ask a question…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                onSend()
              }
            }}
            rows={2}
          />
          <Button disabled={loading || !input.trim()} onClick={onSend}>
            Send
          </Button>
        </div>
      </div>
    </Card>
  )
}
