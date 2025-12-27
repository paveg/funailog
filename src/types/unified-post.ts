import type { CollectionEntry } from 'astro:content';

import type { ZennArticle } from './zenn';

/**
 * Unified post type that can represent both blog posts and Zenn articles
 */
export type UnifiedPost = {
  type: 'blog' | 'zenn';
  slug: string;
  title: string;
  description: string;
  date: Date;
  lastUpdated?: Date | undefined;
  category?: string | undefined;
  tags?: string[] | undefined;
  url: string;
  // Zenn-specific fields
  emoji?: string | undefined;
  likedCount?: number | undefined;
  commentsCount?: number | undefined;
  articleType?: string | undefined;
  // Blog-specific fields
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
 * Convert a Zenn article to unified format
 */
export function zennToUnified(article: ZennArticle): UnifiedPost {
  return {
    type: 'zenn',
    slug: article.slug,
    title: article.title,
    description: `${article.emoji} ${article.article_type}`,
    date: new Date(article.published_at),
    lastUpdated: article.body_updated_at
      ? new Date(article.body_updated_at)
      : undefined,
    category: 'zenn',
    tags: [article.article_type],
    url: `https://zenn.dev/pav/articles/${article.slug}`,
    emoji: article.emoji,
    likedCount: article.liked_count,
    commentsCount: article.comments_count,
    articleType: article.article_type,
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
