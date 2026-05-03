import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string().default('Jeffrey Nicholson Carré'),
    date: z.coerce.date(),
    category: z.string(),
    tags: z.array(z.string()),
    image: z.string(),
    readTime: z.number(),
    excerpt: z.string().optional(),
    language: z.enum(['en', 'fr', 'es', 'ht']).default('en'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
