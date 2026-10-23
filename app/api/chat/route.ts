import { NextResponse } from "next/server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const player = body?.player as string | undefined
    const query = body?.query as string | undefined

    if (!query) {
      return NextResponse.json({ error: "Missing 'query' in body." }, { status: 400 })
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json({ error: "Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable." }, { status: 500 })
    }

    const prompt = [
      "You are a helpful cricket analytics assistant.",
      "Provide concise, insightful analysis based on the question.",
      player ? `Player focus: ${player}` : undefined,
      "",
      `User question: ${query}`,
    ]
      .filter(Boolean)
      .join("\n")

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt,
    })

    return NextResponse.json({ text })
  } catch (err: any) {
    console.log("[v0] /api/chat error:", err?.message || err)
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 })
  }
}
