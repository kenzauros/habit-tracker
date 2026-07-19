interface Props {
  categories: string[];
  value: string;
  onChange: (category: string) => void;
}

export function CategorySelect({ categories, value, onChange }: Props) {
  if (categories.length === 0) {
    return (
      <select className="category-select" aria-label="カテゴリ選択" disabled>
        <option>カテゴリがありません</option>
      </select>
    );
  }

  return (
    <select
      className="category-select"
      aria-label="カテゴリ選択"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      <option value="">すべて</option>
      {categories.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  );
}
