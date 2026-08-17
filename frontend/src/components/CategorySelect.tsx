import type { ChangeEvent } from "react";
import { getCategoryColor } from "../data/category";

interface Props {
  categories: string[];
  value: string;
  onChange: (category: string) => void;
  label?: string;
}

export function CategorySelect({ categories, value, onChange, label = "カテゴリ" }: Props) {
  if (categories.length === 0) {
    return <p className="category-select-empty">カテゴリがまだありません</p>;
  }

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    onChange(event.target.value);
  }

  const color = value ? getCategoryColor(value) : null;

  return (
    <div className="category-select">
      {color && (
        <span
          className="category-select-dot"
          style={{ background: color.bg, borderColor: color.border }}
          aria-hidden="true"
        />
      )}
      <select
        className="category-select-input"
        value={value}
        onChange={handleChange}
        aria-label={label}
      >
        <option value="">すべて</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}
