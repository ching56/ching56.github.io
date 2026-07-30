import { defineConfig } from "astro/config";

import { SITE } from "./src/config/site.js";

export default defineConfig({
  site: SITE.url,
  output: "static",
  trailingSlash: "always",
  build: {
    format: "directory",
  },
});
