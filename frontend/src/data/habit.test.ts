import { describe, expect, it } from "vitest";
import { addCheckIn, createHabit, renameHabit } from "./habit";
import { UNCATEGORIZED } from "./category";
import type { Habit } from "./types";

function mustCreate(name: string, category: string, existing: Habit[] = []): Habit {
  const result = createHabit(name, category, existing);
  if (!result.ok) throw new Error("expected createHabit to succeed in test setup");
  return result.habit;
}

describe("createHabit", () => {
  it("空文字または空白のみの名前は拒否する", () => {
    expect(createHabit("", "健康")).toEqual({ ok: false, error: "empty" });
    expect(createHabit("   ", "健康")).toEqual({ ok: false, error: "empty" });
  });

  it("名前をトリムし、カテゴリが空ならUNCATEGORIZEDにする", () => {
    const result = createHabit("  運動する  ", "");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.habit.name).toBe("運動する");
    expect(result.habit.category).toBe(UNCATEGORIZED);
    expect(result.habit.archived).toBe(false);
    expect(result.habit.checkIns).toEqual([]);
  });

  it("既存の習慣と同じ名前（トリム後）は重複として拒否する", () => {
    const existing = [mustCreate("運動する", "健康")];
    expect(createHabit("運動する", "健康", existing)).toEqual({ ok: false, error: "duplicate" });
    expect(createHabit("  運動する  ", "趣味", existing)).toEqual({ ok: false, error: "duplicate" });
  });
});

describe("renameHabit", () => {
  it("空文字または空白のみの名前は拒否する", () => {
    const original = mustCreate("運動する", "健康");
    expect(renameHabit(original, "", "健康")).toEqual({ ok: false, error: "empty" });
  });

  it("名前とカテゴリを更新しつつチェックイン履歴は保持する", () => {
    const original = mustCreate("運動する", "健康");
    const result = renameHabit(original, "  筋トレする  ", "フィットネス");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.habit.name).toBe("筋トレする");
    expect(result.habit.category).toBe("フィットネス");
    expect(result.habit.id).toBe(original.id);
    expect(result.habit.checkIns).toBe(original.checkIns);
  });

  it("他の習慣と同じ名前には変更できない", () => {
    const target = mustCreate("運動する", "健康");
    const other = mustCreate("読書する", "学習", [target]);
    expect(renameHabit(target, "読書する", "健康", [target, other])).toEqual({
      ok: false,
      error: "duplicate",
    });
  });

  it("名前を変更しない場合は自分自身との重複にならない", () => {
    const target = mustCreate("運動する", "健康");
    const result = renameHabit(target, "運動する", "フィットネス", [target]);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.habit.category).toBe("フィットネス");
  });
});

describe("addCheckIn", () => {
  it("adds a new check-in date", () => {
    const habit = mustCreate("運動する", "健康");
    const updated = addCheckIn(habit, "2024-01-15");
    expect(updated.checkIns).toEqual(["2024-01-15"]);
  });

  it("does not add the same date twice", () => {
    const habit = mustCreate("運動する", "健康");
    const once = addCheckIn(habit, "2024-01-15");
    const twice = addCheckIn(once, "2024-01-15");
    expect(twice.checkIns).toEqual(["2024-01-15"]);
    expect(twice).toBe(once);
  });
});
