import { describe, expect, it } from "vitest";
import { calculateLongestStreak, calculateStreak } from "./streak";

const REFERENCE = new Date(2024, 0, 15); // 2024-01-15 (local time)

describe("calculateStreak", () => {
  it("returns 0 when there are no check-ins", () => {
    expect(calculateStreak([], REFERENCE)).toBe(0);
  });

  it("counts consecutive days including today when today is checked in", () => {
    const checkIns = ["2024-01-13", "2024-01-14", "2024-01-15"];
    expect(calculateStreak(checkIns, REFERENCE)).toBe(3);
  });

  it("shows the streak through yesterday when today is not yet checked in", () => {
    const checkIns = ["2024-01-13", "2024-01-14"];
    expect(calculateStreak(checkIns, REFERENCE)).toBe(2);
  });

  it("stops counting at the first gap", () => {
    const checkIns = ["2024-01-10", "2024-01-14", "2024-01-15"];
    expect(calculateStreak(checkIns, REFERENCE)).toBe(2);
  });

  it("is 0 when neither today nor yesterday is checked in", () => {
    const checkIns = ["2024-01-10", "2024-01-11"];
    expect(calculateStreak(checkIns, REFERENCE)).toBe(0);
  });

  it("counts correctly across a year boundary", () => {
    const newYearReference = new Date(2024, 0, 1); // 2024-01-01
    const checkIns = ["2023-12-30", "2023-12-31", "2024-01-01"];
    expect(calculateStreak(checkIns, newYearReference)).toBe(3);
  });

  it("counts correctly across a leap day (2024-02-29)", () => {
    const leapYearReference = new Date(2024, 2, 1); // 2024-03-01
    const checkIns = ["2024-02-28", "2024-02-29", "2024-03-01"];
    expect(calculateStreak(checkIns, leapYearReference)).toBe(3);
  });
});

describe("calculateLongestStreak", () => {
  it("チェックインが0件のとき→0を返す", () => {
    expect(calculateLongestStreak([])).toBe(0);
  });

  it("すべて連続した日付のとき→その件数を返す", () => {
    const checkIns = ["2024-01-13", "2024-01-14", "2024-01-15"];
    expect(calculateLongestStreak(checkIns)).toBe(3);
  });

  it("途中に途切れがあるとき→最長の連続区間を返す", () => {
    const checkIns = [
      "2024-01-01",
      "2024-01-02",
      "2024-01-10",
      "2024-01-11",
      "2024-01-12",
      "2024-01-13",
    ];
    expect(calculateLongestStreak(checkIns)).toBe(4);
  });

  it("日付の順序が入り乱れているとき→ソートしてから正しく計算する", () => {
    const checkIns = ["2024-01-15", "2024-01-13", "2024-01-14"];
    expect(calculateLongestStreak(checkIns)).toBe(3);
  });

  it("年をまたぐ連続日程のとき→正しく計算する", () => {
    const checkIns = ["2023-12-30", "2023-12-31", "2024-01-01"];
    expect(calculateLongestStreak(checkIns)).toBe(3);
  });

  it("現在の記録より過去の記録の方が長いとき→過去の最長記録を返す", () => {
    const checkIns = ["2024-01-01", "2024-01-02", "2024-01-03", "2024-01-04", "2024-01-10"];
    expect(calculateLongestStreak(checkIns)).toBe(4);
  });
});
