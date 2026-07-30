# 03 — Bilingual structure (/zh-TW/ + /en/, root redirect)

**What to build:** The bilingual skeleton from the spec: a reader landing on `/` is redirected by browser Accept-Language to `/zh-TW/` or `/en/`; both locale editions exist with their own post lists; a visible language-switch link lets the reader override the automatic choice; partial translation is supported — a post existing only in zh-TW is either hidden from the `/en/` list or clearly marked as Chinese-only linking to the zh-TW version (implementer picks one, consistently); hreflang pairs are emitted only where a translation actually exists. Site chrome (nav, footer, email link) is locale-aware — no hardcoded zh-TW strings leaking into `/en/`.

**Blocked by:** 01 — Astro scaffold + first post end-to-end. (Parallel with 02.)

**Status:** ready-for-agent

- [ ] `/zh-TW/` and `/en/` both render with locale-appropriate chrome
- [ ] Root `/` redirects by Accept-Language (zh → `/zh-TW/`, everything else → `/en/`); redirect is testable (Seam 2 style if implemented in code, or asserted config if a Cloudflare rule)
- [ ] Language-switch link present on list and post pages
- [ ] A zh-TW-only post produces NO hreflang pair and follows the chosen partial-translation behavior on `/en/`
- [ ] Post-build assertions cover: both locale routes, hreflang presence/absence rules, no zh-TW hardcoded strings in `/en/` chrome
- [ ] STATE.md/WORKLOG.md updated
