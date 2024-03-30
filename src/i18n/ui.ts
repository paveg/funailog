export const showDefaultLang = false;
export const defaultLang = 'ja';

export const ui = {
  en: {
    'main.title': 'Funai Log',
    'main.description': 'Life log mainly about gadgets and engineering',
    'index.comment': 'An exciting blank canvas awaiting its masterpiece.',
    'blog.description': 'Article list',
    'blog.switch': 'Switch to Japanese articles',
    'blog.index': 'Articles',
    'tags.index': 'Tags',
    'tags.description': 'Tag list',
    'categories.index': 'Categories',
    'categories.description': 'Category list',
    'content.notfound': 'Content not found',
    'content.back': 'Back to blog home',
  },
  ja: {
    'main.title': 'フナイログ',
    'main.description': 'ガジェットやエンジニアリングがメインのライフログ',
    'index.comment': 'このページに、置くべきコンテンツはまだ決まっていません。',
    'blog.description': '記事一覧',
    'blog.switch': '英語記事へ切り替える',
    'blog.index': '記事一覧',
    'tags.index': 'タグ一覧',
    'tags.description': 'タグ一覧ページ',
    'categories.index': 'カテゴリ一覧',
    'categories.description': 'カテゴリ一覧ページ',
    'content.notfound': 'コンテンツが見つかりませんでした',
    'content.back': 'ブログトップへ戻る',
  },
} as const;

export const supportLangs: (keyof typeof ui)[] = ['en', 'ja'];
