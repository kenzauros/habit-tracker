# Operations
## 確認なしで実行してよい操作
- alembic upgrade head（前進マイグレーション）
- uv add（依存追加）
- pnpm build / pnpm test / pnpm lint
- 動作確認のための dev サーバー起動
## 実行前に確認が必要な操作
- alembic downgrade（ロールバック。データ損失の可能性）
- SQLite DB ファイルの削除・リセット
- head 到達済みのマイグレーションファイルの編集（履歴の書き換え）
- SECRET_KEY・CORS origins の変更（セキュリティ境界に影響）
- uv remove（依存削除。影響が読みにくい）
