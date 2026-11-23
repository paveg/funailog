# src/pages/

全ルートはビルド時に静的生成される。
`api/` 配下（posts.json, og/\*.png, cv.pdf）も `getStaticPaths` で生成される静的ファイルで、
ランタイムエンドポイントではない。動的な振る舞いが必要なら React island 側で実装する。

## ルーティング

- ブログ記事は `blog/[...slug].astro`。URL は `/blog/{year}/{slug}`（post.id に年が含まれる）。
- ルート直下の `[slug].astro` は `page` コレクション（about, privacy など）用で、ブログとは別系統。
- シリーズページは `blog/series/[series].astro`。frontmatter の `series` 文字列がキーで、`seriesOrder` 順。
- ブログ一覧・カテゴリ・タグの各ページは Astro の `paginate()` を使わず、
  React island の `InfinitePostList` が `/api/posts.json` を fetch する無限スクロールで表示する。
  ページネーション変更はこの island が対象。

## i18n（手動運用）

英語ページは自動生成されない。
`src/pages/en/` に手で `.astro` ページを作り、`useTranslations('en')` を使う（現状、英語ページは無い）。
`generateHreflangs()` は ja と x-default しか返さないため、
英語版が存在するページは hreflang をページ内にハードコードする。
ポートフォリオは別サイト（https://me.funailog.com/）へ移した。
`/portfolio` などの旧 URL は `public/_redirects` で転送する。

UI 文字列は `src/i18n/ui.ts` の `ja` と `en` 両方のマップにキーを追加し、コンポーネントでは `t()` で参照する。
表示文字列をコンポーネントに直書きしない。
