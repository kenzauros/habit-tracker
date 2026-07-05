export function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function calcStreak(checkedDates: string[], today: string): number {
  if (checkedDates.length === 0) return 0;

  const sorted = [...new Set(checkedDates)].filter((d) => d <= today).sort().reverse();

  // Streak must include today
  if (sorted[0] !== today) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diffDays = (prev.getTime() - curr.getTime()) / 86_400_000;
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
