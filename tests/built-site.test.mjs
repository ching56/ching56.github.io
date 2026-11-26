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

test("the chrome carries no language switch; editions link only through hreflang", async () => {
  const [englishList, chineseList, chineseOnlyPost] = await Promise.all([
    readFile(new URL("en/index.html", distDirectory), "utf8"),
    readFile(listPage, "utf8"),
    readFile(new URL("zh-TW/blog/bottles/index.html", distDirectory), "utf8"),
  ]);

  // There is no visible language switch; the editions link through hreflang.
  assert.doesNotMatch(englishList, /class="language-link"/);
  assert.doesNotMatch(englishList, /class="site-footer"|href="mailto:/);

  assert.doesNotMatch(chineseList, /<header\b|class="language-link"/);
  assert.match(
    chineseList,
    /href="mailto:jcli@pm\.me"[^>]*>\s*<svg class="mail-icon"[\s\S]*?<\/svg>\s*<span>jcli@pm\.me<\/span>\s*<\/a>/,
  );
  assert.doesNotMatch(chineseOnlyPost, /class="language-link"|>English<\/a>/);

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
      // The header is a breadcrumb: the bottle silhouette alone links home.
      assert.match(
        html,
        /<nav class="site-identity" aria-label="(?:目前位置|You are here)">\s*<ol class="site-crumbs">\s*<li>\s*<a class="site-mark" href="\/(?:zh-TW|en)\/" aria-label="(?:首頁|Home)">\s*<span class="bottle-logo" style="--mark:url\(\/_astro\/bottle-mark\.[^)]+\.webp\)" aria-hidden="true"><\/span>\s*<\/a>\s*<\/li>/,
      );
      assert.doesNotMatch(html, /class="author-signature"/);
      // The header holds only the bottle for now.
      assert.doesNotMatch(html, /class="site-crumb"/);
    }
    assert.doesNotMatch(html, /class="site-title"/);
    assert.match(html, /<main id="main-content">/);
    assert.doesNotMatch(html, /<h1[^>]*>\s*李至青\s*<\/h1>/);
    assert.doesNotMatch(html, /nav-tab/);
  }

  assert.equal(SITE.title, SITE.author.displayName);

  assert.doesNotMatch(englishList, /class="language-link"/);
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
    // Wrapped in Cloudflare's email_off markers so Email Address Obfuscation
    // never swaps the address for "[email protected]".
    /<section id="about"[\s\S]*?<!--email_off--><footer class="response-ending">\s*<a class="response-cta" href="mailto:jcli@pm\.me"><svg class="mail-icon"[^>]*aria-hidden="true">[\s\S]*?<\/svg>\s*<span>jcli@pm\.me<\/span>\s*<\/a>\s*<\/footer><!--\/email_off-->\s*<\/div>\s*<\/section>/,
  );
  assert.doesNotMatch(chineseList, /如果有一段文字讓你想起自己/);
  assert.match(
    chineseList,
    /<div class="home-stage">[\s\S]*<div class="creative-coding-area" data-creative-coding-area aria-hidden="true"><\/div>/,
  );
  assert.match(
    chineseList,
    /<div class="home-hero">\s*<div class="home-bottle-slot">\s*<a class="home-bottle" href="\/zh-TW\/" aria-label="首頁"[^>]*>[\s\S]*?<\/a>\s*<script>[\s\S]*?<\/script>\s*<\/div>\s*<section id="about"/,
  );
  // The hero shows the real bottle photo (the fingerprinted turntable sprite),
  // which turns once and darkens into its ink silhouette as it docks, lying
  // on its side, into the header ("1 橫躺").
  const hero = chineseList.match(/<a class="home-bottle"[\s\S]*?<\/a>/)?.[0] ?? "";
  assert.doesNotMatch(hero, /█|bottle-frame/);
  assert.match(hero, /<span class="bottle-silhouette" aria-hidden="true"><\/span>/);
  // Wide screens and phones each get their own turntable sprite, sized for
  // the small resting bottle.
  const sprite = hero.match(/--sprite-large:url\((\/_astro\/bottle-spin\.[^.)]+\.webp)\)/)?.[1];
  const smallSprite = hero.match(/--sprite-small:url\((\/_astro\/bottle-spin-small\.[^.)]+\.webp)\)/)?.[1];
  assert.ok(sprite, "expected the hero to reference the wide-screen sprite");
  assert.ok(smallSprite, "expected the hero to reference the phone sprite");
  assert.match(hero, /<span class="bottle-photo" aria-hidden="true"><\/span>/);
  // At rest the hero shows a still of the first frame, fetched first, in a
  // width that suits the screen.
  const stillTag = hero.match(/<img\b[^>]*class="bottle-still"[^>]*>/)?.[0] ?? "";
  assert.match(stillTag, /fetchpriority="high"/);
  assert.match(stillTag, /\salt(?:="")?[\s>]/);
  const still = stillTag.match(/\bsrc="(\/_astro\/[^"]+)"/)?.[1];
  assert.ok(still, "expected the hero to show the high-resolution still");
  assert.match(stillTag, /\bsrcset="[^"]*160w[^"]*264w[^"]*400w"/);
  await stat(new URL(still.slice(1), distDirectory));
  for (const file of [sprite, smallSprite]) {
    const { size } = await stat(new URL(file.slice(1), distDirectory));
    assert.ok(size < 500 * 1024, `expected ${file} under 500 KB, got ${size}`);
  }
  const { size: smallSize } = await stat(new URL(smallSprite.slice(1), distDirectory));
  assert.ok(smallSize < 200 * 1024, `expected the phone sprite under 200 KB, got ${smallSize}`);
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
      // One bracketed link, no prompt line: [ 同步發佈在 Threads ↗ ].
      assert.match(
        footer,
        /<footer class="response-ending">\s*<a class="response-cta" href="https:\/\/www\.threads\.(?:com|net)\/@[\w.]+\/post\/[\w-]+\/?" target="_blank" rel="noopener noreferrer">\s*<span>(?:同步發佈在 Threads|Also posted on Threads)<\/span>\s*<svg class="external-link-icon"[^>]*aria-hidden="true">[\s\S]*?<\/svg>\s*<span class="visually-hidden">(?:（另開新分頁）| \(opens in a new tab\))<\/span>\s*<\/a>/,
        `expected a Threads permalink in ${page}`,
      );
      assert.doesNotMatch(footer, /mailto:|在上面和我互動|Talk with me there/, `expected no email prompt in ${page}`);
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
      // The hero bottle is decorative (its link carries the label) and is
      // sized by the screen's height.
      if (/class="bottle-still"/.test(image)) continue;
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

