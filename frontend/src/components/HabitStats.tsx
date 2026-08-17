import { calculateLongestStreak } from "../data/streak";
import { useHabits } from "../hooks/useHabits";

interface Props {
  habitId: string;
}

export function HabitStats({ habitId }: Props) {
  const { habits } = useHabits();
  const habit = habits.find((item) => item.id === habitId);

  if (!habit) {
    return <p className="habit-stats-empty">対象の習慣が見つかりません。</p>;
  }

  return (
    <section className="habit-stats" aria-label="最長連続記録">
      <h2>最長連続記録</h2>
      <p className="habit-stats-value">🏆 {calculateLongestStreak(habit.checkIns)}日</p>
    </section>
  );
}
