# 03 — Bilingual structure (/zh-TW/ + /en/, root redirect)

**What to build:** The bilingual skeleton from the spec: a reader landing on `/` is redirected by browser Accept-Language to `/zh-TW/` or `/en/`; both locale editions exist with their own post lists; a visible language-switch link lets the reader override the automatic choice; partial translation is supported — a post existing only in zh-TW is either hidden from the `/en/` list or clearly marked as Chinese-only linking to the zh-TW version (implementer picks one, consistently); hreflang pairs are emitted only where a translation actually exists. Site chrome (nav, footer, email link) is locale-aware — no hardcoded zh-TW strings leaking into `/en/`.

**Blocked by:** 01 — Astro scaffold + first post end-to-end. (Parallel with 02.)

**Status:** resolved

- [x] `/zh-TW/` and `/en/` both render with locale-appropriate chrome
- [x] Root `/` redirects by Accept-Language (zh → `/zh-TW/`, everything else → `/en/`); redirect is testable (Seam 2 style if implemented in code, or asserted config if a Cloudflare rule)
- [x] Language-switch link present on list and post pages
- [x] A zh-TW-only post produces NO hreflang pair and follows the chosen partial-translation behavior on `/en/`
- [x] Post-build assertions cover: both locale routes, hreflang presence/absence rules, no zh-TW hardcoded strings in `/en/` chrome
- [x] STATE.md/WORKLOG.md updated

## Answer

The site now has locale-aware `/zh-TW/` and `/en/` editions, shared localized navigation/footer/email chrome, and visible language switches. Untranslated posts are hidden from the English list. Post files mirrored under both locale directories with the same slug are treated as translations and receive paired hreflang links; single-locale posts emit none.

Root language negotiation is a Cloudflare Pages Function at `functions/index.js`, externally tested with real `Request`/`Response` objects including quality weights, exclusions, wildcards, and missing headers. The required Standards/Spec review found one list-rendering duplication, a stale handoff, and two Accept-Language edge cases; all were fixed. Final `yarn run check` is clean and `yarn test` passes all 13 assertions.
