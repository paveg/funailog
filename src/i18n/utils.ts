import { ui, defaultLang, type SupportedLang } from './ui';

export function useTranslations(lang: SupportedLang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

/**
 * Generate hreflang array for SEO. Pages with an English counterpart
 * should hardcode their own hreflangs inline (see src/pages/en/portfolio.astro).
 */
export function generateHreflangs(basePath: string): Array<{
  path: string;
  hreflang: SupportedLang | 'x-default';
}> {
  const path = basePath.startsWith('/') ? basePath : `/${basePath}`;
  return [
    { path, hreflang: 'ja' },
    { path, hreflang: 'x-default' },
  ];
}
