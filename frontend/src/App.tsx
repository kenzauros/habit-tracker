import { useHabits } from './hooks/useHabits'
import { HabitList } from './components/HabitList'
import { ArchivedSection } from './components/ArchivedSection'
import { WeeklyCalendar } from './components/WeeklyCalendar'
import './App.css'

function App() {
  const { activeHabits, archivedHabits, checkIn, archive, restore } = useHabits()

  return (
    <main className="app">
      <h1>Habit Tracker</h1>
      <WeeklyCalendar today={new Date()} />
      <HabitList habits={activeHabits} onCheckIn={checkIn} onArchive={archive} />
      <ArchivedSection habits={archivedHabits} onRestore={restore} />
    </main>
  )
}

export default App
