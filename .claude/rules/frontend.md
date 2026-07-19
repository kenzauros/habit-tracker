---
paths:
  - "frontend/src/hooks/**/*.ts"
---
# Frontend
- 状態は機能ごとに hooks を分ける（useHabits / useAddForm など）
- フォームは送信前に、習慣名の空と重複を弾く
- チェックイン・アーカイブ操作は楽観的にUI更新し、失敗したらロールバックする
