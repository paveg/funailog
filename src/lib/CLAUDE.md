# src/lib/

remark/rehype プラグイン群とビルド時ヘルパー。
ユニットテストは同ディレクトリに `*.test.ts` で colocate する（vitest, `pnpm test`）。

## リンクカードの経路

裸 URL は 3 段階でリンクカードになる:
`remark-link.ts` が mdast の裸リンクに `hProperties.dataLinkcard` を付与
→ 記事ページの MDX components マップで `a` が `src/components/Link.astro` に割り当てられる
→ `Link.astro` が `data-linkcard` 属性の有無で `LinkCard.astro` と通常アンカーを分岐する。
通常リンクの見た目を変えたいときの編集対象は `Link.astro`。
キャッシュは 2 系統ある:
メタデータは `src/data/link-cards.json`（`link-card-cache.ts`）、
OG 画像は `public/.cache/embed/{sha256}.avif`（`api.ts` が sharp で AVIF q30 に変換）。

## ビルド時 fetch の SSRF ガード

ビルド時に外部 URL を fetch するコードは `ssrf-guard.ts` の `assertPublicUrl` を通す。
`api.ts` がメタデータ fetch と og:image fetch の両方に個別適用しているのが実例。
ガードに落ちた URL は警告してフォールバックし、ビルドは失敗させない。

## 下書きフィルタの非対称性（意図的）

`posts.ts` の `isVisible` は dev サーバでは下書き（`isPublished: false`）も表示するヘルパーで、
ブログページ・関連記事・posts.json・OG 生成が使う。
一方 `rss.xml.ts` と `llms.txt.ts` は raw の `isPublished` でフィルタし、dev でもフィードに下書きを出さない。
これは意図された非対称なので `isVisible` に統一しない
（公開フィードへの下書き漏れ防止。根拠はコミット a3c79d0 / PR #151 のメッセージ）。

## BudouX

`rehype-budoux.ts` は見出し（h1-h6）だけに `<wbr>` を挿入し、`a` タグを除外する。
本文の改行は CSS レイヤ（`text-wrap: pretty` ほか）が受け持つ。
適用範囲を変える前に `docs/adr/0001-prose-typography-layered-design.md` の 4 レイヤ設計を読む。
