import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Shared link style classes for consistent link appearance
 */
export const linkStyles = {
  base: 'text-link visited:text-link-visited hover:italic hover:text-link-hover hover:underline active:text-link-active',
  inline: 'inline-flex items-center gap-1',
} as const;

/**
 * Format date for display (Japanese locale)
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

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
