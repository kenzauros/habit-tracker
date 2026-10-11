# 第4章 成果物（最終形）— 習慣トラッカー完成版

第4章「Claude Code を拡張する」終了時点の成果物一式です。
第3章で整えた Claude 連携ファイルに、スキル・サブエージェント・並び替え機能を加えています。
Claude連携ファイルとアプリコードの両方を含みます。

## このフォルダの位置づけ

- 実機採取の成果物がベースです。
- .devcontainer/・.gitignore・.claude/settings.local.example.json は、本文に掲載した内容に準拠しています。

## 第4章での追加内容

- **4-1 スキル**
  - add-component … コンポーネントを規約に沿って新規作成する。テンプレート（templates/）と props 個数チェック（scripts/validate.sh）つき
  - release … バージョンタグを打って push する。`disable-model-invocation: true` で、ユーザーが明示的に実行したときだけ動く
  - add-component で生成したコンポーネント … CategorySelect / HabitStats / StreakBadge
- **4-2 サブエージェント**
  - ui-reviewer … UI 変更のレビュー（haiku、`memory: project` でレビュー知見を蓄積）
  - api-reviewer … API 変更のレビュー（冪等性の観点を追加）
  - frontend-developer … フロントエンド実装担当（`isolation: worktree` で隔離して作業）
  - .worktreeinclude … worktree にコピーする .env を指定
- **機能追加** … 習慣の並び順をドラッグ&ドロップで変更（`PATCH /habits/{id}/reorder`、絶対 order 指定で冪等）

## ディレクトリ構成

```
（プロジェクトルート）
├─ CLAUDE.md                       ← 概要・コマンド・案内だけを残したハブ
├─ .gitignore                      ← 秘密情報・個人設定・依存物を除外
├─ .worktreeinclude                ← worktree に持ち込む .env
├─ .devcontainer/
│  └─ devcontainer.json            ← 学習環境
├─ .claude/
│  ├─ rules/
│  │  ├─ coding-style.md           無条件・全体
│  │  ├─ frontend.md               paths: frontend/src/hooks/**/*.ts
│  │  ├─ components.md             paths: frontend/src/components/**
│  │  ├─ data-layer.md             paths: frontend/src/data/**/*.ts
│  │  ├─ testing.md                paths: frontend/src/**/*.test.ts(x), api/tests/**/*.py
│  │  ├─ security.md               paths: api/app/**/*.py
│  │  └─ api.md                    paths: api/app/{crud,schemas,routers}/**/*.py
│  ├─ skills/
│  │  ├─ review-ui/SKILL.md
│  │  ├─ review-api/SKILL.md
│  │  ├─ check-before-commit/SKILL.md
│  │  ├─ add-component/            SKILL.md ＋ templates/ ＋ scripts/validate.sh
│  │  └─ release/SKILL.md          手動実行のみ
│  ├─ agents/
│  │  ├─ ui-reviewer.md            review-ui をプリロード、project メモリ
│  │  ├─ api-reviewer.md           review-api をプリロード
│  │  └─ frontend-developer.md     add-component をプリロード、worktree 隔離
│  ├─ agent-memory/
│  │  └─ ui-reviewer/              ui-reviewer が蓄積したレビュー知見
│  ├─ settings.json                permissions（allow/ask/deny）＋ hooks
│  └─ settings.local.example.json  個人設定のひな形（settings.local.json は gitignore）
├─ frontend/                       Vite + React + TypeScript（テスト込み）
└─ api/                            FastAPI + SQLite + Alembic（テスト込み）
```

## 動かし方

1. VSCodeでこのフォルダを開き、Dev Containersでコンテナーを組み立てる
2. フロントエンド: `pnpm -C frontend install` → `pnpm -C frontend dev`
3. API: `uv sync --directory api` → `uv run --directory api alembic upgrade head` → `uv run --directory api uvicorn app.main:app --reload --port 8000`
4. 秘密情報: frontend/.env.example・api/.env.example をそれぞれ .env にコピーして値を設定

## hooks（settings.json）

- **PreToolUse 境界ガード** … api/app/config.py への編集内容に JWT_SECRET_KEY / CORS 設定が含まれるときブロックする
- **PostToolUse guard:color** … 色の値の直書きを検出する。本体は frontend/package.json の scripts
- **PostToolUse alembic check** … モデル変更時のマイグレーション作成漏れを検出する
