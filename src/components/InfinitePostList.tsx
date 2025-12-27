import {
  CalendarIcon,
  Cross2Icon,
  ExternalLinkIcon,
  MagnifyingGlassIcon,
  ReloadIcon,
} from '@radix-ui/react-icons';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { cn, formatDateEn } from '@/lib/utils';

export type SerializedPost = {
  type: 'blog' | 'zenn';
  slug: string;
  title: string;
  description?: string | undefined;
  date: string;
  lastUpdated?: string | undefined;
  category?: string | undefined;
  tags?: string[] | undefined;
  url: string;
  emoji?: string | undefined;
  likedCount?: number | undefined;
  commentsCount?: number | undefined;
  articleType?: string | undefined;
};

const POSTS_PER_PAGE = 10;

function formatDate(dateString: string): string {
  return formatDateEn(new Date(dateString));
}

function PostItem({ post }: { post: SerializedPost }) {
  const isZenn = post.type === 'zenn';
  // Compare only the date portion (YYYY-MM-DD) to ignore time differences
  const dateOnly = post.date.slice(0, 10);
  const lastUpdatedOnly = post.lastUpdated?.slice(0, 10);
  const hasDistinctUpdate = !!lastUpdatedOnly && lastUpdatedOnly !== dateOnly;
  const tags = post.tags ?? [];

  return (
    <article className="group">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {isZenn ? (
          <Badge className="capitalize" variant="outline">
            {post.emoji} zenn
          </Badge>
        ) : (
          <a href={`/blog/categories/${post.category}`}>
            <Badge className="capitalize" variant="secondary">
              {post.category}
            </Badge>
          </a>
        )}
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
      <a
        href={post.url}
        target={isZenn ? '_blank' : '_self'}
        rel={isZenn ? 'noopener noreferrer' : undefined}
        className="block pt-1"
      >
        <h2 className="font-heading text-foreground transition-colors duration-fast group-hover:text-link">
          {post.title}
          {isZenn && (
            <ExternalLinkIcon className="ml-1 inline-block size-3.5 opacity-40" />
          )}
        </h2>
      </a>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1.5">
          {tags.map((tag) =>
            isZenn ? (
              <span key={tag} className="text-xs text-muted-foreground">
                #{tag}
              </span>
            ) : (
              <a
                key={tag}
                href={`/blog/tags/${tag}`}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                #{tag}
              </a>
            ),
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
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={inputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="記事を検索..."
                className={cn(
                  'h-9 w-full rounded-md border border-input bg-background py-2 pl-9 pr-9 text-sm',
                  'placeholder:text-muted-foreground',
                  'focus:outline-none focus:ring-1 focus:ring-ring',
                  'transition-colors duration-fast',
                )}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="検索をクリア"
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
        <p className="pb-4 text-sm text-muted-foreground">
          「{debouncedQuery}」の検索結果: {filteredPosts.length}件
        </p>
      )}

      {/* Post list */}
      <ul className="space-y-8">
        {displayedPosts.length === 0 ? (
          <li className="py-8 text-center text-muted-foreground">
            {debouncedQuery
              ? '検索結果が見つかりませんでした'
              : '記事がありません'}
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
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span className="text-sm">読み込み中...</span>
          </div>
        )}
        {!hasMore && displayedPosts.length > 0 && !debouncedQuery && (
          <span className="text-sm text-muted-foreground">
            すべての記事を表示しました
          </span>
        )}
      </div>
    </div>
  );
}
