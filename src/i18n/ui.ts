export const showDefaultLang = false;
export const defaultLang = 'ja';

export const ui = {
  en: {},
  ja: {},
} as const;

export const supportLangs: (keyof typeof ui)[] = ['en', 'ja'];
