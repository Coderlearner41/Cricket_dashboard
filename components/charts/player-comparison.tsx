"use client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { motion } from "framer-motion"

export function PlayerComparison({
  labels,
  self,
  peer,
}: {
  labels: string[]
  self: number[]
  peer: number[]
}) {
  const data = labels.map((label, i) => ({
    label,
    self: self[i],
    peer: peer[i],
  }))

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
      <div className="px-2 pb-1">
        <h4 className="text-sm font-semibold">Player Comparison</h4>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="self" fill="#059669" isAnimationActive />
            <Bar dataKey="peer" fill="#94a3b8" isAnimationActive />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
