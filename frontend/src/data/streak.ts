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
