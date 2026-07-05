import { getToken } from "./auth";
import type { Habit } from "./types";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; message: string };

async function request<T>(path: string, options: RequestInit = {}): Promise<ApiResult<T>> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> | undefined),
  };
  try {
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { ok: false, status: res.status, message: body.detail ?? "エラーが発生しました" };
    }
    const data: T = res.status === 204 ? (undefined as T) : await res.json();
    return { ok: true, data };
  } catch {
    return { ok: false, status: 0, message: "サーバーに接続できませんでした" };
  }
}

export function fetchHabits(): Promise<ApiResult<Habit[]>> {
  return request<Habit[]>("/habits");
}

export function createHabit(name: string, category?: string): Promise<ApiResult<Habit>> {
  return request<Habit>("/habits", {
    method: "POST",
    body: JSON.stringify({ name, category: category ?? null }),
  });
}

export function updateHabit(
  id: string,
  data: { name?: string; category?: string | null; archived?: boolean }
): Promise<ApiResult<Habit>> {
  return request<Habit>(`/habits/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteHabit(id: string): Promise<ApiResult<void>> {
  return request<void>(`/habits/${id}`, { method: "DELETE" });
}

export function addLog(id: string, date: string): Promise<ApiResult<Habit>> {
  return request<Habit>(`/habits/${id}/logs`, {
    method: "POST",
    body: JSON.stringify({ date }),
  });
}

export function removeLog(id: string, date: string): Promise<ApiResult<Habit>> {
  return request<Habit>(`/habits/${id}/logs/${date}`, { method: "DELETE" });
}
