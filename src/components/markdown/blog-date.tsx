import type { CollectionEntry } from 'astro:content';

import { DateComponent } from '@/components/date';
import { Badge } from '@/components/ui/badge';

type Props = {
  post: CollectionEntry<'blog'>;
};

export const BlogDate = ({ post }: Props) => {
  const { collection } = post;
  const { lastUpdated, published, category } = post.data;
  return (
    <div className="my-2 flex justify-between text-xs md:text-sm">
      <a href={`/${collection}/categories/${category}`}>
        <Badge className="capitalize">{category}</Badge>
      </a>
      <div className="flex gap-2">
        {lastUpdated && <DateComponent type="updated" date={lastUpdated} />}
        {published && <DateComponent type="published" date={published} />}
      </div>
    </div>
  );
};
