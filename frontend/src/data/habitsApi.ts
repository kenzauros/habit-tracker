import type { Habit } from "./types";
import type { HabitError, HabitResult } from "./habit";
import type { ApiErrorKind } from "./apiClient";
import { apiRequest } from "./apiClient";

type SimpleResult = { ok: true; habit: Habit } | { ok: false };

function mapHabitError(kind: ApiErrorKind): HabitError {
  if (kind === "conflict") return "duplicate";
  if (kind === "validation") return "empty";
  return "network";
}

export async function fetchHabits(): Promise<{ ok: true; habits: Habit[] } | { ok: false }> {
  const result = await apiRequest<Habit[]>("/habits");
  if (!result.ok) return { ok: false };
  return { ok: true, habits: result.data };
}

export async function createHabit(name: string, category: string): Promise<HabitResult> {
  const result = await apiRequest<Habit>("/habits", { method: "POST", body: { name, category } });
  if (!result.ok) return { ok: false, error: mapHabitError(result.error) };
  return { ok: true, habit: result.data };
}

export async function renameHabit(
  id: string,
  name: string,
  category: string,
): Promise<HabitResult> {
  const result = await apiRequest<Habit>(`/habits/${id}`, {
    method: "PATCH",
    body: { name, category },
  });
  if (!result.ok) return { ok: false, error: mapHabitError(result.error) };
  return { ok: true, habit: result.data };
}

export async function checkIn(id: string, date: string): Promise<SimpleResult> {
  const result = await apiRequest<Habit>(`/habits/${id}/check-ins`, {
    method: "POST",
    body: { date },
  });
  return result.ok ? { ok: true, habit: result.data } : { ok: false };
}

export async function reorderHabit(
  id: string,
  direction: "up" | "down",
): Promise<{ ok: true; habits: Habit[] } | { ok: false }> {
  const result = await apiRequest<Habit[]>(`/habits/${id}/reorder`, {
    method: "PATCH",
    body: { direction },
  });
  if (!result.ok) return { ok: false };
  return { ok: true, habits: result.data };
}

export async function archiveHabit(id: string): Promise<SimpleResult> {
  const result = await apiRequest<Habit>(`/habits/${id}/archive`, { method: "POST" });
  return result.ok ? { ok: true, habit: result.data } : { ok: false };
}

export async function unarchiveHabit(id: string): Promise<SimpleResult> {
  const result = await apiRequest<Habit>(`/habits/${id}/unarchive`, { method: "POST" });
  return result.ok ? { ok: true, habit: result.data } : { ok: false };
}
