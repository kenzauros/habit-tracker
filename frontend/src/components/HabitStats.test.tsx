import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { HabitStats } from "./HabitStats";
import { useHabits } from "../hooks/useHabits";
import type { Habit } from "../data/types";

vi.mock("../hooks/useHabits", () => ({ useHabits: vi.fn() }));

const mockedUseHabits = vi.mocked(useHabits);

function makeHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    id: "1",
    name: "運動する",
    createdAt: "2024-01-01",
    checkIns: [],
    archived: false,
    category: "健康",
    ...overrides,
  };
}

function setHabits(habits: Habit[]) {
  mockedUseHabits.mockReturnValue({ habits } as ReturnType<typeof useHabits>);
}

describe("HabitStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("対象の習慣の最長連続記録を表示する", () => {
    setHabits([
      makeHabit({
        checkIns: ["2024-01-01", "2024-01-02", "2024-01-03", "2024-01-10"],
      }),
    ]);

    render(<HabitStats habitId="1" />);

    expect(screen.getByText("🏆 3日")).toBeInTheDocument();
  });

  it("チェックインが1件もないとき0日を表示する", () => {
    setHabits([makeHabit({ checkIns: [] })]);

    render(<HabitStats habitId="1" />);

    expect(screen.getByText("🏆 0日")).toBeInTheDocument();
  });

  it("habitIdに一致する習慣がないとき専用の表示を出す", () => {
    setHabits([makeHabit({ id: "1" })]);

    render(<HabitStats habitId="999" />);

    expect(screen.getByText("対象の習慣が見つかりません。")).toBeInTheDocument();
  });
});
