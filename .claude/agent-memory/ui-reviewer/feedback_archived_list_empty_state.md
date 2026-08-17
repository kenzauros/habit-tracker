---
name: archived-list-empty-state-intentional
description: ArchivedHabitListが空のとき何も描画しないのは意図的な例外で、空状態表示の欠落ではない
metadata:
  type: feedback
---

ArchivedHabitListは、アーカイブ済みの習慣が0件のときセクションごと描画しない。components.mdの
「一覧が空のときは、専用の表示を出す」に対する意図的な例外。以前のレビューで「空状態の表示がない」
と指摘したのは誤り。

**Why:** 一度もアーカイブしていない利用者に「アーカイブ済みはありません」と見せても意味がないから。
HabitListとWeeklyCalendarには空状態の表示がある。

**How to apply:** ArchivedHabitListに限り、空のときに何も出さないことを規約違反と判定しない。
ほかの一覧では従来どおり空状態の表示を確認する。
