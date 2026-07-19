import { useState } from "react";
import type { FormEvent } from "react";
import type { HabitResult } from "../data/habit";
import { HABIT_ERROR_MESSAGES } from "../data/habit";

interface Props {
  onAdd: (name: string, category: string) => Promise<HabitResult>;
}

export function AddHabitForm({ onAdd }: Props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await onAdd(name, category);
    if (!result.ok) {
      setError(HABIT_ERROR_MESSAGES[result.error]);
      return;
    }
    setName("");
    setCategory("");
    setError(null);
  }

  return (
    <form className="add-habit-form" onSubmit={handleSubmit}>
      <div className="add-habit-form-fields">
        <input
          type="text"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setError(null);
          }}
          placeholder="新しい習慣を入力..."
          aria-label="習慣名"
        />
        <input
          type="text"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          placeholder="カテゴリ(任意)"
          aria-label="カテゴリ"
          className="category-input"
        />
        <button type="submit">追加</button>
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
