// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { WeeklyCalendar } from "./WeeklyCalendar";
import type { Habit } from "../data/types";

// Fix today to a known Sunday so week = Mon 2024-06-17 … Sun 2024-06-23
const FIXED_TODAY = new Date("2024-06-21T12:00:00"); // Friday

function makeHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    id: "h1",
    name: "テスト習慣",
    checkedDates: [],
    ...overrides,
  };
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(FIXED_TODAY);
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("WeeklyCalendar", () => {
  it("習慣がないとき何も表示しない", () => {
    const { container } = render(<WeeklyCalendar habits={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("曜日ラベルが月〜日の順で表示される", () => {
    render(<WeeklyCalendar habits={[makeHabit()]} />);
    const days = ["月", "火", "水", "木", "金", "土", "日"];
    days.forEach((label) => {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    });
  });

  it("今週の日付範囲がヘッダーに表示される（6/17 – 6/23）", () => {
    render(<WeeklyCalendar habits={[makeHabit()]} />);
    expect(screen.getByText("6/17 – 6/23")).toBeInTheDocument();
  });

  it("check-in 済みの日はドットが dotChecked クラスを持つ", () => {
    const habit = makeHabit({ checkedDates: ["2024-06-21"] });
    render(<WeeklyCalendar habits={[habit]} />);
    const checked = document.querySelectorAll('[class*="dotChecked"]');
    expect(checked.length).toBe(1);
  });

  it("未達成の日はドットが dotChecked クラスを持たない", () => {
    const habit = makeHabit({ checkedDates: [] });
    render(<WeeklyCalendar habits={[habit]} />);
    const checked = document.querySelectorAll('[class*="dotChecked"]');
    expect(checked.length).toBe(0);
  });

  it("前の週ボタンで週ラベルが 6/10 – 6/16 に変わる", () => {
    render(<WeeklyCalendar habits={[makeHabit()]} />);
    fireEvent.click(screen.getByRole("button", { name: "前の週" }));
    expect(screen.getByText("6/10 – 6/16")).toBeInTheDocument();
  });

  it("前の週に移動後、今週ボタンで元に戻る", () => {
    render(<WeeklyCalendar habits={[makeHabit()]} />);
    fireEvent.click(screen.getByRole("button", { name: "前の週" }));
    fireEvent.click(screen.getByRole("button", { name: "今週" }));
    expect(screen.getByText("6/17 – 6/23")).toBeInTheDocument();
  });

  it("習慣名がテーブルに表示される", () => {
    render(<WeeklyCalendar habits={[makeHabit({ name: "ランニング" })]} />);
    expect(screen.getByText("ランニング")).toBeInTheDocument();
  });

  it("複数の習慣が全て表示される", () => {
    const habits: Habit[] = [
      { id: "a", name: "習慣A", checkedDates: [] },
      { id: "b", name: "習慣B", checkedDates: ["2024-06-21"] },
    ];
    render(<WeeklyCalendar habits={habits} />);
    expect(screen.getByText("習慣A")).toBeInTheDocument();
    expect(screen.getByText("習慣B")).toBeInTheDocument();
  });
});
