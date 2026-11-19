import { defineConfig } from "astro/config";

import { SITE } from "./src/config/site.js";
import { articleImageSizes } from "./src/lib/article-image-sizes.mjs";

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
  integrations: [articleImageSizes()],
});
