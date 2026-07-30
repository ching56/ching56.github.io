# 04 — Atom feed per language

**What to build:** A feed-reader user can subscribe to either language edition: one valid Atom feed per locale, generated from the same single metadata source as the site head (killing the WordPress/Eleventy-era placeholder drift for good). Feeds are discoverable via `<link rel="alternate">` on the corresponding locale's pages. The zh-TW feed carries all zh-TW posts; the en feed carries only posts that exist in English (possibly zero at launch — an empty-but-valid feed is correct).

**Blocked by:** 02 — Full content migration; 03 — Bilingual structure.

**Status:** resolved

- [x] Both feeds exist at stable URLs and parse as valid Atom (assertion suite parses them, not eyeball checks)
- [x] Feed title/author/site URL come from the single metadata source; no placeholder strings anywhere
- [x] zh-TW feed lists every migrated post with correct dates and absolute canonical URLs
- [x] en feed contains only English posts and is valid even when empty
- [x] Each locale's pages link their own feed via `<link rel="alternate" type="application/atom+xml">`
- [x] STATE.md/WORKLOG.md updated

## Answer

`/zh-TW/atom.xml` and `/en/atom.xml` are generated as strict Atom 1.0 documents from the shared `SITE`, `UI`, and content-collection sources. The zh-TW feed contains all seven entries established by resolved ticket 02 in newest-first order; the English feed contains zero entries until English Markdown exists. Every locale page advertises only its corresponding feed.

The built-output suite parses both XML files with a strict SAX parser and verifies required feed/entry metadata, exact titles and publication dates, absolute canonical IDs/links, empty-locale behavior, and discovery across every emitted page. The required two-axis review was completed against `427e78a`; all actionable Standards findings were fixed, and its two apparent Spec findings were confirmed as pre-existing spec inconsistencies rather than ticket defects.
