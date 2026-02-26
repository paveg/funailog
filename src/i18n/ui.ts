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
    'index.tagline': '買わない後悔のほうがきっと大きい',
    'index.heroLine1':
      'ガジェット・仕事道具・乗り物、そして技術についても綴る個人メディア。',
    'index.heroLine2':
      'シンプルで気分を上げるモノやエンジニアリングの知見を紹介しています。',
    'index.latestPosts': '最新の記事',
    'index.viewAllPosts': 'すべての記事を見る',
    'blog.description': '記事一覧',
    'blog.index': '記事一覧',
    'tags.index': 'タグ一覧',
    'tags.description': 'タグ一覧ページ',
    'tags.prefix': 'タグ: #',
    'categories.index': 'カテゴリ一覧',
    'categories.description': 'カテゴリ一覧ページ',
    'categories.prefix': 'カテゴリ: ',
    'content.notfound': 'コンテンツが見つかりませんでした',
    'content.back': 'ブログトップへ戻る',
    '404.title': '404 ページが見つかりません',
    '404.description': 'お探しのページは見つかりませんでした。',
    '404.back': 'ホームへ戻る',
    // Accessibility
    'a11y.skipToContent': 'コンテンツへスキップ',
    'a11y.scrollToTop': 'ページ上部へ戻る',
    'a11y.readingProgress': '読了率',
    'a11y.externalLink': '外部リンク',
    // TOC
    'toc.title': 'contents',
    'toc.ariaLabel': '目次',
    // Share
    'share.label': 'share',
    'share.x': 'Xでシェア',
    'share.facebook': 'Facebookでシェア',
    'share.hatena': 'はてなブックマークに追加',
    'share.copyLink': 'リンクをコピー',
    // Footer
    'footer.description':
      'ガジェット・仕事道具・乗り物、そして技術について綴る個人メディア。',
    // Post list / Search
    'postList.searchPlaceholder': '記事を検索…',
    'postList.searchAriaLabel': '記事を検索',
    'postList.clearSearch': '検索をクリア',
    'postList.searchResults': '「{query}」の検索結果: {count}件',
    'postList.noResults': '検索結果が見つかりませんでした',
    'postList.noPosts': '記事がありません',
    'postList.loading': '読み込み中…',
    'postList.allShown': 'すべての記事を表示しました',
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
    'index.tagline': 'The regret of not buying is surely greater',
    'index.heroLine1':
      'A personal media about gadgets, work tools, vehicles, and technology.',
    'index.heroLine2':
      'Introducing simple, mood-lifting items and engineering insights.',
    'index.latestPosts': 'Latest Posts',
    'index.viewAllPosts': 'View all posts',
    'blog.description': 'Blog posts',
    'blog.index': 'Blog',
    'tags.index': 'Tags',
    'tags.description': 'Tag list page',
    'tags.prefix': 'Tag: #',
    'categories.index': 'Categories',
    'categories.description': 'Category list page',
    'categories.prefix': 'Category: ',
    'content.notfound': 'Content not found',
    'content.back': 'Back to blog',
    '404.title': '404 Page Not Found',
    '404.description': 'The page you are looking for could not be found.',
    '404.back': 'Back to home',
    // Accessibility
    'a11y.skipToContent': 'Skip to content',
    'a11y.scrollToTop': 'Scroll to top',
    'a11y.readingProgress': 'Reading progress',
    'a11y.externalLink': 'external link',
    // TOC
    'toc.title': 'contents',
    'toc.ariaLabel': 'Table of contents',
    // Share
    'share.label': 'share',
    'share.x': 'Share on X',
    'share.facebook': 'Share on Facebook',
    'share.hatena': 'Save to Hatena Bookmark',
    'share.copyLink': 'Copy link',
    // Footer
    'footer.description':
      'A personal media about gadgets, work tools, vehicles, and technology.',
    // Post list / Search
    'postList.searchPlaceholder': 'Search posts…',
    'postList.searchAriaLabel': 'Search posts',
    'postList.clearSearch': 'Clear search',
    'postList.searchResults': 'Results for "{query}": {count}',
    'postList.noResults': 'No results found',
    'postList.noPosts': 'No posts',
    'postList.loading': 'Loading…',
    'postList.allShown': 'All posts displayed',
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
