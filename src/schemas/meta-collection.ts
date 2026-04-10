import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';

export const metaCollection = defineCollection({
  loader: glob({ base: './src/content/site', pattern: '*.yml' }),
  schema: z.object({
    main: z.object({
      defaultImage: z.string(),
    }),
    rss: z.object({
      title: z.string(),
      description: z.string(),
    }),
    author: z.object({
      name: z.string(),
    }),
    links: z.object({
      github: z.string(),
      twitter: z.string(),
      instagram: z.string(),
      linkedin: z.string(),
    }),
    affiliate: z
      .object({
        amazon: z
          .object({
            associateId: z.string(),
          })
          .optional(),
      })
      .optional(),
  }),
});
