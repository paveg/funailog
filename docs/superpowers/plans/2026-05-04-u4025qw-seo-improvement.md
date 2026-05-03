# U4025QW SEO Improvement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `src/content/blog/2024/review-monitors-u4025qw-dell.mdx` の SEO 改善（タイトル/description 最適化、5K2K 解説セクション追加、2 年使用感追記）を spec 通りに適用する。

**Architecture:** Astro MDX content の単一ファイル編集。frontmatter と本文を 3 つの論理単位に分け、各単位で `pnpm lint` を通してから個別コミット。長期使用感セクションはユーザー本人の実体験記入を含むインタラクティブタスク。

**Tech Stack:** Astro 5, MDX, prettier, markdownlint-cli2, textlint (`@textlint-ja/preset-ai-writing`), ESLint, astro check, content schema validator (`scripts/validate-content.ts`)

**Reference Spec:** `docs/superpowers/specs/2026-05-04-u4025qw-seo-improvement-design.md`

**Branch:** `seo/u4025qw-improvement`（spec コミット `4a40ccb` を含む）

---

## File Structure

編集対象は 1 ファイルのみ：

- `src/content/blog/2024/review-monitors-u4025qw-dell.mdx` — レビュー記事本体。frontmatter（タイトル / description / lastUpdated）と本文（リード文 / 想定読者 / 「## 5K2K とは？」新設 / 「## What's U4025QW?」リネーム / 「### 2026/05 追記」新設）を編集する。

新規ファイル作成はなし。

---

## Task 1: frontmatter とリード文・想定読者の整合性更新

**Purpose:** タイトル「2 年使った」と本文冒頭の時系列整合性を取る。informational intent 向け読者像を 1 行追加。

**Files:**

- Modify: `src/content/blog/2024/review-monitors-u4025qw-dell.mdx`（frontmatter `title` / `description` / `lastUpdated`、line 12 リード文、lines 14-19 想定読者リスト）

- [ ] **Step 1.1: frontmatter `title` を更新**

`Edit` ツールで以下を実行：

old_string:

```
title: DELL U4025QWレビュー｜5K2K 40インチウルトラワイドモニターの使用感と注意点
```

new_string:

```
title: DELL U4025QW を 2 年使ったレビュー｜5K2K 40 インチウルトラワイドの実用性
```

- [ ] **Step 1.2: frontmatter `description` を更新**

old_string:

```
description: DELLの5K2K 40インチモニターU4025QWの詳細レビュー。デュアルモニターからの移行、PBP/PIP機能、Dell Display Managerの使い方と不具合対応を解説。
```

new_string:

```
description: 5K2K ウルトラワイドモニター DELL U4025QW を 2 年以上使った実機レビュー。デュアルモニターからの移行、PBP/PIP、Dell Display Manager と不具合対応を率直に解説。
```

- [ ] **Step 1.3: frontmatter `lastUpdated` を更新**

old_string:

```
lastUpdated: 2025-12-24
```

new_string:

```
lastUpdated: 2026-05-04
```

- [ ] **Step 1.4: リード文を更新**

old_string:

```
DELLの5K2K 40インチウルトラワイドモニター「U4025QW」を購入しました。今年の1月にアナウンスされ、3月に発売されたばかりのモニターです。
```

new_string:

```
DELLの5K2K 40インチウルトラワイドモニター「U4025QW」を購入してから 2 年以上が経ちました。2024 年 1 月にアナウンスされ、3 月に発売されたタイミングで購入したものです。
```

- [ ] **Step 1.5: 想定読者リストに 1 項目追加**

old_string:

```
- デュアルモニターからの移行を検討している
- 5K2K解像度のモニターに興味がある
- ウルトラワイドモニターの実際の使用感を知りたい
- 2PC環境でPBP/PIP機能を使いたい
```

new_string:

```
- デュアルモニターからの移行を検討している
- 5K2K解像度のモニターに興味がある
- 5K2K と 4K の違いを知りたい
- ウルトラワイドモニターの実際の使用感を知りたい
- 2PC環境でPBP/PIP機能を使いたい
```

- [ ] **Step 1.6: lint を実行**

Run: `pnpm lint`

Expected: pass（format、ESLint、markdownlint、textlint、content validation、astro check が並列で全てパス）

失敗した場合の典型原因と対処：

