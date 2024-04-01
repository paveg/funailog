import type { CollectionEntry } from 'astro:content';

import { defaultLang, showDefaultLang, type ui } from '@/i18n/ui';

type Props = {
  collection: CollectionEntry<'blog'>['collection'];
  tags: string[];
  lang: keyof typeof ui;
};
export const TagsComponent = ({ tags, lang, collection }: Props) => {
  return (
    tags.length > 0 && (
      <div className="space-x-2 text-xs md:text-sm">
        {tags.map((tag) => (
          <span>
            <a
              className="text-link no-underline visited:text-link-visited hover:italic hover:text-link-hover hover:underline active:text-link-active"
              href={
                !showDefaultLang && lang === defaultLang
                  ? `/${collection}/tags/${tag}`
                  : `/${collection}/${lang}/tags/${tag}`
              }
            >
              #{tag}
            </a>
          </span>
        ))}
      </div>
    )
  );
};
