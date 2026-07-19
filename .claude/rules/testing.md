---
paths:
  - "frontend/src/**/*.test.ts"
  - "frontend/src/**/*.test.tsx"
  - "api/tests/**/*.py"
---
# Testing
- 失敗したテストを削除して通さない（原因を直すか、仕様変更ならテストを更新する）

## Frontend
- ロジックの単体テストは src/data/ に作成する
- streak のテストでは現在日時を固定する（today を引数で渡す）
- コンポーネントは Testing Library で、表示と操作を確認する
- テスト名は日本語で、「条件→期待結果」の順に書く

## Backend
- テスト名は日本語で、「条件→期待結果」の順に書く
- crud関数を直接呼ばず、TestClientでHTTPリクエストのレスポンス（ステータスコード・JSON）を検証する
- DBはテストごとにin-memory SQLiteを作り直し、テスト間で状態を共有しない
- 認証が必要なテストは auth_headers フィクスチャで実際に登録・ログインしてトークンを取得する（トークンを直接組み立てない）
- 他ユーザーのデータに触れられないことを確認するテストは test_habit_isolation.py にまとめる

