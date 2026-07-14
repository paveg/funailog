import { describe, it, expect } from 'vitest';

import {
  resolveBlogPostContentPath,
  extractLastmodDate,
  getBlogPostLastmod,
} from './sitemap-lastmod';

describe('resolveBlogPostContentPath', () => {
  it('resolves a blog post URL with trailing slash to its content path', () => {
    expect(
      resolveBlogPostContentPath(
        'https://www.funailog.com/blog/2026/development-environment-2026/',
      ),
    ).toBe('src/content/blog/2026/development-environment-2026.mdx');
  });

  it('resolves a blog post URL without trailing slash to its content path', () => {
    expect(
      resolveBlogPostContentPath(
        'https://www.funailog.com/blog/2024/blog-replacement',
      ),
    ).toBe('src/content/blog/2024/blog-replacement.mdx');
  });

  it('returns undefined for the top page', () => {
    expect(
      resolveBlogPostContentPath('https://www.funailog.com/'),
    ).toBeUndefined();
  });

  it('returns undefined for tag/category listing pages', () => {
    expect(
      resolveBlogPostContentPath('https://www.funailog.com/blog/tags/astro/'),
    ).toBeUndefined();
    expect(
      resolveBlogPostContentPath(
        'https://www.funailog.com/blog/categories/programming/',
      ),
    ).toBeUndefined();
  });

  it('returns undefined for the blog index page', () => {
    expect(
      resolveBlogPostContentPath('https://www.funailog.com/blog/'),
    ).toBeUndefined();
  });
});

describe('extractLastmodDate', () => {
  it('prefers lastUpdated over published when both are present', () => {
    const content = [
      '---',
      'title: 記事タイトル',
      'published: 2024-03-20',
      'lastUpdated: 2025-12-24',
      'isPublished: true',
      '---',
      '本文',
    ].join('\n');
    expect(extractLastmodDate(content)).toBe('2025-12-24');
  });

  it('falls back to published when lastUpdated is absent', () => {
    const content = [
      '---',
      'title: 記事タイトル',
      'published: 2026-01-18',
      'isPublished: true',
      '---',
      '本文',
    ].join('\n');
    expect(extractLastmodDate(content)).toBe('2026-01-18');
  });

  it('returns undefined when neither date is present', () => {
    const content = ['---', 'title: 記事タイトル', '---', '本文'].join('\n');
    expect(extractLastmodDate(content)).toBeUndefined();
  });

  it('returns undefined when the content has no frontmatter block', () => {
    expect(extractLastmodDate('本文のみ、frontmatterなし')).toBeUndefined();
  });

  it('ignores a published-looking line in the body, outside frontmatter', () => {
    const content = [
      '---',
      'title: 記事タイトル',
      '---',
      'published: 2099-01-01 という表記は本文中の文字列',
    ].join('\n');
    expect(extractLastmodDate(content)).toBeUndefined();
  });
});

describe('getBlogPostLastmod', () => {
  it('reads the resolved content path and extracts the lastmod date', () => {
    const content = [
      '---',
      'title: 記事タイトル',
      'published: 2024-03-20',
      'lastUpdated: 2025-12-24',
      '---',
      '本文',
    ].join('\n');
    const readContent = (path: string) =>
      path === 'src/content/blog/2024/blog-replacement.mdx'
        ? content
        : undefined;

    expect(
      getBlogPostLastmod(
        'https://www.funailog.com/blog/2024/blog-replacement/',
        readContent,
      ),
    ).toBe('2025-12-24');
  });

  it('returns undefined for non-blog-post URLs without reading anything', () => {
    let readCalled = false;
    const readContent = (): string | undefined => {
      readCalled = true;
      return undefined;
    };

    expect(
      getBlogPostLastmod('https://www.funailog.com/', readContent),
    ).toBeUndefined();
    expect(readCalled).toBe(false);
  });

  it('returns undefined when the content file cannot be read', () => {
    const readContent = () => undefined;

    expect(
      getBlogPostLastmod(
        'https://www.funailog.com/blog/2099/missing-post/',
        readContent,
      ),
    ).toBeUndefined();
  });
});
