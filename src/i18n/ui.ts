import {
  I18N_CONFIG,
  SUPPORTED_LANGS,
  type SupportedLang,
} from '@/config/site';

export const showDefaultLang = I18N_CONFIG.showDefaultLangInUrl;
export const defaultLang = I18N_CONFIG.defaultLang;

export const ui = {
  ja: {
    'main.title': 'フナイログ',
    'main.description': 'ガジェットやエンジニアリングがメインのライフログ',
    'index.comment': 'このページに、置くべきコンテンツはまだ決まっていません。',
    'blog.description': '記事一覧',
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
