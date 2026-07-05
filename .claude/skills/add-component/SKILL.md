---
name: add-component
description: Habit TrackerのReactコンポーネントを規約に沿って新規作成する。コンポーネント本体とテストファイルをセットで生成したいときに使う。
argument-hint: "[コンポーネント名]"
when_to_use: |
  - 「新しいコンポーネント <名前> を追加して」「<名前> を作って」と依頼されたとき
  - 「既存のコンポーネントを直して」のような修正依頼のときは使わない
---

# コンポーネント追加

`$0` という名前のUIコンポーネントを新規作成します。

## 既存のコンポーネント

以下の既存コンポーネントと命名・構成の一貫性を保つこと。

!`ls frontend/src/components`

## 準拠する規約

!`cat .claude/rules/components.md`

## 手順

1. `${CLAUDE_SKILL_DIR}/templates/component.tsx.tmpl` を読み込み、`COMPONENT_NAME` を `$0` に置換して `frontend/src/components/$0.tsx` として保存する
2. `${CLAUDE_SKILL_DIR}/templates/component.module.css.tmpl` から `frontend/src/components/$0.module.css` を生成する
3. テストファイル `frontend/src/components/$0.test.tsx` を作成する。最低1つのレンダリングテストと、主要なふるまい1つのテストを書く
4. 生成物が状態を持つ場合は `frontend/src/hooks/use$0.ts` も作成する

## 出力形式

生成したファイルのパスを、最後に箇条書きで一覧表示する。
