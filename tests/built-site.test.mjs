import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";
import sax from "sax";

import { SITE } from "../src/config/site.js";
import { ARTICLE_IMAGE_SIZES } from "../src/lib/article-image-sizes.mjs";

const distDirectory = new URL("../dist/", import.meta.url);
const listPage = new URL("zh-TW/index.html", distDirectory);
// A post's `updated` frontmatter, when present, is mirrored here as `updated`.
const lastUpdated = (post) => post.updated ?? post.dateTime;
const forbiddenFontRule = /@font-face|@import\s+(?:url\s*\()?/i;
const expectedPosts = [
  {
    // Threads mirrors are untitled: the list previews their text and the
    // browser tab and feed use their first 40 characters.
    slug: "bottles",
    label: "有時候會很喜歡重複做一樣的東西，最近是瓶子。嘗試了不同比例，上釉的方式，目前最喜…",
    preview: "有時候會很喜歡重複做一樣的東西，最近是瓶子。",
    dateTime: "2026-10-11",
    dateLabel: "2026年10月11日",
    excerpts: [
      "最近是瓶子。<br />",
      "土胚的牆壁像是窗簾一樣捲起😭",
      "先把水吸乾再收窄瓶口",
    ],
  },
  {
    slug: "shino-bottle",
    label: "在土胚的階段，我本來不太喜歡這支瓶子，在考慮要不要切開研究剖面然後回收，但是出窯…",
    preview: "在土胚的階段，我本來不太喜歡這支瓶子，",
    dateTime: "2026-10-17",
    dateLabel: "2026年10月17日",
    excerpts: [
      "我本來不太喜歡這支瓶子，<br />",
      "不抱期待的嘗試最後常常意外表現得很好。",
      "謝謝自己沒有放棄你。",
    ],
  },
  {
    slug: "third-teapot",
    label: "終於把我的第三把茶壺上好釉了。土胚其實在七月底就已經完成，花了很多心血製作這把茶…",
    preview: "終於把我的第三把茶壺上好釉了。",
    dateTime: "2026-10-27",
    dateLabel: "2026年10月27日",
    excerpts: ["瓷漿加上白釉", "要成為讓人印象深刻的茶壺唷！", "附上釉的近照"],
  },
  {
    slug: "offering-cups",
    label: "之前做的東西都是給人類用　第一次做給神明跟祖先用　兩個搶先出窯，燒得極美　一定是…",
    preview: "之前做的東西都是給人類用　第一次做給神明跟祖先用",
    dateTime: "2026-10-31",
    dateLabel: "2026年10月31日",
    excerpts: ["第一次做給神明跟祖先用", "一定是先跟窯神打過招呼了吧！", "謝謝老師😆"],
  },
  {
    slug: "november-bottles",
    label: "這週出窯的瓶子們。最喜歡的是第二張照片的瓶子，形狀很棒，肩膀飽滿，口緣微微向外敞…",
    preview: "這週出窯的瓶子們。",
    dateTime: "2026-11-12",
    dateLabel: "2026年11月12日",
    excerpts: ["上半部密集的結晶像是開滿小花", "三個中心", "是不是拉胚前要做個暖身操比較好🤣"],
  },
];
// No published post carries a music link card right now (2022 was hidden on
// 2026-11-19); add one here when a card is published again.
const expectedMusicLinkCards = [];

test("old WordPress URLs publish permanent redirects to their new homes", async () => {
  const redirects = await readRedirects();
  const expectedRedirects = [
    {
      source: "/hello-world",
      destination: "/zh-TW/",
      status: 301,
    },
    {
      source: "/zh-TW/blog/hello-world/",
      destination: "/zh-TW/",
      status: 301,
    },
    { source: "/about", destination: "/zh-TW/#about", status: 301 },
    {
      source: "/zh-TW/about/",
      destination: "/zh-TW/#about",
      status: 301,
    },
    {
      source: "/zh-TW/blog/about/",
      destination: "/zh-TW/#about",
      status: 301,
    },
    { source: "/2022-2", destination: "/zh-TW/", status: 301 },
    {
      source: "/zh-TW/blog/2022/",
      destination: "/zh-TW/",
      status: 301,
    },
    { source: "/covid", destination: "/zh-TW/", status: 301 },
    {
      source: "/zh-TW/blog/covid/",
      destination: "/zh-TW/",
      status: 301,
    },
    { source: "/conservation-of-mass", destination: "/zh-TW/", status: 301 },
    {
      source: "/zh-TW/blog/conservation-of-mass/",
      destination: "/zh-TW/",
      status: 301,
    },
    { source: "/2023-2024", destination: "/zh-TW/", status: 301 },
    {
      source: "/zh-TW/blog/2023-2024/",
      destination: "/zh-TW/",
      status: 301,
    },
    { source: "/2025-2", destination: "/zh-TW/", status: 301 },
    {
      source: "/zh-TW/blog/2025/",
      destination: "/zh-TW/",
      status: 301,
    },
  ];

  for (const expected of expectedRedirects) {
    assert.deepEqual(
      redirects.find(({ source }) => source === expected.source),
      expected,
    );
  }
});

test("each locale publishes a parseable Atom feed at its stable URL", async () => {
  for (const language of ["zh-TW", "en"]) {
    const root = await readAtomFeed(language);

    assert.equal(root.local, "feed");
    assert.equal(root.uri, "http://www.w3.org/2005/Atom");
  }
});

test("locale feeds expose required Atom metadata from the canonical site identity", async () => {
  const expectedFeeds = [
    {
      language: "zh-TW",
      subtitle: "李至青的部落格",
      homeUrl: "https://jhihcing.li/zh-TW/",
      feedUrl: "https://jhihcing.li/zh-TW/atom.xml",
    },
    {
      language: "en",
      subtitle: "Jhih Cing Li's blog",
      homeUrl: "https://jhihcing.li/en/",
      feedUrl: "https://jhihcing.li/en/atom.xml",
    },
  ];

  for (const expected of expectedFeeds) {
    const feed = await readAtomFeed(expected.language);
    const author = requiredAtomChild(feed, "author");
    const selfLink = atomChildren(feed, "link").find(
      (link) => atomAttribute(link, "rel") === "self",
    );
    const alternateLink = atomChildren(feed, "link").find(
      (link) => atomAttribute(link, "rel") === "alternate",
    );

    assert.equal(feed.attributes["xml:lang"]?.value, expected.language);
    assert.equal(requiredAtomText(feed, "title"), SITE.title);
    assert.equal(requiredAtomText(feed, "subtitle"), expected.subtitle);
    assert.equal(requiredAtomText(author, "name"), "Jhih Cing Li");
    assert.equal(requiredAtomText(feed, "id"), expected.feedUrl);
    assert.match(
      requiredAtomText(feed, "updated"),
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/,
    );
    assert.ok(selfLink, "expected one Atom self link");
    assert.equal(atomAttribute(selfLink, "href"), expected.feedUrl);
    assert.equal(atomAttribute(selfLink, "type"), "application/atom+xml");
    assert.ok(alternateLink, "expected one Atom alternate link");
    assert.equal(atomAttribute(alternateLink, "href"), expected.homeUrl);
    assert.equal(atomAttribute(alternateLink, "type"), "text/html");
    assert.equal(atomAttribute(alternateLink, "hreflang"), expected.language);
  }
});

test("locale feeds contain every post in that language and no untranslated posts", async () => {
  const [chineseFeed, englishFeed] = await Promise.all([
    readAtomFeed("zh-TW"),
    readAtomFeed("en"),
  ]);
  const chineseEntries = atomChildren(chineseFeed, "entry");
  const actualPosts = chineseEntries.map((entry) => {
    const published = requiredAtomText(entry, "published");
    const alternateLink = atomChildren(entry, "link").find(
      (link) => atomAttribute(link, "rel") === "alternate",
    );

    assert.match(
      published,
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/,
    );
    const updated = requiredAtomText(entry, "updated");
    assert.ok(updated >= published, "an entry cannot be updated before it was published");
    assert.ok(alternateLink, "expected each Atom entry to have an alternate link");
    assert.equal(atomAttribute(alternateLink, "type"), "text/html");
    assert.equal(atomAttribute(alternateLink, "hreflang"), "zh-TW");

    return {
      title: requiredAtomText(entry, "title"),
      date: published.slice(0, 10),
      updated: updated.slice(0, 10),
      id: requiredAtomText(entry, "id"),
      url: atomAttribute(alternateLink, "href"),
    };
  });
  const expectedFeedPosts = [...expectedPosts]
    .sort((a, b) => b.dateTime.localeCompare(a.dateTime))
    .map((post) => {
      const canonicalUrl = `https://jhihcing.li/zh-TW/blog/${post.slug}/`;

      return {
        title: post.title ?? post.label,
        date: post.dateTime,
        updated: lastUpdated(post),
        id: canonicalUrl,
        url: canonicalUrl,
      };
    });

  assert.deepEqual(actualPosts, expectedFeedPosts);
  assert.equal(atomChildren(englishFeed, "entry").length, 0);
});

test("every locale page discovers only its own Atom feed", async () => {
  const localePages = [
    {
      language: "en",
      pages: [new URL("en/index.html", distDirectory)],
    },
    {
      language: "zh-TW",
      pages: [
        listPage,
        ...expectedPosts.map(
          ({ slug }) =>
            new URL(`zh-TW/blog/${slug}/index.html`, distDirectory),
        ),
      ],
    },
  ];

  for (const locale of localePages) {
    const expectedFeedUrl = `https://jhihcing.li/${locale.language}/atom.xml`;

    for (const page of locale.pages) {
      const html = await readFile(page, "utf8");
      const atomLinks = [...html.matchAll(/<link\b[^>]*>/gi)]
        .map(([link]) => link)
        .filter((link) => /\btype="application\/atom\+xml"/i.test(link));

      assert.equal(atomLinks.length, 1);
      assert.match(atomLinks[0], /\brel="alternate"/i);
      assert.ok(
        atomLinks[0].includes(`title="${escapeHtmlAttribute(SITE.title)}"`),
      );
      assert.ok(atomLinks[0].includes(`href="${expectedFeedUrl}"`));
    }
  }
});

test("an English reader can open the empty English edition", async () => {
  const page = new URL("en/index.html", distDirectory);
  const html = await readFile(page, "utf8");

  assert.match(html, /<html lang="en">/);
  assert.match(html, /<meta name="description" content="Jhih Cing Li's blog">/);
  assert.match(html, /<h1[^>]*>Posts<\/h1>/);
  assert.match(html, /No English posts yet\./);
  assert.doesNotMatch(html, /<ol class="post-list">/);
});

test("readers can switch languages using locale-aware chrome", async () => {
  const [englishList, chineseList, chineseOnlyPost] = await Promise.all([
    readFile(new URL("en/index.html", distDirectory), "utf8"),
    readFile(listPage, "utf8"),
    readFile(new URL("zh-TW/blog/bottles/index.html", distDirectory), "utf8"),
  ]);

  assert.match(englishList, /<nav[^>]*aria-label="Primary navigation"/);
  assert.match(
    englishList,
    /class="language-link"[^>]*href="\/zh-TW\/"[^>]*>繁體中文<\/a>/,
  );
  assert.doesNotMatch(englishList, /class="site-footer"|href="mailto:/);

  assert.doesNotMatch(chineseList, /<header\b|class="language-link"/);
  assert.match(
    chineseList,
    /href="mailto:jcli@pm\.me"[^>]*>\s*<svg class="mail-icon"[\s\S]*?<\/svg>\s*<span>jcli@pm\.me<\/span>\s*<\/a>/,
  );
  assert.match(chineseOnlyPost, /href="\/en\/"[^>]*>English<\/a>/);

  for (const html of [englishList, chineseList, chineseOnlyPost]) {
    const header = html.match(/<header\b[\s\S]*?<\/header>/)?.[0] ?? "";
    assert.doesNotMatch(header, />\s*(?:Posts|文章|關於)\s*</);
  }

  const englishChrome = ["header", "footer"]
    .map((element) => englishList.match(new RegExp(`<${element}\\b[\\s\\S]*?<\\/${element}>`))?.[0] ?? "")
    .join(" ");
  assert.doesNotMatch(englishChrome, /文章|關於|寄信|主要導覽/);

  for (const html of [englishList, chineseList]) {
    assert.doesNotMatch(html, /class="site-footer"/);
  }
});

test("the approved continuous journal structure is semantic across reading surfaces", async () => {
  const [englishList, chineseList, chinesePost] = await Promise.all([
    readFile(new URL("en/index.html", distDirectory), "utf8"),
    readFile(listPage, "utf8"),
    readFile(new URL("zh-TW/blog/bottles/index.html", distDirectory), "utf8"),
  ]);

  assert.doesNotMatch(chineseList, /class="author-signature"/);
  assert.doesNotMatch(chinesePost, /article-stamp|ZH-TW　/);

  for (const html of [englishList, chineseList, chinesePost]) {
    assert.match(html, /<body data-surface="character-proof">/);
    assert.match(html, /direction seed 9062ef67/);
    if (html !== chineseList) {
      // The docked glyph bottle and the name share one home link.
      assert.match(
        html,
        /<a class="site-mark" href="\/(?:zh-TW|en)\/">\s*<span class="bottle-logo"[^>]*aria-hidden="true">[\s\S]*?<\/span>\s*<span class="author-signature">李至青<\/span>\s*<\/a>/,
      );
    }
    assert.doesNotMatch(html, /class="site-title"/);
    assert.match(html, /<main id="main-content">/);
    assert.doesNotMatch(html, /<h1[^>]*>\s*李至青\s*<\/h1>/);
    assert.doesNotMatch(html, /nav-tab/);
  }

  assert.equal(SITE.title, SITE.author.displayName);

  assert.match(
    englishList,
    /<a\b[^>]*class="language-link"[^>]*href="\/zh-TW\/"[^>]*>\s*繁體中文\s*<\/a>/,
  );
  const chineseHomepageHeader = chineseList.match(/<header\b[\s\S]*?<\/header>/)?.[0] ?? "";
  assert.doesNotMatch(chineseHomepageHeader, />\s*文章\s*</);
  assert.doesNotMatch(chineseHomepageHeader, />\s*關於\s*</);
  assert.match(chineseList, /<section class="register-panel diary-feed" aria-labelledby="register-heading">/);
  assert.match(
    chineseList,
    /<h1 id="register-heading" class="visually-hidden">文章<\/h1>/,
  );
  assert.doesNotMatch(
    chineseList,
    /最近更新|5 篇文章|class="register-(?:update|stamp|year)"|ZH-TW　/,
  );
  assert.equal(
    [...chineseList.matchAll(/<article class="diary-entry">/g)].length,
    expectedPosts.length,
  );
  assert.match(
    chineseList,
    /<section id="about" class="about-intro" aria-label="關於">/,
  );
  assert.doesNotMatch(chineseList, /<h[1-6][^>]*>關於(?:這裡)?<\/h[1-6]>/);
  assert.match(
    chineseList,
    /<section id="about"[\s\S]*?<footer class="response-ending">\s*<a class="response-cta" href="mailto:jcli@pm\.me"><svg class="mail-icon"[^>]*aria-hidden="true">[\s\S]*?<\/svg>\s*<span>jcli@pm\.me<\/span>\s*<\/a>\s*<\/footer>\s*<\/div>\s*<\/section>/,
  );
  assert.doesNotMatch(chineseList, /如果有一段文字讓你想起自己/);
  assert.match(
    chineseList,
    /<div class="home-stage">[\s\S]*<div class="creative-coding-area" data-creative-coding-area aria-hidden="true"><\/div>/,
  );
  assert.match(
    chineseList,
    /<div class="home-hero">\s*<div class="home-bottle-slot">\s*<a class="home-bottle" href="\/zh-TW\/" aria-label="首頁"[^>]*>[\s\S]*?<\/a>\s*<\/div>\s*<section id="about"/,
  );
  // The bottle is typed out in glyphs: 21 shaded frames and their 21 solid
  // silhouettes, with no raster sprite shipped.
  const hero = chineseList.match(/<a class="home-bottle"[\s\S]*?<\/a>/)?.[0] ?? "";
  assert.equal([...hero.matchAll(/class="bottle-frame"/g)].length, 42);
  assert.match(hero, /█/);
  assert.doesNotMatch(hero, /<img\b/);
  await assert.rejects(stat(new URL("media/home/bottle-spin.webp", distDirectory)));
  assert.match(chinesePost, /<article class="reading-article">/);
  assert.match(englishList, /<section class="register-panel"/);
});

test("posts mirrored from Threads send responses to the Threads original", async () => {
  const pages = (await walkFiles(distDirectory)).filter((path) =>
    /^(?:zh-TW|en)\/blog\/[^/]+\/index\.html$/.test(path),
  );

  for (const page of pages) {
    const html = await readFile(new URL(page, distDirectory), "utf8");
    const footer = html.match(
      /<article class="reading-article">[\s\S]*?<footer class="response-ending">[\s\S]*?<\/footer>\s*<\/article>/,
    )?.[0];

    assert.ok(footer, `expected a response ending in ${page}`);

    if (/同步發佈在 Threads|Also posted on Threads/.test(footer)) {
      assert.match(
        footer,
        /<a class="response-cta" href="https:\/\/www\.threads\.(?:com|net)\/@[\w.]+\/post\/[\w-]+\/?" target="_blank" rel="noopener noreferrer">\s*<span>(?:在上面和我互動|Talk with me there)<\/span>\s*<svg class="external-link-icon"[^>]*aria-hidden="true">[\s\S]*?<\/svg>\s*<span class="visually-hidden">(?:（另開新分頁）| \(opens in a new tab\))<\/span>\s*<\/a>/,
        `expected a Threads permalink in ${page}`,
      );
      assert.doesNotMatch(footer, /mailto:/, `expected no email prompt in ${page}`);
    } else {
      assert.match(
        footer,
        /<footer class="response-ending"><p>[^<]+<\/p>\s*<a class="response-cta" href="mailto:jcli@pm\.me"><svg class="mail-icon"[\s\S]*?<\/svg>\s*<span>[^<]+<\/span>\s*<\/a>\s*<\/footer>/,
        `expected the email prompt in ${page}`,
      );
    }
  }
});

test("every built file fits Cloudflare Pages' 25 MiB per-file limit", async () => {
  const limit = 25 * 1024 * 1024;

  for (const path of await walkFiles(distDirectory)) {
    const { size } = await stat(new URL(path, distDirectory));

    assert.ok(size < limit, `${path} is ${size} bytes, over the 25 MiB limit`);
  }
});

test("article videos wait for the reader and ship their poster and file", async () => {
  const pages = (await walkFiles(distDirectory)).filter((path) =>
    /^(?:zh-TW|en)\/blog\/[^/]+\/index\.html$/.test(path),
  );

  for (const page of pages) {
    const html = await readFile(new URL(page, distDirectory), "utf8");

    for (const video of html.match(/<video\b[\s\S]*?<\/video>/g) ?? []) {
      const tag = video.match(/<video\b[^>]*>/)[0];

      for (const attribute of [/\bcontrols\b/, /\bplaysinline\b/, /\bpreload="none"/, /\bwidth="\d+"/, /\bheight="\d+"/, /\baria-label="[^"]+"/]) {
        assert.match(tag, attribute, `expected ${attribute} on a video in ${page}`);
      }
      assert.doesNotMatch(tag, /\bautoplay\b/, `expected no autoplay in ${page}`);

      const poster = tag.match(/\bposter="(\/media\/[^"]+\.jpg)"/)?.[1];
      const source = video.match(/<source\b[^>]*\bsrc="(\/media\/[^"]+\.mp4)"[^>]*\btype="video\/mp4"/)?.[1];

      assert.ok(poster, `expected a /media/ poster on a video in ${page}`);
      assert.ok(source, `expected a /media/ MP4 source on a video in ${page}`);

      for (const file of [poster, source]) {
        await assert.doesNotReject(
          stat(new URL(file.slice(1), distDirectory)),
          `expected ${file} in the build for ${page}`,
        );
      }
    }
  }
});

