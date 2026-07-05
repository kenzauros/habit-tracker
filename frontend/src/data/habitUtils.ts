import type { Habit } from "./types";

export function groupByCategory(habits: Habit[]): Array<{ category: string; habits: Habit[] }> {
  const map = new Map<string, Habit[]>();
  for (const h of habits) {
    const cat = h.category || "";
    if (!map.has(cat)) map.set(cat, []);
    map.get(cat)!.push(h);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => {
      if (a === "") return 1;
      if (b === "") return -1;
      return a.localeCompare(b, "ja");
    })
    .map(([category, habits]) => ({ category, habits }));
}

export function categoryColorSlot(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  return h % 6;
}
