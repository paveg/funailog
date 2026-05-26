import fs from 'node:fs';
import path from 'node:path';

export type LinkCardData = {
  description: string | undefined;
  image: { src: string | undefined };
  title: string | undefined;
};

const DEFAULT_CACHE_PATH = path.join(process.cwd(), 'src/data/link-cards.json');

export const readCache = (
  cachePath = DEFAULT_CACHE_PATH,
): Map<string, LinkCardData> => {
  if (!fs.existsSync(cachePath)) {
    return new Map();
  }

  const raw = JSON.parse(fs.readFileSync(cachePath, 'utf-8')) as Record<
    string,
    LinkCardData
  >;
  return new Map(Object.entries(raw));
};

export const writeCache = (
  cachePath = DEFAULT_CACHE_PATH,
  cache: Map<string, LinkCardData>,
): void => {
  const dir = path.dirname(cachePath);
  fs.mkdirSync(dir, { recursive: true });

  const sorted = [...cache.entries()].sort(([a], [b]) => a.localeCompare(b));
  const obj = Object.fromEntries(sorted);
  fs.writeFileSync(cachePath, JSON.stringify(obj, null, 2) + '\n');
};

export const getCached = (
  url: string,
  cachePath = DEFAULT_CACHE_PATH,
): LinkCardData | undefined => {
  const cache = readCache(cachePath);
  return cache.get(url);
};

export const setCached = (
  url: string,
  data: LinkCardData,
  cachePath = DEFAULT_CACHE_PATH,
): void => {
  const cache = readCache(cachePath);
  cache.set(url, data);
  writeCache(cachePath, cache);
};
