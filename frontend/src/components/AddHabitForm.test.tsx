import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddHabitForm } from "./AddHabitForm";
import type { HabitResult } from "../data/habit";

describe("AddHabitForm", () => {
  it("習慣名が空のまま送信すると、エラーを表示してフォームを閉じない", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn(
      async (): Promise<HabitResult> => ({ ok: false, error: "empty" }),
    );
    render(<AddHabitForm onAdd={onAdd} />);

    await user.click(screen.getByRole("button", { name: "追加" }));

    expect(await screen.findByText("習慣名を入力してください。")).toBeInTheDocument();
  });

  it("重複した習慣名で送信すると、重複の理由を表示する", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn(
      async (): Promise<HabitResult> => ({ ok: false, error: "duplicate" }),
    );
    render(<AddHabitForm onAdd={onAdd} />);

    await user.type(screen.getByLabelText("習慣名"), "運動する");
    await user.click(screen.getByRole("button", { name: "追加" }));

    expect(await screen.findByText("同じ名前の習慣がすでにあります。")).toBeInTheDocument();
  });

  it("送信に成功すると、入力欄とエラーをクリアする", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn(
      async (): Promise<HabitResult> => ({
        ok: true,
        habit: {
          id: "1",
          name: "運動する",
          createdAt: "2024-01-01T00:00:00.000Z",
          checkIns: [],
          archived: false,
          category: "健康",
        },
      }),
    );
    render(<AddHabitForm onAdd={onAdd} />);

    const nameInput = screen.getByLabelText("習慣名") as HTMLInputElement;
    await user.type(nameInput, "運動する");
    await user.click(screen.getByRole("button", { name: "追加" }));

    await waitFor(() => expect(nameInput.value).toBe(""));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("エラー表示後に習慣名を編集すると、エラーは消える", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn(
      async (): Promise<HabitResult> => ({ ok: false, error: "empty" }),
    );
    render(<AddHabitForm onAdd={onAdd} />);

    await user.click(screen.getByRole("button", { name: "追加" }));
    expect(await screen.findByRole("alert")).toBeInTheDocument();

    await user.type(screen.getByLabelText("習慣名"), "運動する");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
