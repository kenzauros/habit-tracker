import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { HabitStats } from "./HabitStats";
import type { HabitStatsSummary } from "../hooks/selectors";

function makeStats(overrides: Partial<HabitStatsSummary> = {}): HabitStatsSummary {
  return {
    activeCount: 2,
    checkedInTodayCount: 1,
    currentBest: { habitId: "1", name: "運動する", streak: 3 },
    longestEver: { habitId: "2", name: "読書する", streak: 10 },
    ...overrides,
  };
}

describe("HabitStats", () => {
  it("アクティブな習慣が0件のとき→専用の表示を出す", () => {
    render(<HabitStats stats={makeStats({ activeCount: 0, currentBest: null, longestEver: null })} />);
    expect(screen.getByText("統計を表示する習慣がありません。")).toBeInTheDocument();
  });

  it("習慣があるとき→習慣数と本日の達成数を表示する", () => {
    render(<HabitStats stats={makeStats({ activeCount: 3, checkedInTodayCount: 2 })} />);
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
  });

  it("現在の最長ストリークがあるとき→習慣名と日数を表示する", () => {
    render(<HabitStats stats={makeStats()} />);
    expect(screen.getByText("運動する 🔥3日")).toBeInTheDocument();
  });

  it("連続日数の最長記録があるとき→習慣名と日数を表示する", () => {
    render(<HabitStats stats={makeStats()} />);
    expect(screen.getByText("読書する 🏆10日")).toBeInTheDocument();
  });

  it("最長記録がまだないとき→ハイフンを表示する", () => {
    render(<HabitStats stats={makeStats({ currentBest: null, longestEver: null })} />);
    expect(screen.getAllByText("-")).toHaveLength(2);
  });
});
