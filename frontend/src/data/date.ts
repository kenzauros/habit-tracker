export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayString(): string {
  return formatDate(new Date());
}

const WEEKDAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

export function weekdayLabel(date: Date): string {
  return WEEKDAY_LABELS[date.getDay()];
}
