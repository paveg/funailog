# Phase 1: デザインシステム基盤 — 設計仕様

## 概要

funailog.com の再設計 Phase 1。デザイントークンの刷新、Storybook 導入、AffiliateCard 再設計、LinkCard キャッシュ改善を行い、ビジュアル品質とビルド性能を向上させる。

**ターゲット読者**: ガジェット好き全般（技術背景不問）
**デザイン方向性**: Adaptive Duo-tone（ライト/ダーク両モードで同等に美しい）
**フォント**: LINE Seed JP（見出し）、システムフォントスタック（本文）、JetBrains Mono（コード）

## 制約

- 既存 URL 構造を維持する（`/blog/[year]/[slug]` 等）
- Astro + React + Tailwind v4 の技術スタックは維持
- 既存記事の MDX フロントマターに破壊的変更を加えない
- PR バッジ（アフィリエイト表示）は景品表示法対応のため維持

## 1. レスポンシブ方針

モバイル・デスクトップ両方の体験を一切損なわない。どちらか一方を「主」とせず、両方を一級市民として扱う。Web 分析はクローラー比率が高く実ユーザーのデバイス分布が不明なため、片方に寄せる根拠がない。

### ブレイクポイント

既存の Tailwind v4 ブレイクポイントを維持:

- **base（〜639px）**: スマホ。シングルカラム。タッチターゲット 44px 以上
- **sm（640px〜）**: 大きめスマホ / 小タブレット
- **md（768px〜）**: タブレット / 小ノート PC。記事内グリッドを 2 カラムに
- **lg（1024px〜）**: デスクトップ。サイドバー（TOC）表示

### コンポーネント別の振る舞い

| コンポーネント       | base（モバイル）               | md 以上（デスクトップ）  |
| :------------------- | :----------------------------- | :----------------------- |
| AffiliateCard        | 縦積み（画像 → 情報 → ボタン） | 横並び（画像左・情報右） |
| LinkCard             | フル幅、タップ領域を広めに     | 現状維持                 |
| ArticleTOC           | 折りたたみ or 記事上部に配置   | サイドバー固定           |
| Navigation           | ハンバーガーメニュー           | 水平ナビ                 |
| 記事グリッド（一覧） | シングルカラム                 | 2 カラムグリッド         |

### 設計原則

- CSS 実装はモバイルファースト（Tailwind の `sm:` / `md:` / `lg:` で拡張する方向）だが、これは実装手法であってデザイン優先度ではない
- 各コンポーネントはモバイルとデスクトップの両方で意図した体験を提供する。「モバイルで動くがデスクトップで間延びする」「デスクトップで美しいがモバイルで崩れる」のいずれも許容しない
- AffiliateCard の購入導線はモバイルのタップ操作でもデスクトップのクリック操作でも同等にスムーズであること

### Storybook での検証

各コンポーネントの Story にビューポートアドオン（`@storybook/addon-viewport`）を導入し、モバイル（375px）/ タブレット（768px）/ デスクトップ（1280px）の 3 幅で表示を検証する。両モード（ライト/ダーク）× 3 幅 = 6 パターンが全て意図どおりであることを確認基準とする。

## 2. デザイントークン刷新

### 現状

`src/styles/tokens.css` にライト/ダークのカラートークンが定義済み。セマンティック命名（`--foreground`, `--card`, `--muted` 等）。

### 変更内容

**追加トークン**:

| トークン             | 用途                                             | ライト                        | ダーク                      |
| :------------------- | :----------------------------------------------- | :---------------------------- | :-------------------------- |
| `--surface-elevated` | カード・ポップオーバーの浮き上がった面           | `#fff`                        | `#1a1a24`                   |
| `--surface-sunken`   | 入力欄・コード枠の沈んだ面                       | `#f5f6f8`                     | `#0d0d12`                   |
| `--border-elevated`  | ダークモードでシャドウの代わりに使う微細ボーダー | `transparent`                 | `rgba(255,255,255,0.06)`    |
| `--shadow-sm`        | カード・小要素                                   | `0 1px 3px rgba(0,0,0,0.06)`  | `0 1px 2px rgba(0,0,0,0.3)` |
| `--shadow-md`        | 浮き上がった要素                                 | `0 4px 12px rgba(0,0,0,0.08)` | `0 4px 8px rgba(0,0,0,0.4)` |

**変更しないもの**:

- 既存のカラートークン体系（`--foreground`, `--background`, `--card` 等）
- Tailwind v4 の CSS 変数ベースの設定構造
- フォント定義

### jp-ui-contracts 準拠

`prose.css` に以下を明示的に宣言:

- 本文 `max-width: 38em`（1行 35〜40文字）
- `text-wrap: pretty`（本文）、`text-wrap: balance`（見出し）— 既存を維持
- BudouX 統合 — 既存を維持

## 3. Storybook 導入

### 技術選定

- **@storybook/react-vite** を使用（`@storybook/astro` は不安定なため避ける）
- **storybook-dark-mode** アドオンでライト/ダーク切り替え
- Tailwind v4 のスタイルを Storybook に統合（`.storybook/preview.ts` で tokens.css を import）

### 対象コンポーネント

| カテゴリ   | コンポーネント                             | 優先度 |
| :--------- | :----------------------------------------- | :----- |
| UI 基盤    | Card, Badge, Button, Pagination, Separator | 高     |
| 記事       | ArticleHeader, ArticleTOC, ReadingProgress | 高     |
| コンテンツ | AffiliateCard, LinkCard                    | 高     |
| レイアウト | Header, Footer, Navigation                 | 中     |
| その他     | RelatedArticles, CloudflareAnalytics       | 低     |

