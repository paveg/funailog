import {
  CalendarIcon,
  ChatBubbleIcon,
  ExternalLinkIcon,
  HeartIcon,
  ReloadIcon,
} from '@radix-ui/react-icons';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';

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
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
}

function PostItem({ post }: { post: SerializedPost }) {
  const isZenn = post.type === 'zenn';
  const displayDate = post.lastUpdated ?? post.date;
  const hasUpdate = !!post.lastUpdated;

  return (
    <article className="group">
      <span className="flex items-center justify-start gap-2 align-middle">
        {isZenn ? (
          <Badge className="capitalize" variant="outline">
            <span className="mr-1">{post.emoji}</span>
            zenn
          </Badge>
        ) : (
          <a className="pb-0.5" href={`/blog/categories/${post.category}`}>
            <Badge className="capitalize" variant="secondary">
              {post.category}
            </Badge>
          </a>
        )}
        <time
          className="flex items-center gap-1 text-xs text-muted-foreground"
          dateTime={displayDate}
        >
          {hasUpdate ? (
            <ReloadIcon className="size-3" />
          ) : (
            <CalendarIcon className="size-3" />
          )}
          {formatDate(displayDate)}
        </time>
      </span>
      <a
        href={post.url}
        target={isZenn ? '_blank' : '_self'}
        rel={isZenn ? 'noopener noreferrer' : undefined}
      >
        <h2 className="font-heading transition-colors duration-normal group-hover:text-link">
          {post.title}
          {isZenn && (
            <ExternalLinkIcon className="ml-1 inline-block size-4 opacity-50" />
          )}
        </h2>
      </a>
      {isZenn ? (
        <div className="flex items-center gap-3 text-xs text-muted-foreground md:text-sm">
          <span className="flex items-center gap-1">
            <HeartIcon className="size-4" />
            {post.likedCount}
          </span>
          <span className="flex items-center gap-1">
            <ChatBubbleIcon className="size-4" />
            {post.commentsCount}
          </span>
          <Badge variant="outline" className="text-xs">
            {post.articleType}
          </Badge>
        </div>
      ) : (
        <>
          <span className="text-xs leading-4 text-muted-foreground md:text-sm">
            {post.description}
          </span>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {post.tags.map((tag) => (
                <a
                  key={tag}
                  href={`/blog/tags/${tag}`}
                  className="text-xs text-muted-foreground hover:text-link"
                >
                  #{tag}
                </a>
              ))}
            </div>
          )}
        </>
      )}
    </article>
  );
}

export function InfinitePostList({
  initialPosts,
}: {
  initialPosts: SerializedPost[];
}) {
  const [posts, setPosts] = useState<SerializedPost[]>(
    initialPosts.slice(0, POSTS_PER_PAGE),
  );
  const [hasMore, setHasMore] = useState(initialPosts.length > POSTS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const allPostsRef = useRef(initialPosts);

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    // Simulate async loading for smooth UX
    setTimeout(() => {
      const currentLength = posts.length;
      const nextPosts = allPostsRef.current.slice(
        currentLength,
        currentLength + POSTS_PER_PAGE,
      );

      setPosts((prev) => [...prev, ...nextPosts]);
      setHasMore(currentLength + nextPosts.length < allPostsRef.current.length);
      setIsLoading(false);
    }, 100);
  }, [posts.length, hasMore, isLoading]);

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

  return (
    <div className="py-4">
      <ul className="space-y-8">
        {posts.map((post) => (
          <li key={`${post.type}-${post.slug}`}>
            <PostItem post={post} />
          </li>
        ))}
      </ul>

      <div ref={loadMoreRef} className="flex justify-center py-8">
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span className="text-sm">読み込み中...</span>
          </div>
        )}
        {!hasMore && posts.length > 0 && (
          <span className="text-sm text-muted-foreground">
            すべての記事を表示しました
          </span>
        )}
      </div>
    </div>
  );
}
