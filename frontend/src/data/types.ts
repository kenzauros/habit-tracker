export interface Habit {
  id: string;
  name: string;
  createdAt: string;
  checkIns: string[];
  archived: boolean;
  category: string;
}

export interface User {
  id: string;
  email: string;
}