test("no page advertises an hreflang alternate while English is parked", async () => {
  const [englishList, chineseList, chineseOnlyPost] = await Promise.all([
    readFile(new URL("en/index.html", distDirectory), "utf8"),
    readFile(listPage, "utf8"),
    readFile(new URL("zh-TW/blog/bottles/index.html", distDirectory), "utf8"),
  ]);

  for (const html of [englishList, chineseList, chineseOnlyPost]) {
    assert.doesNotMatch(html, /hreflang=/);
  }
});

test("the root route sends every reader to the zh-TW home", async () => {
  const { onRequest } = await import("../functions/index.js");

  for (const acceptLanguage of ["zh-TW,zh;q=0.9", "en-US,en;q=0.9", null]) {
    const headers = acceptLanguage ? { "Accept-Language": acceptLanguage } : undefined;
    const response = onRequest({ request: new Request("https://jhihcing.li/", { headers }) });

    assert.equal(response.status, 302);
    assert.equal(response.headers.get("Location"), "https://jhihcing.li/zh-TW/");
  }
});

test("builds never ship the dev-only ?probe motion recorder", async () => {
  const html = await readFile(listPage, "utf8");

  assert.doesNotMatch(html, /__probe|motion-probe/);
});

test("the parked English edition redirects to the zh-TW home", async () => {
  const redirects = await readFile(new URL("_redirects", distDirectory), "utf8");

  assert.match(redirects, /^\/en \/zh-TW\/ 302$/m);
  assert.match(redirects, /^\/en\/\* \/zh-TW\/ 302$/m);
});

