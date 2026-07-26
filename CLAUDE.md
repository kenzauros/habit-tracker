# Habit Tracker
日々の習慣達成を記録する小さな Web アプリ。

## Structure
- frontend/ : React + TypeScript + Vite のフロントエンド
- api/ : FastAPI バックエンド（uv管理、SQLite + Alembic、JWT認証）

## Commands
- Install (frontend): pnpm -C frontend install
- Dev (frontend): pnpm -C frontend dev
- Build (frontend): pnpm -C frontend build
- Test (frontend): pnpm -C frontend test
- Lint (frontend): pnpm -C frontend lint
- Install (api): uv sync --directory api
- Dev (api): uv run --directory api uvicorn app.main:app --reload --port 8000
- Test (api): uv run --directory api pytest
- Migrate (api): uv run --directory api alembic upgrade head
- Migration check (api): uv run --directory api alembic check

## Product Rules
- 1つの習慣は1日に1回だけ check-in できる
- アーカイブは削除と区別する（消さず、一覧から外して戻せる）
- 取り消せない操作は、実行する前に確認する

## Workflow
- 変更前に関連ファイルを確認する
- 大きな変更では先に実装計画を提示する
- 追加した UI・API はテストを書き、可能なら動作確認を行う

## Project Context
- プロジェクトの規約は .claude/rules/ に整理してある
- 一部の規約は .claude/settings.json の hook で機械的にチェックされる（例: モデル変更時のマイグレーション作成漏れ、JWT_SECRET_KEY/CORS設定の直接編集のブロック）
- 定型作業はスキルを利用する（コンポーネント追加は add-component、リリースは release）
- 必要に応じてサブエージェントを利用する（UI/APIレビューは ui-reviewer/api-reviewer、実装は frontend-developer（並列実装では worktree で分離））