import { useState } from "react";
import type { CategoryGroup } from "../hooks/selectors";
import type { HabitResult } from "../data/habit";
import { HabitItem } from "./HabitItem";

interface Props {
  groups: CategoryGroup[];
  onCheckIn: (id: string) => void;
  onEdit: (id: string, name: string, category: string) => Promise<HabitResult>;
  onArchive: (id: string) => void;
  onReorder: (id: string, direction: "up" | "down") => void;
}

export function HabitList({ groups, onCheckIn, onEdit, onArchive, onReorder }: Props) {
  const [draggingId, setDraggingId] = useState<string | null>(null);

  function handleDrop(targetId: string, targetIndex: number, sourceIndex: number) {
    if (draggingId === null || draggingId === targetId) return;
    onReorder(draggingId, targetIndex < sourceIndex ? "up" : "down");
    setDraggingId(null);
  }

  if (groups.length === 0) {
    return <p className="empty-message">まだ習慣がありません。上のフォームから追加してください。</p>;
  }

  return (
    <div className="category-groups">
      {groups.map(({ category, color, habits }) => (
        <section key={category} className="category-group">
          <h2 className="category-heading">
            <span
              className="category-badge"
              style={{
                backgroundColor: color.bg,
                color: color.text,
                borderColor: color.border,
              }}
            >
              {category}
            </span>
          </h2>
          <ul className="habit-list">
            {habits.map(({ habit, streak, checkedInToday }, index) => (
              <li
                key={habit.id}
                className="habit-drop-zone"
                onPointerUp={() =>
                  handleDrop(
                    habit.id,
                    index,
                    habits.findIndex(({ habit: h }) => h.id === draggingId),
                  )
                }
              >
                <HabitItem
                  habit={habit}
                  streak={streak}
                  checkedInToday={checkedInToday}
                  onCheckIn={onCheckIn}
                  onEdit={onEdit}
                  onArchive={onArchive}
                  onDragStart={setDraggingId}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
