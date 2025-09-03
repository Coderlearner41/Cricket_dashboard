"use client"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { motion } from "framer-motion"

export function CareerProgression({
  data,
}: {
  data: Array<{ year: number; runs: number; wickets: number }>
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
      <div className="px-2 pb-1">
        <h4 className="text-sm font-semibold">Career Progression</h4>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="runs" stroke="#059669" fill="#059669" fillOpacity={0.18} isAnimationActive />
            <Area
              type="monotone"
              dataKey="wickets"
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.15}
              isAnimationActive
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
