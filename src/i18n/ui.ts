import {
  I18N_CONFIG,
  SUPPORTED_LANGS,
  type SupportedLang,
} from '@/config/site';

export const showDefaultLang = I18N_CONFIG.showDefaultLangInUrl;
export const defaultLang = I18N_CONFIG.defaultLang;

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
    'zenn.index': 'Zenn articles',
    'zenn.description': 'Zenn articles list',
    '404.title': '404 Not Found',
    '404.description': "The page you are looking for hasn't been found.",
    '404.back': 'Go Back to Home',
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
    'zenn.index': 'Zenn 記事一覧',
    'zenn.description': 'Zenn.dev 記事一覧ページ',
    '404.title': '404 ページが見つかりません',
    '404.description': 'お探しのページは見つかりませんでした。',
    '404.back': 'ホームへ戻る',
  },
} as const;

export const supportLangs = SUPPORTED_LANGS;
export type { SupportedLang };
