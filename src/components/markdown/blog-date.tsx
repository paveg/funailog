import type { CollectionEntry } from 'astro:content';

import { CalendarIcon, ReloadIcon } from '@radix-ui/react-icons';

import { Badge } from '@/components/ui/badge';
import { defaultLang, showDefaultLang, type ui } from '@/i18n/ui';

type Props = {
  post: CollectionEntry<'blog'>;
  lang: keyof typeof ui;
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const BlogDate = ({ post, lang }: Props) => {
  const { collection } = post;
  const { lastUpdated, published, category } = post.data;
  return (
    <div
      id="post-data-container"
      className="my-2 flex justify-between text-xs md:text-sm"
    >
      <a
        href={
          !showDefaultLang && lang === defaultLang
            ? `/${collection}/categories/${category}`
            : `/${collection}/${lang}/categories/${category}`
        }
      >
        <Badge className="capitalize">{category}</Badge>
      </a>
      <div className="flex gap-2">
        {lastUpdated && (
          <time id="last-updated-date" className="flex items-center gap-1">
            <ReloadIcon className="pt-0.5" />
            {formatDate(lastUpdated)}
          </time>
        )}
        {published && (
          <time id="published-date" className="flex items-center gap-1">
            <CalendarIcon className="pt-0.5" />
            {formatDate(published)}
          </time>
        )}
      </div>
    </div>
  );
};
