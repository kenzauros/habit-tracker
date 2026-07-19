import type { WeeklyDayColumn, WeeklyHabitRow } from "../hooks/selectors";

interface Props {
  days: WeeklyDayColumn[];
  rows: WeeklyHabitRow[];
}

export function WeeklyCalendar({ days, rows }: Props) {
  return (
    <section className="weekly-calendar">
      <h2>今週のカレンダー</h2>
      {rows.length === 0 ? (
        <p className="empty-message">表示できる習慣がありません。</p>
      ) : (
        <table className="weekly-calendar-table">
          <thead>
            <tr>
              <th scope="col" className="weekly-habit-name">
                習慣
              </th>
              {days.map((day) => (
                <th key={day.date} scope="col" className={day.isToday ? "is-today" : undefined}>
                  <span className="weekly-weekday">{day.weekdayLabel}</span>
                  <span className="weekly-day">{day.dayOfMonth}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <th scope="row" className="weekly-habit-name">
                  {row.name}
                </th>
                {row.checkedDays.map((checked, index) => (
                  <td key={days[index].date} className={days[index].isToday ? "is-today" : undefined}>
                    <span
                      className={checked ? "weekly-check-mark" : "weekly-check-empty"}
                      aria-label={checked ? "チェック済み" : "未チェック"}
                    >
                      {checked ? "●" : "○"}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
