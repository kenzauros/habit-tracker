// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { HabitItem } from "./HabitItem";
import type { Habit } from "../data/types";

function makeHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    id: "h1",
    name: "運動",
    checkedDates: [],
    ...overrides,
  };
}

function defaultProps(overrides = {}) {
  return {
    habit: makeHabit(),
    checked: false,
    streak: 0,
    isEditing: false,
    editValue: "運動",
    editCategory: "",
    editCategoryPlaceholder: "",
    onEditValueChange: vi.fn(),
    onEditCategoryChange: vi.fn(),
    onStartEdit: vi.fn(),
    onCommitEdit: vi.fn(),
    onCancelEdit: vi.fn(),
    onCheckIn: vi.fn(),
    onArchive: vi.fn(),
    ...overrides,
  };
}

afterEach(cleanup);

describe("HabitItem 編集フォーム", () => {
  it("名前フィールド → カテゴリフィールドへのフォーカス移動では確定しない", async () => {
    const user = userEvent.setup();
    const onCommitEdit = vi.fn();
    render(
      <HabitItem
        {...defaultProps({ isEditing: true, onCommitEdit })}
      />
    );

    const nameInput = screen.getByPlaceholderText("習慣名");
    const catInput = screen.getByPlaceholderText("カテゴリ（任意）");

    await user.click(nameInput);
    await user.click(catInput);

    expect(onCommitEdit).not.toHaveBeenCalled();
  });

  it("編集フォームの外へフォーカスが移動したとき→確定する", async () => {
    const user = userEvent.setup();
    const onCommitEdit = vi.fn();
    render(
      <div>
        <HabitItem
          {...defaultProps({ isEditing: true, onCommitEdit })}
        />
        <button>外のボタン</button>
      </div>
    );

    const nameInput = screen.getByPlaceholderText("習慣名");
    await user.click(nameInput);
    await user.click(screen.getByText("外のボタン"));
    await new Promise((r) => setTimeout(r, 0)); // flush blur's setTimeout

    expect(onCommitEdit).toHaveBeenCalledTimes(1);
  });

  it("Enter キー押下 → 確定する", async () => {
    const user = userEvent.setup();
    const onCommitEdit = vi.fn();
    render(
      <HabitItem {...defaultProps({ isEditing: true, onCommitEdit })} />
    );

    await user.type(screen.getByPlaceholderText("習慣名"), "{Enter}");
    expect(onCommitEdit).toHaveBeenCalledTimes(1);
  });

  it("Escape キー押下 → キャンセルする", async () => {
    const user = userEvent.setup();
    const onCancelEdit = vi.fn();
    render(
      <HabitItem {...defaultProps({ isEditing: true, onCancelEdit })} />
    );

    await user.type(screen.getByPlaceholderText("習慣名"), "{Escape}");
    expect(onCancelEdit).toHaveBeenCalledTimes(1);
  });
});
