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
      description: z.string()
    }))
  }))
});

export const collections = {
  professions
};
