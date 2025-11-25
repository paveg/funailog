import {
  ui,
  defaultLang,
  showDefaultLang,
  supportLangs,
  type SupportedLang,
} from './ui';

export function getLangFromUrl(url: URL): SupportedLang {
  const pathnames = url.pathname.split('/');
  const lang = pathnames.find((pathname) => pathname in ui);
  if (lang) return lang as SupportedLang;
  return defaultLang;
}

export function useTranslations(lang: SupportedLang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

export function useTranslatedPath(lang: SupportedLang) {
  return function translatePath(path: string, l: string = lang) {
    return !showDefaultLang && l === defaultLang ? path : `${l}/${path}`;
  };
}

export function exactSlugPath(slug: string) {
  const [lang, ...slugs] = slug.split('/');

  return !showDefaultLang && lang === defaultLang ? slugs.join('/') : slug;
}

/**
 * Build a localized path for a given language
 * Handles the showDefaultLang logic centrally
 */
export function buildLocalizedPath(
  basePath: string,
  lang: SupportedLang,
): string {
  // Remove leading slash for consistent handling
  const path = basePath.startsWith('/') ? basePath.slice(1) : basePath;

  if (!showDefaultLang && lang === defaultLang) {
    return `/${path}`;
  }
  return `/${lang}/${path}`;
}

/**
 * Generate hreflang array for SEO
 * Automatically includes all supported languages and x-default
 */
export function generateHreflangs(basePath: string): Array<{
  path: string;
  hreflang: SupportedLang | 'x-default';
}> {
  const hreflangs: Array<{
    path: string;
    hreflang: SupportedLang | 'x-default';
  }> = supportLangs.map((lang) => ({
    path: buildLocalizedPath(basePath, lang),
    hreflang: lang,
  }));

  // x-default points to the default language version
  hreflangs.push({
    path: buildLocalizedPath(basePath, defaultLang),
    hreflang: 'x-default',
  });

  return hreflangs;
}

/**
 * Get the alternate language (for language toggle)
 */
export function getAlternateLang(currentLang: SupportedLang): SupportedLang {
  return currentLang === 'ja' ? 'en' : 'ja';
}

/**
 * Extract language from a content slug (e.g., "ja/2024/post-name")
 */
export function getLangFromSlug(slug: string): SupportedLang {
  const [lang] = slug.split('/');
  return supportLangs.includes(lang as SupportedLang)
    ? (lang as SupportedLang)
    : defaultLang;
}
