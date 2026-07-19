import type { Habit } from "../data/types";
import { calculateStreak } from "../data/streak";
import { formatDate, todayString, weekdayLabel } from "../data/date";
import { getCategoryColor, groupByCategory } from "../data/category";
import { getWeekDates } from "../data/week";

export interface HabitViewModel {
  habit: Habit;
  streak: number;
  checkedInToday: boolean;
}

export interface CategoryGroup {
  category: string;
  color: ReturnType<typeof getCategoryColor>;
  habits: HabitViewModel[];
}

function toViewModel(habit: Habit): HabitViewModel {
  return {
    habit,
    streak: calculateStreak(habit.checkIns),
    checkedInToday: habit.checkIns.includes(todayString()),
  };
}

export function selectActiveGroups(habits: Habit[]): CategoryGroup[] {
  const active = habits.filter((habit) => !habit.archived);

  return groupByCategory(active).map(({ category, habits: categoryHabits }) => ({
    category,
    color: getCategoryColor(category),
    habits: categoryHabits.map(toViewModel),
  }));
}

export function selectArchivedHabits(habits: Habit[]): Habit[] {
  return habits.filter((habit) => habit.archived);
}

export interface WeeklyDayColumn {
  date: string;
  weekdayLabel: string;
  dayOfMonth: number;
  isToday: boolean;
}

export interface WeeklyHabitRow {
  id: string;
  name: string;
  color: ReturnType<typeof getCategoryColor>;
  checkedDays: boolean[];
}

export interface WeeklyOverview {
  days: WeeklyDayColumn[];
  rows: WeeklyHabitRow[];
}

export function selectWeeklyOverview(habits: Habit[], today: Date = new Date()): WeeklyOverview {
  const todayDate = formatDate(today);
  const days = getWeekDates(today).map((date) => {
    const dateString = formatDate(date);
    return {
      date: dateString,
      weekdayLabel: weekdayLabel(date),
      dayOfMonth: date.getDate(),
      isToday: dateString === todayDate,
    };
  });

  const rows = habits
    .filter((habit) => !habit.archived)
    .map((habit) => ({
      id: habit.id,
      name: habit.name,
      color: getCategoryColor(habit.category),
      checkedDays: days.map((day) => habit.checkIns.includes(day.date)),
    }));

  return { days, rows };
}
