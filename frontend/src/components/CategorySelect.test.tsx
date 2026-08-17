import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { CategorySelect } from "./CategorySelect";

describe("CategorySelect", () => {
  it("カテゴリがない場合は空状態の表示になる", () => {
    render(<CategorySelect categories={[]} value="" onChange={vi.fn()} />);

    expect(screen.getByText("カテゴリがまだありません")).toBeInTheDocument();
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });

  it("カテゴリを選ぶとonChangeに選択値が渡る", () => {
    const onChange = vi.fn();
    render(<CategorySelect categories={["運動", "学習"]} value="" onChange={onChange} />);

    fireEvent.change(screen.getByRole("combobox", { name: "カテゴリ" }), {
      target: { value: "運動" },
    });

    expect(onChange).toHaveBeenCalledWith("運動");
  });
});
