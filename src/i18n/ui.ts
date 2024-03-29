export const showDefaultLang = false;
export const defaultLang = 'ja';

export const ui = {
  en: {
    'blog.switch': 'Switch to Japanese articles',
  },
  ja: {
    'blog.switch': '英語記事へ切り替える',
  },
} as const;

export const supportLangs: (keyof typeof ui)[] = ['en', 'ja'];
