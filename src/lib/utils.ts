import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Shared link style classes for consistent link appearance
 */
export const linkStyles = {
  base: 'text-link visited:text-link-visited hover:text-link-hover underline underline-offset-3 decoration-link/40 hover:decoration-link-hover active:text-link-active transition-[color,text-decoration-color] duration-150',
  inline: 'inline-flex items-center gap-1',
} as const;

/**
 * Format date for display (English locale)
 */
export function formatDateEn(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

const FILE_EXTENSION_PATTERN = /\.[a-zA-Z0-9]+$/;

/**
 * Ensure an internal page path ends with a trailing slash, matching the
 * directory-style URLs Astro emits (`build.format: 'directory'`).
 * Paths ending in a file extension (rss.xml, og images, ...) are returned
 * unchanged, since those are served as files, not directories.
 */
export function ensureTrailingSlash(path: string): string {
  if (path.endsWith('/') || FILE_EXTENSION_PATTERN.test(path)) {
    return path;
  }
  return `${path}/`;
}
