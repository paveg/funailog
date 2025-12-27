import { z, defineCollection } from 'astro:content';

export const metaCollection = defineCollection({
  type: 'data',
  schema: z.object({
    main: z.object({
      title: z.string(),
      description: z.string(),
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
