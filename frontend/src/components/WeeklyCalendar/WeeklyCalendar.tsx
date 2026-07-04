import { useWeekNav } from '../../hooks/useWeekNav'

type Props = {
  today: Date
}

export function WeeklyCalendar({ today }: Props) {
  const { days, goToPreviousWeek, goToNextWeek } = useWeekNav(today)

  return (
    <div className="weekly-calendar" aria-label="週間カレンダー">
      <div className="weekly-calendar-nav">
        <button type="button" aria-label="前の週へ" onClick={goToPreviousWeek}>
          ◀
        </button>
        <button type="button" aria-label="次の週へ" onClick={goToNextWeek}>
          ▶
        </button>
      </div>
      <ul className="weekly-calendar-days">
        {days.map((day) => (
          <li key={day} className="weekly-calendar-day">
            {day}
          </li>
        ))}
      </ul>
    </div>
  )
}
