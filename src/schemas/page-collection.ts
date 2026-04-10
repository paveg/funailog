import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';

export const pageCollection = defineCollection({
  loader: glob({ base: './src/content/page', pattern: '**/*.mdx' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    emoji: z.string().optional().default('📝'),
  }),
});
