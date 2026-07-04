---
name: add-component
description: Habit TrackerのReactコンポーネントを規約に沿って新規作成する。コンポーネント本体とテストファイルをセットで生成したいときに使う。
---

# コンポーネント追加

Habit TrackerのUIコンポーネントを新規作成します。

## 手順

1. `frontend/src/components/<コンポーネント名>/` ディレクトリを作成する
2. 以下のファイルを生成する
   - `<コンポーネント名>.tsx` — コンポーネント本体
   - `<コンポーネント名>.test.tsx` — Vitest + Testing Library のテスト
3. 生成物が状態を持つ場合は、`frontend/src/hooks/use<コンポーネント名>.ts` も作成する

## 規約

- props は5個までを目安にする
- 状態は hooks に持たせ、コンポーネント本体は表示に専念する
- 一覧が空のときは専用の表示を出す
- 操作要素には aria-label を付ける
- 色は CSS 変数にまとめ、値を直書きしない

## 出力形式

生成したファイルのパスを、最後に箇条書きで一覧表示する。