- prettier 違反 → `pnpm format` で自動修正
- markdownlint 違反 → `pnpm lint:md:fix` で自動修正
- textlint AI writing 違反 → 該当箇所の表現を `~/.claude/rules/japanese-writing.md` のガイドに沿って修正

- [ ] **Step 1.7: コミット**

Run:

```bash
git add src/content/blog/2024/review-monitors-u4025qw-dell.mdx
git commit -m "$(cat <<'EOF'
chore(seo): refresh u4025qw frontmatter and lead for 2-year framing

タイトル/description/lastUpdated を 2 年使用後の文脈に合わせて更新。
リード文を絶対年表記に変更し、想定読者に「5K2K と 4K の違いを知りたい」
を追加して informational intent 検索者を取り込む。

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

Expected: pre-commit hook（lint-staged）がパスして commit が作成される。

---

## Task 2: 「## 5K2K とは？」セクション新設 + 既存 H2 リネーム

**Purpose:** informational intent クエリ（「5k2k とは」「5k2k 4k 違い」）の獲得。論理的な「解像度の概念 → 製品の具体仕様」の流れに整理。

**Files:**

- Modify: `src/content/blog/2024/review-monitors-u4025qw-dell.mdx`（line 25 周辺の「## What's U4025QW?」セクション）

- [ ] **Step 2.1: 既存 H2「## What's U4025QW?」をリネーム**

`Edit` ツールで以下を実行：

old_string:

```
## What's U4025QW?
```

new_string:

```
## DELL U4025QW のスペック
```

- [ ] **Step 2.2: リネームした H2 の直前に「## 5K2K とは？」セクションを挿入**

`Edit` ツールで以下を実行：

old_string:

```
この記事では、購入したモニターのレビューとインプレッションを記載します。

## DELL U4025QW のスペック
```

new_string:

```
この記事では、購入したモニターのレビューとインプレッションを記載します。

## 5K2K とは？

5K2K（5120 × 2160 ピクセル）は、4K UHD（3840 × 2160）の左右に約 1280 ピクセルずつ広げた解像度です。アスペクト比は 21:9 のウルトラワイドに分類されます。

| 解像度 | ピクセル数  | アスペクト比 | 想定用途                           |
| :----- | :---------- | :----------- | :--------------------------------- |
| FHD    | 1920 × 1080 | 16:9         | 一般的な作業                       |
| 4K UHD | 3840 × 2160 | 16:9         | 映像視聴・写真編集                 |
| 5K2K   | 5120 × 2160 | 21:9         | マルチタスク・動画編集タイムライン |

4K と比べて横方向の作業領域が広がるため、デュアルモニターを 1 枚にまとめたい用途に向いています。一方で 16:9 のフルスクリーン動画では左右に黒帯が出ます。

## DELL U4025QW のスペック
```

- [ ] **Step 2.3: lint を実行**

Run: `pnpm lint`

Expected: pass。特に確認したいのは：

- 比較表の markdown フォーマット崩れがない
- textlint AI writing が「機械的リスト整形」「過剰強調」で違反を出さない（短い解説文なので問題なし想定）

- [ ] **Step 2.4: ローカル表示で目視確認**

Run: `pnpm dev`（バックグラウンドで起動）

ブラウザで `http://localhost:4321/blog/2024/review-monitors-u4025qw-dell` を開き、以下を確認：

1. 「## 5K2K とは？」が H2 として表示されている
2. 比較表が崩れずに 3 行 × 4 列で表示されている（ヘッダ含む）
3. 既存セクション「## DELL U4025QW のスペック」のスペック表が引き続き正常に表示されている
4. 目次（TOC）に「5K2K とは？」と「DELL U4025QW のスペック」が追加されている

確認後、`pnpm dev` プロセスを停止する。

- [ ] **Step 2.5: コミット**

Run:

