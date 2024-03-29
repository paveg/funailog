import { ui, defaultLang, showDefaultLang } from './ui';

export function getLangFromUrl(url: URL) {
  const pathnames = url.pathname.split('/');
  const lang = pathnames.find((pathname) => pathname in ui);
  if (lang) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

export function useTranslatedPath(lang: keyof typeof ui) {
  return function translatePath(path: string, l: string = lang) {
    return !showDefaultLang && l === defaultLang ? path : `${l}/${path}`;
  };
}

export function exactSlugPath(slug: string) {
  const [lang, ...slugs] = slug.split('/');

  return !showDefaultLang && lang === defaultLang ? slugs.join('/') : slug;
}
