import { getCollection, type CollectionEntry } from "astro:content";

type PostLanguage = CollectionEntry<"posts">["data"]["language"];

export function getPostsByLanguage(language: PostLanguage) {
  return getCollection(
    "posts",
    ({ data }) =>
      data.language === language &&
      data.contentType === "post" &&
      data.published,
  );
}

export async function getPageByLanguage(language: PostLanguage, slug: string) {
  return (await getCollection("posts", ({ data }) =>
    data.language === language &&
    data.contentType === "page" &&
    data.published
  )).find((entry) => getPostSlug(entry) === slug);
}

export function getPostSlug(post: Pick<CollectionEntry<"posts">, "id">) {
  return post.id.split("/").at(-1) ?? post.id;
}

// True when the Markdown body says something beyond whitespace and HTML comments.
export function hasContent(entry: Pick<CollectionEntry<"posts">, "body">) {
  return (entry.body ?? "").replace(/<!--[\s\S]*?-->/g, "").trim() !== "";
}

export function getLastUpdated(entry: Pick<CollectionEntry<"posts">, "data">) {
  return entry.data.updated ?? entry.data.date;
}

export function byLastUpdated(
  a: Pick<CollectionEntry<"posts">, "data">,
  b: Pick<CollectionEntry<"posts">, "data">,
) {
  return getLastUpdated(b).valueOf() - getLastUpdated(a).valueOf();
}

export function getPostDate(date: Date, language: PostLanguage) {
  return {
    dateTime: date.toISOString().slice(0, 10),
    label: new Intl.DateTimeFormat(language, {
      dateStyle: "long",
      timeZone: "UTC",
    }).format(date),
  };
}
