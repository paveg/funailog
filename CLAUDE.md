# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # 開発サーバ（localhost のみ。server.host は有効化しない: astro.config.ts のコメント参照）
pnpm build        # prebuild で dist を掃除 → astro build → dist/styleguide を削除
pnpm lint         # 8系統を並列実行: astro check / content validate / eslint / prettier / knip / markdownlint / textlint / tsc
pnpm fix          # prettier, eslint, markdownlint, textlint の自動修正
pnpm test         # vitest（src/lib/*.test.ts のユニットテストのみ）
pnpm test:a11y    # Playwright + axe-core（e2e/a11y.test.ts のみ。汎用 E2E は無い）
```

lint は eslint と tsc だけではない。
knip（未使用ファイル/依存）と textlint（AI 文体検出、MDX 対象）でも落ちる。

## Architecture

Astro 静的ブログ (funailog.com)。
全ページをビルド時に `dist/` へ生成し、Cloudflare Workers の static assets として配信する（`wrangler.json`）。
Cloudflare Pages ではなく、SSR でもない。
`astro.config.ts` に adapter と output 指定が無いのは意図的で、このまま維持する。
`src/pages/api/*` もビルド時に生成される静的ファイルであり、ランタイムエンドポイントではない。

スタイリングは Tailwind v4 の CSS-first 構成。
テーマ（色・フォント・トークン）の実体は `src/styles/theme.css` にあり、そこを編集する。
ルートの `tailwind.config.mjs` はどこからも読み込まれていない残骸で、編集しても何も変わらない（`@config` ディレクティブが無く、未インストールの依存を import している）。

ブログ記事は `src/content/blog/{year}/*.mdx` に年ディレクトリのみで配置する。
日本語のみで、英語コンテンツツリーは存在しない（英語は `src/pages/en/portfolio.astro` の 1 ページだけ）。
固定ページは `src/content/page/*.mdx`（about, privacy）、サイトメタデータは `src/content/site/meta.yml`。

ディレクトリ別の規約は各階層の CLAUDE.md にある:
`src/content/blog/`, `src/lib/`, `src/pages/`, `src/styles/`。

パスエイリアス `@/` は `src/` を指す。
import 順は ESLint が強制する（`pnpm fix` で自動整列）。