test("drafts and permanent pages never publish as blog posts", async () => {
  for (const slug of [
    "hello-world",
    "conservation-of-mass",
    "about",
    "2022",
    "covid",
    "2023-2024",
    "2025",
  ]) {
    await assert.rejects(
      readFile(
        new URL(`zh-TW/blog/${slug}/index.html`, distDirectory),
        "utf8",
      ),
      (error) => error?.code === "ENOENT",
    );
  }

  await assert.rejects(
    readFile(new URL("zh-TW/about/index.html", distDirectory), "utf8"),
    (error) => error?.code === "ENOENT",
  );
});

test("optimized content images ship a srcset sized to the reading column", async () => {
  const pages = (await walkFiles(distDirectory)).filter((path) =>
    path.endsWith(".html"),
  );

  for (const page of pages) {
    const html = await readFile(new URL(page, distDirectory), "utf8");
    const images = html.match(/<img\b[^>]*\bsrc="\/_astro\/[^"]*"[^>]*>/g) ?? [];

    for (const image of images) {
      const srcset = image.match(/\bsrcset="([^"]*)"/)?.[1] ?? "";

      assert.ok(
        srcset.split(",").filter(Boolean).length >= 1,
        `expected a srcset on ${image} in ${page}`,
      );
      // Feed thumbnails are fixed-height and lightbox photos fill the screen;
      // every other content image sits in the reading column.
      const expectedSizes = /class="diary-photo-image"/.test(image)
        ? "240px"
        : /class="lightbox-image"/.test(image)
          ? "100vw"
          : ARTICLE_IMAGE_SIZES;
      assert.ok(
        image.includes(`sizes="${expectedSizes}"`),
        `expected sizes="${expectedSizes}" on ${image} in ${page}`,
      );
      assert.match(image, /\balt="[^"]+"/, `expected alt text on ${image} in ${page}`);
    }
  }
});

