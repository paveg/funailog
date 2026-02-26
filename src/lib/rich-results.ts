import type { CollectionEntry } from 'astro:content';

import type {
  WithContext,
  Article,
  WebSite,
  Organization,
  Person,
} from 'schema-dts';

import { useTranslations } from '@/i18n/utils';

const person = (meta: CollectionEntry<'site'>): Person => {
  return {
    '@type': 'Person',
    '@id': meta.data.links.twitter,
    name: meta.data.author.name,
    sameAs: [
      meta.data.links.github,
      meta.data.links.twitter,
      meta.data.links.instagram,
      meta.data.links.linkedin,
    ],
  };
};

const publisher = (site: URL | ''): Organization => {
  const t = useTranslations('ja');
  const url = new URL('/', site).toString();

  return {
    '@type': 'Organization',
    '@id': 'paveg/funailog',
    name: t('main.title'),
    url: url,
  };
};

export const WebsiteLd = (
  meta: CollectionEntry<'site'>,
  site: URL | '',
): WithContext<WebSite> => {
  const t = useTranslations('ja');
  const url = new URL('/', site).toString();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': url,
    name: t('main.title'),
    url: url,
    inLanguage: 'ja',
    author: [person(meta)],
    publisher: publisher(site),
  };
};

export const ArticleLd = (
  meta: CollectionEntry<'site'>,
  blog: CollectionEntry<'blog'>,
  site: URL | '',
): WithContext<Article> => {
  const articleUrl = new URL(
    `${blog.collection}/${blog.slug}`,
    site,
  ).toString();
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': articleUrl,
    headline: blog.data.title,
    description: blog.data.description,
    image: new URL(
      blog.data.heroImage ??
        `/api/og/article/${blog.collection}/${blog.slug}.png`,
      site,
    ).toString(),
    keywords: blog.data.tags ?? [],
    datePublished: blog.data.published.toISOString(),
    dateModified: (blog.data.lastUpdated ?? blog.data.published).toISOString(),
    inLanguage: 'ja',
    author: [person(meta)],
    publisher: publisher(site),
    isPartOf: WebsiteLd(meta, site),
  };
};
