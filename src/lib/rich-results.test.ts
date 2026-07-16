import type { CollectionEntry } from 'astro:content';

import { describe, expect, it } from 'vitest';

import { ArticleLd, WebsiteLd } from './rich-results';

const site = new URL('https://www.funailog.com/');

const meta = {
  collection: 'site',
  id: 'meta',
  data: {
    main: { defaultImage: '/og-default.png' },
    rss: { title: 'funailog', description: 'funailog rss' },
    author: { name: 'paveg' },
    links: {
      github: 'https://github.com/paveg',
      twitter: 'https://twitter.com/paveg_',
      instagram: 'https://instagram.com/paveg',
      linkedin: 'https://linkedin.com/in/paveg',
    },
  },
} as unknown as CollectionEntry<'site'>;

const blog = {
  collection: 'blog',
  id: '2026/example-post',
  data: {
    title: 'テスト記事',
    description: 'テスト記事の説明',
    published: new Date('2026-01-01T00:00:00.000Z'),
    lastUpdated: new Date('2026-01-02T00:00:00.000Z'),
    isPublished: true,
    category: 'programming',
    emoji: '📝',
  },
} as unknown as CollectionEntry<'blog'>;

describe('rich-results', () => {
  describe('WebsiteLd', () => {
    it('sets publisher @id to the site organization IRI', () => {
      const result = WebsiteLd(meta, site);
      expect(result.publisher).toMatchObject({
        '@id': 'https://www.funailog.com/#organization',
      });
    });
  });

  describe('ArticleLd', () => {
    it('sets publisher @id to the site organization IRI', () => {
      const result = ArticleLd(meta, blog, site);
      expect(result.publisher).toMatchObject({
        '@id': 'https://www.funailog.com/#organization',
      });
    });

    it('includes mainEntityOfPage pointing at the article URL', () => {
      const result = ArticleLd(meta, blog, site);
      expect(result.mainEntityOfPage).toEqual({
        '@type': 'WebPage',
        '@id': 'https://www.funailog.com/blog/2026/example-post/',
      });
    });

    it('keeps existing headline and date fields', () => {
      const result = ArticleLd(meta, blog, site);
      expect(result.headline).toBe('テスト記事');
      expect(result.datePublished).toBe('2026-01-01T00:00:00.000Z');
      expect(result.dateModified).toBe('2026-01-02T00:00:00.000Z');
    });
  });
});