test("music link cards expose only verified outbound provider choices", async () => {
  for (const expected of expectedMusicLinkCards) {
    const html = await readFile(
      new URL(`zh-TW/blog/${expected.slug}/index.html`, distDirectory),
      "utf8",
    );
    const card = html.match(
      /<aside class="music-link-card"[\s\S]*?<\/aside>/,
    )?.[0];

    assert.ok(card, `expected a music link card on ${expected.slug}`);
    assert.ok(card.includes(expected.name));
    assert.ok(card.includes(expected.performer));
    assert.doesNotMatch(card, /<(?:iframe|img|script)\b/i);

    let previousProviderIndex = -1;

    for (const [provider, url] of expected.providers) {
      const link = card.match(
        new RegExp(`<a\\b[^>]*href="${escapeForRegex(url)}"[^>]*>[\\s\\S]*?<\\/a>`),
      )?.[0];

      assert.ok(link, `expected ${provider} on ${expected.slug}`);
      assert.match(link, /target="_blank"/);
      assert.match(link, /rel="noopener noreferrer"/);
      assert.match(link, /class="external-link-icon"[^>]*aria-hidden="true"/);
      assert.match(link, /另開新分頁/);

      const providerIndex = card.indexOf(`>${provider}</span>`);
      assert.ok(providerIndex > previousProviderIndex);
      previousProviderIndex = providerIndex;
    }
  }

  const unrelatedPost = await readFile(
    new URL("zh-TW/blog/bottles/index.html", distDirectory),
    "utf8",
  );
  assert.doesNotMatch(unrelatedPost, /class="music-link-card"/);
});

