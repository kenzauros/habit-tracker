import type { Habit } from '../types'
import { HabitItem } from './HabitItem'

type Props = {
  habits: Habit[]
  onCheckIn: (habitId: string) => void
  onArchive: (habitId: string) => void
}

export function HabitList({ habits, onCheckIn, onArchive }: Props) {
  if (habits.length === 0) {
    return <p className="habit-list-empty">習慣がまだ登録されていません</p>
  }

  return (
    <ul className="habit-list">
      {habits.map((habit) => (
        <HabitItem key={habit.id} habit={habit} onCheckIn={onCheckIn} onArchive={onArchive} />
      ))}
    </ul>
  )
}
