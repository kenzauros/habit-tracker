---
paths:
  - "api/app/routers/**/*.py"
---
# API Design
- チェックの追加・削除（POST / DELETE /habits/{id}/logs）は冪等にする
- チェック操作のレスポンスは Habit 全体を返す（クライアントが再取得せず更新できる）
- 登録成功時はそのままトークンを返す（別途 /login は不要）
- DELETE /habits/{id} は 204 No Content（ボディなし）
- CORS の allow_origins は開発用に固定。本番デプロイ時は環境変数で上書きする
