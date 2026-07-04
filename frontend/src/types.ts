export type HabitLog = {
  checkedDate: string
}

export type Habit = {
  id: string
  name: string
  category: string
  archived: boolean
  logs: HabitLog[]
}
