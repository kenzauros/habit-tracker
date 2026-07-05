import { describe, it, expect } from "vitest";
import { calcStreak } from "./streak";

const TODAY = "2024-06-20";
const calc = (dates: string[]) => calcStreak(dates, TODAY);

describe("calcStreak", () => {
  it("returns 0 for empty dates", () => {
    expect(calc([])).toBe(0);
  });

  it("returns 0 when today is not checked", () => {
    expect(calc(["2024-06-19", "2024-06-18"])).toBe(0);
  });

  it("returns 1 when only today is checked", () => {
    expect(calc([TODAY])).toBe(1);
  });

  it("counts consecutive days ending today", () => {
    expect(calc(["2024-06-18", "2024-06-19", TODAY])).toBe(3);
  });

  it("stops at a gap in the sequence", () => {
    // 6/17 → gap → 6/19 → today
    expect(calc(["2024-06-17", "2024-06-19", TODAY])).toBe(2);
  });

  it("ignores duplicate dates", () => {
    expect(calc([TODAY, TODAY, "2024-06-19"])).toBe(2);
  });

  it("ignores future dates beyond today", () => {
    expect(calc(["2024-06-21", TODAY])).toBe(1);
  });

  it("counts streak across a month boundary", () => {
    // 5/30 → 5/31 → 6/1 → ... → today (6/20) = 22 days
    const dates = [];
    for (let d = 30; d <= 31; d++) dates.push(`2024-05-${String(d).padStart(2, "0")}`);
    for (let d = 1; d <= 20; d++) dates.push(`2024-06-${String(d).padStart(2, "0")}`);
    expect(calc(dates)).toBe(22);
  });

  it("counts streak across a year boundary", () => {
    expect(
      calcStreak(["2024-12-30", "2024-12-31", "2025-01-01", "2025-01-02"], "2025-01-02")
    ).toBe(4);
  });

  it("stops at a gap spanning a month boundary", () => {
    expect(
      calcStreak(["2024-05-29", "2024-05-31", "2024-06-01"], "2024-06-01")
    ).toBe(2);
  });

  describe("leap year (2024)", () => {
    it("counts 2/28 → 2/29 as consecutive", () => {
      expect(calcStreak(["2024-02-28", "2024-02-29"], "2024-02-29")).toBe(2);
    });

    it("counts 2/29 → 3/1 as consecutive", () => {
      expect(calcStreak(["2024-02-29", "2024-03-01"], "2024-03-01")).toBe(2);
    });

    it("counts streak across Feb 29", () => {
      expect(
        calcStreak(["2024-02-27", "2024-02-28", "2024-02-29", "2024-03-01"], "2024-03-01")
      ).toBe(4);
    });
  });

  describe("non-leap year (2023)", () => {
    it("counts 2/28 → 3/1 as consecutive", () => {
      expect(calcStreak(["2023-02-28", "2023-03-01"], "2023-03-01")).toBe(2);
    });

    it("treats 2/29 as nonexistent — gap between 2/28 and 3/1 does not occur", () => {
      expect(calcStreak(["2023-02-27", "2023-02-28", "2023-03-01"], "2023-03-01")).toBe(3);
    });
  });
});
