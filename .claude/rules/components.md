---
paths:
  - "frontend/src/components/**/*.tsx"
  - "frontend/src/components/**/*.css"
---
# Components
- props は5個までを目安にし、超えたら分割する
- 状態は hooks で管理し、components は表示だけを担う
- 一覧が空のときは、専用の表示を出す（何も出さないまま終わらせない）
- ボタン・ダイアログは共通コンポーネントにそろえる
- 操作要素には label か aria-label を付ける
- 色はCSS変数にまとめ、値を直書きしない
