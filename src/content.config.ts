import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// A post mirrored from Threads links back to the original so readers can
// respond there. Only canonical Threads post permalinks are accepted.
const threadsPostUrl = z.url().refine(
  (url) => {
    const destination = new URL(url);

    return (
      destination.protocol === "https:" &&
      ["www.threads.com", "www.threads.net"].includes(destination.hostname) &&
      /^\/@[\w.]+\/post\/[\w-]+\/?$/.test(destination.pathname)
    );
  },
  { message: "threadsUrl must be an https://www.threads.com/@handle/post/<id> permalink" },
);

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
    threadsUrl: threadsPostUrl.optional(),
  }),
});

export const collections = { posts };
