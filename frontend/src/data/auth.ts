const TOKEN_KEY = "habit_tracker_token";
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}

export type AuthResult =
  | { ok: true; token: string }
  | { ok: false; message: string };

async function postAuth(path: string, email: string, password: string): Promise<AuthResult> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { ok: false, message: body.detail ?? "エラーが発生しました" };
    }
    const data = await res.json();
    return { ok: true, token: data.access_token };
  } catch {
    return { ok: false, message: "サーバーに接続できませんでした" };
  }
}

export function loginApi(email: string, password: string): Promise<AuthResult> {
  return postAuth("/auth/login", email, password);
}

export function registerApi(email: string, password: string): Promise<AuthResult> {
  return postAuth("/auth/register", email, password);
}
