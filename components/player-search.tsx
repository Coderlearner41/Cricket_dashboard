"use client"
import { useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const PLAYERS = [
  "Virat Kohli",
  "Rohit Sharma",
  "Kane Williamson",
  "Joe Root",
  "Babar Azam",
  "Steve Smith",
  "David Warner",
  "Ben Stokes",
  "Shubman Gill",
  "KL Rahul",
  "Jasprit Bumrah",
  "Rashid Khan",
  "Hardik Pandya",
  "MS Dhoni",
]

export function PlayerSearch({
  value,
  onChange,
}: {
  value: string
  onChange: (player: string) => void
}) {
  const [query, setQuery] = useState(value)
  const [open, setOpen] = useState(false)

  // Filter players based on input
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return PLAYERS.filter((p) => p.toLowerCase().includes(q)).slice(0, 8)
  }, [query])

  // Inline suggestion (first match)
  const suggestion = useMemo(() => {
    if (!query) return ""
    const firstMatch = results[0]
    if (!firstMatch) return ""
    return firstMatch.toLowerCase().startsWith(query.toLowerCase())
      ? firstMatch.slice(query.length)
      : ""
  }, [query, results])

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Select Player</label>
      <div className="relative">
        <Input
          placeholder="Search players..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onKeyDown={(e) => {
            if (e.key === "Tab" && suggestion) {
              e.preventDefault()
              setQuery(query + suggestion)
              onChange(query + suggestion)
              setOpen(false)
            }
          }}
          aria-label="Player search"
        />
        {/* Inline suggestion */}
        {suggestion && query && (
          <div className="absolute top-0 left-0 h-full w-full pointer-events-none px-3 py-2 text-sm text-muted-foreground">
            {query}
            <span className="text-gray-400">{suggestion}</span>
          </div>
        )}
        {/* Dropdown */}
        {open && results.length > 0 && (
          <Card className="absolute z-10 mt-1 w-full overflow-hidden">
            <ul role="listbox" className="max-h-64 divide-y">
              {results.map((name) => (
                <li key={name}>
                  <button
                    role="option"
                    aria-selected={name === value}
                    onClick={() => {
                      onChange(name)
                      setQuery(name)
                      setOpen(false)
                    }}
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-muted"
                  >
                    {name}
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </div>
  )
}
