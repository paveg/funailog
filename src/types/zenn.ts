export type ZennArticleTypes = 'tech' | 'idea' | string;

export type ZennPostTypes = 'Article' | string;

export type ZennUser = {
  id: string;
  username: string;
  name: string;
  avatar_small_url: string;
};

export type ZennArticle = {
  id: string;
  post_type: ZennPostTypes;
  title: string;
  slug: string;
  liked_count: number;
  comments_count: number;
  article_type: ZennArticleTypes;
  emoji: string;
  published_at: string;
  body_updated_at: string;
  path: string;
  user: ZennUser;
  publication: null;
};

export type ZennArticleData = {
  articles: ZennArticle[];
  next_page: number | null;
};
