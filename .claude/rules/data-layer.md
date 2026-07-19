---
paths:
  - "frontend/src/data/**/*.ts"
---
# Data Layer
- APIエラーは apiClient.ts が汎用種別（ApiErrorKind）に変換し、各 xxxApi.ts がそれをドメイン固有のエラー型に詰め替える
- 日付は常に "YYYY-MM-DD" の文字列で扱う（Dateのまま受け渡ししない）
- 認証トークンは tokenStorage.ts 経由でのみ読み書きする（localStorageに直接触れない）
