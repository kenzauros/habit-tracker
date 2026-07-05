import type { Habit } from "../data/types";
import { toLocalDateString } from "../data/streak";
import { useWeekNav } from "../hooks/useWeekNav";
import styles from "./WeeklyCalendar.module.css";

const DAY_LABELS = ["月", "火", "水", "木", "金", "土", "日"];
function formatMonthDay(dateStr: string): string {
  const [, m, d] = dateStr.split("-");
  return `${Number(m)}/${Number(d)}`;
}
interface Props {
  habits: Habit[];
}

export function WeeklyCalendar({ habits }: Props) {
  const today = toLocalDateString(new Date());
  const { weekDates, offset, prevWeek, nextWeek, goToday } = useWeekNav();

  if (habits.length === 0) return null;

  return (
    <section className={styles.section} aria-label="週次カレンダー">
      <div className={styles.nav}>
        <button onClick={prevWeek} aria-label="前の週" className={styles.navBtn}>‹</button>
        <span className={styles.weekLabel}>
          {formatMonthDay(weekDates[0])} – {formatMonthDay(weekDates[6])}
        </span>
        <button onClick={nextWeek} aria-label="次の週" className={styles.navBtn}>›</button>
        {offset !== 0 && (
          <button onClick={goToday} className={styles.todayBtn}>今週</button>
        )}
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.nameCol} scope="col" />
              {weekDates.map((date, i) => (
                <th
                  key={date}
                  scope="col"
                  className={`${styles.dayCol} ${date === today ? styles.todayCol : ""}`}
                >
                  <span className={styles.dayName}>{DAY_LABELS[i]}</span>
                  <span className={styles.dayNum}>{Number(date.slice(8))}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {habits.map((habit) => (
              <tr key={habit.id} className={styles.row}>
                <td className={styles.habitName} title={habit.name}>
                  {habit.name}
                </td>
                {weekDates.map((date) => {
                  const checked = habit.checkedDates.includes(date);
                  const isFuture = date > today;
                  return (
                    <td
                      key={date}
                      className={`${styles.cell} ${date === today ? styles.todayCol : ""}`}
                      aria-label={`${habit.name} ${date} ${checked ? "達成" : "未達成"}`}
                    >
                      <span
                        className={`${styles.dot} ${checked ? styles.dotChecked : ""} ${isFuture ? styles.dotFuture : ""}`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
