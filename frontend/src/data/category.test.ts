import { describe, expect, it } from "vitest";
import { getCategoryColor, groupByCategory, normalizeCategory, UNCATEGORIZED } from "./category";
import type { Habit } from "./types";

function makeHabit(overrides: Partial<Habit>): Habit {
  return {
    id: crypto.randomUUID(),
    name: "テスト習慣",
    createdAt: "2024-01-01T00:00:00.000Z",
    checkIns: [],
    archived: false,
    category: "",
    ...overrides,
  };
}

describe("normalizeCategory", () => {
  it("falls back to UNCATEGORIZED for empty or whitespace-only input", () => {
    expect(normalizeCategory("")).toBe(UNCATEGORIZED);
    expect(normalizeCategory("   ")).toBe(UNCATEGORIZED);
  });

  it("trims surrounding whitespace", () => {
    expect(normalizeCategory("  健康  ")).toBe("健康");
  });
});

describe("getCategoryColor", () => {
  it("is deterministic for the same category name", () => {
    expect(getCategoryColor("健康")).toEqual(getCategoryColor("健康"));
  });

  it("returns a distinct color for UNCATEGORIZED", () => {
    const uncategorized = getCategoryColor(UNCATEGORIZED);
    const other = getCategoryColor("仕事");
    expect(uncategorized).not.toEqual(other);
  });
});

describe("groupByCategory", () => {
  it("groups habits by their normalized category", () => {
    const habits = [
      makeHabit({ name: "運動する", category: "健康" }),
      makeHabit({ name: "読書する", category: "学習" }),
      makeHabit({ name: "瞑想する", category: "健康" }),
    ];

    const groups = groupByCategory(habits);
    const health = groups.find((g) => g.category === "健康");
    expect(health?.habits.map((h) => h.name)).toEqual(["運動する", "瞑想する"]);
  });

  it("puts uncategorized habits into a fallback group sorted last", () => {
    const habits = [
      makeHabit({ name: "無題の習慣", category: "" }),
      makeHabit({ name: "運動する", category: "健康" }),
    ];

    const groups = groupByCategory(habits);
    expect(groups.at(-1)?.category).toBe(UNCATEGORIZED);
  });

  it("sorts named categories in locale order", () => {
    const habits = [
      makeHabit({ name: "a", category: "趣味" }),
      makeHabit({ name: "b", category: "仕事" }),
    ];

    const groups = groupByCategory(habits);
    expect(groups.map((g) => g.category)).toEqual(
      ["仕事", "趣味"].sort((a, b) => a.localeCompare(b, "ja")),
    );
  });
});
