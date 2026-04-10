import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';

export const blogCollection = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.mdx' }),
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
        'vehicles',
        'other',
      ])
      .default('other'),
    tags: z.array(z.string()).optional(),
    related: z.array(z.string()).optional(),
    emoji: z.string().optional().default('📝'),
  }),
});
