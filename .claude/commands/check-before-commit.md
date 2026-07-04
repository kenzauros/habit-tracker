# コミット前チェック
コミット前に、次を確認して結果を報告してください。
1. cd frontend && pnpm build が通るか
2. cd frontend && pnpm test が通るか
3. cd api && uv run pytest が通るか
4. 変更に対応するテストがあるか
5. CLAUDE.md や rules と矛盾する変更がないか
