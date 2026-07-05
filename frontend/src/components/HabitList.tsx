import type { Habit } from "../data/types";
import type { EditState } from "../hooks/useEditState";
import { groupByCategory, categoryColorSlot } from "../data/habitUtils";
import { HabitItem } from "./HabitItem";

interface Props {
  habits: Habit[];
  isCheckedToday: (habit: Habit) => boolean;
  getStreak: (habit: Habit) => number;
  onCheckIn: (id: string) => void;
  onArchive: (id: string) => void;
  editState: EditState;
}

export function HabitList({
  habits,
  isCheckedToday,
  getStreak,
  onCheckIn,
  onArchive,
  editState,
}: Props) {
  if (habits.length === 0) {
    return (
      <p className="empty">習慣をまだ登録していません。上から追加してみましょう！</p>
    );
  }
  const groups = groupByCategory(habits);
  const {
    editingId,
    editValue,
    editCategory,
    editCategoryPlaceholder,
    setEditValue,
    setEditCategory,
    startEdit,
    commitEdit,
    cancelEdit,
  } = editState;

  return (
    <div className="groups">
      {groups.map(({ category, habits: groupHabits }) => (
        <section
          key={category || "__none__"}
          className="category-group"
          {...(category ? { "data-cat-color": categoryColorSlot(category) } : {})}
        >
          {category && (
            <h2 className="category-header">
              <span className="category-dot" />
              {category}
            </h2>
          )}
          {!category && groups.length > 1 && (
            <h2 className="category-header uncategorized">未分類</h2>
          )}
          <ul className="habit-list">
            {groupHabits.map((habit) => (
              <HabitItem
                key={habit.id}
                habit={habit}
                checked={isCheckedToday(habit)}
                streak={getStreak(habit)}
                isEditing={editingId === habit.id}
                editValue={editValue}
                editCategory={editCategory}
                editCategoryPlaceholder={editCategoryPlaceholder}
                onEditValueChange={setEditValue}
                onEditCategoryChange={setEditCategory}
                onStartEdit={() => startEdit(habit)}
                onCommitEdit={() => commitEdit(habit.id)}
                onCancelEdit={cancelEdit}
                onCheckIn={() => onCheckIn(habit.id)}
                onArchive={() => onArchive(habit.id)}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
