const BLOG_POST_PATH_PATTERN = /\/blog\/(\d{4})\/([^/]+)\/?$/;
const CONTENT_DIR = 'src/content/blog';

/**
 * `/blog/{year}/{slug}/` 形式のブログ記事 URL を、対応する frontmatter
 * ファイルへの相対パスに解決する。ブログ記事以外の URL（トップ、タグ、
 * カテゴリ、ブログ一覧など）は undefined を返す。
 */
export function resolveBlogPostContentPath(url: string): string | undefined {
  const match = BLOG_POST_PATH_PATTERN.exec(new URL(url).pathname);
  if (!match) return undefined;
  const [, year, slug] = match;
  return `${CONTENT_DIR}/${year}/${slug}.mdx`;
}

const FRONTMATTER_BLOCK_PATTERN = /^---\n([\s\S]*?)\n---/;

function extractFrontmatterDate(
  frontmatter: string,
  key: 'published' | 'lastUpdated',
): string | undefined {
  const pattern = new RegExp(
    `^${key}:\\s*['"]?(\\d{4}-\\d{2}-\\d{2})['"]?\\s*$`,
    'm',
  );
  return pattern.exec(frontmatter)?.[1];
}

/**
 * MDX の frontmatter から lastmod に使う日付を取り出す。
 * `lastUpdated` を優先し、無ければ `published` にフォールバックする。
 * frontmatter が読めない・日付が見つからない場合は undefined を返す。
 */
export function extractLastmodDate(content: string): string | undefined {
  const frontmatter = FRONTMATTER_BLOCK_PATTERN.exec(content)?.[1];
  if (!frontmatter) return undefined;
  return (
    extractFrontmatterDate(frontmatter, 'lastUpdated') ??
    extractFrontmatterDate(frontmatter, 'published')
  );
}

/**
 * sitemap の各 URL に対する lastmod を求める。
 * `readContent` は該当パスの読み取りを担う注入ポイントで、ファイルが
 * 存在しない場合は undefined を返す想定（例外は投げない）。
 */
export function getBlogPostLastmod(
  url: string,
  readContent: (path: string) => string | undefined,
): string | undefined {
  const path = resolveBlogPostContentPath(url);
  if (!path) return undefined;
  const content = readContent(path);
  if (!content) return undefined;
  return extractLastmodDate(content);
}
