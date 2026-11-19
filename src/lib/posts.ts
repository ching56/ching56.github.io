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

const CJK = "\\p{Script=Han}\\u3000-\\u303f\\uff00-\\uffef";
const spaceBesideCjk = new RegExp(`(?<=[${CJK}]) | (?=[${CJK}])`, "gu");

// The post's text as one plain line: no images, video, or markup. A line or
// paragraph break that ends in punctuation simply joins; any other break
// becomes one ideographic space. Other spaces survive
// only between Latin words.
const LINE = "\u{1E}";
const PARAGRAPH = "\u{1F}";

export function getPostPreview(entry: Pick<CollectionEntry<"posts">, "body">) {
  return (entry.body ?? "")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<video[\s\S]*?<\/video>/gi, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<br\s*\/?>[ \t]*\n?/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/^\s*(?:#{1,6}|>|[-*+]|\d+\.)\s+/gm, "")
    .replace(/[*_`~]/g, "")
    .replace(/\n[ \t]*\n\s*/g, PARAGRAPH)
    .replace(/[ \t]*\n[ \t]*/g, LINE)
    .replace(/\s+/g, " ")
    .replace(spaceBesideCjk, "")
    .replace(/ ?[\u{1E}\u{1F}][\s\u{1E}\u{1F}]*/gu, (run) =>
      run.includes(PARAGRAPH) ? PARAGRAPH : LINE,
    )
    .replace(/(\p{P})[\u{1E}\u{1F}]/gu, "$1")
    .replace(/^[\u{1E}\u{1F}]+|[\u{1E}\u{1F}]+$/gu, "")
    .replace(/[\u{1E}\u{1F}]/gu, "\u3000")
    .trim();
}

// What names a post wherever a short label is needed (browser tab, feed):
// its title, or for an untitled Threads post its opening words.
export function getPostLabel(
  entry: Pick<CollectionEntry<"posts">, "body" | "data">,
  maxLength = 40,
) {
  if (entry.data.title) return entry.data.title;

  const characters = [...getPostPreview(entry)];

  return characters.length > maxLength
    ? `${characters.slice(0, maxLength).join("").trimEnd()}…`
    : characters.join("");
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

