# 第3章 成果物（最終形）— 習慣トラッカー完成版

第3章「プロジェクトで学ぶ」のハンズオン3終了時点の成果物一式です。
Claude連携ファイルとアプリコードの両方を含みます。

## このフォルダの位置づけ

- 実機採取の成果物がベースです。
- .devcontainer/・.gitignore・.claude/settings.local.example.json は、本文に掲載した内容に準拠しています。

## ディレクトリ構成

```
（プロジェクトルート）
├─ CLAUDE.md                       ← 概要・コマンド・案内だけを残したハブ
├─ .gitignore                      ← 秘密情報・個人設定・依存物を除外
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
│  │  └─ check-before-commit/SKILL.md
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

