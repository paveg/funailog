import type { CollectionEntry } from 'astro:content';

/**
 * Find related posts by matching category and tags.
 * Scoring: same category = 2pts, each shared tag = 1pt.
 */
export function getRelatedPosts(
  current: CollectionEntry<'blog'>,
  allPosts: CollectionEntry<'blog'>[],
  limit = 3,
): CollectionEntry<'blog'>[] {
  const currentTags = new Set(current.data.tags ?? []);

  return allPosts
    .filter((p) => p.slug !== current.slug && p.data.isPublished)
    .map((post) => {
      let score = 0;
      if (post.data.category === current.data.category) score += 2;
      for (const tag of post.data.tags ?? []) {
        if (currentTags.has(tag)) score += 1;
      }
      return { post, score };
    })
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.post.data.published.getTime() - a.post.data.published.getTime(),
    )
    .slice(0, limit)
    .map(({ post }) => post);
}
