"use client"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { motion } from "framer-motion"

export function PerformanceTrend({
  data,
}: {
  data: Array<{ match: number; runs: number; wickets: number }>
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
      <div className="px-2 pb-1">
        <h4 className="text-sm font-semibold">Performance Trend (last matches)</h4>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="match" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="runs" stroke="#059669" strokeWidth={2} dot={false} isAnimationActive />
            <Line type="monotone" dataKey="wickets" stroke="#f59e0b" strokeWidth={2} dot isAnimationActive />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