test("post pages progressively enhance with the vanilla likes control", async () => {
  for (const post of expectedPosts) {
    const html = await readFile(
      new URL(`zh-TW/blog/${post.slug}/index.html`, distDirectory),
      "utf8",
    );

    assert.match(html, /<div class="post-likes" data-post-likes hidden>/);
    assert.match(html, /<button type="button"[^>]*data-like-button/);
    assert.match(html, /<output[^>]*data-like-count[^>]*>0<\/output>/);
    assert.match(html, /<script src="\/likes\.js" defer><\/script>/);
    assert.doesNotMatch(html, /astro-island|astro-slot|data-astro-cid/);
  }
});

test("hreflang alternates appear only for pages with a translated counterpart", async () => {
  const [englishList, chineseList, chineseOnlyPost] = await Promise.all([
    readFile(new URL("en/index.html", distDirectory), "utf8"),
    readFile(listPage, "utf8"),
    readFile(new URL("zh-TW/blog/bottles/index.html", distDirectory), "utf8"),
  ]);
  const listAlternates = [
    '<link rel="alternate" hreflang="zh-TW" href="https://jhihcing.li/zh-TW/">',
    '<link rel="alternate" hreflang="en" href="https://jhihcing.li/en/">',
  ];

  for (const alternate of listAlternates) {
    assert.ok(chineseList.includes(alternate));
    assert.ok(englishList.includes(alternate));
  }

  assert.doesNotMatch(chineseOnlyPost, /hreflang=/);
});

