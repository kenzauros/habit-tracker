import type { HabitLog } from '../../types'
import { useMonthlyHeatmap } from '../../hooks/useMonthlyHeatmap'

type Props = {
  today: Date
  logs: HabitLog[]
}

export function MonthlyHeatmap({ today, logs }: Props) {
  const { days, monthLabel, goToPreviousMonth, goToNextMonth } = useMonthlyHeatmap(today, logs)

  return (
    <div className="monthly-heatmap" aria-label="月間ヒートマップ">
      <div className="monthly-heatmap-nav">
        <button type="button" aria-label="前の月へ" onClick={goToPreviousMonth}>
          ◀
        </button>
        <span className="monthly-heatmap-label">{monthLabel}</span>
        <button type="button" aria-label="次の月へ" onClick={goToNextMonth}>
          ▶
        </button>
      </div>
      <ul className="monthly-heatmap-days">
        {days.map((day) => (
          <li
            key={day.date}
            className={`monthly-heatmap-day${day.checked ? ' monthly-heatmap-day-checked' : ''}`}
          >
            {day.day}
          </li>
        ))}
      </ul>
    </div>
  )
}
