export const showDefaultLang = false;
export const defaultLang = 'ja';

export const ui = {
  en: {
    'main.title': 'Funai Log',
    'main.description': 'Life log mainly about gadgets and engineering',
    'index.comment': 'An exciting blank canvas awaiting its masterpiece.',
    'blog.description': 'Article list',
    'blog.switch': 'Switch to Japanese articles',
    'tags.index': 'Tags',
    'tags.description': 'Tag list',
  },
  ja: {
    'main.title': 'フナイログ',
    'main.description': 'ガジェットやエンジニアリングがメインのライフログ',
    'index.comment': 'このページに、置くべきコンテンツはまだ決まっていません。',
    'blog.description': '記事一覧',
    'blog.switch': '英語記事へ切り替える',
    'tags.index': 'タグ一覧',
    'tags.description': 'タグ一覧ページ',
  },
} as const;

export const supportLangs: (keyof typeof ui)[] = ['en', 'ja'];
export const hrefLangs: (keyof typeof ui)[] = ['en'];
