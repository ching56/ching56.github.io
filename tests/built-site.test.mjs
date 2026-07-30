import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

const distDirectory = new URL("../dist/", import.meta.url);
const listPage = new URL("zh-TW/index.html", distDirectory);
const postPage = new URL(
  "zh-TW/blog/conservation-of-mass/index.html",
  distDirectory,
);
const forbiddenFontRule = /@font-face|@import\s+(?:url\s*\()?/i;

test("a reader can open the zh-TW post list and read 一切不滅定律", async () => {
  const [listHtml, postHtml] = await Promise.all([
    readFile(listPage, "utf8"),
    readFile(postPage, "utf8"),
  ]);

  assert.match(
    listHtml,
    /href="\/zh-TW\/blog\/conservation-of-mass\/"/,
  );
  assert.match(listHtml, /一切不滅定律/);
  assert.match(postHtml, /<html lang="zh-TW">/);
  assert.match(postHtml, /<h1[^>]*>一切不滅定律<\/h1>/);
  assert.match(postHtml, /datetime="2023-01-27"[^>]*>2023年1月27日<\/time>/);
  assert.match(postHtml, /用覺悟召喚自己的領域/);
  assert.match(
    postHtml,
    /<link rel="canonical" href="https:\/\/jhihcing\.li\/zh-TW\/blog\/conservation-of-mass\/">/,
  );
  assert.match(postHtml, /<meta name="author" content="Jhih Cing Li">/);
});

test("a reader can read the complete Hello world! post", async () => {
  const helloPage = new URL(
    "zh-TW/blog/hello-world/index.html",
    distDirectory,
  );
  const [listHtml, helloHtml] = await Promise.all([
    readFile(listPage, "utf8"),
    readFile(helloPage, "utf8"),
  ]);

  assert.match(listHtml, /href="\/zh-TW\/blog\/hello-world\/"/);
  assert.match(helloHtml, /<h1[^>]*>Hello world!<\/h1>/);
  assert.match(helloHtml, /datetime="2022-12-01"[^>]*>2022年12月1日<\/time>/);
  assert.match(helloHtml, /This is the first post\./);
});

test("a reader can read the complete 2022 post", async () => {
  const page = new URL("zh-TW/blog/2022/index.html", distDirectory);
  const [listHtml, html] = await Promise.all([
    readFile(listPage, "utf8"),
    readFile(page, "utf8"),
  ]);

  assert.match(listHtml, /href="\/zh-TW\/blog\/2022\/"/);
  assert.match(html, /<h1[^>]*>2022<\/h1>/);
  assert.match(html, /datetime="2023-01-02"[^>]*>2023年1月2日<\/time>/);
  assert.match(html, /第一次感受到運動的快樂/);
  assert.match(html, /每一個平靜踏實的當下，才能好好地抵達未來/);
  assert.match(html, /才能不負幸運/);
});

test("a reader can read the complete 確診 post", async () => {
  const page = new URL("zh-TW/blog/covid/index.html", distDirectory);
  const [listHtml, html] = await Promise.all([
    readFile(listPage, "utf8"),
    readFile(page, "utf8"),
  ]);

  assert.match(listHtml, /href="\/zh-TW\/blog\/covid\/"/);
  assert.match(html, /<h1[^>]*>確診<\/h1>/);
  assert.match(html, /datetime="2023-01-13"[^>]*>2023年1月13日<\/time>/);
  assert.match(html, /第零天/);
  assert.match(html, /告訴我晚上可以解隔了/);
  assert.match(html, /孤單才是錯覺吧/);
});

test("a reader can read the complete 關於 post", async () => {
  const page = new URL("zh-TW/blog/about/index.html", distDirectory);
  const [listHtml, html] = await Promise.all([
    readFile(listPage, "utf8"),
    readFile(page, "utf8"),
  ]);

  assert.match(listHtml, /href="\/zh-TW\/blog\/about\/"/);
  assert.match(html, /<h1[^>]*>關於<\/h1>/);
  assert.match(html, /datetime="2022-12-22"[^>]*>2022年12月22日<\/time>/);
  assert.match(html, /我是李至青 Jhih Cing, Li/);
  assert.match(html, /故事是從這裡開始/);
  assert.match(html, /透過 Email 找到我：/);
  assert.match(html, /href="mailto:jcli@pm\.me"[^>]*>jcli@pm\.me<\/a>/);
});

test("a reader can read the complete 2023 ~ 2024 post", async () => {
  const page = new URL("zh-TW/blog/2023-2024/index.html", distDirectory);
  const [listHtml, html] = await Promise.all([
    readFile(listPage, "utf8"),
    readFile(page, "utf8"),
  ]);

  assert.match(listHtml, /href="\/zh-TW\/blog\/2023-2024\/"/);
  assert.match(html, /<h1[^>]*>2023 ~ 2024<\/h1>/);
  assert.match(html, /datetime="2024-12-22"[^>]*>2024年12月22日<\/time>/);
  assert.match(html, /我追求完美同時接受自己有限/);
  assert.match(html, /不可能的事情一直發生/);
  assert.match(html, /我滿意現在的生活/);
});

test("a reader can read the complete 2025 post", async () => {
  const page = new URL("zh-TW/blog/2025/index.html", distDirectory);
  const [listHtml, html] = await Promise.all([
    readFile(listPage, "utf8"),
    readFile(page, "utf8"),
  ]);

  assert.match(listHtml, /href="\/zh-TW\/blog\/2025\/"/);
  assert.match(html, /<h1[^>]*>2025<\/h1>/);
  assert.match(html, /datetime="2026-01-01"[^>]*>2026年1月1日<\/time>/);
  assert.match(html, /開始學做茶壺/);
  assert.match(html, /Mew 的 farewell/);
  assert.match(html, /但絕對不降低標準/);
});

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
  const [listHtml, postHtml, outputFiles] = await Promise.all([
    readFile(listPage, "utf8"),
    readFile(postPage, "utf8"),
    walkFiles(distDirectory),
  ]);

  for (const html of [listHtml, postHtml]) {
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
