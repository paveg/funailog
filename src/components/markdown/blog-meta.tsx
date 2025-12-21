import type { CollectionEntry } from 'astro:content';

import { TimerIcon } from '@radix-ui/react-icons';

import { TagsComponent } from '@/components/markdown/tags';

type Props = {
  post: CollectionEntry<'blog'>;
  minRead: string;
};

export const BlogMeta = ({ post, minRead }: Props) => {
  const { collection } = post;
  const tags = post.data?.tags ?? [];
  return (
    <div className="my-2 flex flex-col items-end justify-end text-xs md:text-sm">
      <span className="flex items-center justify-end gap-2">
        <TimerIcon />
        {minRead}
      </span>
      {tags.length > 0 && <TagsComponent tags={tags} collection={collection} />}
    </div>
  );
};
