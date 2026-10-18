import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const musicProviderHosts = {
  "Apple Music": "music.apple.com",
  Spotify: "open.spotify.com",
  YouTube: "www.youtube.com",
} as const;

const musicProvider = z
  .object({
    name: z.enum(["Apple Music", "Spotify", "YouTube"]),
    url: z.url(),
  })
  .superRefine(({ name, url }, context) => {
    const destination = new URL(url);

    if (
      destination.protocol !== "https:" ||
      destination.hostname !== musicProviderHosts[name]
    ) {
      context.addIssue({
        code: "custom",
        message: `${name} links must use https://${musicProviderHosts[name]}`,
        path: ["url"],
      });
    }
  });

const musicLinkCard = z.object({
  kind: z.enum(["album", "track"]),
  name: z.string().min(1),
  performer: z.string().min(1),
  providers: z
    .array(musicProvider)
    .min(1)
    .superRefine((providers, context) => {
      const names = providers.map(({ name }) => name);

      if (new Set(names).size !== names.length) {
        context.addIssue({
          code: "custom",
          message: "Music link cards cannot repeat a provider",
        });
      }
    }),
});

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
    musicLinkCard: musicLinkCard.optional(),
  }),
});

export const collections = { posts };
