import type { CollectionEntry } from 'astro:content';

import { cn, linkStyles } from '@/lib/utils';

type Props = {
  collection: CollectionEntry<'blog'>['collection'];
  tags: string[];
};

export const TagsComponent = ({ tags, collection }: Props) => {
  return (
    <div key={tags.join('-')} className="space-x-2 text-xs md:text-sm">
      {tags.map((tag) => (
        <span key={tag}>
          <a
            className={cn(linkStyles.base, 'no-underline')}
            href={`/${collection}/tags/${tag}`}
          >
            #{tag}
          </a>
        </span>
      ))}
    </div>
  );
};
