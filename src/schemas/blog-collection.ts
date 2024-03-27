import { defineCollection, z } from 'astro:content';

export const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    heroImage: z.string().optional().default('/default.jpg'),
    published: z.date(),
    lastUpdated: z.date().optional(),
    isPublished: z.boolean(),
    tags: z.array(z.string()).optional(),
    related: z.array(z.string()).optional(),
  }),
});
