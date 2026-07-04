import { useState } from 'react'
import type { HabitLog } from '../types'
import { buildMonthlyHeatmap, formatMonthLabel, startOfMonth } from '../data/monthlyHeatmap'

export function useMonthlyHeatmap(today: Date, logs: HabitLog[]) {
  const [monthAnchor, setMonthAnchor] = useState(() => startOfMonth(today))

  const days = buildMonthlyHeatmap(monthAnchor, logs)
  const monthLabel = formatMonthLabel(monthAnchor)

  function goToPreviousMonth() {
    setMonthAnchor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  function goToNextMonth() {
    setMonthAnchor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  return { days, monthLabel, goToPreviousMonth, goToNextMonth }
}
