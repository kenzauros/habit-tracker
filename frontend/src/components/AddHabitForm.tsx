import { useAddForm } from "../hooks/useAddForm";

interface Props {
  uniqueCategories: string[];
  onAdd: (name: string, category: string) => void;
}

export function AddHabitForm({ uniqueCategories, onAdd }: Props) {
  const { input, setInput, catInput, setCatInput, submit } = useAddForm(onAdd);

  return (
    <form className="add-form" onSubmit={(e) => { e.preventDefault(); submit(); }}>
      <div className="add-fields">
        <input
          type="text"
          placeholder="新しい習慣を入力..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <input
          type="text"
          list="categories-list"
          placeholder="カテゴリ（任意）"
          className="cat-field"
          value={catInput}
          onChange={(e) => setCatInput(e.target.value)}
        />
      </div>
      <button type="submit" disabled={!input.trim()}>
        追加
      </button>
      <datalist id="categories-list">
        {uniqueCategories.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
    </form>
  );
}
