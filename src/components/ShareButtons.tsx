'use client';

import { CheckIcon, Link2Icon, TwitterLogoIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { cn } from '@/lib/utils';

type ShareButtonsProps = {
  url: string;
  title: string;
};

type SharePlatform = {
  name: string;
  icon: React.ReactNode;
  getShareUrl: (url: string, title: string) => string;
  ariaLabel: string;
  hoverColor: string;
};

// Custom SVG icons for platforms not in Radix
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const HatenaIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M20.47 0H3.53A3.53 3.53 0 0 0 0 3.53v16.94A3.53 3.53 0 0 0 3.53 24h16.94A3.53 3.53 0 0 0 24 20.47V3.53A3.53 3.53 0 0 0 20.47 0zm-3.705 18.47a1.412 1.412 0 1 1 0-2.824 1.412 1.412 0 0 1 0 2.824zm-.353-4.235h-2.118V6.588h2.118v7.647zM9.647 18.47c-2.118 0-3.53-1.412-3.53-3.53s1.412-3.53 3.53-3.53c2.118 0 3.53 1.412 3.53 3.53s-1.412 3.53-3.53 3.53z" />
  </svg>
);

const LineIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.105.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
  </svg>
);

const SHARE_HASHTAG = 'funailog';

const sharePlatforms: SharePlatform[] = [
  {
    name: 'Twitter',
    icon: <TwitterLogoIcon className="size-4" />,
    getShareUrl: (url, title) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}&hashtags=${SHARE_HASHTAG}`,
    ariaLabel: 'Xでシェア',
    hoverColor: 'hover:text-[#1DA1F2]',
  },
  {
    name: 'Facebook',
    icon: <FacebookIcon className="size-4" />,
    getShareUrl: (url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    ariaLabel: 'Facebookでシェア',
    hoverColor: 'hover:text-[#1877F2]',
  },
  {
    name: 'Hatena',
    icon: <HatenaIcon className="size-4" />,
    getShareUrl: (url) =>
      `https://b.hatena.ne.jp/entry/s/${url.replace(/^https?:\/\//, '')}`,
    ariaLabel: 'はてなブックマークに追加',
    hoverColor: 'hover:text-[#00A4DE]',
  },
  {
    name: 'LINE',
    icon: <LineIcon className="size-4" />,
    getShareUrl: (url, title) =>
      `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`${title} #${SHARE_HASHTAG}`)}`,
    ariaLabel: 'LINEでシェア',
    hoverColor: 'hover:text-[#00B900]',
  },
];

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API failed - show error state briefly
      console.warn('Failed to copy to clipboard');
    }
  };

  return (
    <div className="mt-12">
      <div className="border-border/50 bg-accent/30 rounded-xl border px-6 py-5">
        <p className="mb-4 text-center text-sm font-medium text-foreground">
          この記事をシェア
        </p>
        <div className="flex items-center justify-center gap-3">
          {sharePlatforms.map((platform) => (
            <a
              key={platform.name}
              href={platform.getShareUrl(url, title)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'group relative flex size-11 items-center justify-center rounded-full',
                'border-border/50 border bg-background text-muted-foreground',
                'shadow-sm transition-all duration-200',
                'hover:border-border hover:shadow-md',
                platform.hoverColor,
              )}
              aria-label={platform.ariaLabel}
            >
              {platform.icon}
            </a>
          ))}
          <button
            type="button"
            onClick={handleCopyLink}
            className={cn(
              'group relative flex size-11 items-center justify-center rounded-full',
              'border-border/50 border bg-background text-muted-foreground',
              'shadow-sm transition-all duration-200',
              'hover:border-border hover:text-foreground hover:shadow-md',
              copied &&
                'border-green-500/50 text-green-600 hover:text-green-600',
            )}
            aria-label={copied ? 'リンクをコピーしました' : 'リンクをコピー'}
          >
            {copied ? (
              <CheckIcon className="size-4" />
            ) : (
              <Link2Icon className="size-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
