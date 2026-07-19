---
paths:
  - "api/app/crud/**/*.py"
  - "api/app/schemas/**/*.py"
  - "api/app/routers/**/*.py"
---
# API Domain
- 重複・空値などのドメインエラーは例外を投げず文字列定数（DUPLICATE/EMPTY等）で返し、router層でHTTPExceptionに変換する
- チェックインの重複投稿はエラーにせず無視する（冪等）
- カテゴリの空文字は「未分類」に正規化する（frontend側と同じルールをAPI側でも独立に持つ。共有化はしない）
- レスポンスのフィールド名はcamelCase、DB/モデル側はsnake_case（相互変換は手動でschemaに書く）
