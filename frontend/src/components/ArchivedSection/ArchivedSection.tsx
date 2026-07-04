import type { Habit } from '../../types'

type Props = {
  habits: Habit[]
  onRestore: (habitId: string) => void
}

export function ArchivedSection({ habits, onRestore }: Props) {
  if (habits.length === 0) {
    return <p className="archived-section-empty">アーカイブ済みの習慣はありません</p>
  }

  return (
    <ul className="archived-section">
      {habits.map((habit) => (
        <li key={habit.id} className="archived-section-item">
          <span>{habit.name}</span>
          <button
            type="button"
            aria-label={`${habit.name}を復元`}
            onClick={() => onRestore(habit.id)}
          >
            復元
          </button>
        </li>
      ))}
    </ul>
  )
}