### Astro コンポーネントの扱い

LinkCard と AffiliateCard は現在 `.astro` ファイル。Storybook で管理するために:

- **AffiliateCard**: React に移行（MDX 内で直接使うため React 化のメリットが大きい）
- **LinkCard**: Astro のまま維持。Story 用に同等の React プレビューコンポーネントを作成

## 4. AffiliateCard 再設計

### 現状

`src/components/AffiliateCard.astro` — カード内に商品画像・タイトル・説明・複数の購入ボタン（Amazon/楽天/Yahoo!）を配置。明確に「広告カード」として視認される。

### 新デザイン方針

**コンセプト**: 記事の文脈に溶け込むインラインスタイル

- `surface-elevated` トークンを使い、本文からの浮き上がりは最小限
- 商品画像 + タイトル + 価格が本文と同じタイポグラフィトーンで表示
- 購入リンクは控えめなテキストリンク or 小さなピルボタン
- PR バッジは Card 右上に小さく表示（景品表示法対応）
- サービス別カラー（Amazon オレンジ、楽天レッド等）はボタンのみに限定し、カード全体は記事トーンに統一

### Props インターフェース

既存の Props を維持しつつ、`variant` を追加:

```typescript
interface AffiliateCardProps {
  title: string;
  description?: string;
  image?: string;
  amazon?: AffiliateLink;
  rakuten?: AffiliateLink;
  yahoo?: AffiliateLink;
  other?: AffiliateLink & { label: string };
  hidePrBadge?: boolean;
  variant?: 'default' | 'inline' | 'compact';
}
```

- `default`: 現在のレイアウト（後方互換）
- `inline`: 記事に溶け込むスタイル（新デフォルト）
- `compact`: 複数商品を並べる際の省スペース版

### 既存記事への影響

- `variant` のデフォルト値を `'inline'` にすることで、既存記事は自動的に新デザインに切り替わる
- 元のデザインが必要な場合は `variant="default"` を明示

## 5. LinkCard ハイブリッドキャッシュ

### 現状の問題

- 毎回のビルドで全ての外部 URL に対して `fetch-site-metadata` を実行
- 記事数 × リンク数の分だけビルド時間が純増
- 外部サイトの応答速度・可用性に依存

### 解決策: JSON 永続キャッシュ

**キャッシュファイル**: `src/data/link-cards.json`（git 管理）

```json
{
  "https://example.com/article": {
    "title": "Example Article",
    "description": "Description text",
    "image": "//.cache/embed/abc123.avif",
    "fetchedAt": "2026-05-27T00:00:00Z"
  }
}
```

**ビルド時の動作**:

1. `remark-link.ts` が裸 URL を検出
2. `link-cards.json` を参照
3. キャッシュヒット → JSON からメタデータ取得（fetch スキップ）
4. キャッシュミス → fetch して JSON に追記、OG 画像も `public/.cache/embed/` に保存

**CLI コマンド**:

- `pnpm link-cards:update` — 全キャッシュを最新に更新
- `pnpm link-cards:update --url <URL>` — 特定 URL のキャッシュを更新
- `pnpm link-cards:clean` — 記事で参照されていないキャッシュエントリを削除

**remark-link.ts の変更**:

- `fetchLinkCard()` の前にキャッシュ読み取りを追加
- fetch 成功時にキャッシュ書き込みを追加
- 既存の SSRF ガード、リトライロジックは維持

### OG 画像キャッシュ

`public/.cache/embed/` の仕組みはそのまま維持。JSON には画像パスの参照のみ保存。

## 6. 既存コンポーネント整理

### 方針

- 新規作成ではなく、既存コンポーネントの Storybook 登録と両モード検証が主目的
- 各コンポーネントを 1 つずつ Story 化し、ライト/ダーク両モードで挙動を確認
- デッドコードや重複があれば整理

### 作業順序

1. UI 基盤（Card → Badge → Button → Separator → Pagination）
2. AffiliateCard（React 移行 + 新デザイン）
3. LinkCard（Story 用プレビューコンポーネント）
4. 記事系（ArticleHeader → ArticleTOC → ReadingProgress）
5. レイアウト（Header → Footer）

各コンポーネントで:

- Story 作成（default / variants / dark mode）
- ライト/ダーク両モードの表示確認
- アクセシビリティ（キーボード操作、コントラスト比）の簡易チェック
- 問題があれば修正

## 完了条件

- [ ] tokens.css に新トークン（surface-elevated, surface-sunken, shadow-sm, shadow-md）が追加されている
- [ ] Storybook が `pnpm storybook` で起動し、ライト/ダーク切り替えが動作する
- [ ] 全対象コンポーネントが Storybook に登録されている
- [ ] AffiliateCard が React コンポーネントに移行し、inline variant が実装されている
- [ ] LinkCard の JSON キャッシュが動作し、キャッシュヒット時に fetch をスキップする
- [ ] `pnpm build` が成功し、既存の URL 構造が維持されている
- [ ] `pnpm lint` がパスする
- [ ] 既存記事の表示に regression がない

## Phase 2・3 との関係

- Phase 2（コンテンツ戦略 & SEO）はこの Phase 1 のデザイントークンとコンポーネント体系の上に構築する
- Phase 3（AI 投稿ワークフロー）は Phase 1 の AffiliateCard / LinkCard の新インターフェースを前提とする
- Phase 1 が完了してから Phase 2 に着手する
