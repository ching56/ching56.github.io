// Article photos are struck as glyphs too: every Markdown image beside a post
// is wrapped with its build-time character-art rendering, which the page
// develops into the photo as it scrolls into view (CSS only).
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

import { photoToAscii } from "./ascii.ts";

// Article art: fewer, larger glyphs read as typed characters at column width.
const ROWS = 40;

const glyphPhotosPlugin = {
  name: "glyph-photos",
  element: {
    filter: ["img"],
    async visit(node, context) {
      const source = node.properties?.src;
      if (!context.fileURL || typeof source !== "string" || !source.startsWith("./")) return;

      const file = relative(process.cwd(), join(dirname(fileURLToPath(context.fileURL)), source));
      const art = await photoToAscii(file, ROWS).catch(() => null);
      if (!art) return;

      context.wrapNode(node, {
        type: "element",
        tagName: "span",
        properties: {
          className: ["glyph-photo"],
          style: `--cols:${art.cols};--rows:${art.rows}`,
        },
        children: [
          {
            type: "element",
            tagName: "span",
            properties: { className: ["glyph-photo-ascii"], ariaHidden: "true" },
            children: [{ type: "text", value: art.text }],
          },
        ],
      });
    },
  },
};

export function glyphPhotos() {
  return {
    name: "glyph-photos",
    hooks: {
      "astro:config:setup": ({ config }) => {
        config.markdown.processor.options.hastPlugins.push(glyphPhotosPlugin);
      },
    },
  };
}
