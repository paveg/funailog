import type { CollectionEntry } from 'astro:content';

import { TimerIcon } from '@radix-ui/react-icons';

import { TagsComponent } from '@/components/markdown/tags';
import { type ui } from '@/i18n/ui';

type Props = {
  post: CollectionEntry<'blog'>;
  minRead: string;
  lang: keyof typeof ui;
};

export const BlogMeta = ({ post, minRead, lang }: Props) => {
  const { collection } = post;
  const tags = post.data?.tags ?? [];
  return (
    <div
      id="post-meta-container"
      className="my-2 flex flex-col items-end justify-end text-xs md:text-sm"
    >
      <span id="reading-time" className="flex items-center justify-end gap-2">
        <TimerIcon />
        {minRead}
      </span>
      {tags.length > 0 && (
        <TagsComponent tags={tags} lang={lang} collection={collection} />
      )}
    </div>
  );
};
