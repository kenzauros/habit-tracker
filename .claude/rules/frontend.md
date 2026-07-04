---
paths:
  - "frontend/src/hooks/**/*.ts"
---
# Frontend
- 状態は機能ごとに hooks を分ける（useHabits / useAddForm など）
- フォームは送信前に、習慣名の空と重複を弾く
- API が 401 を返したら、useHabits の onUnauthorized で処理する（api.ts では自動ログアウトしない）
- ミューテーションはサーバーの成功後に state を更新する（楽観的更新はしない）
