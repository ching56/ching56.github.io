# 01 — Astro scaffold + first post end-to-end

**What to build:** Replace the Eleventy setup with an Astro project that renders one real zh-TW post completely: a reader can open the local site, land on the zh-TW post list, click through to the post, and read it — with system fonts only, no client JS, and the site title/author/canonical URL coming from a single metadata source (site name is an OPEN decision — see PRODUCT.md § Brand Commitments — so it must be trivially changeable). The post-build assertion suite (Seam 1 from the spec) is born here: production build runs, then assertions verify the expected route exists, content is present, and no webfont/framework-JS requests appear in the HTML.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] `astro build` completes cleanly; dev server serves the site
- [ ] One real migrated post renders at its `/zh-TW/...` URL with correct title, date, and body
- [ ] All text renders via a system-font stack; build output contains no font files and no framework runtime JS on content pages
- [ ] Site title/author/canonical URL defined in exactly one place and consumed by layout + head metadata
- [ ] Post-build assertion suite exists, runs against `dist/`, and passes (route presence, content, no-webfont/no-JS checks)
- [ ] Eleventy remains untouched or removed only insofar as it doesn't block the Astro build (full cleanup is ticket 02)
- [ ] STATE.md/WORKLOG.md updated per AGENTS.md