```bash
git add src/content/blog/2024/review-monitors-u4025qw-dell.mdx
git commit -m "$(cat <<'EOF'
chore(seo): add 5K2K explainer section to u4025qw review

informational 検索クエリ（「5k2k とは」「5k2k 4k 違い」）獲得のため、
独立 H2「5K2K とは？」を新設し FHD/4K UHD/5K2K の比較表を追加。
既存 H2「What's U4025QW?」を「DELL U4025QW のスペック」にリネームし、
意味を明確化。

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

Expected: pre-commit hook がパスして commit が作成される。

---

## Task 3: 「### 2026/05 追記」セクション新設（ユーザー × AI インタラクティブ）

**Purpose:** タイトル「2 年使った」の根拠となる長期使用追記を、ユーザー本人の実体験を聞き取って一気に書く。AI は文体ガイド（`.claude/rules/blog-writing-style.md` および `~/.claude/rules/japanese-writing.md`）に沿った整形をサポートする。テンプレートだけ先行コミットすると公開時に未完成テキストが見える可能性があるため、本文込みで 1 コミットにする。

**Files:**

- Modify: `src/content/blog/2024/review-monitors-u4025qw-dell.mdx`（line 112 直後、「## 追記」配下の最後）

- [ ] **Step 3.1: ユーザーに各項目について実体験を聞き取り**

AI は以下の質問を順番に投げ、ユーザーの回答を待つ：

1. 「色調不具合（2024/04 追記の PBP 後の色調戻らない問題）はその後どうなりましたか？解消した／継続している／忘れていたが今確認したら〇〇、など」
2. 「パネルの焼き付き（一部表示が残る現象）は発生していますか？」
3. 「PBP/PIP の挙動は当初と比べて変わりましたか？」
4. 「2 年使ってみて、不満点や改善してほしいポイントはありますか？」
5. 「同じ予算で今買い替えるとしたら、また U4025QW を選びますか？理由も含めて」

ユーザーが「特になし」「忘れた」など短い回答をした項目は省略してよい。

- [ ] **Step 3.2: 回答内容を文体ガイドに沿って整形**

整形の指針：

- 丁寧語（です・ます調）を維持
- 過度な強調（「非常に」「圧倒的」）を避ける
- 散文を基本とし、リスト化は本当に並列性のある場合のみ
- ブログの個性である **括弧内補足**（例:「特に問題ありません（むしろ忘れていました）」）を取り入れる余地を残す
- AI 臭フレーズ（「いかがでしょうか」「〜することができます」）を避ける
- 既存「## 追記 > 2024/04/01」セクションのトーン（事実報告 + ユーザー視点の判断）に揃える

- [ ] **Step 3.3: 「### 2026/05 追記」セクションを挿入（実体験本文込み）**

`Edit` ツールで以下を実行（new_string 内の `<本文>` プレースホルダは Step 3.1-3.2 のアウトプットを差し込む）：

old_string:

```
リフレッシュレート等をDell Display Managerから変更するとこの問題は回復します。いずれにしても、問題であることは変わりないので進展があれば追記することとします。

## おすすめの用途
```

new_string（`<本文>` 部分は Step 3.2 の整形結果に置換）:

```
リフレッシュレート等をDell Display Managerから変更するとこの問題は回復します。いずれにしても、問題であることは変わりないので進展があれば追記することとします。

### 2026/05 追記: 2 年使用後の感想

購入から 2 年以上が経過しました。以下、長期使用の所感です。

<本文>

## おすすめの用途
```

注: 中間テンプレートをコミットしないため、placeholder が公開される事故を回避できる。

- [ ] **Step 3.4: textlint AI writing チェック**

Run: `pnpm lint:textlint`

Expected: pass。違反が出た場合は該当箇所を修正：

- 「機械的リスト整形」違反 → 散文化
- 「誇張表現」違反 → 数値や事実に置換
- 「過剰強調」違反 → 装飾を外す
- 「英語風コロン構文」違反 → 句点で区切る or 名詞で受ける

- [ ] **Step 3.5: フル lint を実行**

Run: `pnpm lint`

Expected: pass

- [ ] **Step 3.6: コミット**

Run:

```bash
git add src/content/blog/2024/review-monitors-u4025qw-dell.mdx
git commit -m "$(cat <<'EOF'
chore(seo): add 2-year usage impression to u4025qw review

タイトル「2 年使ったレビュー」と本文の整合性確保のため、長期使用追記の
H3 サブセクションを「## 追記」配下に新設し、実体験ベースの本文を記入。
色調不具合のその後、パネル状態、PBP/PIP の安定性、不満点、買い替え判断を
率直に記載。

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

Expected: pre-commit hook がパスして commit が作成される。

---

## Task 4: 最終検証と PR 準備

**Purpose:** 全変更が spec 通りに反映されたことを確認し、PR 作成の準備を整える。

- [ ] **Step 4.1: フル lint と build を実行**

Run: `pnpm lint && pnpm build`

Expected: 両方 pass。`pnpm build` は `astro check && astro build` を実行し、コンテンツ schema 含めた厳格なチェックを行う。

