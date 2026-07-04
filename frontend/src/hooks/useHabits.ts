import { useState } from 'react'
import type { Habit } from '../types'

const initialHabits: Habit[] = [
  {
    id: 'habit-1',
    name: '読書',
    category: '学習',
    archived: false,
    logs: [{ checkedDate: '2026-07-01' }, { checkedDate: '2026-07-02' }],
  },
  {
    id: 'habit-2',
    name: 'ストレッチ',
    category: '健康',
    archived: false,
    logs: [],
  },
]

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(initialHabits)

  const activeHabits = habits.filter((habit) => !habit.archived)
  const archivedHabits = habits.filter((habit) => habit.archived)

  function checkIn(habitId: string) {
    const today = new Date()
    const checkedDate = `${today.getFullYear()}-${`${today.getMonth() + 1}`.padStart(2, '0')}-${`${today.getDate()}`.padStart(2, '0')}`
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === habitId
          ? { ...habit, logs: [...habit.logs, { checkedDate }] }
          : habit,
      ),
    )
  }

  function archive(habitId: string) {
    setHabits((prev) =>
      prev.map((habit) => (habit.id === habitId ? { ...habit, archived: true } : habit)),
    )
  }

  function restore(habitId: string) {
    setHabits((prev) =>
      prev.map((habit) => (habit.id === habitId ? { ...habit, archived: false } : habit)),
    )
  }

  return { habits, activeHabits, archivedHabits, checkIn, archive, restore }
}
