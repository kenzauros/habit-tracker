import { useState } from "react";
import type { Habit } from "../data/types";

interface Props {
  habits: Habit[];
  onUnarchive: (id: string) => void;
}

export function ArchivedSection({ habits, onUnarchive }: Props) {
  const [showArchived, setShowArchived] = useState(false);

  if (habits.length === 0) return null;

  return (
    <div className="archived-section">
      <button
        className="toggle-archived"
        onClick={() => setShowArchived((v) => !v)}
      >
        {showArchived ? "▲" : "▼"} アーカイブ済み ({habits.length})
      </button>
      {showArchived && (
        <ul className="habit-list archived-list">
          {habits.map((habit) => (
            <li key={habit.id} className="habit-item archived-item">
              <span className="habit-name">{habit.name}</span>
              {habit.category && (
                <span className="archived-cat">{habit.category}</span>
              )}
              <button className="unarchive-btn" onClick={() => onUnarchive(habit.id)}>
                元に戻す
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
