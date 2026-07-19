import { useAuth } from "./hooks/useAuth";
import { useHabits } from "./hooks/useHabits";
import {
  selectActiveGroups,
  selectArchivedHabits,
  selectHabitStats,
  selectWeeklyOverview,
} from "./hooks/selectors";
import { AddHabitForm } from "./components/AddHabitForm";
import { HabitList } from "./components/HabitList";
import { HabitStats } from "./components/HabitStats";
import { WeeklyCalendar } from "./components/WeeklyCalendar";
import { ArchivedHabitList } from "./components/ArchivedHabitList";
import { LoginForm } from "./components/LoginForm";
import "./App.css";

interface HabitsAppProps {
  email: string;
  onLogout: () => void;
}

function HabitsApp({ email, onLogout }: HabitsAppProps) {
  const { habits, addHabit, checkInToday, editHabit, archiveHabit, unarchiveHabit } =
    useHabits();
  const weeklyOverview = selectWeeklyOverview(habits);

  return (
    <main className="app">
      <header className="app-header">
        <h1>Habit Tracker</h1>
        <div className="app-user-bar">
          <span className="app-user-email">{email}</span>
          <button type="button" className="logout-button" onClick={onLogout}>
            ログアウト
          </button>
        </div>
      </header>
      <AddHabitForm onAdd={addHabit} />
      <HabitStats stats={selectHabitStats(habits)} />
      <WeeklyCalendar days={weeklyOverview.days} rows={weeklyOverview.rows} />
      <HabitList
        groups={selectActiveGroups(habits)}
        onCheckIn={checkInToday}
        onEdit={editHabit}
        onArchive={archiveHabit}
      />
      <ArchivedHabitList habits={selectArchivedHabits(habits)} onRestore={unarchiveHabit} />
    </main>
  );
}

function App() {
  const auth = useAuth();

  if (auth.status === "loading") {
    return (
      <main className="app">
        <p>読み込み中...</p>
      </main>
    );
  }

  if (auth.status === "anonymous" || !auth.user) {
    return <LoginForm onLogin={auth.login} onRegister={auth.register} />;
  }

  return <HabitsApp email={auth.user.email} onLogout={auth.logout} />;
}

export default App;
