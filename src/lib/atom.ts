import type { SiteLanguage } from "../config/i18n";
import { SITE } from "../config/site.js";
import { getPostSlug, getPostsByLanguage } from "./posts";

export async function buildAtomFeed(language: SiteLanguage) {
  const homeUrl = new URL(`/${language}/`, SITE.url).href;
  const feedUrl = new URL(`/${language}/atom.xml`, SITE.url).href;
  const posts = (await getPostsByLanguage(language)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
  const updatedAt = posts.at(0)?.data.date.toISOString() ?? SITE.emptyFeedUpdatedAt;
  const entries = posts.map((post) => {
    const publishedAt = post.data.date.toISOString();
    const postUrl = new URL(
      `/${language}/blog/${getPostSlug(post)}/`,
      SITE.url,
    ).href;

    return `  <entry>
    <title>${escapeXml(post.data.title)}</title>
    <id>${postUrl}</id>
    <link rel="alternate" href="${postUrl}" type="text/html" hreflang="${language}" />
    <published>${publishedAt}</published>
    <updated>${publishedAt}</updated>
  </entry>`;
  });

  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${language}">
  <title>${escapeXml(SITE.title)}</title>
  <subtitle>${escapeXml(SITE.description[language])}</subtitle>
  <id>${feedUrl}</id>
  <link rel="self" href="${feedUrl}" type="application/atom+xml" />
  <link rel="alternate" href="${homeUrl}" type="text/html" hreflang="${language}" />
  <updated>${updatedAt}</updated>
  <author>
    <name>${escapeXml(SITE.author.name)}</name>
  </author>
${entries.length > 0 ? `${entries.join("\n")}\n` : ""}
</feed>`;
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
