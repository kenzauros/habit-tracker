import { useState } from "react";
import type { Habit } from "../data/types";
import type { HabitResult } from "../data/habit";
import { HABIT_ERROR_MESSAGES } from "../data/habit";

interface Props {
  habit: Habit;
  streak: number;
  checkedInToday: boolean;
  onCheckIn: (id: string) => void;
  onEdit: (id: string, name: string, category: string) => Promise<HabitResult>;
  onArchive: (id: string) => void;
  onDragStart: (id: string) => void;
}

export function HabitItem({
  habit,
  streak,
  checkedInToday,
  onCheckIn,
  onEdit,
  onArchive,
  onDragStart,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(habit.name);
  const [draftCategory, setDraftCategory] = useState(habit.category);
  const [error, setError] = useState<string | null>(null);

  function startEditing() {
    setDraftName(habit.name);
    setDraftCategory(habit.category);
    setError(null);
    setIsEditing(true);
  }

  async function saveEdit() {
    const result = await onEdit(habit.id, draftName, draftCategory);
    if (!result.ok) {
      setError(HABIT_ERROR_MESSAGES[result.error]);
      return;
    }
    setError(null);
    setIsEditing(false);
  }

  function cancelEdit() {
    setError(null);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <li className="habit-item">
        <div className="habit-edit-row">
          <input
            type="text"
            className="habit-name-input"
            value={draftName}
            onChange={(event) => {
              setDraftName(event.target.value);
              setError(null);
            }}
            aria-label="習慣名を編集"
            autoFocus
          />
          <input
            type="text"
            className="category-input"
            value={draftCategory}
            onChange={(event) => setDraftCategory(event.target.value)}
            placeholder="カテゴリ(任意)"
            aria-label="カテゴリを編集"
          />
          <button type="button" className="save-button" onClick={saveEdit}>
            保存
          </button>
          <button type="button" className="cancel-button" onClick={cancelEdit}>
            キャンセル
          </button>
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </li>
    );
  }

  return (
    <li className="habit-item">
      <div className="habit-info">
        <span className="drag-handle" onPointerDown={() => onDragStart(habit.id)} />
        <span className="habit-name">{habit.name}</span>
        <span className="habit-streak">🔥 {streak}日</span>
      </div>
      <div className="habit-actions">
        <button
          type="button"
          className="check-in-button"
          disabled={checkedInToday}
          onClick={() => onCheckIn(habit.id)}
        >
          {checkedInToday ? "完了" : "今日のチェック"}
        </button>
        <button type="button" className="edit-button" onClick={startEditing}>
          編集
        </button>
        <button
          type="button"
          className="archive-button"
          onClick={() => onArchive(habit.id)}
        >
          アーカイブ
        </button>
      </div>
    </li>
  );
}
