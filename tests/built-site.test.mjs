import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";
import sax from "sax";

import { SITE } from "../src/config/site.js";
import { ARTICLE_IMAGE_SIZES } from "../src/lib/article-image-sizes.mjs";

const distDirectory = new URL("../dist/", import.meta.url);
const listPage = new URL("zh-TW/index.html", distDirectory);
const forbiddenFontRule = /@font-face|@import\s+(?:url\s*\()?/i;
const expectedPosts = [
  {
    slug: "2022",
    title: "2022",
    dateTime: "2023-01-02",
    dateLabel: "2023年1月2日",
    excerpts: [
      "《進入下一層新的夢之前》",
      "每一個平靜踏實的當下，才能好好地抵達未來",
      "才能不負幸運",
    ],
  },
  {
    slug: "covid",
    title: "確診",
    dateTime: "2023-01-13",
    dateLabel: "2023年1月13日",
    excerpts: ["第零天", "告訴我晚上可以解隔了", "孤單才是錯覺吧"],
  },
  {
    slug: "2023-2024",
    title: "2023 ~ 2024",
    dateTime: "2024-12-22",
    dateLabel: "2024年12月22日",
    excerpts: [
      "我追求完美同時接受自己有限",
      "不可能的事情一直發生",
      "我滿意現在的生活",
    ],
  },
  {
    slug: "2025",
    title: "2025",
    dateTime: "2026-01-01",
    dateLabel: "2026年1月1日",
    excerpts: ["開始學做茶壺", "Mew 的 farewell", "照顧好自己才能照顧別人"],
  },
];

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
    { source: "/2022-2", destination: "/zh-TW/blog/2022/", status: 301 },
    { source: "/covid", destination: "/zh-TW/blog/covid/", status: 301 },
    {
      source: "/conservation-of-mass",
      destination: "/zh-TW/",
      status: 301,
    },
    {
      source: "/zh-TW/blog/conservation-of-mass/",
      destination: "/zh-TW/",
      status: 301,
    },
    {
      source: "/2023-2024",
      destination: "/zh-TW/blog/2023-2024/",
      status: 301,
    },
    { source: "/2025-2", destination: "/zh-TW/blog/2025/", status: 301 },
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
    assert.equal(requiredAtomText(entry, "updated"), published);
    assert.ok(alternateLink, "expected each Atom entry to have an alternate link");
    assert.equal(atomAttribute(alternateLink, "type"), "text/html");
    assert.equal(atomAttribute(alternateLink, "hreflang"), "zh-TW");

    return {
      title: requiredAtomText(entry, "title"),
      date: published.slice(0, 10),
      id: requiredAtomText(entry, "id"),
      url: atomAttribute(alternateLink, "href"),
    };
  });
  const expectedFeedPosts = [...expectedPosts]
    .sort((a, b) => b.dateTime.localeCompare(a.dateTime))
    .map((post) => {
      const canonicalUrl = `https://jhihcing.li/zh-TW/blog/${post.slug}/`;

      return {
        title: post.title,
        date: post.dateTime,
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

test("readers can navigate and switch languages using locale-aware chrome", async () => {
  const [englishList, chineseList, chineseOnlyPost] = await Promise.all([
    readFile(new URL("en/index.html", distDirectory), "utf8"),
    readFile(listPage, "utf8"),
    readFile(new URL("zh-TW/blog/covid/index.html", distDirectory), "utf8"),
  ]);

  assert.match(englishList, /<nav[^>]*aria-label="Primary navigation"/);
  assert.match(englishList, /href="\/en\/"[^>]*>Posts<\/a>/);
  assert.match(
    englishList,
    /href="\/zh-TW\/"[^>]*>Traditional Chinese<\/a>/,
  );
  assert.match(
    englishList,
    /href="mailto:jcli@pm\.me"[^>]*>jcli@pm\.me<\/a>/,
  );

  assert.match(chineseList, /<nav[^>]*aria-label="主要導覽"/);
  assert.match(chineseList, /href="\/zh-TW\/"[^>]*>文章<\/a>/);
  assert.match(chineseList, /href="\/zh-TW\/#about"[^>]*>關於<\/a>/);
  assert.match(chineseList, /href="\/en\/"[^>]*>English<\/a>/);
  assert.match(
    chineseList,
    /href="mailto:jcli@pm\.me"[^>]*>jcli@pm\.me<\/a>/,
  );
  assert.match(chineseOnlyPost, /href="\/en\/"[^>]*>English<\/a>/);

  const englishChrome = ["header", "footer"]
    .map((element) => englishList.match(new RegExp(`<${element}\\b[\\s\\S]*?<\\/${element}>`))?.[0] ?? "")
    .join(" ");
  assert.doesNotMatch(englishChrome, /文章|關於|寄信|主要導覽/);

  for (const [html, expectedLabel] of [
    [englishList, "jcli@pm.me"],
    [chineseList, "jcli@pm.me"],
  ]) {
    const footer = html.match(
      /<footer\b[^>]*class="site-footer"[^>]*>[\s\S]*?<\/footer>/,
    )?.[0];

    assert.ok(footer, "expected one footer");
    assert.equal((footer.match(/<a\b/g) ?? []).length, 1);
    assert.equal(footer.replace(/<[^>]+>/g, "").trim(), expectedLabel);
  }
});

test("the approved Accession Tabs structure is semantic across reading surfaces", async () => {
  const [englishList, chineseList, chinesePost] = await Promise.all([
    readFile(new URL("en/index.html", distDirectory), "utf8"),
    readFile(listPage, "utf8"),
    readFile(new URL("zh-TW/blog/covid/index.html", distDirectory), "utf8"),
  ]);

  for (const html of [englishList, chineseList, chinesePost]) {
    assert.match(html, /<body data-surface="accession-tabs">/);
    assert.match(html, /direction seed f0bd5f13/);
    assert.match(html, /<a\b[^>]*class="author-signature"[^>]*>\s*李至青\s*<\/a>/);
    assert.doesNotMatch(html, /class="site-title"/);
    assert.match(html, /<main id="main-content">/);
    assert.doesNotMatch(html, /<h1[^>]*>\s*李至青\s*<\/h1>/);
  }

  assert.equal(SITE.title, SITE.author.displayName);

  assert.match(
    chineseList,
    /<a\b[^>]*class="[^"]*nav-tab--cobalt[^"]*is-active[^"]*"[^>]*href="\/zh-TW\/"[^>]*aria-current="page"/,
  );
  assert.match(
    englishList,
    /<a\b[^>]*class="[^"]*nav-tab--cobalt[^"]*is-active[^"]*"[^>]*href="\/en\/"[^>]*aria-current="page"/,
  );
  assert.match(
    chinesePost,
    /<a\b[^>]*class="[^"]*nav-tab--cobalt[^"]*is-active[^"]*"[^>]*href="\/zh-TW\/"[^>]*aria-current="location"/,
  );
  assert.doesNotMatch(
    chinesePost,
    /<a\b[^>]*href="\/zh-TW\/"[^>]*aria-current="page"/,
  );
  assert.match(chineseList, /<ol class="post-list" data-register="chronological">/);
  assert.match(
    chineseList,
    /<h1 id="register-heading" class="register-title">文章<\/h1>/,
  );
  assert.doesNotMatch(
    chineseList,
    /最近更新|5 篇文章|class="register-(?:update|stamp|year)"|ZH-TW ·/,
  );
  assert.equal(
    [...chineseList.matchAll(/<li class="post-list-item">/g)].length,
    expectedPosts.length,
  );
  assert.match(
    chineseList,
    /<section id="about" class="about-intro" aria-label="關於">/,
  );
  assert.doesNotMatch(chineseList, /<h[1-6][^>]*>關於(?:這裡)?<\/h[1-6]>/);
  assert.match(
    chineseList,
    /<footer class="about-cta">[\s\S]*如果有一段文字讓你想起自己，歡迎寫信告訴我。[\s\S]*href="mailto:jcli@pm\.me"[^>]*>寫信給我<\/a>/,
  );
  assert.match(chinesePost, /<article class="reading-article">/);
  assert.match(
    chinesePost,
    /<footer class="reader-response">[\s\S]*讀完有想說的嗎？[\s\S]*href="mailto:jcli@pm\.me"[^>]*>寫信給我<\/a>/,
  );
  assert.match(englishList, /<section class="register-panel"/);
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
      assert.ok(
        image.includes(`sizes="${ARTICLE_IMAGE_SIZES}"`),
        `expected the reading-column sizes hint on ${image} in ${page}`,
      );
      assert.match(image, /\balt="[^"]+"/, `expected alt text on ${image} in ${page}`);
    }
  }
});

