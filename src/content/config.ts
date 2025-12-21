import { blogCollection } from '@/schemas/blog-collection';
import { metaCollection } from '@/schemas/meta-collection';
import { pageCollection } from '@/schemas/page-collection';
import { portfolioCollection } from '@/schemas/portfolio-collection';

export const collections = {
  page: pageCollection,
  blog: blogCollection,
  site: metaCollection,
  portfolio: portfolioCollection,
};
