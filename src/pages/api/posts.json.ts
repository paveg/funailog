import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

import { defaultLang } from '@/i18n/ui';
import { fetchZennArticles } from '@/lib/zenn';
import {
  blogToUnified,
  zennToUnified,
  sortUnifiedPosts,
} from '@/types/unified-post';

export const GET: APIRoute = async () => {
  // Fetch blog posts
  const blogPosts = (await getCollection('blog'))
    .filter((post) => post.data.isPublished)
    .filter((post) => {
      const [lang] = post.slug.split('/');
      return lang === defaultLang;
    })
    .map(blogToUnified);

  // Fetch Zenn articles
  const zennArticles = (await fetchZennArticles()).map(zennToUnified);

  // Merge and sort all posts
  const allPosts = sortUnifiedPosts([...blogPosts, ...zennArticles]);

  // Remove originalPost field to reduce JSON size
  const serializedPosts = allPosts.map((post) => ({
    type: post.type,
    slug: post.slug,
    title: post.title,
    description:
      post.type === 'blog' ? post.originalPost?.data.description : undefined,
    date: post.date.toISOString(),
    lastUpdated: post.lastUpdated?.toISOString(),
    category: post.category,
    tags: post.tags,
    url: post.url,
    emoji: post.emoji,
    likedCount: post.likedCount,
    commentsCount: post.commentsCount,
    articleType: post.articleType,
  }));

  return new Response(JSON.stringify(serializedPosts), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
