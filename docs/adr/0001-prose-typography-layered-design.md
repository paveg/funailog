# ADR-0001: Adopt Layered JP/EN Typography Design (jp-ui-contracts inspired)

## Status

Proposed

## Context

funailog は日本語 + 英語混在の技術ブログで、直近の #112 で `rehype-budoux` プラグインを導入し、全テキストノードに `<wbr>` を挿入して句節単位の改行を実現した。導入後、以下の副作用が観測された：

- リンクテキスト内部にも `<wbr>` が入るため、リンク文字列が句節境界で途中改行される
- `prose.css` のリンクは `decoration-transparent`（hover 時のみ下線）で、色弱/ダークモード/改行時に認識が難しい
- `word-break: keep-all` + greedy 改行の副作用で、右端に大きな空白（穴ボコ）が残る
- 和欧混植（「TanStack Queryの設定」等）で自動スペーシングが効かず、ぎこちない

参考として hirokaji/jp-ui-contracts（日本語 UI 設計契約キット）を調査した結果、本文/見出し/リンク/和欧混植を **別レイヤとして設計** することが実効的と判明。

## Decision

jp-ui-contracts のレシピ群を参考に、以下のレイヤ分離を採用する：

1. **本文レイヤ** (`p`, `li`): `text-wrap: pretty` による全体最適化された改行
2. **見出しレイヤ** (`h1`-`h4`): `word-break: auto-phrase` + `text-wrap: balance`
3. **リンクレイヤ** (`a`): rehype-budoux から除外 + 常時下線表示 + `underline-offset-3` で全箇所統一
4. **和欧混植レイヤ** (`:lang(ja)`): `text-autospace: normal` で自動スペーシング

BudouX は Safari/Firefox 向けの句節改行フォールバックとして維持する（撤去はしない）。

同じ改修機会で以下の周辺修正も実施する（ホリスティックレビューで顕在化した問題）：

- **Focus ring の大域化**: `:focus-visible` を `prose.css`（記事ルートのみ）から `budoux.css`（Layout でグローバル import）へ移動。WCAG 2.4.7 退行を解消。
- **`underline-offset` 統一**: プロジェクト全体で `-3` に揃える（現状は `-2` / `-3` / `-4` の 3 種が混在）。

代替案として検討したもの：

- **案A: 下線だけ直す最小変更**: 穴ボコ問題とリンク途中改行が未解決
- **案B: BudouX 撤去して `auto-phrase` 一本化**: Safari で退行
- **採用案（案1改）**: BudouX を保持しつつレイヤ分離で弱点補正

## Consequences

### Positive

- リンクが途中で切れなくなる（可読性と認識性の両方が向上）
- 下線の常時表示で WCAG 1.4.1（色のみに頼らない）の達成に寄与
- Focus ring が全ページで効き、WCAG 2.4.7 Focus Visible 退行を解消
- `underline-offset` 統一でリンクの視覚言語が一貫
- Chrome/Edge ユーザーは `text-wrap: pretty` と `text-autospace` でさらにリッチな体験
- jp-ui-contracts の契約思想を取り込むことで、今後の UI 拡張時の判断軸が揃う
- Safari ユーザーも BudouX `<wbr>` の恩恵を引き続き受けられる（退行なし）

### Negative

- CSS の複雑度が増す（4 レイヤの規則が並立）
- `text-autospace` は Chrome 137+（2025 年夏）のみで、現時点では限定的な機能
- `color-mix()` を使う箇所で古いブラウザのフォールバック設計が必要
- BudouX と `auto-phrase` の二重適用で、稀に見出しの改行が不自然になる可能性（観測時に個別対処）

### Neutral

- `rehype-budoux.ts` の除外タグが `['pre', 'code']` → `['pre', 'code', 'a']` に拡張される
- 既存の色トークン（`--link` 等）は変更しない

## References

- hirokaji/jp-ui-contracts: https://github.com/hirokaji/jp-ui-contracts
- Spec: `docs/superpowers/specs/2026-04-22-prose-typography-jp-ui-design.md`
- 関連 PR: #112 (feat(layout): apply BudouX phrase-aware line wrapping site-wide)
