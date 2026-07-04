# Project Overview
Habit Tracker は、日々の習慣達成を記録する Web アプリ。
ユーザー登録・ログイン（JWT）で複数ユーザーのデータを分離管理する。

# Structure
- frontend/  Vite + React SPA（TypeScript）
- api/       FastAPI バックエンド（SQLite + Alembic、JWT 認証）

# Commands

## フロントエンド（frontend/ で実行）
- pnpm dev
- pnpm lint
- pnpm test
- pnpm build

## バックエンド（api/ で実行）
- uv run uvicorn app.main:app --reload   # 開発サーバー（:8000）
- uv run pytest                          # テスト
- uv run alembic upgrade head            # マイグレーション適用

## 環境変数
- frontend/.env  →  VITE_API_URL=http://localhost:8000（デフォルト）
- api/app/auth.py の SECRET_KEY は環境変数 SECRET_KEY で上書き（本番用）

# Product Rules
- アーカイブは削除と区別する（消さず、一覧から外して戻せる）
- 取り消せない操作は、実行する前に確認する
- データはユーザーごとに分離する（他ユーザーのデータを操作しない）

# Workflow
- 変更前に関連ファイルを確認する
- 大きな変更では先に実装計画を提示する
- UI 変更では可能なら表示確認を行う

# Project Context
- プロジェクトの規約は .claude/rules/ に整理してある
