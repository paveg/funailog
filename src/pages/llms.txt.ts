import type { APIContext } from 'astro';
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

import { CATEGORIES, type Category } from '@/config/site';

const CATEGORY_LABELS: Record<Category, string> = {
  programming: 'Programming',
  design: 'Design',
  gadgets: 'Gadgets',
  travel: 'Travel',
  lifestyle: 'Lifestyle',
  vehicles: 'Vehicles',
  other: 'Other',
};

const formatDate = (date: Date): string => date.toISOString().slice(0, 10);

const escapeDescription = (text: string): string =>
  text.replace(/\s+/g, ' ').trim();

const renderPostLine = (post: CollectionEntry<'blog'>, site: URL): string => {
  const url = new URL(`/${post.collection}/${post.id}/`, site).toString();
  const description = escapeDescription(post.data.description);
  const date = formatDate(post.data.published);
  return `- [${post.data.title}](${url}): ${description} (${date})`;
};

export async function GET(context: APIContext): Promise<Response> {
  const meta = await getEntry('site', 'meta');
  if (!meta) {
    throw new Error('Site meta configuration not found');
  }
  const site = context.site;
  if (!site) {
    throw new Error('Astro `site` is not configured');
  }

  const posts = (await getCollection('blog'))
    .filter((post) => post.data.isPublished)
    .sort((a, b) => b.data.published.getTime() - a.data.published.getTime());

  const postsByCategory = new Map<Category, CollectionEntry<'blog'>[]>();
  for (const post of posts) {
    const list = postsByCategory.get(post.data.category) ?? [];
    list.push(post);
    postsByCategory.set(post.data.category, list);
  }

  const lines: string[] = [];
  lines.push(`# ${meta.data.rss.title}`);
  lines.push('');
  lines.push(`> ${meta.data.rss.description}`);
  lines.push('');
  lines.push(
    'ガジェット・仕事道具・乗り物、そして技術について綴る個人メディアです。記事本文は日本語で書かれています。',
  );
  lines.push('');
  lines.push(`- Author: ${meta.data.author.name}`);
  lines.push(`- Site: ${site.toString()}`);
  lines.push(`- RSS: ${new URL('/rss.xml', site).toString()}`);
  lines.push(`- Sitemap: ${new URL('/sitemap-index.xml', site).toString()}`);
  lines.push('');

  for (const category of CATEGORIES) {
    const entries = postsByCategory.get(category);
    if (!entries || entries.length === 0) continue;
    lines.push(`## ${CATEGORY_LABELS[category]}`);
    lines.push('');
    for (const post of entries) {
      lines.push(renderPostLine(post, site));
    }
    lines.push('');
  }

  const body =
    lines
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trimEnd() + '\n';

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
