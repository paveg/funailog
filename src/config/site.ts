/**
 * Site-wide configuration
 * Centralized settings to avoid magic strings and improve maintainability
 */

// Supported languages (Japanese only)
export const SUPPORTED_LANGS = ['ja'] as const;
export type SupportedLang = (typeof SUPPORTED_LANGS)[number];

// i18n configuration
export const I18N_CONFIG = {
  defaultLang: 'ja' as SupportedLang,
  showDefaultLangInUrl: false,
} as const;

// Pagination settings
export const PAGINATION = {
  pageSize: 5,
} as const;

// Blog categories
export const CATEGORIES = [
  'programming',
  'design',
  'gadgets',
  'travel',
  'lifestyle',
  'vehicles',
  'other',
] as const;
export type Category = (typeof CATEGORIES)[number];

// Default images
export const DEFAULT_IMAGES = {
  hero: '/first-place.jpg',
  ogImage:
    'https://funailog.imgix.net/defaultImage.png?auto=format,compress,enhance',
} as const;

// Cache directories
export const CACHE_DIRS = {
  embed: '/.cache/embed',
  public: './public/.cache/embed',
} as const;
