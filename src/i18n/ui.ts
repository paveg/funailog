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
    '404.title': '404 ページが見つかりません',
    '404.description': 'お探しのページは見つかりませんでした。',
    '404.back': 'ホームへ戻る',
    // Portfolio
    'portfolio.title': 'ポートフォリオ',
    'portfolio.description': '職務経歴・プロジェクト履歴・スキル一覧',
    'portfolio.workExperience': '職務経歴',
    'portfolio.projects': 'プロジェクト',
    'portfolio.skills': 'スキル',
    'portfolio.certifications': '資格',
    'portfolio.education': '学歴',
    'portfolio.current': '現在',
    'portfolio.showMore': '他{count}件の経歴を表示',
    'portfolio.collapse': '折りたたむ',
    'portfolio.years': '{years}年',
    'portfolio.lessThanYear': '1年未満',
    'portfolio.personal': '個人',
    'portfolio.work': '業務',
    'portfolio.oss': 'OSS',
  },
  en: {
    'main.title': 'Funailog',
    'main.description': 'A lifelog focused on gadgets and engineering',
    'index.comment': 'Content for this page is not yet decided.',
    'blog.description': 'Blog posts',
    'blog.index': 'Blog',
    'tags.index': 'Tags',
    'tags.description': 'Tag list page',
    'categories.index': 'Categories',
    'categories.description': 'Category list page',
    'content.notfound': 'Content not found',
    'content.back': 'Back to blog',
    '404.title': '404 Page Not Found',
    '404.description': 'The page you are looking for could not be found.',
    '404.back': 'Back to home',
    // Portfolio
    'portfolio.title': 'Portfolio',
    'portfolio.description': 'Work experience, projects, and skills',
    'portfolio.workExperience': 'Work Experience',
    'portfolio.projects': 'Projects',
    'portfolio.skills': 'Skills',
    'portfolio.certifications': 'Certifications',
    'portfolio.education': 'Education',
    'portfolio.current': 'Current',
    'portfolio.showMore': 'Show {count} more',
    'portfolio.collapse': 'Collapse',
    'portfolio.years': '{years} years',
    'portfolio.lessThanYear': 'Less than 1 year',
    'portfolio.personal': 'Personal',
    'portfolio.work': 'Work',
    'portfolio.oss': 'OSS',
  },
} as const;

export const supportLangs = SUPPORTED_LANGS;
export type { SupportedLang };
