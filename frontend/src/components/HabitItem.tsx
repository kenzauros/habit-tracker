import { useState } from "react";
import type { Habit } from "../data/types";

interface Props {
  habit: Habit;
  checked: boolean;
  streak: number;
  isEditing: boolean;
  editValue: string;
  editCategory: string;
  editCategoryPlaceholder: string;
  onEditValueChange: (v: string) => void;
  onEditCategoryChange: (v: string) => void;
  onStartEdit: () => void;
  onCommitEdit: () => void;
  onCancelEdit: () => void;
  onCheckIn: () => void;
  onArchive: () => void;
}

export function HabitItem({
  habit,
  checked,
  streak,
  isEditing,
  editValue,
  editCategory,
  editCategoryPlaceholder,
  onEditValueChange,
  onEditCategoryChange,
  onStartEdit,
  onCommitEdit,
  onCancelEdit,
  onCheckIn,
  onArchive,
}: Props) {
  const [pendingArchive, setPendingArchive] = useState(false);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") onCommitEdit();
    if (e.key === "Escape") onCancelEdit();
  }

  function handleContainerBlur(e: React.FocusEvent<HTMLDivElement>) {
    const container = e.currentTarget;
    if (!container.contains(e.relatedTarget as Node)) {
      // Delay to let datalist's onChange fire before committing
      // (blur fires before the change event when selecting from a datalist)
      setTimeout(() => {
        if (!container.contains(document.activeElement)) {
          onCommitEdit();
        }
      }, 0);
    }
  }

  return (
    <li className={`habit-item${checked ? " checked" : ""}${isEditing ? " editing" : ""}`}>
      {isEditing ? (
        <div className="edit-fields" onBlur={handleContainerBlur}>
          <input
            className="edit-input"
            autoFocus
            aria-label="習慣名"
            value={editValue}
            onChange={(e) => onEditValueChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="習慣名"
          />
          <input
            className="edit-input edit-cat"
            list="categories-list"
            aria-label="カテゴリ"
            value={editCategory}
            onChange={(e) => onEditCategoryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={editCategoryPlaceholder || "カテゴリ（任意）"}
          />
        </div>
      ) : (
        <span className="habit-name">{habit.name}</span>
      )}
      <span className="streak" title="連続日数">
        🔥 {streak}日
      </span>
      <button
        className="icon-btn"
        title={isEditing ? "編集を確定" : "名前を編集"}
        onClick={isEditing ? onCommitEdit : onStartEdit}
        onMouseDown={isEditing ? (e) => e.preventDefault() : undefined}
      >
        ✏️
      </button>
      <button className="checkin-btn" onClick={onCheckIn} disabled={checked}>
        {checked ? "✓ 済" : "Check in"}
      </button>
      {pendingArchive ? (
        <span className="archive-confirm">
          <span className="archive-confirm-label">アーカイブ？</span>
          <button
            className="icon-btn archive-confirm-yes"
            aria-label="アーカイブを確定"
            onClick={() => { onArchive(); setPendingArchive(false); }}
          >
            する
          </button>
          <button
            className="icon-btn"
            aria-label="キャンセル"
            onClick={() => setPendingArchive(false)}
          >
            やめる
          </button>
        </span>
      ) : (
        <button
          className="icon-btn archive-btn"
          aria-label="アーカイブ"
          title="アーカイブ"
          onClick={() => setPendingArchive(true)}
        >
          📦
        </button>
      )}
    </li>
  );
}
