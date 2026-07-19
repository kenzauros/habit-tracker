import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { WeeklyCalendar } from "./WeeklyCalendar";
import type { WeeklyDayColumn, WeeklyHabitRow } from "../hooks/selectors";

const DAYS: WeeklyDayColumn[] = [
  { date: "2024-01-14", weekdayLabel: "日", dayOfMonth: 14, isToday: false },
  { date: "2024-01-15", weekdayLabel: "月", dayOfMonth: 15, isToday: true },
  { date: "2024-01-16", weekdayLabel: "火", dayOfMonth: 16, isToday: false },
  { date: "2024-01-17", weekdayLabel: "水", dayOfMonth: 17, isToday: false },
  { date: "2024-01-18", weekdayLabel: "木", dayOfMonth: 18, isToday: false },
  { date: "2024-01-19", weekdayLabel: "金", dayOfMonth: 19, isToday: false },
  { date: "2024-01-20", weekdayLabel: "土", dayOfMonth: 20, isToday: false },
];

function makeRow(overrides: Partial<WeeklyHabitRow>): WeeklyHabitRow {
  return {
    id: "1",
    name: "運動する",
    color: { bg: "var(--category-1-bg)", text: "var(--category-1-text)", border: "var(--category-1-border)" },
    checkedDays: [false, false, false, false, false, false, false],
    ...overrides,
  };
}

describe("WeeklyCalendar", () => {
  it("shows a fallback message when there are no habits", () => {
    render(<WeeklyCalendar days={DAYS} rows={[]} />);
    expect(screen.getByText("表示できる習慣がありません。")).toBeInTheDocument();
  });

  it("renders each habit's name with a check mark for checked-in days", () => {
    const rows = [makeRow({ checkedDays: [true, false, true, false, false, false, false] })];
    render(<WeeklyCalendar days={DAYS} rows={rows} />);

    expect(screen.getByText("運動する")).toBeInTheDocument();
    expect(screen.getAllByLabelText("チェック済み")).toHaveLength(2);
    expect(screen.getAllByLabelText("未チェック")).toHaveLength(5);
  });

  it("renders a column for every day of the week", () => {
    render(<WeeklyCalendar days={DAYS} rows={[makeRow({})]} />);
    for (const day of DAYS) {
      expect(screen.getByText(String(day.dayOfMonth))).toBeInTheDocument();
    }
  });
});
