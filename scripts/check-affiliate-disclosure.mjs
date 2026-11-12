// アフィリエイト表記の棚卸しチェック。
// 収益リンクを含む記事に「アフィリエイトリンク（広告）を含みます」の表記が
// なければ失敗させる。ステマ規制対応を CI で担保するためのもの。
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'src/content/blog';
const DISCLOSURE = 'アフィリエイトリンク（広告）を含みます';

// 収益が発生しうるリンク・コンポーネントのパターン
const MONETIZED = [
  /AffiliateCard/, // PRバッジ付きカード（ASIN からタグ付きリンクを生成）
  /hb\.afl\.rakuten\.co\.jp/, // 楽天アフィリエイト
  /amazon\.co\.jp\/(?:dp|gp)\/[^)\s]*[?&]tag=/, // タグ付き Amazon リンク
  /a8mat/, // A8.net
  /ck\.jp\.ap\.valuecommerce\.com/, // バリューコマース
];

const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith('.mdx')) files.push(p);
  }
};
walk(ROOT);

const problems = [];
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  if (text.includes('hidePrBadge')) {
    problems.push(`${file}: hidePrBadge が使われています（PRバッジを隠さない）`);
  }
  const monetized = MONETIZED.some((re) => re.test(text));
  if (monetized && !text.includes(DISCLOSURE)) {
    problems.push(`${file}: 収益リンクがありますが表記がありません`);
  }
}

if (problems.length > 0) {
  console.error('アフィリエイト表記チェックに失敗しました:');
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`OK: ${files.length} 記事を検査し、表記の漏れはありませんでした。`);
