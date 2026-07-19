import { describe, expect, it } from "vitest";
import { getWeekDates } from "./week";
import { formatDate } from "./date";

describe("getWeekDates", () => {
  it("returns the 7 dates from Sunday to Saturday for a mid-week reference", () => {
    const reference = new Date(2024, 0, 17); // 2024-01-17 (Wed)
    const dates = getWeekDates(reference).map(formatDate);
    expect(dates).toEqual([
      "2024-01-14",
      "2024-01-15",
      "2024-01-16",
      "2024-01-17",
      "2024-01-18",
      "2024-01-19",
      "2024-01-20",
    ]);
  });

  it("returns the same week when the reference date is already Sunday", () => {
    const reference = new Date(2024, 0, 14); // 2024-01-14 (Sun)
    const dates = getWeekDates(reference).map(formatDate);
    expect(dates[0]).toBe("2024-01-14");
    expect(dates[6]).toBe("2024-01-20");
  });

  it("crosses a month boundary correctly", () => {
    const reference = new Date(2024, 1, 1); // 2024-02-01 (Thu)
    const dates = getWeekDates(reference).map(formatDate);
    expect(dates).toEqual([
      "2024-01-28",
      "2024-01-29",
      "2024-01-30",
      "2024-01-31",
      "2024-02-01",
      "2024-02-02",
      "2024-02-03",
    ]);
  });
});
