'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface MonthlyStatsChartProps {
  sessions: any[]
}

export function MonthlyStatsChart({ sessions }: MonthlyStatsChartProps) {
  const getMonthlyData = () => {
    const today = new Date()
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()

    const data = []
    for (let i = 1; i <= daysInMonth; i++) {
      data.push({
        day: i,
        hours: 0,
        date: new Date(today.getFullYear(), today.getMonth(), i).toLocaleDateString(),
      })
    }

    sessions.forEach((session) => {
      const sessionDate = new Date(session.timestamp || session.date)
      if (sessionDate >= monthStart && sessionDate <= today) {
        const dayIndex = sessionDate.getDate() - 1
        if (dayIndex >= 0 && dayIndex < data.length) {
          data[dayIndex].hours += (session.duration || 0) / 60
        }
      }
    })

    return data.map((d) => ({
      ...d,
      hours: Math.round(d.hours * 10) / 10,
    }))
  }

  const data = getMonthlyData()

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 120)" />
        <XAxis
          dataKey="day"
          stroke="oklch(0.7 0 0)"
          interval={Math.floor(data.length / 8)}
        />
        <YAxis stroke="oklch(0.7 0 0)" label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
        <Tooltip
          contentStyle={{ backgroundColor: 'oklch(0.15 0.01 120)', border: '1px solid oklch(0.25 0.01 120)' }}
          labelStyle={{ color: 'oklch(0.96 0 0)' }}
        />
        <Line
          type="monotone"
          dataKey="hours"
          stroke="oklch(0.6 0.18 185)"
          dot={false}
          strokeWidth={2}
          animationDuration={1000}
          className="line-animate"
          isAnimationActive={true}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
