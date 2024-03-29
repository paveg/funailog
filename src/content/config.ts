import { blogCollection } from '@/schemas/blog-collection';
import { metaCollection } from '@/schemas/meta-collection';
import { pageCollection } from '@/schemas/page-collection';

export const collections = {
  page: pageCollection,
  blog: blogCollection,
  data: metaCollection,
};
