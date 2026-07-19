import { getToken } from "./tokenStorage";

export type ApiErrorKind = "unauthorized" | "not_found" | "conflict" | "validation" | "network";

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: ApiErrorKind };

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function mapStatusToError(statusCode: number): ApiErrorKind {
  if (statusCode === 401) return "unauthorized";
  if (statusCode === 404) return "not_found";
  if (statusCode === 409) return "conflict";
  if (statusCode === 422) return "validation";
  return "network";
}

interface RequestOptions {
  method?: string;
  body?: unknown;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<ApiResult<T>> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method: options.method ?? "GET",
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    return { ok: false, error: "network" };
  }

  if (!response.ok) {
    return { ok: false, error: mapStatusToError(response.status) };
  }

  const data = (await response.json()) as T;
  return { ok: true, data };
}
