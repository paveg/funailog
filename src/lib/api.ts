import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

import fetchSiteMetadata from 'fetch-site-metadata';
import sharp from 'sharp';

import type { Metadata } from 'fetch-site-metadata';

const fileExt = 'avif';
const publicEmbedCacheDir = './public/.cache/embed';

// 同時実行数を制限するフェッチキュー
const MAX_CONCURRENT_FETCHES = 5;
let currentFetches = 0;
const fetchQueue: Array<{
  resolve: (value: string | undefined) => void;
  src: string;
}> = [];

const processQueue = () => {
  while (currentFetches < MAX_CONCURRENT_FETCHES && fetchQueue.length > 0) {
    const task = fetchQueue.shift();
    if (task) {
      currentFetches++;
      fetchSiteImageInternal(task.src)
        .then(task.resolve)
        .finally(() => {
          currentFetches--;
          processQueue();
        });
    }
  }
};

const siteMetadataMap = new Map<string, Metadata>();
fs.mkdirSync(path.join(process.cwd(), publicEmbedCacheDir), {
  recursive: true,
});

const siteImageCache = fs
  .readdirSync(path.join(process.cwd(), publicEmbedCacheDir))
  .filter((img) => img.endsWith(`.${fileExt}`));

const siteImageMap = new Map<string, string | undefined>(
  siteImageCache.map((img) => [
    path.basename(img, `.${fileExt}`),
    `/.cache/embed/${img}`,
  ]),
);

const siteMetadata = async (url: string) => {
  const cached = siteMetadataMap.get(url);
  if (cached) {
    return cached;
  } else {
    const { description, image, title } = await fetchSiteMetadata(url, {
      suppressAdditionalRequest: true,
    }).catch(() => ({
      description: 'page not found',
      image: {
        src: undefined,
      },
      title: 'Not found',
    }));

    return { description, image, title };
  }
};

const FETCH_TIMEOUT_MS = 5000;

const fetchWithTimeout = async (url: string): Promise<ArrayBuffer | null> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });
    return response.arrayBuffer();
  } catch (error) {
    console.warn(`Failed to fetch image (timeout or error): ${url}`);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
};

const MAX_RETRIES = 2;

// キューを使わない内部実装
const fetchSiteImageInternal = async (
  src: string,
  retryCount = 0,
): Promise<string | undefined> => {
  const hash = crypto.createHash('sha256').update(src).digest('hex');
  const cached = siteImageMap.get(hash);

  // Check cache BEFORE fetching
  if (cached) {
    return cached;
  }

  const img = await fetchWithTimeout(src);
  if (!img) {
    if (retryCount < MAX_RETRIES) {
      return fetchSiteImageInternal(src, retryCount + 1);
    }
    return undefined;
  }

  const file = `/.cache/embed/${hash}.${fileExt}`;
  const filePath = path.join(process.cwd(), `./public${file}`);

  try {
    await sharp(Buffer.from(img))
      .resize(400)
      .toFormat(fileExt, {
        quality: 30,
      })
      .toFile(filePath);

    fs.mkdirSync(path.join(process.cwd(), `./dist/.cache/embed`), {
      recursive: true,
    });

    fs.copyFileSync(filePath, path.join(process.cwd(), `./dist${file}`));
    siteImageMap.set(hash, file);

    return file;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      return fetchSiteImageInternal(src, retryCount + 1);
    }
    console.warn(
      `Failed to process image after ${MAX_RETRIES} retries: ${src}`,
    );
    return undefined;
  }
};

// キューを使った並列フェッチ（同時実行数制限付き）
const fetchSiteImage = async (src: string): Promise<string | undefined> => {
  const hash = crypto.createHash('sha256').update(src).digest('hex');
  const cached = siteImageMap.get(hash);

  // キャッシュがあれば即座に返す
  if (cached) {
    return cached;
  }

  // キューに追加して並列処理
  return new Promise((resolve) => {
    fetchQueue.push({ resolve, src });
    processQueue();
  });
};

export const fetchLinkCard = async (href: string) => {
  const { description, image, title } = await siteMetadata(href);

  const ogImage = image?.src ? await fetchSiteImage(image.src) : undefined;

  return {
    description,
    image: {
      src: ogImage,
    },
    title,
  };
};
