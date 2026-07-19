import type { Habit } from "./types";
import { normalizeCategory } from "./category";

export type HabitError = "empty" | "duplicate" | "network";

export type HabitResult = { ok: true; habit: Habit } | { ok: false; error: HabitError };

export const HABIT_ERROR_MESSAGES: Record<HabitError, string> = {
  empty: "習慣名を入力してください。",
  duplicate: "同じ名前の習慣がすでにあります。",
  network: "通信エラーが発生しました。もう一度お試しください。",
};

function isDuplicateName(name: string, existing: Habit[], excludeId?: string): boolean {
  return existing.some((habit) => habit.id !== excludeId && habit.name === name);
}

export function createHabit(name: string, category: string, existing: Habit[] = []): HabitResult {
  const trimmed = name.trim();
  if (!trimmed) return { ok: false, error: "empty" };
  if (isDuplicateName(trimmed, existing)) return { ok: false, error: "duplicate" };

  return {
    ok: true,
    habit: {
      id: crypto.randomUUID(),
      name: trimmed,
      createdAt: new Date().toISOString(),
      checkIns: [],
      archived: false,
      category: normalizeCategory(category),
    },
  };
}

export function renameHabit(
  habit: Habit,
  name: string,
  category: string,
  existing: Habit[] = [],
): HabitResult {
  const trimmed = name.trim();
  if (!trimmed) return { ok: false, error: "empty" };
  if (isDuplicateName(trimmed, existing, habit.id)) return { ok: false, error: "duplicate" };

  return { ok: true, habit: { ...habit, name: trimmed, category: normalizeCategory(category) } };
}

export function addCheckIn(habit: Habit, date: string): Habit {
  if (habit.checkIns.includes(date)) return habit;
  return { ...habit, checkIns: [...habit.checkIns, date] };
}