test("the root route redirects readers by their preferred supported language", async () => {
  const { onRequest } = await import("../functions/index.js");
  const cases = [
    {
      acceptLanguage: "zh-TW,zh;q=0.9,en;q=0.8",
      location: "https://jhihcing.li/zh-TW/",
    },
    {
      acceptLanguage: "en-US,en;q=0.9,zh-TW;q=0.8",
      location: "https://jhihcing.li/en/",
    },
    {
      acceptLanguage: "fr-FR,fr;q=0.9",
      location: "https://jhihcing.li/en/",
    },
    {
      acceptLanguage: "zh-TW;Q=0,en;q=1",
      location: "https://jhihcing.li/en/",
    },
    {
      acceptLanguage: "en;q=0,*;q=1,zh;q=0.5",
      location: "https://jhihcing.li/zh-TW/",
    },
    {
      acceptLanguage: null,
      location: "https://jhihcing.li/en/",
    },
  ];

  for (const { acceptLanguage, location } of cases) {
    const headers = acceptLanguage
      ? { "Accept-Language": acceptLanguage }
      : undefined;
    const request = new Request("https://jhihcing.li/", { headers });
    const response = onRequest({ request });

    assert.equal(response.status, 302);
    assert.equal(response.headers.get("Location"), location);
    assert.equal(response.headers.get("Vary"), "Accept-Language");
  }
});

