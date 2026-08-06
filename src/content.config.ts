import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  loader: glob({
    base: "./src/content/posts",
    pattern: "**/*.md",
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    language: z.enum(["zh-TW", "en"]),
    contentType: z.enum(["post", "page"]).default("post"),
    published: z.boolean().default(true),
  }),
});

export const collections = { posts };
