import { defineCollection, z } from 'astro:content';

export const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    heroImage: z.string().optional(),
    published: z.date(),
    lastUpdated: z.date().optional(),
    isPublished: z.boolean(),
    category: z
      .enum([
        'programming',
        'design',
        'gadgets',
        'travel',
        'lifestyle',
        'other',
      ])
      .default('other'),
    tags: z.array(z.string()).optional(),
    related: z.array(z.string()).optional(),
    emoji: z.string().optional().default('📝'),
  }),
});
