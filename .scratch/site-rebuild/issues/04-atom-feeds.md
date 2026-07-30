# 04 — Atom feed per language

**What to build:** A feed-reader user can subscribe to either language edition: one valid Atom feed per locale, generated from the same single metadata source as the site head (killing the WordPress/Eleventy-era placeholder drift for good). Feeds are discoverable via `<link rel="alternate">` on the corresponding locale's pages. The zh-TW feed carries all zh-TW posts; the en feed carries only posts that exist in English (possibly zero at launch — an empty-but-valid feed is correct).

**Blocked by:** 02 — Full content migration; 03 — Bilingual structure.

**Status:** ready-for-agent

- [ ] Both feeds exist at stable URLs and parse as valid Atom (assertion suite parses them, not eyeball checks)
- [ ] Feed title/author/site URL come from the single metadata source; no placeholder strings anywhere
- [ ] zh-TW feed lists every migrated post with correct dates and absolute canonical URLs
- [ ] en feed contains only English posts and is valid even when empty
- [ ] Each locale's pages link their own feed via `<link rel="alternate" type="application/atom+xml">`
- [ ] STATE.md/WORKLOG.md updated
