import { useState } from "react";
import { toLocalDateString } from "../data/streak";

function getWeekDates(today: Date, offset: number): string[] {
  const dow = today.getDay(); // 0=Sun
  const daysToMonday = (dow + 6) % 7;
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - daysToMonday + offset * 7 + i);
    return toLocalDateString(d);
  });
}

export function useWeekNav() {
  const [offset, setOffset] = useState(0);
  const weekDates = getWeekDates(new Date(), offset);

  return {
    weekDates,
    offset,
    prevWeek: () => setOffset((o) => o - 1),
    nextWeek: () => setOffset((o) => o + 1),
    goToday: () => setOffset(0),
  };
}
