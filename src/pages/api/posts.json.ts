import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

import { blogToUnified, sortUnifiedPosts } from '@/types/unified-post';

export const GET: APIRoute = async () => {
  // Fetch blog posts
  const blogPosts = (await getCollection('blog'))
    .filter((post) => post.data.isPublished)
    .map(blogToUnified);

  // Sort all posts
  const allPosts = sortUnifiedPosts(blogPosts);

  // Remove originalPost field to reduce JSON size
  const serializedPosts = allPosts.map((post) => ({
    type: post.type,
    slug: post.slug,
    title: post.title,
    description: post.originalPost?.data.description,
    date: post.date.toISOString(),
    lastUpdated: post.lastUpdated?.toISOString(),
    category: post.category,
    tags: post.tags,
    url: post.url,
  }));

  return new Response(JSON.stringify(serializedPosts), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
