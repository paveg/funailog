import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getEntry, getCollection } from 'astro:content';

export async function GET(context: APIContext) {
  const meta = await getEntry('site', 'meta');
  const posts = (await getCollection('blog'))
    .sort((a, b) => a.data.published.getTime() - b.data.published.getTime())
    .reverse();

  return await rss({
    title: meta.data.index.title,
    description: meta.data.index.description,
    site: context.site ?? '',
    items: posts.map((post) => {
      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.published,
        categories: post.data.tags,
        link: `/${post.collection}/posts/${post.slug}`,
        enclosure: {
          // TODO: Replace with ogp image after implementing it
          url: '/default.jpg',
          type: 'image/jpeg',
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
