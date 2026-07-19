import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HabitItem } from "./HabitItem";
import type { Habit } from "../data/types";
import type { HabitResult } from "../data/habit";

function makeHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    id: "1",
    name: "運動する",
    createdAt: "2024-01-01T00:00:00.000Z",
    checkIns: [],
    archived: false,
    category: "健康",
    ...overrides,
  };
}

describe("HabitItem", () => {
  it("保存に失敗すると、編集画面を閉じずに理由を表示する", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn(
      async (): Promise<HabitResult> => ({ ok: false, error: "duplicate" }),
    );
    render(
      <ul>
        <HabitItem
          habit={makeHabit()}
          streak={0}
          checkedInToday={false}
          onCheckIn={vi.fn()}
          onEdit={onEdit}
          onArchive={vi.fn()}
        />
      </ul>,
    );

    await user.click(screen.getByRole("button", { name: "編集" }));
    await user.click(screen.getByRole("button", { name: "保存" }));

    expect(await screen.findByText("同じ名前の習慣がすでにあります。")).toBeInTheDocument();
    expect(screen.getByLabelText("習慣名を編集")).toBeInTheDocument();
  });

  it("保存に成功すると、編集画面を閉じる", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn(
      async (): Promise<HabitResult> => ({ ok: true, habit: makeHabit({ name: "筋トレする" }) }),
    );
    render(
      <ul>
        <HabitItem
          habit={makeHabit()}
          streak={0}
          checkedInToday={false}
          onCheckIn={vi.fn()}
          onEdit={onEdit}
          onArchive={vi.fn()}
        />
      </ul>,
    );

    await user.click(screen.getByRole("button", { name: "編集" }));
    await user.click(screen.getByRole("button", { name: "保存" }));

    await screen.findByRole("button", { name: "編集" });
    expect(screen.queryByLabelText("習慣名を編集")).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("キャンセルすると、エラーも編集内容も破棄される", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn(
      async (): Promise<HabitResult> => ({ ok: false, error: "empty" }),
    );
    render(
      <ul>
        <HabitItem
          habit={makeHabit()}
          streak={0}
          checkedInToday={false}
          onCheckIn={vi.fn()}
          onEdit={onEdit}
          onArchive={vi.fn()}
        />
      </ul>,
    );

    await user.click(screen.getByRole("button", { name: "編集" }));
    await user.click(screen.getByRole("button", { name: "保存" }));
    expect(await screen.findByRole("alert")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "キャンセル" }));
    expect(screen.queryByLabelText("習慣名を編集")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "編集" }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