for (const post of expectedPosts) {
  test(`a reader can read the complete ${post.title ?? post.slug} post`, async () => {
    const route = `/zh-TW/blog/${post.slug}/`;
    const page = new URL(`${route.slice(1)}index.html`, distDirectory);
    const [listHtml, html] = await Promise.all([
      readFile(listPage, "utf8"),
      readFile(page, "utf8"),
    ]);

    // The homepage feed dates each entry as YYYY/MM/DD and links it.
    assert.match(
      listHtml,
      new RegExp(
        `<a href="${escapeForRegex(route)}"><time datetime="${post.dateTime}">${post.dateTime.replaceAll("-", "/")}</time></a>`,
      ),
    );

    if (post.title) {
      assert.ok(listHtml.includes(`<p class="diary-title">${post.title}</p>`));
      assert.match(
        html,
        new RegExp(`<h1[^>]*>${escapeForRegex(post.title)}</h1>`),
      );
    } else {
      // The feed shows the post's own text; the article has no visible title.
      const feedText = listHtml.replace(/<[^>]+>/g, "").replace(/\s+/g, "");
      assert.ok(
        feedText.includes(post.preview.replace(/\s+/g, "")),
        `expected ${post.slug} text in the feed`,
      );
      assert.match(
        html,
        new RegExp(`<h1 class="visually-hidden">${escapeForRegex(post.label)}</h1>`),
      );
      assert.match(
        html,
        new RegExp(`<title>${escapeForRegex(post.label)}　`),
      );
    }
    assert.match(html, /<html lang="zh-TW">/);
    assert.match(
      html,
      new RegExp(`datetime="${post.dateTime}"[^>]*>${post.dateTime.replaceAll("-", "/")}</time>`),
    );

    for (const excerpt of post.excerpts) {
      assert.ok(
        html.includes(excerpt),
        `missing content from ${post.title}: ${excerpt}`,
      );
    }

    assert.ok(
      html.includes(`<link rel="canonical" href="https://jhihcing.li${route}">`),
    );
    assert.match(html, /<meta name="author" content="Jhih Cing Li">/);
  });
}

test("the zh-TW homepage introduces the writer before the article register", async () => {
  const html = await readFile(listPage, "utf8");

  assert.match(html, /<html lang="zh-TW">/);
  assert.match(html, /<section id="about" class="about-intro" aria-label="關於">/);
  assert.match(
    html,
    /<div class="about-copy">\s*<p>嗨，我是至青。我喜歡捏陶跟做網站，歡迎來到我的做陶日記 :\)<\/p>\s*<\/div>/,
  );
  assert.doesNotMatch(html, /Jhih Cing, Li|現居高雄/);
  assert.doesNotMatch(html, /<header\b/);
  assert.match(html, /href="mailto:jcli@pm\.me"[^>]*>\s*<svg class="mail-icon"[\s\S]*?<\/svg>\s*<span>jcli@pm\.me<\/span>\s*<\/a>/);
  assert.ok(html.indexOf('id="about"') < html.indexOf('class="register-panel'));
});