- [ ] **Step 4.2: 変更ファイルの差分を確認**

Run: `git diff origin/main...HEAD -- src/content/blog/2024/review-monitors-u4025qw-dell.mdx`

確認ポイント：

- frontmatter の 3 フィールドが新タイトル/description/日付になっている
- リード文が「購入してから 2 年以上が経ちました」で始まる
- 想定読者リストに「5K2K と 4K の違いを知りたい」が追加されている
- 「## 5K2K とは？」セクションと比較表が存在する
- 「## What's U4025QW?」が「## DELL U4025QW のスペック」にリネームされている
- 「### 2026/05 追記: 2 年使用後の感想」が存在し、実体験本文が入っている

- [ ] **Step 4.3: ローカル表示で全体目視確認**

Run: `pnpm dev`（バックグラウンド起動）

ブラウザで `http://localhost:4321/blog/2024/review-monitors-u4025qw-dell` を開き、以下を確認：

1. ブラウザタブのタイトルが新タイトル
2. 記事ヘッダーに新タイトル + lastUpdated 「2026-05-04」が表示
3. 想定読者リストが 5 項目
4. 「## 5K2K とは？」セクションと比較表
5. 「## DELL U4025QW のスペック」（旧 What's U4025QW?）
6. 「### 2026/05 追記: 2 年使用後の感想」セクション（実体験本文）
7. 既存セクション（モニター配置、Dell Display Manager、総評、おすすめの用途、購入リンク、関連記事）が崩れずに表示

確認後、`pnpm dev` プロセスを停止。

- [ ] **Step 4.4: アンカー URL の変化を確認**

ブラウザの開発者ツールで H2 見出しの `id` 属性を確認。Astro の slug 生成仕様により実際の id 文字列は確定できないが、最低限以下を確認する：

- 旧 anchor（`whats-u4025qw` 等の英語 slug）が消滅している
- 新 anchor（「5K2K とは？」「DELL U4025QW のスペック」相当）が生成されている

外部からの被リンク影響は spec 通り限定的と判断（英語見出しへの被リンクは少ないと予想）。

- [ ] **Step 4.5: コミット履歴の確認**

Run: `git log --oneline origin/main..HEAD`

期待される 4 コミット（spec を含む）：

```
<sha> chore(seo): add 2-year usage impression to u4025qw review
<sha> chore(seo): add 5K2K explainer section to u4025qw review
<sha> chore(seo): refresh u4025qw frontmatter and lead for 2-year framing
4a40ccb docs(spec): add U4025QW review SEO improvement design
```

合計差分が ~280 行以内（spec ~226 行 + 実装 ~50 行）に収まっていることを確認。

- [ ] **Step 4.6: ユーザー承認後に push と PR 作成**

ユーザーに「push して PR 作成して良いか」を明示確認。承認後：

Run:

```bash
git push -u origin seo/u4025qw-improvement
```

その後、`gh pr create` で PR 作成（タイトル / 本文は別途相談）。PR テンプレート案：

- タイトル: `chore(seo): improve u4025qw review for 5K2K monitor search intent`
- 本文: spec への参照、Search Console データの背景、変更点 3 つの要約、テストプラン（lint/build/visual）

---

## Notes

- **コミット粒度**: Task 1-3 で 3 コミット + spec コミット = 4 コミットの構成。各コミットは pr-size.md ルール「1 commit = 1 logical change (100-200 LOC)」内に収まる（合計 ~50 LOC のため余裕）。
- **commit message prefix**: 過去ログに `feat(seo):` があるため `chore(seo):` を採用。実装内容は新機能ではなく既存記事の改善なので chore が適切。
- **Task 3 を 1 コミットにした理由**: 当初テンプレート先行 + 本文後置の 2 段階を検討したが、(1) MDX で安全に使える placeholder マーカー（HTML コメント）の前例が既存ブログに存在しない、(2) テンプレート段階を push すると未完成テキストが公開される事故リスクがある、ため 1 コミットに統合した。
- **インタラクティブな Task 3**: 通常の TDD パターンと異なり、ユーザー本人しか書けない実体験を含むため、Step 3.1 でユーザーから情報を聞き取るフェーズを設計した。subagent に丸投げできないタスク。
- **Task 4 完了後の状態**: branch は push 待ちの状態で停止。PR 作成は明示的承認が必要。
