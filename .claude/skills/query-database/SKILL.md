---
name: query-database
description: habit-db MCPでローカルDBのクエリ結果を取得する。データ調査や集計の依頼を受けたときに使う
---

MCP サーバー habit-db (@bytebase/dbhub) でローカルDB (`api/habit_tracker.db`) に問い合わせる。

## 使用可能ツール

- スキーマの把握: `search_objects`ツール (readonly)
- クエリ: `execute_sql`ツール (readonly)
