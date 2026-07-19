---
name: add-component
description: Habit TrackerのReactコンポーネントを規約に沿って新規作成する。コンポーネント本体とテストファイルをセットで生成したいときに使う。
argument-hint: "[コンポーネント名] [任意: 表示内容やpropsの説明]"
when_to_use: |
  - 「新しいコンポーネント <名前> を追加して」「<名前> を作って」と依頼されたとき
  - 「既存のコンポーネントを直して」のような修正依頼のときは使わない
---

# コンポーネント追加

`$0` という名前のUIコンポーネントを新規作成します。名前に続けて表示内容やpropsの説明があれば、`$ARGUMENTS`全体から仕様として読み取る。

## 既存のコンポーネント

以下の既存コンポーネントと命名・構成の一貫性を保つこと。

!`ls frontend/src/components`

## 準拠する規約

!`cat .claude/rules/components.md`

## 手順

1. 表示内容・props・データソースが名前や依頼文から一意に読み取れない場合は、実装前に想定する仕様を箇条書きで提示し、確認を得てから進める。読み取れる場合はこの確認を省略する
2. `${CLAUDE_SKILL_DIR}/templates/component.tsx.tmpl` を読み込み、`COMPONENT_NAME` を `$0` に、`COMPONENT_NAME_KEBAB` を `$0` のケバブケースに置換して `frontend/src/components/$0.tsx` として保存する
3. `frontend/src/App.css` の末尾に、同じケバブケースのクラスでスタイルを追記する
4. テストファイル `frontend/src/components/$0.test.tsx` を作成する。最低1つのレンダリングテストと、主要なふるまい1つのテストを書く
5. 生成物が状態を持つ場合は `frontend/src/hooks/use$0.ts` も作成する

## 出力形式

生成したファイルのパスを、最後に箇条書きで一覧表示する。
