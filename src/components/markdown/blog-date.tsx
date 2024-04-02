import type { CollectionEntry } from 'astro:content';

import { DateComponent } from '@/components/date';
import { Badge } from '@/components/ui/badge';
import { defaultLang, showDefaultLang, type ui } from '@/i18n/ui';

type Props = {
  post: CollectionEntry<'blog'>;
  lang: keyof typeof ui;
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
        {lastUpdated && <DateComponent type="updated" date={lastUpdated} />}
        {published && <DateComponent type="published" date={published} />}
      </div>
    </div>
  );
};
