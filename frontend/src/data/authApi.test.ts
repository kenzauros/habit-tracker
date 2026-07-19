import { describe, expect, it, vi } from "vitest";
import { fetchMe, login, register } from "./authApi";
import { apiRequest } from "./apiClient";

vi.mock("./apiClient", () => ({ apiRequest: vi.fn() }));

const mockedApiRequest = vi.mocked(apiRequest);

describe("register", () => {
  it("成功時はトークンを返す", async () => {
    mockedApiRequest.mockResolvedValue({
      ok: true,
      data: { access_token: "token-1", token_type: "bearer" },
    });

    const result = await register("new@example.com", "password123");

    expect(result).toEqual({ ok: true, data: "token-1" });
    expect(mockedApiRequest).toHaveBeenCalledWith("/auth/register", {
      method: "POST",
      body: { email: "new@example.com", password: "password123" },
    });
  });

  it("メール重複時はemail_takenエラーを返す", async () => {
    mockedApiRequest.mockResolvedValue({ ok: false, error: "conflict" });

    const result = await register("dup@example.com", "password123");

    expect(result).toEqual({ ok: false, error: "email_taken" });
  });
});

describe("login", () => {
  it("認証失敗時はinvalid_credentialsエラーを返す", async () => {
    mockedApiRequest.mockResolvedValue({ ok: false, error: "unauthorized" });

    const result = await login("wrong@example.com", "wrong-password");

    expect(result).toEqual({ ok: false, error: "invalid_credentials" });
  });
});

describe("fetchMe", () => {
  it("成功時はユーザー情報を返す", async () => {
    mockedApiRequest.mockResolvedValue({
      ok: true,
      data: { id: "u1", email: "me@example.com" },
    });

    const result = await fetchMe();

    expect(result).toEqual({ ok: true, data: { id: "u1", email: "me@example.com" } });
  });

  it("通信エラー時はnetworkエラーを返す", async () => {
    mockedApiRequest.mockResolvedValue({ ok: false, error: "network" });

    const result = await fetchMe();

    expect(result).toEqual({ ok: false, error: "network" });
  });
});
