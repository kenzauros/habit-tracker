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
  if (checkIns.length === 0) return 0;

  const sorted = [...checkIns].sort();
  let longest = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    current = nextDateString(sorted[i - 1]) === sorted[i] ? current + 1 : 1;
    longest = Math.max(longest, current);
  }

  return longest;
}

function nextDateString(dateString: string): string {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + 1);
  return formatDate(date);
}
