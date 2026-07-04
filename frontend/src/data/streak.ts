import type { HabitLog } from '../types'

function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function calculateStreak(logs: HabitLog[], today: Date): number {
  const checkedDates = new Set(logs.map((log) => log.checkedDate))
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  let streak = 0
  while (checkedDates.has(toDateKey(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}
