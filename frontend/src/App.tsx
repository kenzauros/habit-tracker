import { useAuth } from "./hooks/useAuth";
import { useHabits } from "./hooks/useHabits";
import { useEditState } from "./hooks/useEditState";
import { LoginPage } from "./pages/LoginPage";
import { AddHabitForm } from "./components/AddHabitForm";
import { HabitList } from "./components/HabitList";
import { WeeklyCalendar } from "./components/WeeklyCalendar";
import { ArchivedSection } from "./components/ArchivedSection";
import "./App.css";

function App() {
  const { authenticated, error, loading, login, register, logout } = useAuth();

  const {
    activeHabits,
    archivedHabits,
    uniqueCategories,
    addHabit,
    updateHabitMeta,
    archiveHabit,
    unarchiveHabit,
    checkIn,
    isCheckedToday,
    getStreak,
  } = useHabits(logout);

  const editState = useEditState((id, name, category) => {
    updateHabitMeta(id, name, category);
  });

  if (!authenticated) {
    return (
      <LoginPage
        onLogin={login}
        onRegister={register}
        error={error}
        loading={loading}
      />
    );
  }

  return (
    <div className="container">
      <div className="app-header">
        <h1>Habit Tracker</h1>
        <button className="logout-btn" onClick={logout} aria-label="ログアウト">
          ログアウト
        </button>
      </div>
      <AddHabitForm uniqueCategories={uniqueCategories} onAdd={addHabit} />
      <WeeklyCalendar habits={activeHabits} />
      <HabitList
        habits={activeHabits}
        isCheckedToday={isCheckedToday}
        getStreak={getStreak}
        onCheckIn={checkIn}
        onArchive={archiveHabit}
        editState={editState}
      />
      <ArchivedSection habits={archivedHabits} onUnarchive={unarchiveHabit} />
    </div>
  );
}

export default App;
