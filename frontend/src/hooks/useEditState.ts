import { useState, useRef } from "react";
import type { Habit } from "../data/types";

export function useEditState(
  onCommit: (id: string, name: string, category: string) => void
) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [categoryOriginal, setCategoryOriginal] = useState("");

  // Refs to read the latest category value synchronously at commit time.
  // Needed because datalist selection fires blur before onChange,
  // so React state may not reflect the new value yet when commitEdit runs.
  const editCategoryRef = useRef("");
  const categoryTouchedRef = useRef(false);

  function startEdit(habit: Habit) {
    const cat = habit.category ?? "";
    setCategoryOriginal(cat);
    editCategoryRef.current = "";
    categoryTouchedRef.current = false;
    setEditingId(habit.id);
    setEditValue(habit.name);
    setEditCategory("");
  }

  function updateEditCategory(v: string) {
    if (v === editCategoryRef.current) return;
    categoryTouchedRef.current = true;
    editCategoryRef.current = v;
    setEditCategory(v);
  }

  function commitEdit(id: string) {
    const category = categoryTouchedRef.current
      ? editCategoryRef.current
      : categoryOriginal;
    onCommit(id, editValue, category);
    setEditingId(null);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  return {
    editingId,
    editValue,
    setEditValue,
    editCategory,
    editCategoryPlaceholder: categoryOriginal,
    setEditCategory: updateEditCategory,
    startEdit,
    commitEdit,
    cancelEdit,
  };
}

export type EditState = ReturnType<typeof useEditState>;
