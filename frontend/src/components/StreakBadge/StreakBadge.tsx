import type { HabitLog } from '../../types'
import { useStreakBadge } from '../../hooks/useStreakBadge'

type Props = {
  today: Date
  logs: HabitLog[]
}

export function StreakBadge({ today, logs }: Props) {
  const { streak } = useStreakBadge(today, logs)

  if (streak === 0) {
    return <span className="streak-badge streak-badge-empty">記録なし</span>
  }

  return (
    <span className="streak-badge" aria-label={`${streak}日連続達成`}>
      🔥 {streak}日
    </span>
  )
}
