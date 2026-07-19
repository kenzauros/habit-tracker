import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CategorySelect } from "./CategorySelect";

describe("CategorySelect", () => {
  it("カテゴリ一覧が空のとき、選択不可の専用表示を出す", () => {
    render(<CategorySelect categories={[]} value="" onChange={vi.fn()} />);

    const select = screen.getByLabelText("カテゴリ選択") as HTMLSelectElement;
    expect(select).toBeDisabled();
    expect(screen.getByText("カテゴリがありません")).toBeInTheDocument();
  });

  it("カテゴリ一覧があるとき、すべてと各カテゴリを選択肢に表示する", () => {
    render(
      <CategorySelect categories={["健康", "勉強"]} value="" onChange={vi.fn()} />,
    );

    expect(screen.getByRole("option", { name: "すべて" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "健康" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "勉強" })).toBeInTheDocument();
  });

  it("カテゴリを選択すると、選択した値でonChangeを呼び出す", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <CategorySelect
        categories={["健康", "勉強"]}
        value=""
        onChange={onChange}
      />,
    );

    await user.selectOptions(screen.getByLabelText("カテゴリ選択"), "健康");

    expect(onChange).toHaveBeenCalledWith("健康");
  });

  it("valueに一致する選択肢が選ばれた状態で表示される", () => {
    render(
      <CategorySelect
        categories={["健康", "勉強"]}
        value="勉強"
        onChange={vi.fn()}
      />,
    );

    const select = screen.getByLabelText("カテゴリ選択") as HTMLSelectElement;
    expect(select.value).toBe("勉強");
  });
});
