import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StreakBadge } from "./StreakBadge";

describe("StreakBadge", () => {
  it("streakが1以上のとき→連続日数を表示する", () => {
    render(<StreakBadge streak={5} />);
    expect(screen.getByText("🔥 5日")).toBeInTheDocument();
  });

  it("streakが0のとき→非アクティブなスタイルで表示する", () => {
    render(<StreakBadge streak={0} />);
    const badge = screen.getByLabelText("連続達成0日");
    expect(badge).toHaveClass("streak-badge-inactive");
  });
});
