import type { Habit } from '../types'

type Props = {
  habit: Habit
  onCheckIn: (habitId: string) => void
  onArchive: (habitId: string) => void
}

export function HabitItem({ habit, onCheckIn, onArchive }: Props) {
  return (
    <li className="habit-item">
      <span className="habit-item-name">{habit.name}</span>
      <span className="habit-item-category">{habit.category}</span>
      <button
        type="button"
        aria-label={`${habit.name}をチェックイン`}
        onClick={() => onCheckIn(habit.id)}
      >
        ✓
      </button>
      <button
        type="button"
        aria-label={`${habit.name}をアーカイブ`}
        onClick={() => onArchive(habit.id)}
      >
        アーカイブ
      </button>
    </li>
  )
}
