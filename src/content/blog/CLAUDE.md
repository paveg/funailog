# src/content/blog/

記事は `src/content/blog/{year}/{slug}.mdx` に置く。
URL は `/blog/{year}/{slug}` で、年がそのまま URL に含まれる（post.id = `{year}/{slug}`）。
内部リンクも年付きパスで書く。

## frontmatter

スキーマの原典は `src/schemas/blog-collection.ts`。ここに書かれた規約より原典を信頼する。

- `published`（公開日）と `isPublished`（公開フラグ）は別項目で、どちらも必須。
  下書きは `isPublished: false` のままにし、公開する PR で `true` に変える。
- `series` slug は既存 Part 記事の frontmatter を確認して一字一句揃える。
  表記揺れ（`kubernetes-the-hard-way-` と `kubernetes-hard-way-` など）があるとシリーズリンクが切れる。
- category を新設する場合は 3 箇所を同時に更新する:
  schema の enum、`src/config/site.ts` の CATEGORIES、`scripts/validate-content.ts` の VALID_CATEGORIES。

## MDX 本文

コンポーネントは MDX 冒頭で明示的に import する。自動 import は無い。

```mdx
import AffiliateCard from '@/components/AffiliateCard.astro';
```

裸 URL を単独行に置くとビルド時にリンクカードへ変換される（リスト内は対象外）。
新しい外部 URL を含む記事を書いたら `pnpm link-cards:warm` を手動で実行し、
`src/data/link-cards.json` と `public/.cache/embed/*.avif` の更新をコミットに含める。
実行しなくてもビルドは通る（ビルド時にライブ fetch する）が、キャッシュを温めた方が再現性が高い。

太字マーカー `**` が本文にそのまま残る崩れは pre-commit の `scripts/validate-content.ts` が検出する。
textlint（AI 文体検出）も MDX に対して走る。

## 文体

執筆時は `.claude/rules/blog-writing-style.md` に従う
（です・ます調、一人称「僕」、括弧内ツッコミ、カテゴリ別テンプレ）。
programming カテゴリの記事は「想定読者」セクションを「はじめに」の直下に置く。
