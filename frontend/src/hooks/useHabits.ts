import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Habit } from "../data/types";
import type { HabitResult } from "../data/habit";
import { addCheckIn as applyCheckInLocally, createHabit, renameHabit } from "../data/habit";
import { todayString } from "../data/date";
import * as habitsApi from "../data/habitsApi";

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    habitsApi.fetchHabits().then((result) => {
      if (cancelled) return;
      if (result.ok) {
        setHabits(result.habits);
      } else {
        setError("習慣の取得に失敗しました。");
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function addHabit(name: string, category: string): Promise<HabitResult> {
    const localCheck = createHabit(name, category, habits);
    if (!localCheck.ok) return localCheck;

    const result = await habitsApi.createHabit(name, category);
    if (result.ok) {
      setHabits((prev) => [...prev, result.habit]);
    }
    return result;
  }

  async function editHabit(id: string, name: string, category: string): Promise<HabitResult> {
    const target = habits.find((habit) => habit.id === id);
    if (!target) return { ok: false, error: "network" };

    const localCheck = renameHabit(target, name, category, habits);
    if (!localCheck.ok) return localCheck;

    const result = await habitsApi.renameHabit(id, name, category);
    if (result.ok) {
      setHabits((prev) => prev.map((habit) => (habit.id === id ? result.habit : habit)));
    }
    return result;
  }

  function checkInToday(id: string) {
    const date = todayString();
    setHabits((prev) =>
      prev.map((habit) => (habit.id === id ? applyCheckInLocally(habit, date) : habit)),
    );
    habitsApi.checkIn(id, date).then((result) => {
      if (result.ok) {
        setHabits((prev) => prev.map((habit) => (habit.id === id ? result.habit : habit)));
      } else {
        rollbackCheckIn(id, date);
      }
    });
  }

  function rollbackCheckIn(id: string, date: string) {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id ? { ...habit, checkIns: habit.checkIns.filter((d) => d !== date) } : habit,
      ),
    );
  }

  function reorderHabit(id: string, direction: "up" | "down") {
    setHabits((prev) => {
      const index = prev.findIndex((habit) => habit.id === id);
      const target = direction === "up" ? index - 1 : index + 1;
      if (index < 0 || target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    habitsApi.reorderHabit(id, direction);
  }

  function archiveHabit(id: string) {
    setArchivedLocally(id, true, setHabits);
    habitsApi.archiveHabit(id).then((result) => {
      if (!result.ok) setArchivedLocally(id, false, setHabits);
    });
  }

  function unarchiveHabit(id: string) {
    setArchivedLocally(id, false, setHabits);
    habitsApi.unarchiveHabit(id).then((result) => {
      if (!result.ok) setArchivedLocally(id, true, setHabits);
    });
  }

  return {
    habits,
    loading,
    error,
    addHabit,
    checkInToday,
    editHabit,
    reorderHabit,
    archiveHabit,
    unarchiveHabit,
  };
}

function setArchivedLocally(
  id: string,
  archived: boolean,
  setHabits: Dispatch<SetStateAction<Habit[]>>,
) {
  setHabits((prev) => prev.map((habit) => (habit.id === id ? { ...habit, archived } : habit)));
}
