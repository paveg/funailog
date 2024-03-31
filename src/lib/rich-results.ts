import type { CollectionEntry } from 'astro:content';

import type {
  WithContext,
  Article,
  WebSite,
  Organization,
  Person,
} from 'schema-dts';

import { supportLangs, type ui } from '@/i18n/ui';
import { useTranslations } from '@/i18n/utils';

const person = (meta: CollectionEntry<'site'>): Person => {
  return {
    '@type': 'Person',
    // TODO: Add profile page and link to it
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

const publisher = (site: URL | '', lang: keyof typeof ui): Organization => {
  const t = useTranslations(lang);
  const url = new URL('/', site).toString();

  return {
    '@type': 'Organization',
    '@id': 'paveg/funailog',
    name: t('main.title'),
    url: url,
  };
};

const website = (
  meta: CollectionEntry<'site'>,
  site: URL | '',
  lang: keyof typeof ui,
): WebSite => {
  const t = useTranslations(lang);
  const url = new URL('/', site).toString();
  return {
    '@type': 'WebSite',
    '@id': url,
    name: t('main.title'),
    url: url,
    inLanguage: supportLangs,
    author: [person(meta)],
    publisher: publisher(site, lang),
  };
};

export const ArticleLd = (
  meta: CollectionEntry<'site'>,
  blog: CollectionEntry<'blog'>,
  site: URL | '',
  lang: keyof typeof ui,
): WithContext<Article> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': blog.id,
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
    inLanguage: supportLangs,
    author: [person(meta)],
    publisher: publisher(site, lang),
    isPartOf: website(meta, site, lang),
  };
};
