'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface WeeklyStatsChartProps {
  sessions: any[]
}

export function WeeklyStatsChart({ sessions }: WeeklyStatsChartProps) {
  const getWeeklyData = () => {
    const data = [
      { day: 'Mon', hours: 0 },
      { day: 'Tue', hours: 0 },
      { day: 'Wed', hours: 0 },
      { day: 'Thu', hours: 0 },
      { day: 'Fri', hours: 0 },
      { day: 'Sat', hours: 0 },
      { day: 'Sun', hours: 0 },
    ]

    const today = new Date()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())

    sessions.forEach((session) => {
      const sessionDate = new Date(session.timestamp || session.date)
      if (sessionDate >= weekStart && sessionDate <= today) {
        const dayIndex = sessionDate.getDay()
        data[dayIndex].hours += (session.duration || 0) / 60
      }
    })

    return data.map((d) => ({
      ...d,
      hours: Math.round(d.hours * 10) / 10,
    }))
  }

  const data = getWeeklyData()
  const colors = ['oklch(0.6 0.18 185)', 'oklch(0.6 0.18 185)', 'oklch(0.6 0.18 185)', 'oklch(0.6 0.18 185)', 'oklch(0.6 0.18 185)', 'oklch(0.6 0.18 185)', 'oklch(0.6 0.18 185)']

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 120)" />
        <XAxis dataKey="day" stroke="oklch(0.7 0 0)" />
        <YAxis stroke="oklch(0.7 0 0)" label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
        <Tooltip
          contentStyle={{ backgroundColor: 'oklch(0.15 0.01 120)', border: '1px solid oklch(0.25 0.01 120)' }}
          labelStyle={{ color: 'oklch(0.96 0 0)' }}
        />
        <Bar dataKey="hours" fill="oklch(0.6 0.18 185)" animationDuration={800} className="bar-animate">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
