import type { HabitLog } from '../types'

export type DayCell = {
  date: string
  day: number
  checked: boolean
}

function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function buildMonthlyHeatmap(monthAnchor: Date, logs: HabitLog[]): DayCell[] {
  const checkedDates = new Set(logs.map((log) => log.checkedDate))
  const start = startOfMonth(monthAnchor)
  const daysInMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate()

  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1
    const date = toDateKey(new Date(start.getFullYear(), start.getMonth(), day))
    return { date, day, checked: checkedDates.has(date) }
  })
}

export function formatMonthLabel(monthAnchor: Date) {
  return `${monthAnchor.getFullYear()}年${monthAnchor.getMonth() + 1}月`
}
