import { defineConfig } from "astro/config";

import { SITE } from "./src/config/site.js";
import { articleImageSizes } from "./src/lib/article-image-sizes.mjs";
import { devRootRedirect } from "./src/lib/dev-root-redirect.mjs";

export default defineConfig({
  site: SITE.url,
  output: "static",
  trailingSlash: "always",
  build: {
    format: "directory",
  },
  // Markdown images get a srcset of several widths; the integration supplies
  // a `sizes` hint matching the article column. devRootRedirect runs the
  // root Pages Function in `astro dev` only.
  image: {
    layout: "constrained",
  },
  integrations: [articleImageSizes(), devRootRedirect()],
});
