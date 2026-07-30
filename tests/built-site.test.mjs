import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

const distDirectory = new URL("../dist/", import.meta.url);
const listPage = new URL("zh-TW/index.html", distDirectory);
const forbiddenFontRule = /@font-face|@import\s+(?:url\s*\()?/i;
const expectedPosts = [
  {
    slug: "hello-world",
    title: "Hello world!",
    dateTime: "2022-12-01",
    dateLabel: "2022年12月1日",
    excerpts: ["This is the first post."],
  },
  {
    slug: "about",
    title: "關於",
    dateTime: "2022-12-22",
    dateLabel: "2022年12月22日",
    excerpts: [
      "我是李至青 Jhih Cing, Li",
      "故事是從這裡開始",
      'href="mailto:jcli@pm.me"',
    ],
  },
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
    slug: "conservation-of-mass",
    title: "一切不滅定律",
    dateTime: "2023-01-27",
    dateLabel: "2023年1月27日",
    excerpts: [
      "《一切不滅定律》——昏鴉樂團",
      "幻滅會讓霧散開",
      "用覺悟召喚自己的領域",
    ],
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
    excerpts: ["開始學做茶壺", "Mew 的 farewell", "但絕對不降低標準"],
  },
];

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
    /href="mailto:jhihcing\.li@gmail\.com"[^>]*>Email<\/a>/,
  );

  assert.match(chineseList, /<nav[^>]*aria-label="主要導覽"/);
  assert.match(chineseList, /href="\/zh-TW\/"[^>]*>文章<\/a>/);
  assert.match(chineseList, /href="\/zh-TW\/about\/"[^>]*>關於<\/a>/);
  assert.match(chineseList, /href="\/en\/"[^>]*>English<\/a>/);
  assert.match(
    chineseList,
    /href="mailto:jhihcing\.li@gmail\.com"[^>]*>寄信<\/a>/,
  );
  assert.match(chineseOnlyPost, /href="\/en\/"[^>]*>English<\/a>/);

  const englishChrome = ["header", "footer"]
    .map((element) => englishList.match(new RegExp(`<${element}\\b[\\s\\S]*?<\\/${element}>`))?.[0] ?? "")
    .join(" ");
  assert.doesNotMatch(englishChrome, /文章|關於|寄信|主要導覽/);
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

test("a reader can open the complete zh-TW about page", async () => {
  const page = new URL("zh-TW/about/index.html", distDirectory);
  const html = await readFile(page, "utf8");

  assert.match(html, /<html lang="zh-TW">/);
  assert.match(html, /<h1[^>]*>關於<\/h1>/);
  assert.match(html, /datetime="2022-12-22"[^>]*>2022年12月22日<\/time>/);
  assert.match(html, /我是李至青 Jhih Cing, Li/);
  assert.match(html, /故事是從這裡開始/);
  assert.match(html, /href="mailto:jcli@pm\.me"[^>]*>jcli@pm\.me<\/a>/);
  assert.match(
    html,
    /<link rel="canonical" href="https:\/\/jhihcing\.li\/zh-TW\/about\/">/,
  );
});

test("content pages request neither webfonts nor Astro runtime JavaScript", async () => {
  const contentPages = [
    listPage,
    new URL("en/index.html", distDirectory),
    new URL("zh-TW/about/index.html", distDirectory),
    ...expectedPosts.map(
      ({ slug }) => new URL(`zh-TW/blog/${slug}/index.html`, distDirectory),
    ),
  ];
  const [contentHtml, outputFiles] = await Promise.all([
    Promise.all(contentPages.map((page) => readFile(page, "utf8"))),
    walkFiles(distDirectory),
  ]);

  for (const html of contentHtml) {
    assert.doesNotMatch(html, /<script\b/i);
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

function escapeForRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
