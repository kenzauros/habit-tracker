# 第5章 成果物（最終形）— 習慣トラッカー完成版

第5章「外部ツールと連携する（MCP）」終了時点の成果物一式です。
第4章までのスキル・サブエージェント・並び替え機能に、MCP サーバー連携を加えています。
Claude連携ファイルとアプリコードの両方を含みます。

## このフォルダの位置づけ

- 実機採取の成果物がベースです。
- .devcontainer/・.gitignore・.claude/settings.local.example.json は、本文に掲載した内容に準拠しています。

## 第5章での追加内容

- **MCP サーバー（.mcp.json）**
  - habit-db … @bytebase/dbhub（stdio）でローカル DB に問い合わせる。接続先は dbhub.toml、DSN は環境変数 `HABIT_DB_DSN`
  - context7 … ライブラリの最新ドキュメントを取得する（http）。認証は環境変数 `CONTEXT7_API_KEY`
  - github … リポジトリ・Issue・PR を操作する（http、toolsets は repos / issues / pull_requests に限定）。認証は環境変数 `GITHUB_MCP_PAT`
- **dbhub.toml** … `execute_sql` を readonly・最大100行に制限し、`search_objects` でスキーマを把握できるようにする
- **スキル**
  - query-database … habit-db MCP でデータ調査・集計を行う手順
  - context7-mcp … ライブラリ・フレームワークの質問で Context7 を使う手順
- **ルール** … rules/context7.md（ライブラリ関連の質問では Context7 の最新ドキュメントを優先）
- **permissions** … 読み取り系の MCP ツール（habit-db / context7 / github の Issue・PR 参照）は allow、書き込み系の github ツール（コメント追加・PR 作成/更新/マージ）は ask

## 第4章までの内容

- **スキル** … add-component（templates/ と scripts/validate.sh つき）、release（手動実行のみ）
- **サブエージェント** … ui-reviewer（project メモリ）、api-reviewer、frontend-developer（worktree 隔離）
- **.worktreeinclude** … worktree にコピーする .env を指定
- **機能** … 習慣の並び順をドラッグ&ドロップで変更（`PATCH /habits/{id}/reorder`、絶対 order 指定で冪等）

## ディレクトリ構成

```
（プロジェクトルート）
├─ CLAUDE.md                       ← 概要・コマンド・案内だけを残したハブ
├─ .mcp.json                       ← MCP サーバー定義（habit-db / context7 / github）
├─ dbhub.toml                      ← habit-db（dbhub）の接続・ツール設定
├─ .gitignore                      ← 秘密情報・個人設定・依存物を除外
├─ .worktreeinclude                ← worktree に持ち込む .env
├─ .devcontainer/
│  └─ devcontainer.json            ← 学習環境
├─ .claude/
│  ├─ rules/
│  │  ├─ coding-style.md           無条件・全体
│  │  ├─ context7.md               ライブラリ質問で Context7 を使う方針
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
│  │  ├─ release/SKILL.md          手動実行のみ
│  │  ├─ query-database/SKILL.md   habit-db MCP でDB調査
│  │  └─ context7-mcp/SKILL.md     Context7 MCP でドキュメント取得
│  ├─ agents/
│  │  ├─ ui-reviewer.md            review-ui をプリロード、project メモリ
│  │  ├─ api-reviewer.md           review-api をプリロード
│  │  └─ frontend-developer.md     add-component をプリロード、worktree 隔離
│  ├─ agent-memory/
│  │  └─ ui-reviewer/              ui-reviewer が蓄積したレビュー知見
│  ├─ settings.json                permissions（allow/ask/deny、MCP ツール含む）＋ hooks
│  └─ settings.local.example.json  個人設定のひな形（settings.local.json は gitignore）
├─ frontend/                       Vite + React + TypeScript（テスト込み）
└─ api/                            FastAPI + SQLite + Alembic（テスト込み）
```

## 動かし方

1. VSCodeでこのフォルダを開き、Dev Containersでコンテナーを組み立てる
2. フロントエンド: `pnpm -C frontend install` → `pnpm -C frontend dev`
3. API: `uv sync --directory api` → `uv run --directory api alembic upgrade head` → `uv run --directory api uvicorn app.main:app --reload --port 8000`
4. 秘密情報: frontend/.env.example・api/.env.example をそれぞれ .env にコピーして値を設定
5. MCP 用の環境変数: `HABIT_DB_DSN`（habit-db）、`CONTEXT7_API_KEY`（context7）、`GITHUB_MCP_PAT`（github）をシェルに設定してから Claude Code を起動する。値はリポジトリにコミットしない

## hooks（settings.json）

- **PreToolUse 境界ガード** … api/app/config.py への編集内容に JWT_SECRET_KEY / CORS 設定が含まれるときブロックする
- **PostToolUse guard:color** … 色の値の直書きを検出する。本体は frontend/package.json の scripts
- **PostToolUse alembic check** … モデル変更時のマイグレーション作成漏れを検出する
