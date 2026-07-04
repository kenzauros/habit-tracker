---
paths:
  - "frontend/src/**/*.test.ts"
  - "frontend/src/**/*.test.tsx"
  - "api/tests/**/*.py"
---
# Testing
- ロジックの単体テストは frontend/src/data/ に置く。today を固定する
- streak のテストは月・年の境界ケースを含める
- コンポーネントは Testing Library で、表示と操作を確認する
- 失敗したテストを削除して通さない（原因を直すか、仕様変更ならテストを更新する）

## バックエンド
- テスト用 DB はインメモリ SQLite（StaticPool）。ファイルを作らない
- DB は各テストで作り直す
- 認証のいらないテスト（health・auth）は client を使う
- 習慣の操作は auth_client を使う（実際に /auth/register を呼び、モックしない）
- ユーザー分離は、ヘッダーのトークンを切り替えて確認する
