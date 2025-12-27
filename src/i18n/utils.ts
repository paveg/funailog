import { ui, defaultLang, type SupportedLang } from './ui';

export function getLangFromUrl(_url: URL): SupportedLang {
  return defaultLang;
}

export function useTranslations(lang: SupportedLang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

export function useTranslatedPath(_lang: SupportedLang) {
  return function translatePath(path: string) {
    return path;
  };
}

export function exactSlugPath(slug: string) {
  return slug;
}

/**
 * Build a localized path (simplified for single language)
 */
export function buildLocalizedPath(basePath: string): string {
  const path = basePath.startsWith('/') ? basePath.slice(1) : basePath;
  return `/${path}`;
}

/**
 * Generate hreflang array for SEO (simplified)
 */
export function generateHreflangs(basePath: string): Array<{
  path: string;
  hreflang: SupportedLang | 'x-default';
}> {
  const path = buildLocalizedPath(basePath);
  return [
    { path, hreflang: 'ja' },
    { path, hreflang: 'x-default' },
  ];
}

/**
 * Extract language from a content slug
 */
export function getLangFromSlug(_slug: string): SupportedLang {
  return defaultLang;
}
