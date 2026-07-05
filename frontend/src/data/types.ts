export interface Habit {
  id: string;
  name: string;
  checkedDates: string[]; // ISO date strings "YYYY-MM-DD"
  archived?: boolean;
  category?: string;
}
