import type { CollectionEntry } from 'astro:content';

/**
 * dev サーバ実行中は下書き (isPublished: false) も含めて返す。
 * production ビルドでは公開済みのみ。
 */
export function isVisible(post: CollectionEntry<'blog'>): boolean {
  return import.meta.env.DEV || post.data.isPublished;
}
