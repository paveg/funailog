import fs from 'node:fs';
import path from 'node:path';

import { readCache, setCached, writeCache } from '../src/lib/link-card-cache';

import type { LinkCardData } from '../src/lib/link-card-cache';

const CONTENT_GLOB_ROOT = path.join(process.cwd(), 'src/content');
const YOUTUBE_RE = /youtube|youtu\.be/;

function collectMdxFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectMdxFiles(full));
    } else if (entry.name.endsWith('.mdx')) {
      results.push(full);
    }
  }
  return results;
}

function extractBareUrls(filePath: string): string[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const urls: string[] = [];

  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (
      trimmed.startsWith('http') &&
      !trimmed.includes(' ') &&
      !YOUTUBE_RE.test(trimmed)
    ) {
      urls.push(trimmed);
    }
  }
  return urls;
}

function allReferencedUrls(): Set<string> {
  const mdxFiles = collectMdxFiles(CONTENT_GLOB_ROOT);
  const urls = new Set<string>();
  for (const file of mdxFiles) {
    for (const url of extractBareUrls(file)) {
      urls.add(url);
    }
  }
  return urls;
}

async function warm() {
  const urls = allReferencedUrls();
  const cache = readCache();
  const uncached = [...urls].filter((url) => !cache.has(url));

  console.log(`Found ${urls.size} link card URLs, ${uncached.length} uncached`);

  if (uncached.length === 0) {
    console.log('Cache is up to date');
    return;
  }

  const { fetchLinkCard } = await import('../src/lib/api');

  let done = 0;
  for (const url of uncached) {
    try {
      const data: LinkCardData = await fetchLinkCard(url);
      setCached(url, data);
      done++;
      process.stdout.write(`\r  ${done}/${uncached.length}`);
    } catch (e) {
      console.error(
        `\nFailed to fetch ${url}: ${e instanceof Error ? e.message : String(e)}`,
      );
    }
  }
  console.log(`\nWarmed ${done} entries`);
}

function prune() {
  const urls = allReferencedUrls();
  const cache = readCache();
  const before = cache.size;
  let removed = 0;

  for (const key of cache.keys()) {
    if (!urls.has(key)) {
      cache.delete(key);
      removed++;
    }
  }

  if (removed > 0) {
    writeCache(undefined, cache);
  }

  console.log(`Pruned ${removed} stale entries (${before} -> ${cache.size})`);
}

function list() {
  const cache = readCache();

  if (cache.size === 0) {
    console.log('Cache is empty');
    return;
  }

  console.log(`${cache.size} cached entries:\n`);
  for (const [url, data] of cache) {
    console.log(`  ${url}`);
    console.log(`    title: ${data.title ?? '(none)'}`);
  }
}

const command = process.argv[2];

switch (command) {
  case 'warm':
    warm().catch((e) => {
      console.error(e);
      process.exit(1);
    });
    break;
  case 'prune':
    prune();
    break;
  case 'list':
    list();
    break;
  default:
    console.error(`Usage: link-cards.ts <warm|prune|list>`);
    process.exit(1);
}
