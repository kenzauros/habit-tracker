interface Props {
  streak: number;
}

export function StreakBadge({ streak }: Props) {
  const isActive = streak > 0;

  return (
    <span
      className={`streak-badge${isActive ? "" : " streak-badge-inactive"}`}
      aria-label={`連続達成${streak}日`}
    >
      🔥 {streak}日
    </span>
  );
}
