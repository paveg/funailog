import {
  CalendarIcon,
  Cross2Icon,
  MagnifyingGlassIcon,
  ReloadIcon,
} from '@radix-ui/react-icons';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { defaultLang } from '@/i18n/ui';
import { useTranslations } from '@/i18n/utils';
import { filterTags } from '@/lib/tags';
import { cn, formatDateEn } from '@/lib/utils';

const t = useTranslations(defaultLang);

export type SerializedPost = {
  type: 'blog';
  slug: string;
  title: string;
  description?: string | undefined;
  date: string;
  lastUpdated?: string | undefined;
  category?: string | undefined;
  tags?: string[] | undefined;
  url: string;
};

const POSTS_PER_PAGE = 10;

function formatDate(dateString: string): string {
  return formatDateEn(new Date(dateString));
}

function PostItem({ post }: { post: SerializedPost }) {
  // Compare only the date portion (YYYY-MM-DD) to ignore time differences
  const dateOnly = post.date.slice(0, 10);
  const lastUpdatedOnly = post.lastUpdated?.slice(0, 10);
  const hasDistinctUpdate = !!lastUpdatedOnly && lastUpdatedOnly !== dateOnly;
  const tags = filterTags(post.tags ?? []);

  return (
    <article className="group relative">
      {/* Accent line on hover */}
      <div className="bg-accent-line absolute top-0 -left-3 h-full w-0.5 origin-top scale-y-0 transition-transform duration-200 group-hover:scale-y-100" />

      <div className="text-muted-foreground flex items-center gap-2 text-xs">
        <a href={`/blog/categories/${post.category}`}>
          <Badge className="capitalize" variant="secondary">
            {post.category}
          </Badge>
        </a>
        <span className="flex items-center gap-1">
          <CalendarIcon className="size-3" />
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {hasDistinctUpdate && (
            <>
              <ReloadIcon className="ml-1 size-3" />
              <time dateTime={post.lastUpdated}>
                {formatDate(post.lastUpdated!)}
              </time>
            </>
          )}
        </span>
      </div>
      <a href={post.url} className="block pt-1">
        <h2 className="font-heading text-foreground group-hover:text-link line-clamp-2 text-base break-words transition-colors duration-200 md:text-lg">
          {post.title}
        </h2>
      </a>
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1.5">
          {tags.slice(0, 5).map((tag) => (
            <a
              key={tag}
              href={`/blog/tags/${tag}`}
              className="text-muted-foreground hover:text-foreground text-xs transition-colors duration-150"
            >
              #{tag}
            </a>
          ))}
          {tags.length > 5 && (
            <span className="text-muted-foreground/70 text-xs">
              +{tags.length - 5}
            </span>
          )}
        </div>
      )}
    </article>
  );
}

export type InfinitePostListProps = {
  initialPosts: SerializedPost[];
  showSearch?: boolean;
  title?: string;
};

export function InfinitePostList({
  initialPosts,
  showSearch = false,
  title,
}: InfinitePostListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [displayedCount, setDisplayedCount] = useState(POSTS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setDisplayedCount(POSTS_PER_PAGE); // Reset pagination on search
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter posts based on search query
  const filteredPosts = useMemo(() => {
    if (!debouncedQuery.trim()) return initialPosts;

    const query = debouncedQuery.toLowerCase();
    return initialPosts.filter((post) => {
      const titleMatch = post.title.toLowerCase().includes(query);
      const descriptionMatch = post.description?.toLowerCase().includes(query);
      const tagsMatch = post.tags?.some((tag) =>
        tag.toLowerCase().includes(query),
      );
      return titleMatch || descriptionMatch || tagsMatch;
    });
  }, [initialPosts, debouncedQuery]);

  // Posts to display (paginated)
  const displayedPosts = useMemo(
    () => filteredPosts.slice(0, displayedCount),
    [filteredPosts, displayedCount],
  );

  const hasMore = displayedCount < filteredPosts.length;

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setTimeout(() => {
      setDisplayedCount((prev) => prev + POSTS_PER_PAGE);
      setIsLoading(false);
    }, 100);
  }, [hasMore, isLoading]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' },
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loadMore, hasMore, isLoading]);

  const handleClearSearch = () => {
    setSearchQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className="py-4">
      {/* Header with optional title and search */}
      {(title || showSearch) && (
        <div className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-center sm:justify-between">
          {title && <h1 className="font-heading capitalize">{title}</h1>}
          {showSearch && (
            <div className="relative w-full sm:w-64">
              <MagnifyingGlassIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('postList.searchPlaceholder')}
                aria-label={t('postList.searchAriaLabel')}
                className={cn(
                  'border-input bg-background h-9 w-full rounded-md border py-2 pr-9 pl-9 text-sm',
                  'placeholder:text-muted-foreground',
                  'focus:ring-ring focus:ring-1 focus:outline-none',
                  'duration-fast transition-colors',
                )}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                  aria-label={t('postList.clearSearch')}
                >
                  <Cross2Icon className="size-4" />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Search results info */}
      {showSearch && debouncedQuery && (
        <p className="text-muted-foreground pb-4 text-sm">
          {t('postList.searchResults')
            .replace('{query}', debouncedQuery)
            .replace('{count}', String(filteredPosts.length))}
        </p>
      )}

      {/* Post list */}
      <ul className="space-y-8 pl-3">
        {displayedPosts.length === 0 ? (
          <li className="text-muted-foreground py-8 text-center">
            {debouncedQuery ? t('postList.noResults') : t('postList.noPosts')}
          </li>
        ) : (
          displayedPosts.map((post) => (
            <li key={`${post.type}-${post.slug}`}>
              <PostItem post={post} />
            </li>
          ))
        )}
      </ul>

      {/* Load more indicator */}
      <div ref={loadMoreRef} className="flex justify-center py-8">
        {isLoading && (
          <div className="text-muted-foreground flex items-center gap-2">
            <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span className="text-sm">{t('postList.loading')}</span>
          </div>
        )}
        {!hasMore && displayedPosts.length > 0 && !debouncedQuery && (
          <span className="text-muted-foreground text-sm">
            {t('postList.allShown')}
          </span>
        )}
      </div>
    </div>
  );
}