test("the zh-TW homepage is a diary feed, newest entry first, with lightbox photos", async () => {
  const html = await readFile(listPage, "utf8");
  const entries = [...html.matchAll(/<article class="diary-entry">[\s\S]*?<\/article>/g)].map(
    ([entry]) => entry,
  );
  const actual = entries.map((entry) => ({
    slug: entry.match(/href="\/zh-TW\/blog\/([^/]+)\/"/)?.[1],
    dateTime: entry.match(/datetime="([^"]+)"/)?.[1],
  }));
  const expected = [...expectedPosts]
    .sort((a, b) => b.dateTime.localeCompare(a.dateTime))
    .map((post) => ({ slug: post.slug, dateTime: post.dateTime }));

  assert.deepEqual(actual, expected);

  for (const [index, entry] of entries.entries()) {
    assert.match(entry, /<h2 class="diary-date">/);
    assert.match(entry, /<div class="diary-text">/);
    // Entries are numbered as making steps, oldest first.
    const step = String(entries.length - index).padStart(2, "0");
    assert.match(entry, new RegExp(`<p class="diary-step"><span class="visually-hidden">步驟 </span>${step}</p>`));

    // Every thumbnail carries its typed glyph rendering for the develop effect.
    assert.equal(
      entry.match(/class="diary-photo-ascii" aria-hidden="true"/g)?.length ?? 0,
      entry.match(/class="diary-photo"/g)?.length ?? 0,
    );

    // Each thumbnail opens its own native popover lightbox; no script needed.
    const triggers = [...entry.matchAll(/<button type="button" class="diary-photo" popovertarget="([^"]+)"/g)].map(([, id]) => id);
    for (const id of triggers) {
      assert.match(entry, new RegExp(`<div id="${id}" class="lightbox" popover>`));
      assert.match(entry, new RegExp(`popovertarget="${id}" popovertargetaction="hide"`));
    }
  }

  const photoCount = (slug) =>
    entries.find((entry) => entry.includes(`/zh-TW/blog/${slug}/`))
      ?.match(/class="diary-photo"/g)?.length ?? 0;
  assert.equal(photoCount("november-bottles"), 5);
  assert.equal(photoCount("offering-cups"), 2);

  // The dev-only date-font panel and its web fonts never ship.
  assert.doesNotMatch(html, /font-panel|fonts\.googleapis/);
});

test("the zh-TW homepage shows a now note only when it is published and has content", async () => {
  const html = await readFile(listPage, "utf8");
  const nowSource = new URL("../src/content/posts/zh-TW/now.md", import.meta.url);
  const nowText = await readFile(nowSource, "utf8").catch(() => null);
  const nowBody = nowText?.replace(/^---\r?\n[\s\S]*?\r?\n---/, "").replace(/<!--[\s\S]*?-->/g, "");
  const hasNow =
    nowText !== null &&
    !/^published:\s*false\s*$/m.test(nowText) &&
    nowBody.trim() !== "";

  if (!hasNow) {
    assert.doesNotMatch(html, /id="now"/);
    return;
  }

  assert.match(html, /<section id="now" class="now-note" aria-label="現在">/);
  assert.ok(html.indexOf('id="about"') < html.indexOf('id="now"'));
  assert.ok(html.indexOf('id="now"') < html.indexOf('class="register-panel'));
  assert.doesNotMatch(html, /<a href="\/zh-TW\/blog\/now\/"/);
});

test("content pages request neither webfonts nor Astro runtime JavaScript", async () => {
  const contentPages = [
    listPage,
    new URL("en/index.html", distDirectory),
    ...expectedPosts.map(
      ({ slug }) => new URL(`zh-TW/blog/${slug}/index.html`, distDirectory),
    ),
  ];
  const [contentHtml, outputFiles] = await Promise.all([
    Promise.all(contentPages.map((page) => readFile(page, "utf8"))),
    walkFiles(distDirectory),
  ]);

  for (const [index, html] of contentHtml.entries()) {
    const scripts = [...html.matchAll(/<script\b[^>]*>/gi)].map(([tag]) => tag);
    if (index < 2) {
      assert.deepEqual(scripts, []);
    } else {
      assert.deepEqual(scripts, ['<script src="/likes.js" defer>']);
    }
    assert.doesNotMatch(html, forbiddenFontRule);
    assert.doesNotMatch(
      html,
      /<link\b[^>]*href="[^"]+\.(?:woff2?|ttf|otf|eot)(?:\?[^"]*)?"/i,
    );

    for (const link of html.matchAll(/<link\b[^>]*>/gi)) {
      if (/\brel="stylesheet"/i.test(link[0])) {
        assert.doesNotMatch(link[0], /\bhref="https?:\/\//i);
      }
    }
  }

  assert.deepEqual(
    outputFiles.filter((file) => /\.(?:woff2?|ttf|otf|eot)$/i.test(file)),
    [],
  );

  const stylesheets = outputFiles.filter((file) => file.endsWith(".css"));
  for (const stylesheet of stylesheets) {
    const css = await readFile(new URL(stylesheet, distDirectory), "utf8");
    assert.doesNotMatch(css, forbiddenFontRule);
  }
});

test("the compact frameless content contract stays within its confirmed limits", async () => {
  const css = await readFile(
    new URL("../src/styles/global.css", import.meta.url),
    "utf8",
  );
  const fontSizeDeclarations = [
    ...css.matchAll(/font-size:\s*([^;]+);/g),
  ];

  for (const [, declaration] of fontSizeDeclarations) {
    for (const [, size] of declaration.matchAll(/([\d.]+)rem/g)) {
      assert.ok(
        Number(size) <= 1.5,
        `font-size exceeds 1.5rem: ${declaration.trim()}`,
      );
    }
  }

  for (const selector of [
    ".site-header",
    ".about-intro",
    ".response-ending",
    ".register-panel",
    ".now-note",
    ".post-list-item",
    ".empty-register",
    ".post-header",
    ".post-body blockquote",
    ".creative-coding-area",
  ]) {
    const rule = css.match(
      new RegExp(`${escapeForRegex(selector)}\\s*\\{([^}]*)\\}`),
    );

    assert.ok(rule, `expected a CSS rule for ${selector}`);
    assert.doesNotMatch(
      rule[1],
      /\bborder(?:-(?:top|right|bottom|left|block|inline))?\s*:/,
      `${selector} must not use a divider border`,
    );
  }

  const signatureRule = css.match(/\.author-signature\s*\{([^}]*)\}/);
  assert.ok(signatureRule, "expected a CSS rule for the site signature");
  assert.match(signatureRule[1], /font-weight:\s*400;/);
  assert.match(signatureRule[1], /letter-spacing:\s*0\.08em;/);

  const linkRule = css.match(/^a\s*\{([^}]*)\}/m);
  assert.ok(linkRule, "expected a global link rule");
  assert.match(linkRule[1], /text-decoration:\s*none;/);

  const languageRule = css.match(/\.language-link\s*\{([^}]*)\}/);
  assert.ok(languageRule, "expected a CSS rule for the language utility");
  assert.match(languageRule[1], /font-weight:\s*400;/);
  assert.match(languageRule[1], /letter-spacing:\s*normal;/);

  const chineseDocumentRule = css.match(/html:lang\(zh-TW\)\s*\{([^}]*)\}/);
  assert.ok(chineseDocumentRule, "expected zh-TW line-breaking guidance");
  assert.match(chineseDocumentRule[1], /line-break:\s*strict;/);

  const previewRule = css.match(/\.post-list-item a\.post-list-preview\s*\{([^}]*)\}/);
  assert.ok(previewRule, "expected a CSS rule for untitled post previews");
  assert.match(previewRule[1], /white-space:\s*nowrap;/);
  assert.match(previewRule[1], /text-overflow:\s*ellipsis;/);

  const articleTitleRule = css.match(/\.post-header h1\s*\{([^}]*)\}/);
  assert.ok(articleTitleRule, "expected a CSS rule for article titles");
  assert.match(articleTitleRule[1], /letter-spacing:\s*normal;/);
  assert.doesNotMatch(
    articleTitleRule[1],
    /font-weight:/,
    "article titles must retain their native authored emphasis",
  );

  for (const selector of [
    ".about-copy h2",
    ".music-link-card__work",
    ".music-link-card__providers a",
    ".response-cta",
  ]) {
    const rule = css.match(
      new RegExp(`${escapeForRegex(selector)}\\s*\\{([^}]*)\\}`),
    );

    assert.ok(rule, `expected a CSS rule for ${selector}`);
    assert.match(
      rule[1],
      /font-weight:\s*400;/,
      `${selector} must remain regular weight outside authored article content`,
    );
  }

  const openingRule = css.match(/\.about-copy\s*>\s*p:first-child\s*\{([^}]*)\}/);
  assert.ok(openingRule, "expected a CSS rule for the introduction opening");
  assert.match(openingRule[1], /font-weight:\s*400;/);
});

function escapeForRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeHtmlText(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeHtmlAttribute(value) {
  return escapeHtmlText(value).replaceAll('"', "&quot;");
}

async function readAtomFeed(language) {
  const xml = await readFile(
    new URL(`${language}/atom.xml`, distDirectory),
    "utf8",
  );
  return parseAtom(xml);
}

function parseAtom(xml) {
  const parser = sax.parser(true, { xmlns: true });
  let root;
  const stack = [];

  parser.onopentag = (node) => {
    const element = {
      local: node.local,
      uri: node.uri,
      attributes: node.attributes,
      children: [],
      text: "",
    };
    const parent = stack.at(-1);

    if (parent) {
      parent.children.push(element);
    } else {
      root = element;
    }
    stack.push(element);
  };
  parser.ontext = (text) => {
    const current = stack.at(-1);
    if (current) {
      current.text += text;
    }
  };
  parser.onclosetag = () => {
    stack.pop();
  };
  parser.write(xml).close();

  assert.ok(root, "expected the feed XML to have a root element");
  return root;
}

function atomChildren(element, localName) {
  return element.children.filter(
    (child) =>
      child.local === localName && child.uri === "http://www.w3.org/2005/Atom",
  );
}

function requiredAtomChild(element, localName) {
  const children = atomChildren(element, localName);
  assert.equal(children.length, 1, `expected exactly one Atom ${localName}`);
  return children[0];
}

function requiredAtomText(element, localName) {
  const text = requiredAtomChild(element, localName).text.trim();
  assert.notEqual(text, "", `expected Atom ${localName} to have text`);
  return text;
}

function atomAttribute(element, localName) {
  return Object.values(element.attributes).find(
    (attribute) => attribute.local === localName && attribute.uri === "",
  )?.value;
}

async function walkFiles(directoryUrl, relativeDirectory = "") {
  const entries = await readdir(directoryUrl, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relativePath = join(relativeDirectory, entry.name);

    if (entry.isDirectory()) {
      files.push(
        ...(await walkFiles(new URL(`${entry.name}/`, directoryUrl), relativePath)),
      );
    } else {
      files.push(relativePath);
    }
  }

  return files;
}

async function readRedirects() {
  const contents = await readFile(new URL("_redirects", distDirectory), "utf8");

  return contents
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const [source, destination, status] = line.split(/\s+/);
      return { source, destination, status: Number(status) };
    });
}
