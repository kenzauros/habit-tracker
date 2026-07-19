import type { User } from "./types";
import type { ApiErrorKind } from "./apiClient";
import { apiRequest } from "./apiClient";

export type AuthError = "invalid_credentials" | "email_taken" | "invalid_input" | "network";

export type AuthResult<T> = { ok: true; data: T } | { ok: false; error: AuthError };

export const AUTH_ERROR_MESSAGES: Record<AuthError, string> = {
  invalid_credentials: "メールアドレスまたはパスワードが正しくありません。",
  email_taken: "このメールアドレスは既に登録されています。",
  invalid_input: "メールアドレスとパスワードを確認してください。",
  network: "通信エラーが発生しました。もう一度お試しください。",
};

interface TokenPayload {
  access_token: string;
  token_type: string;
}

function mapAuthError(kind: ApiErrorKind): AuthError {
  if (kind === "conflict") return "email_taken";
  if (kind === "unauthorized") return "invalid_credentials";
  if (kind === "validation") return "invalid_input";
  return "network";
}

export async function register(email: string, password: string): Promise<AuthResult<string>> {
  const result = await apiRequest<TokenPayload>("/auth/register", {
    method: "POST",
    body: { email, password },
  });
  if (!result.ok) return { ok: false, error: mapAuthError(result.error) };
  return { ok: true, data: result.data.access_token };
}

export async function login(email: string, password: string): Promise<AuthResult<string>> {
  const result = await apiRequest<TokenPayload>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
  if (!result.ok) return { ok: false, error: mapAuthError(result.error) };
  return { ok: true, data: result.data.access_token };
}

export async function fetchMe(): Promise<AuthResult<User>> {
  const result = await apiRequest<User>("/auth/me");
  if (!result.ok) return { ok: false, error: mapAuthError(result.error) };
  return { ok: true, data: result.data };
}
