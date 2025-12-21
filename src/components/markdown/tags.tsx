import type { CollectionEntry } from 'astro:content';

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
            className="text-link no-underline visited:text-link-visited hover:italic hover:text-link-hover hover:underline active:text-link-active"
            href={`/${collection}/tags/${tag}`}
          >
            #{tag}
          </a>
        </span>
      ))}
    </div>
  );
};
