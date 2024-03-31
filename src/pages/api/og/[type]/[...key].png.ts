import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

import ogImage from '@/components/ogImage';

const docs = await getCollection('page');
const posts = (await getCollection('blog')).filter(
  (post) => post.data.isPublished,
);

const articles = [...docs, ...posts];

export const GET: APIRoute = async ({ params }) => {
  let res = new Response('Not Found', { status: 404 });

  const { type, key } = params;
  if (type === 'article') {
    const article = articles.find(
      (post) => `${post.collection}/${post.slug}` === key,
    );

    if (article) {
      const isPost = article.collection === 'blog';
      const image = await ogImage(
        article.data.title,
        isPost ? article.data.lastUpdated ?? article.data.published : undefined,
        article.data.emoji ?? undefined,
      );
      res = new Response(image);
    }
  }
  return res;
};

export async function getStaticPaths() {
  const ogEntries = [
    ...articles.map((article) => ({
      params: { type: 'article', key: `${article.collection}/${article.slug}` },
    })),
  ];
  return ogEntries;
}
