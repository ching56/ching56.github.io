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

test("content pages request neither webfonts nor Astro runtime JavaScript", async () => {
  const [listHtml, postHtml, outputFiles] = await Promise.all([
    readFile(listPage, "utf8"),
    readFile(postPage, "utf8"),
    walkFiles(distDirectory),
  ]);

  for (const html of [listHtml, postHtml]) {
    assert.doesNotMatch(html, /<script\b/i);
    assert.doesNotMatch(
      html,
      /<link\b[^>]*href="[^"]+\.(?:woff2?|ttf|otf|eot)(?:\?[^"]*)?"/i,
    );
    assert.doesNotMatch(
      html,
      /(?:fonts\.(?:googleapis|gstatic)\.com|use\.typekit\.net)/i,
    );
  }

  assert.deepEqual(
    outputFiles.filter((file) => /\.(?:woff2?|ttf|otf|eot)$/i.test(file)),
    [],
  );

  const stylesheets = outputFiles.filter((file) => file.endsWith(".css"));
  for (const stylesheet of stylesheets) {
    const css = await readFile(new URL(stylesheet, distDirectory), "utf8");
    assert.doesNotMatch(css, /@font-face|@import\s+url/i);
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
