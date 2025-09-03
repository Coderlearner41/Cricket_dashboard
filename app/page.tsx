"use client"
import useSWR from "swr"
import { useState } from "react"
import { motion } from "framer-motion"
import { PlayerSearch } from "@/components/player-search"
import { ChatPanel } from "@/components/chat-panel"
import { PerformanceTrend } from "@/components/charts/performance-trend"
import { PlayerComparison } from "@/components/charts/player-comparison"
import { CareerProgression } from "@/components/charts/career-progression"
import { Card } from "@/components/ui/card"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function Page() {
  const [player, setPlayer] = useState("Virat Kohli")
  const { data, error, isLoading } = useSWR(
    `/api/player-data?player=${encodeURIComponent(player)}`,
    fetcher
  )

  return (
    <div className="min-h-dvh bg-background text-foreground p-4">
      {/* Player search */}
      <section className="mb-4 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <PlayerSearch value={player} onChange={setPlayer} />
        </motion.div>
      </section>

      {/* Charts + Chat */}
      <section className="grid lg:grid-cols-[2fr_1fr] gap-4 max-w-7xl mx-auto">
        {/* Charts (Left) */}
        <div className="grid gap-4">
          {isLoading && (
            <Card className="p-4 text-sm text-muted-foreground">
              Loading player data…
            </Card>
          )}
          {error && (
            <Card className="p-4 text-sm text-red-600 dark:text-red-400">
              Failed to load player data.
            </Card>
          )}
          {!isLoading && !error && data && (
            <>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Matches</div>
                  <div className="text-2xl font-semibold">{data.summary.matches}</div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Runs</div>
                  <div className="text-2xl font-semibold">{data.summary.runs}</div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Strike Rate</div>
                  <div className="text-2xl font-semibold">{data.summary.strikeRate}</div>
                </Card>
              </div>

              <Card className="p-3">
                <PerformanceTrend data={data.performanceTrend} />
              </Card>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Card className="p-3">
                  <PlayerComparison
                    labels={data.comparisons.labels}
                    self={data.comparisons.self}
                    peer={data.comparisons.peer}
                  />
                </Card>
                <Card className="p-3">
                  <CareerProgression data={data.careerProgression} />
                </Card>
              </div>
            </>
          )}
        </div>

        {/* Chat Panel (Right) */}
        <div>
          <Card className="p-3 h-full">
            <ChatPanel player={player} />
          </Card>
        </div>
      </section>
    </div>
  )
}
