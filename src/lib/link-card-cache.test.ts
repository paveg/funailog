import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { getCached, readCache, setCached, writeCache } from './link-card-cache';

import type { LinkCardData } from './link-card-cache';

const fixture: LinkCardData = {
  description: 'A test page',
  image: { src: '/.cache/embed/abc123.avif' },
  title: 'Test Page',
};

describe('link-card-cache', () => {
  let tmpDir: string;
  let cachePath: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'link-card-cache-'));
    cachePath = path.join(tmpDir, 'link-cards.json');
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  describe('readCache', () => {
    it('returns empty map when file does not exist', () => {
      const cache = readCache(cachePath);
      expect(cache.size).toBe(0);
    });

    it('returns parsed data when file exists', () => {
      const data = { 'https://example.com': fixture };
      fs.writeFileSync(cachePath, JSON.stringify(data));

      const cache = readCache(cachePath);
      expect(cache.size).toBe(1);
      expect(cache.get('https://example.com')).toEqual(fixture);
    });
  });

  describe('writeCache', () => {
    it('writes valid JSON', () => {
      const cache = new Map<string, LinkCardData>();
      cache.set('https://example.com', fixture);

      writeCache(cachePath, cache);

      const raw = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
      expect(raw['https://example.com']).toEqual(fixture);
    });
  });

  describe('getCached', () => {
    it('returns cached entry if present', () => {
      const data = { 'https://example.com': fixture };
      fs.writeFileSync(cachePath, JSON.stringify(data));

      const result = getCached('https://example.com', cachePath);
      expect(result).toEqual(fixture);
    });

    it('returns undefined if not present', () => {
      const data = { 'https://example.com': fixture };
      fs.writeFileSync(cachePath, JSON.stringify(data));

      const result = getCached('https://other.com', cachePath);
      expect(result).toBeUndefined();
    });
  });

  describe('setCached', () => {
    it('adds entry and persists', () => {
      setCached('https://example.com', fixture, cachePath);

      const raw = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
      expect(raw['https://example.com']).toEqual(fixture);
    });

    it('preserves existing entries when adding new ones', () => {
      const existing: LinkCardData = {
        description: 'Existing',
        image: { src: undefined },
        title: 'Existing Page',
      };
      fs.writeFileSync(
        cachePath,
        JSON.stringify({ 'https://existing.com': existing }),
      );

      setCached('https://new.com', fixture, cachePath);

      const raw = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
      expect(raw['https://existing.com']).toEqual(existing);
      expect(raw['https://new.com']).toEqual(fixture);
    });
  });
});
