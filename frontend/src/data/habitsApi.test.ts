import { describe, expect, it, vi } from "vitest";
import { archiveHabit, checkIn, createHabit, fetchHabits, renameHabit, unarchiveHabit } from "./habitsApi";
import { apiRequest } from "./apiClient";

vi.mock("./apiClient", () => ({ apiRequest: vi.fn() }));

const mockedApiRequest = vi.mocked(apiRequest);

const HABIT = {
  id: "h1",
  name: "運動",
  createdAt: "2026-07-11T00:00:00.000Z",
  checkIns: [],
  archived: false,
  category: "健康",
};

describe("fetchHabits", () => {
  it("成功時は習慣一覧を返す", async () => {
    mockedApiRequest.mockResolvedValue({ ok: true, data: [HABIT] });

    const result = await fetchHabits();

    expect(result).toEqual({ ok: true, habits: [HABIT] });
  });

  it("失敗時はokがfalseになる", async () => {
    mockedApiRequest.mockResolvedValue({ ok: false, error: "network" });

    const result = await fetchHabits();

    expect(result).toEqual({ ok: false });
  });
});

describe("createHabit", () => {
  it("成功時は作成された習慣を返す", async () => {
    mockedApiRequest.mockResolvedValue({ ok: true, data: HABIT });

    const result = await createHabit("運動", "健康");

    expect(result).toEqual({ ok: true, habit: HABIT });
    expect(mockedApiRequest).toHaveBeenCalledWith("/habits", {
      method: "POST",
      body: { name: "運動", category: "健康" },
    });
  });

  it("409エラー時はduplicateエラーを返す", async () => {
    mockedApiRequest.mockResolvedValue({ ok: false, error: "conflict" });

    const result = await createHabit("運動", "健康");

    expect(result).toEqual({ ok: false, error: "duplicate" });
  });

  it("422エラー時はemptyエラーを返す", async () => {
    mockedApiRequest.mockResolvedValue({ ok: false, error: "validation" });

    const result = await createHabit("", "");

    expect(result).toEqual({ ok: false, error: "empty" });
  });
});

describe("renameHabit", () => {
  it("PATCHで更新される", async () => {
    mockedApiRequest.mockResolvedValue({ ok: true, data: HABIT });

    const result = await renameHabit("h1", "筋トレ", "健康");

    expect(result).toEqual({ ok: true, habit: HABIT });
    expect(mockedApiRequest).toHaveBeenCalledWith("/habits/h1", {
      method: "PATCH",
      body: { name: "筋トレ", category: "健康" },
    });
  });
});

describe("checkIn", () => {
  it("成功時は更新された習慣を返す", async () => {
    mockedApiRequest.mockResolvedValue({ ok: true, data: HABIT });

    const result = await checkIn("h1", "2026-07-11");

    expect(result).toEqual({ ok: true, habit: HABIT });
    expect(mockedApiRequest).toHaveBeenCalledWith("/habits/h1/check-ins", {
      method: "POST",
      body: { date: "2026-07-11" },
    });
  });

  it("失敗時はokがfalseになる", async () => {
    mockedApiRequest.mockResolvedValue({ ok: false, error: "not_found" });

    const result = await checkIn("missing", "2026-07-11");

    expect(result).toEqual({ ok: false });
  });
});

describe("archiveHabit / unarchiveHabit", () => {
  it("archiveHabitは/archiveエンドポイントを呼ぶ", async () => {
    mockedApiRequest.mockResolvedValue({ ok: true, data: { ...HABIT, archived: true } });

    await archiveHabit("h1");

    expect(mockedApiRequest).toHaveBeenCalledWith("/habits/h1/archive", { method: "POST" });
  });

  it("unarchiveHabitは/unarchiveエンドポイントを呼ぶ", async () => {
    mockedApiRequest.mockResolvedValue({ ok: true, data: HABIT });

    await unarchiveHabit("h1");

    expect(mockedApiRequest).toHaveBeenCalledWith("/habits/h1/unarchive", { method: "POST" });
  });
});