test("a wrongly cased /zh-tw/ path redirects to /zh-TW/ and the real one passes", async () => {
  const { onRequest } = await import("../functions/zh-tw/[[path]].js");
  const next = () => new Response("page");
  const cases = [
    ["https://jhihcing.li/zh-tw/", "https://jhihcing.li/zh-TW/"],
    ["https://jhihcing.li/zh-tw", "https://jhihcing.li/zh-TW/"],
    ["https://jhihcing.li/ZH-TW/blog/bottles/?a=1", "https://jhihcing.li/zh-TW/blog/bottles/?a=1"],
  ];

  for (const [from, to] of cases) {
    const response = onRequest({ request: new Request(from), next });
    assert.equal(response.status, 301);
    assert.equal(response.headers.get("Location"), to);
  }

  const passed = onRequest({ request: new Request("https://jhihcing.li/zh-TW/blog/bottles/"), next });
  assert.equal(await passed.text(), "page");
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

  for (const entry of entries) {
    assert.match(entry, /<h2 class="diary-date">/);
    assert.match(entry, /<div class="diary-text">/);
    // Entries carry no index; the date alone heads each one.
    assert.doesNotMatch(entry, /diary-step/);

    // Thumbnails are plain photographs, with no character-art overlay.
    assert.doesNotMatch(entry, /diary-photo-ascii|glyph-photo/);

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

test("only the bottle moves across pages, and the page itself never fades", async () => {
  // The site's own stylesheets (public/css holds unreferenced Eleventy-era files).
  const stylesheets = (await walkFiles(distDirectory)).filter(
    (file) => file.includes("_astro/") && file.endsWith(".css"),
  );
  const css = (
    await Promise.all(stylesheets.map((file) => readFile(new URL(file, distDirectory), "utf8")))
  ).join("\n");
  assert.match(css, /@view-transition\s*\{\s*navigation:\s*auto/);
  assert.match(css, /view-transition-name:\s*bottle/);
  // Only the hero bottle is named; a lone mark (home docked) does not move.
  assert.match(css, /html\[data-bottle=hero\] \.home-bottle\{view-transition-name:bottle\}/);
  assert.doesNotMatch(css, /(?:^|[,}])\.home-bottle\{view-transition-name/);
  assert.match(css, /::view-transition-old\(bottle\):only-child,::view-transition-new\(bottle\):only-child\{animation:none\}/);
  assert.match(css, /::view-transition-old\(root\),\s*::view-transition-new\(root\)[^{]*\{\s*animation:\s*none/);
});

test("every page offers a back-to-top link that appears a screen down", async () => {
  const pages = [listPage, new URL("en/index.html", distDirectory), new URL("zh-TW/blog/bottles/index.html", distDirectory)];
  for (const page of pages) {
    const html = await readFile(page, "utf8");
    assert.match(html, /<a class="to-top" href="#top" aria-label="(?:回到頂端|Back to top)">↑<\/a>/);
  }
  const stylesheets = (await walkFiles(distDirectory)).filter((file) => file.endsWith(".css"));
  const css = (
    await Promise.all(stylesheets.map((file) => readFile(new URL(file, distDirectory), "utf8")))
  ).join("\n");
  assert.match(css, /animation-name:to-top-in/);
});

test("content pages load no external webfonts or Astro runtime JavaScript beyond the bottle loader", async () => {
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
    if (index === 0) {
      // The zh-TW home has one small inline script, the bottle's state
      // machines: place (hero/docked -> data-bottle), motion (still/live ->
      // data-bottle-motion) and the sprite loader (-> data-spin="ready",
      // never on Save-Data, 2G or after 8s). A head script seeds place and
      // motion before the first frame: docked and still only on a return to
      // a home history entry left docked (history.state.bottle), so the restore never
      // replays the move; otherwise hero and live, so the first scroll from
      // the top plays it however it scrolls. The body script runs them.
      assert.deepEqual(scripts, ["<script>", "<script>"]);
      const [headScript, script] = [...html.matchAll(/<script>[\s\S]*?<\/script>/g)].map(([s]) => s);
      assert.ok(html.indexOf(headScript) < html.indexOf("</head>"), "expected the seed script in <head>");
      assert.match(headScript, /history\.state/);
      assert.match(headScript, /bottleMotion/);
      assert.match(headScript, /"live"/);
      assert.ok(headScript.length < 1024, `expected the head script under 1 KB, got ${headScript.length}`);
      assert.match(script, /\.spin="ready"/);
      assert.match(script, /docked/);
      assert.match(script, /replaceState/);
      assert.ok(script.length < 3072, `expected the inline script under 3 KB, got ${script.length}`);
    } else if (index === 1) {
      assert.deepEqual(scripts, []);
    } else {
      // Posts: the header mark's go-back script, then the likes script.
      assert.deepEqual(scripts, ["<script>", '<script src="/likes.js" defer>']);
      const [inline] = html.match(/<script>[\s\S]*?<\/script>/);
      assert.match(inline, /history\.back\(\)/);
      assert.ok(inline.length < 1024, `expected the mark script under 1 KB, got ${inline.length}`);
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

  // System faces only: no font files and no @font-face.
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

test("scroll-driven animations survive minification as longhands", async () => {
  // Minifiers can fold animation-timeline into the animation shorthand, which
  // browsers reject, silently freezing the bottle.
  const stylesheets = (await walkFiles(distDirectory)).filter((file) => file.endsWith(".css"));
  const css = (
    await Promise.all(stylesheets.map((file) => readFile(new URL(file, distDirectory), "utf8")))
  ).join("\n");

  assert.doesNotMatch(css, /animation:[^;}]*scroll\(/);
  for (const timeline of ["scroll(root)"]) {
    assert.ok(css.includes(`animation-timeline:${timeline}`), `expected animation-timeline:${timeline}`);
  }
  // Past the threshold the home bottle docks as the header mark, lying on
  // its side ("1 橫躺"), on a strip of paper.
  assert.match(css, /animation-name:dock-flag/);
  assert.match(css, /@keyframes dock-flag/);
  assert.match(css, /--logo-rotate:-90deg/);
});

test("the compact frameless content contract stays within its confirmed limits", async () => {
  // global.css imports ordered partials; read them all, in import order.
  const stylesDirectory = new URL("../src/styles/", import.meta.url);
  const entry = await readFile(new URL("global.css", stylesDirectory), "utf8");
  const partials = [...entry.matchAll(/@import "\.\/([\w-]+\.css)";/g)].map(([, file]) => file);
  assert.ok(partials.length > 0, "expected global.css to import its partials");
  const css = (
    await Promise.all(partials.map((file) => readFile(new URL(file, stylesDirectory), "utf8")))
  ).join("\n");
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

  // The header holds only the bottle: no name, no crumb trail.
  assert.doesNotMatch(css, /\.author-signature|\.site-crumb\b/);

  const linkRule = css.match(/^a\s*\{([^}]*)\}/m);
  assert.ok(linkRule, "expected a global link rule");
  assert.match(linkRule[1], /text-decoration:\s*none;/);


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
