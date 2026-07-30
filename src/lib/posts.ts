import { getCollection, type CollectionEntry } from "astro:content";

type PostLanguage = CollectionEntry<"posts">["data"]["language"];

export function getPostsByLanguage(language: PostLanguage) {
  return getCollection("posts", ({ data }) => data.language === language);
}

export function getPostSlug(post: Pick<CollectionEntry<"posts">, "id">) {
  return post.id.split("/").at(-1) ?? post.id;
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
