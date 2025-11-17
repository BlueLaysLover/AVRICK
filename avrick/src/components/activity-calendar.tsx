'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'

interface ActivityCalendarProps {
  activityData: { [key: string]: number }
}

export function ActivityCalendar({ activityData }: ActivityCalendarProps) {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)
  const today = new Date()
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - 365)

  // Create array of past 52 weeks
  const weeks: Array<Array<{ date: Date; count: number }>> = []
  let currentWeek: Array<{ date: Date; count: number }> = []

  for (let i = 364; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    const dateStr = date.toLocaleDateString()
    const count = activityData[dateStr] || 0

    currentWeek.push({ date, count })

    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek)
  }

  const getColor = (count: number) => {
    if (count === 0) return 'bg-border/20'
    if (count < 30) return 'bg-accent/30'
    if (count < 60) return 'bg-accent/60'
    if (count < 120) return 'bg-accent/80'
    return 'bg-accent'
  }

  const getHours = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours === 0) return `${mins}m`
    if (mins === 0) return `${hours}h`
    return `${hours}h ${mins}m`
  }

  return (
    <div>
      <div className="mb-6 grid gap-1 overflow-x-auto pb-4" style={{ gridTemplateColumns: `repeat(${weeks.length}, 1fr)` }}>
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="flex flex-col gap-1">
            {week.map((day, dayIdx) => (
              <div key={dayIdx} className="relative group">
                <div
                  className={`w-4 h-4 rounded-sm transition-all hover:ring-2 hover:ring-accent/50 cursor-pointer ${getColor(day.count)}`}
                  onMouseEnter={() => setHoveredDate(day.date.toLocaleDateString())}
                  onMouseLeave={() => setHoveredDate(null)}
                />
                {hoveredDate === day.date.toLocaleDateString() && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-card border border-border/50 rounded-md text-xs whitespace-nowrap z-50 pointer-events-none">
                    <p className="font-medium">{getHours(day.count)}</p>
                    <p className="text-muted-foreground text-xs">{day.date.toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-3 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-border/20"></div>
          <div className="w-3 h-3 rounded-sm bg-accent/30"></div>
          <div className="w-3 h-3 rounded-sm bg-accent/60"></div>
          <div className="w-3 h-3 rounded-sm bg-accent/80"></div>
          <div className="w-3 h-3 rounded-sm bg-accent"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  )
}