test("posts mirrored from Threads send responses to the Threads original", async () => {
  const pages = (await walkFiles(distDirectory)).filter((path) =>
    /^(?:zh-TW|en)\/blog\/[^/]+\/index\.html$/.test(path),
  );

  for (const page of pages) {
    const html = await readFile(new URL(page, distDirectory), "utf8");
    const footer = html.match(
      /<footer class="reader-response">[\s\S]*?<\/footer>/,
    )?.[0];

    assert.ok(footer, `expected a response ending in ${page}`);

    if (/同步發佈在 Threads|Also posted on Threads/.test(footer)) {
      assert.match(
        footer,
        /href="https:\/\/www\.threads\.(?:com|net)\/@[\w.]+\/post\/[\w-]+\/?"[^>]*>(?:在上面和我互動|Talk with me there)<\/a>/,
        `expected a Threads permalink in ${page}`,
      );
      assert.doesNotMatch(footer, /mailto:/, `expected no email prompt in ${page}`);
    } else {
      assert.match(footer, /href="mailto:/, `expected the email prompt in ${page}`);
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
  for (const slug of ["hello-world", "conservation-of-mass", "about"]) {
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
    readFile(new URL("zh-TW/blog/covid/index.html", distDirectory), "utf8"),
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
  test(`a reader can read the complete ${post.title} post`, async () => {
    const route = `/zh-TW/blog/${post.slug}/`;
    const page = new URL(`${route.slice(1)}index.html`, distDirectory);
    const [listHtml, html] = await Promise.all([
      readFile(listPage, "utf8"),
      readFile(page, "utf8"),
    ]);

    assert.match(
      listHtml,
      new RegExp(
        `href="${escapeForRegex(route)}"[^>]*>${escapeForRegex(post.title)}</a>`,
      ),
    );
    assert.match(html, /<html lang="zh-TW">/);
    assert.match(
      html,
      new RegExp(`<h1[^>]*>${escapeForRegex(post.title)}</h1>`),
    );
    assert.match(
      html,
      new RegExp(`datetime="${post.dateTime}"[^>]*>${post.dateLabel}</time>`),
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
  assert.match(html, /我是李至青 Jhih Cing, Li/);
  assert.match(html, /我寫生活裡的變化、迷惘、幸運/);
  assert.match(html, /沒有通知，沒有廣告，獨立於平台/);
  assert.match(html, /故事是從這裡開始/);
  assert.match(html, /href="mailto:jcli@pm\.me"[^>]*>寫信給我<\/a>/);
  assert.ok(html.indexOf('id="about"') < html.indexOf('class="register-panel"'));
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
    ".about-cta",
    ".register-panel",
    ".register-header",
    ".post-list-item",
    ".empty-register",
    ".post-header",
    ".post-body blockquote",
    ".reader-response",
    ".site-footer",
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
