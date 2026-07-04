import type { HabitLog } from '../types'
import { calculateStreak } from '../data/streak'

export function useStreakBadge(today: Date, logs: HabitLog[]) {
  const streak = calculateStreak(logs, today)
  return { streak }
}
