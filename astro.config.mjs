import { defineConfig } from "astro/config";

import { SITE } from "./src/config/site.js";
import { articleImageSizes } from "./src/lib/article-image-sizes.mjs";
import { glyphPhotos } from "./src/lib/glyph-photos.mjs";

export default defineConfig({
  site: SITE.url,
  output: "static",
  trailingSlash: "always",
  build: {
    format: "directory",
  },
  // Markdown images get a srcset of several widths; the integration supplies
  // a `sizes` hint matching the article column.
  image: {
    layout: "constrained",
  },
  // Article photos also carry their character-art rendering.
  integrations: [articleImageSizes(), glyphPhotos()],
});
