import { describe, expect, it } from 'vitest';

import { ensureTrailingSlash } from './utils';

describe('ensureTrailingSlash', () => {
  it('appends a trailing slash to a bare path', () => {
    expect(ensureTrailingSlash('/blog')).toBe('/blog/');
  });

  it('appends a trailing slash to a nested path', () => {
    expect(ensureTrailingSlash('/blog/tags/zsh')).toBe('/blog/tags/zsh/');
  });

  it('leaves a path that already ends with a slash unchanged', () => {
    expect(ensureTrailingSlash('/blog/')).toBe('/blog/');
  });

  it('leaves the root path unchanged', () => {
    expect(ensureTrailingSlash('/')).toBe('/');
  });

  it('leaves a path with a file extension unchanged', () => {
    expect(ensureTrailingSlash('/rss.xml')).toBe('/rss.xml');
  });

  it('leaves a path with a file extension in a nested directory unchanged', () => {
    expect(ensureTrailingSlash('/api/og/article/2026/foo.png')).toBe(
      '/api/og/article/2026/foo.png',
    );
  });
});
