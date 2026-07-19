import type { Habit } from "./types";

export const UNCATEGORIZED = "未分類";

const PALETTE = [
  { bg: "var(--category-1-bg)", text: "var(--category-1-text)", border: "var(--category-1-border)" },
  { bg: "var(--category-2-bg)", text: "var(--category-2-text)", border: "var(--category-2-border)" },
  { bg: "var(--category-3-bg)", text: "var(--category-3-text)", border: "var(--category-3-border)" },
  { bg: "var(--category-4-bg)", text: "var(--category-4-text)", border: "var(--category-4-border)" },
  { bg: "var(--category-5-bg)", text: "var(--category-5-text)", border: "var(--category-5-border)" },
  { bg: "var(--category-6-bg)", text: "var(--category-6-text)", border: "var(--category-6-border)" },
  { bg: "var(--category-7-bg)", text: "var(--category-7-text)", border: "var(--category-7-border)" },
  { bg: "var(--category-8-bg)", text: "var(--category-8-text)", border: "var(--category-8-border)" },
];

const UNCATEGORIZED_COLOR = {
  bg: "var(--category-uncategorized-bg)",
  text: "var(--category-uncategorized-text)",
  border: "var(--category-uncategorized-border)",
};

export function normalizeCategory(category: string): string {
  return category.trim() || UNCATEGORIZED;
}

export function getCategoryColor(category: string) {
  if (category === UNCATEGORIZED) return UNCATEGORIZED_COLOR;

  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = (hash * 31 + category.charCodeAt(i)) | 0;
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export function groupByCategory(habits: Habit[]): Array<{ category: string; habits: Habit[] }> {
  const groups = new Map<string, Habit[]>();

  for (const habit of habits) {
    const category = normalizeCategory(habit.category);
    const group = groups.get(category);
    if (group) {
      group.push(habit);
    } else {
      groups.set(category, [habit]);
    }
  }

  return Array.from(groups.entries())
    .map(([category, categoryHabits]) => ({ category, habits: categoryHabits }))
    .sort((a, b) => {
      if (a.category === UNCATEGORIZED) return 1;
      if (b.category === UNCATEGORIZED) return -1;
      return a.category.localeCompare(b.category, "ja");
    });
}
