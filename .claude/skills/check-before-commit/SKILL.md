---
name: check-before-commit
description: コミット前のフロントエンドとAPIのチェックを実施する
context: fork
agent: Explore
---

# コミット前チェック
コミット前に、次を確認して結果を報告してください。

## Frontend
1. pnpm -C frontend build が通るか
2. pnpm -C frontend test が通るか

## API
3. uv run --directory api pytest が通るか
4. uv run --directory api alembic check が通るか（モデル変更に対応するマイグレーションを作成し忘れていないか）

## 共通
5. 変更に対応するテストがあるか
6. CLAUDE.md や rules と矛盾する変更がないか
