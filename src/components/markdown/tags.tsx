import type { CollectionEntry } from 'astro:content';

import { filterTags } from '@/lib/tags';
import { cn, linkStyles } from '@/lib/utils';

type Props = {
  collection: CollectionEntry<'blog'>['collection'];
  tags: string[];
};

export const TagsComponent = ({ tags: rawTags, collection }: Props) => {
  const tags = filterTags(rawTags);

  if (tags.length === 0) return null;

  return (
    <div
      key={tags.join('-')}
      className="flex flex-wrap justify-end gap-x-2 gap-y-1 text-xs md:text-sm"
    >
      {tags.map((tag) => (
        <a
          key={tag}
          className={cn(linkStyles.base, 'no-underline')}
          href={`/${collection}/tags/${tag}`}
        >
          #{tag}
        </a>
      ))}
    </div>
  );
};
