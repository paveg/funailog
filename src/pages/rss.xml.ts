import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getEntry, getCollection } from 'astro:content';

export async function GET(context: APIContext) {
  const meta = await getEntry('site', 'meta');
  if (!meta) {
    throw new Error('Site meta configuration not found');
  }
  const posts = (await getCollection('blog'))
    .filter((post) => post.data.isPublished)
    .sort((a, b) => a.data.published.getTime() - b.data.published.getTime())
    .reverse();

  return await rss({
    title: meta.data.rss.title,
    description: meta.data.rss.description,
    site: context.site ?? '',
    items: posts.map((post) => {
      const url = `/${post.collection}/${post.slug}`;
      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.published,
        categories: post.data.tags,
        link: url,
        enclosure: {
          url: new URL(
            `/api/og/article/${post.collection}/${post.slug}.png`,
            context.site,
          ).toString(),
          type: 'image/png',
          length: 65535,
        },
      };
    }),
    xmlns: {
      atom: 'http://www.w3.org/2005/Atom',
    },
    customData: [
      '<language>ja-jp</language>',
      `<atom:link href="${new URL('/rss.xml', context.site)}" rel="self" type="application/rss+xml" />`,
    ].join(''),
  });
}
