import type { HabitStatsSummary } from "../hooks/selectors";

interface Props {
  stats: HabitStatsSummary;
}

export function HabitStats({ stats }: Props) {
  if (stats.activeCount === 0) {
    return (
      <section className="habit-stats" aria-label="習慣の統計">
        <h2>統計</h2>
        <p className="empty-message">統計を表示する習慣がありません。</p>
      </section>
    );
  }

  return (
    <section className="habit-stats" aria-label="習慣の統計">
      <h2>統計</h2>
      <dl className="habit-stats-grid">
        <div className="habit-stats-item">
          <dt>習慣数</dt>
          <dd>{stats.activeCount}</dd>
        </div>
        <div className="habit-stats-item">
          <dt>本日の達成</dt>
          <dd>
            {stats.checkedInTodayCount} / {stats.activeCount}
          </dd>
        </div>
        <div className="habit-stats-item">
          <dt>現在の最長ストリーク</dt>
          <dd>
            {stats.currentBest
              ? `${stats.currentBest.name} 🔥${stats.currentBest.streak}日`
              : "-"}
          </dd>
        </div>
        <div className="habit-stats-item">
          <dt>連続日数の最長記録</dt>
          <dd>
            {stats.longestEver
              ? `${stats.longestEver.name} 🏆${stats.longestEver.streak}日`
              : "-"}
          </dd>
        </div>
      </dl>
    </section>
  );
}
