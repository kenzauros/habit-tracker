import type { Habit } from "../data/types";

interface Props {
  habits: Habit[];
  onRestore: (id: string) => void;
}

export function ArchivedHabitList({ habits, onRestore }: Props) {
  if (habits.length === 0) return null;

  return (
    <section className="archived-section">
      <h2>アーカイブ済み</h2>
      <ul className="archived-list">
        {habits.map((habit) => (
          <li key={habit.id} className="archived-item">
            <span className="habit-name">{habit.name}</span>
            <button
              type="button"
              className="restore-button"
              onClick={() => onRestore(habit.id)}
            >
              元に戻す
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
