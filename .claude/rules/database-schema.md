---
paths:
  - "api/app/models.py"
  - "api/alembic/versions/**"
---
# Database Schema
- User・Habit の主キーは UUID 文字列
- HabitLog の主キーは整数連番（外部に出さない内部 ID。実質の識別子は habit_id と checked_date）
- checked_date は Date 型でなく String (YYYY-MM-DD) で持つ（API とクライアントで変換不要）
- user_id は nullable（認証導入前のデータを壊さない後方互換）
- SQLite は既存テーブルに FK 制約を後付けできないので、ORM のリレーションで担保する
- (habit_id, checked_date) の重複は DB の UniqueConstraint で防ぐ（並列リクエスト対策）
