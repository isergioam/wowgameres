import { defineCollection, z } from 'astro:content';

const professions = defineCollection({
  type: 'data',
  schema: z.record(z.object({
    expansionName: z.string(),
    professionName: z.string(),
    maxLevel: z.number(),
    description: z.string(),
    note: z.string().optional(),
    steps: z.array(z.object({
      min: z.number(),
      max: z.number(),
      mats: z.record(z.number()),
      description: z.string(),
      routeImage: z.string().optional()
    }))
  }))
});

const news = defineCollection({
  type: 'data',
  schema: z.array(z.object({
    id: z.number(),
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    content: z.string(),
    url: z.string().url(),
    image: z.string().url(),
    date: z.string(),
    category: z.string(),
    summary: z.string(),
    summaryTitle: z.string().nullable().optional()
  }))
});

export const collections = {
  professions,
  news
};
