import { useState, useEffect, useCallback } from "react";
import type { Habit } from "../data/types";
import { toLocalDateString, calcStreak } from "../data/streak";
import { fetchHabits, createHabit, updateHabit, addLog, removeLog } from "../data/api";

export function useHabits(onUnauthorized?: () => void) {
  const [habits, setHabits] = useState<Habit[]>([]);

  const loadData = useCallback(async () => {
    const result = await fetchHabits();
    if (!result.ok) {
      if (result.status === 401 && onUnauthorized) onUnauthorized();
      return;
    }
    setHabits(result.data);
  }, [onUnauthorized]);

  useEffect(() => { loadData(); }, [loadData]);

  async function addHabit(name: string, category?: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    const result = await createHabit(trimmed, category?.trim() || undefined);
    if (result.ok) setHabits((prev) => [...prev, result.data]);
  }

  async function updateHabitMeta(id: string, name: string, category: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    const result = await updateHabit(id, {
      name: trimmed,
      category: category.trim() || null,
    });
    if (result.ok) setHabits((prev) => prev.map((h) => (h.id === id ? result.data : h)));
  }

  async function archiveHabit(id: string) {
    const result = await updateHabit(id, { archived: true });
    if (result.ok) setHabits((prev) => prev.map((h) => (h.id === id ? result.data : h)));
  }

  async function unarchiveHabit(id: string) {
    const result = await updateHabit(id, { archived: false });
    if (result.ok) setHabits((prev) => prev.map((h) => (h.id === id ? result.data : h)));
  }

  async function checkIn(id: string) {
    const today = toLocalDateString(new Date());
    const result = await addLog(id, today);
    if (result.ok) setHabits((prev) => prev.map((h) => (h.id === id ? result.data : h)));
  }

  async function uncheckIn(id: string) {
    const today = toLocalDateString(new Date());
    const result = await removeLog(id, today);
    if (result.ok) setHabits((prev) => prev.map((h) => (h.id === id ? result.data : h)));
  }

  function isCheckedToday(habit: Habit): boolean {
    return habit.checkedDates.includes(toLocalDateString(new Date()));
  }

  function getStreak(habit: Habit): number {
    return calcStreak(habit.checkedDates, toLocalDateString(new Date()));
  }

  const activeHabits = habits.filter((h) => !h.archived);
  const archivedHabits = habits.filter((h) => h.archived);
  const uniqueCategories = Array.from(
    new Set(activeHabits.map((h) => h.category).filter(Boolean) as string[])
  ).sort((a, b) => a.localeCompare(b, "ja"));

  return {
    activeHabits,
    archivedHabits,
    uniqueCategories,
    addHabit,
    updateHabitMeta,
    archiveHabit,
    unarchiveHabit,
    checkIn,
    uncheckIn,
    isCheckedToday,
    getStreak,
  };
}
