import type { CollectionEntry } from 'astro:content';

import type {
  WithContext,
  Article,
  BreadcrumbList,
  CollectionPage,
  Organization,
  Person,
  ProfilePage,
  WebPage,
  WebSite,
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

export const BreadcrumbLd = (
  items: { name: string; url: string }[],
): WithContext<BreadcrumbList> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
};

export const CollectionPageLd = (opts: {
  name: string;
  description: string;
  url: string;
  meta: CollectionEntry<'site'>;
  site: URL | '';
}): WithContext<CollectionPage> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': opts.url,
    name: opts.name,
    description: opts.description,
    url: opts.url,
    inLanguage: 'ja',
    isPartOf: WebsiteLd(opts.meta, opts.site),
  };
};

export const WebPageLd = (opts: {
  name: string;
  description: string;
  url: string;
  meta: CollectionEntry<'site'>;
  site: URL | '';
}): WithContext<WebPage> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': opts.url,
    name: opts.name,
    description: opts.description,
    url: opts.url,
    inLanguage: 'ja',
    isPartOf: WebsiteLd(opts.meta, opts.site),
  };
};

export const ProfilePageLd = (opts: {
  name: string;
  description: string;
  url: string;
  meta: CollectionEntry<'site'>;
  site: URL | '';
  lang?: string;
}): WithContext<ProfilePage> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': opts.url,
    name: opts.name,
    description: opts.description,
    url: opts.url,
    inLanguage: opts.lang ?? 'ja',
    mainEntity: person(opts.meta),
    isPartOf: WebsiteLd(opts.meta, opts.site),
  };
};

export type JsonLdSchema =
  | WithContext<Article>
  | WithContext<BreadcrumbList>
  | WithContext<CollectionPage>
  | WithContext<ProfilePage>
  | WithContext<WebPage>
  | WithContext<WebSite>;
