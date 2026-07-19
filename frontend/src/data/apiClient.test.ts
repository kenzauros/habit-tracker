import { afterEach, describe, expect, it, vi } from "vitest";
import { apiRequest } from "./apiClient";
import { clearToken, setToken } from "./tokenStorage";

function mockFetchOnce(response: Partial<Response>) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({}),
      ...response,
    }),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  clearToken();
  localStorage.clear();
});

describe("apiRequest", () => {
  it("成功レスポンスはokとdataを返す", async () => {
    mockFetchOnce({ ok: true, status: 200, json: async () => ({ id: "1" }) });

    const result = await apiRequest<{ id: string }>("/habits");

    expect(result).toEqual({ ok: true, data: { id: "1" } });
  });

  it("トークンが保存されている場合Authorizationヘッダーを付与する", async () => {
    setToken("test-token");
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({}) });
    vi.stubGlobal("fetch", fetchMock);

    await apiRequest("/habits");

    const [, options] = fetchMock.mock.calls[0];
    expect(options.headers.Authorization).toBe("Bearer test-token");
  });

  it("401レスポンスはunauthorizedエラーを返す", async () => {
    mockFetchOnce({ ok: false, status: 401 });

    const result = await apiRequest("/auth/me");

    expect(result).toEqual({ ok: false, error: "unauthorized" });
  });

  it("409レスポンスはconflictエラーを返す", async () => {
    mockFetchOnce({ ok: false, status: 409 });

    const result = await apiRequest("/habits", { method: "POST" });

    expect(result).toEqual({ ok: false, error: "conflict" });
  });

  it("422レスポンスはvalidationエラーを返す", async () => {
    mockFetchOnce({ ok: false, status: 422 });

    const result = await apiRequest("/habits", { method: "POST" });

    expect(result).toEqual({ ok: false, error: "validation" });
  });

  it("404レスポンスはnot_foundエラーを返す", async () => {
    mockFetchOnce({ ok: false, status: 404 });

    const result = await apiRequest("/habits/missing");

    expect(result).toEqual({ ok: false, error: "not_found" });
  });

  it("fetchが例外を投げた場合networkエラーを返す", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("offline")),
    );

    const result = await apiRequest("/habits");

    expect(result).toEqual({ ok: false, error: "network" });
  });
});
