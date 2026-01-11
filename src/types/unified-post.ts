import type { CollectionEntry } from 'astro:content';

/**
 * Unified post type for blog posts
 */
export type UnifiedPost = {
  type: 'blog';
  slug: string;
  title: string;
  description: string;
  date: Date;
  lastUpdated?: Date | undefined;
  category?: string | undefined;
  tags?: string[] | undefined;
  url: string;
  collection?: string | undefined;
  originalPost?: CollectionEntry<'blog'> | undefined;
};

/**
 * Convert a blog post to unified format
 */
export function blogToUnified(post: CollectionEntry<'blog'>): UnifiedPost {
  return {
    type: 'blog',
    slug: post.slug,
    title: post.data.title,
    description: post.data.description,
    date: post.data.published,
    lastUpdated: post.data.lastUpdated,
    category: post.data.category,
    tags: post.data.tags,
    url: `/blog/${post.slug}`,
    collection: post.collection,
    originalPost: post,
  };
}

/**
 * Sort unified posts by published date (newest first)
 * Note: Uses published date (date), not lastUpdated, to maintain consistent chronological order
 */
export function sortUnifiedPosts(posts: UnifiedPost[]): UnifiedPost[] {
  return posts.sort((a, b) => {
    return b.date.getTime() - a.date.getTime();
  });
}
