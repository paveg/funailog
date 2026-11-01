import { describe, expect, it } from 'vitest';

import {
  checkInternalLink,
  findDisclosures,
  type InternalLinkContext,
} from './content-checks';

const labelsOf = (text: string) =>
  findDisclosures(text).map((finding) => finding.label);

describe('findDisclosures', () => {
  it.each([
    ['筆者は池澤です', '本名'],
    ['イケザワと申します', '本名'],
    ['"name": "Ryota Ikezawa"', '本名'],
    ['MAC は aa:bb:cc:dd:ee:ff です', 'MAC アドレス'],
    ['prefix は 240b:12:1b88:f400:: です', 'IPv6 のグローバルアドレス'],
    ['連絡先は someone@gmail.com です', 'メールアドレス'],
  ])('%s を %s として検出する', (text, label) => {
    expect(labelsOf(text)).toEqual([label]);
  });

  it.each([
    'ping6 2606:4700:4700::1111 は通る',
    '2404:6800:400b:c005::71 は google.com',
    '2001:db8:1:2::3 は文書用',
    'user@example.com は例示',
    'brew install neovim@0.11',
    'brew install python@3.12',
    "import Image from '@/components/markdown/Image.astro';",
    '時刻は 12:34:56 で、比率は 16:9',
    'リンクローカルは fe80::1',
    '2026-11-01 の障害',
  ])('%s は検出しない', (text) => {
    expect(labelsOf(text)).toEqual([]);
  });

  it('検出した行番号を返す', () => {
    expect(findDisclosures('一行目\n二行目 池澤')[0]?.line).toBe(2);
  });
});

describe('checkInternalLink', () => {
  const context: InternalLinkContext = {
    publishedPosts: new Set(['2026/published']),
    draftPosts: new Set(['2026/draft']),
    isSourcePublished: true,
    isKnownRoute: (path) => path === '/portfolio',
  };

  it.each([
    'https://example.com/',
    'mailto:someone@example.com',
    '//example.com/x',
    '#heading',
    '/blog/2026/published',
    '/blog/2026/published/',
    '/blog/2026/published#heading',
    '/portfolio',
  ])('%s は問題なしとする', (url) => {
    expect(checkInternalLink(url, context)).toBeNull();
  });

  it.each([
    ['/2026/published', 'ページがありません'],
    ['/blog/2026/missing', '記事がありません'],
    ['/blog/published', 'ページがありません'],
    ['2026/published', '相対パス'],
    ['blog/2026/published', '相対パス'],
    ['/blog/2026/draft', '下書き'],
  ])('%s を誤りとする', (url, message) => {
    expect(checkInternalLink(url, context)).toContain(message);
  });

  it('下書きの記事から下書きの記事へのリンクは許す', () => {
    expect(
      checkInternalLink('/blog/2026/draft', {
        ...context,
        isSourcePublished: false,
      }),
    ).toBeNull();
  });
});
