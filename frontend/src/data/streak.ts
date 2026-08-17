import { formatDate } from "./date";

export function calculateStreak(
  checkIns: string[],
  referenceDate: Date = new Date(),
): number {
  const checkedDates = new Set(checkIns);
  const cursor = new Date(referenceDate);

  if (!checkedDates.has(formatDate(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (checkedDates.has(formatDate(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function calculateLongestStreak(checkIns: string[]): number {
  const checkedDates = new Set(checkIns);
  let longest = 0;

  for (const date of checkedDates) {
    // 連続区間の先頭からだけ数える（前日があるなら、そこはまだ区間の途中）
    if (checkedDates.has(shiftDate(date, -1))) continue;

    let length = 0;
    let cursor = date;
    while (checkedDates.has(cursor)) {
      length++;
      cursor = shiftDate(cursor, 1);
    }
    longest = Math.max(longest, length);
  }

  return longest;
}

function shiftDate(dateString: string, days: number): string {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return formatDate(date);
}
