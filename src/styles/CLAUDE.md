# src/styles/

Tailwind v4 の CSS-first 構成。
テーマ（色・フォント・トークン）は `theme.css` の `:root` / `.dark` トークンを編集する。
ルートの `tailwind.config.mjs` は読み込まれていないので触らない。

## 色トークン

- ブランド色は `--primary` / `--ring` / `--link*` / `--accent-line`。
  `--accent` は shadcn 由来のグレー面トークン（hover 背景など）で、名前に反してブランド色ではない。
- ブランド色を変えたら `src/components/ogImage.tsx` の `ACCENT` 定数も追随させる
  （OG 画像生成は CSS 変数を読めずハードコードしている）。
- L 値のコメントは WCAG コントラスト比の担保値。色変更後は `pnpm test:a11y` で再確認する。

## import 経路

`theme.css` → `components.css` → `budoux.css` は `Layout.astro` でグローバルに読み込まれる。
`prose.css` は記事ルートだけで読み込まれるので、そこに書いたスタイルは記事以外のページに効かない。
`:focus-visible` のフォーカスリングは意図的に `budoux.css`（グローバル側）にある。
`prose.css` へ移すと記事以外でフォーカスリングが消え、WCAG 2.4.7 の退行になる。

## 和文タイポグラフィ（4 レイヤ設計）

本文（`text-wrap: pretty`）・見出し（`word-break: auto-phrase` + `balance`）・
リンク（BudouX 除外 + 常時下線）・和欧混植（`text-autospace`）の 4 レイヤを別々に設計している。
冗長に見えても 1 つに統合しない。背景は `docs/adr/0001-prose-typography-layered-design.md`。

- リンク下線は `underline-offset-3` でサイト全体を統一する。新しいリンクスタイルもこの値を使う。
- BudouX の `<wbr>` 挿入は Safari/Firefox 向けフォールバックとして維持する
  （Chrome だけで見ると不要に見えるが消さない）。

ダークモードは `<html>` への `.dark` クラス付与（`localStorage.theme`、無ければ `prefers-color-scheme`）。
Tailwind の media 戦略ではなく class 戦略。
