# Spec: Site rebuild — Astro + Cloudflare, bilingual, likes, self-owned analytics

Status: ready-for-agent

> Synthesized 2026-07-30 from the grilling interview recorded in `STATE.md` § Decision record. Those decisions are settled — do not re-litigate them here.

## Problem Statement

The author (李至青) has a personal blog "The Return" still live on WordPress at `jhihcing.li`, and a half-finished Eleventy migration in this repo. WordPress is heavyweight to run and the Eleventy base cannot cleanly host the interactive pieces the author has concrete plans for (a pottery-map mini app embedded in posts). The author wants: a minimal, extremely fast site (readers may be on slow connections; content is Chinese, where webfonts alone can cost megabytes), page-view numbers without cookies or consent banners, a way for readers to send a "like", and a bilingual structure that can grow an English edition without forcing every post to be translated. Two posts published after the last WordPress export exist only on the live site and would be lost in a naive cutover.

## Solution

Rebuild the site on Astro (static output, zero JS by default, islands available for the future pottery-map app), deployed to Cloudflare Pages under canonical domain `https://jhihcing.li`, with DNS on Cloudflare and registration remaining at Namecheap. Content lives in a bilingual URL structure (`/zh-TW/` + `/en/`) with partial translation allowed; all existing posts start under `/zh-TW/`. Readers get a cookieless like button backed by a tiny Cloudflare Worker + D1. Page views are measured by the Cloudflare Web Analytics beacon (cookieless), and a weekly snapshot job pulls per-page counts through the Cloudflare GraphQL API into a JSON ledger committed to this repo, so long-term history is self-owned despite Cloudflare's ~30-day retention. No comment system: the footer carries an email link. Typography is a system-font stack — zero font download.

## User Stories

### Reader

1. As a reader on a slow connection, I want pages to load with no webfonts, no framework JS, and minimal HTML/CSS, so that articles render in well under a second even on bad networks.
2. As a reader, I want the site to work with zero cookies, so that I never see a consent banner.
3. As a zh-TW reader landing on `/`, I want to be routed to `/zh-TW/` based on my browser language, so that I see the site in my language without choosing.
4. As an English-speaking reader landing on `/`, I want to be routed to `/en/`, so that I see whatever English content exists.
5. As a reader, I want to switch language explicitly via a visible link, so that the automatic routing never traps me.
6. As a reader on the `/en/` edition, I want untranslated posts to be either hidden or clearly marked "中文 only" (linking to the zh-TW version), so that I am never dumped on a page in a language I didn't pick without explanation.
7. As a reader who enjoyed a post, I want to press a like button without logging in or being tracked, so that I can send appreciation in one click.
8. As a reader, I want to see the current like count on a post, so that the button feels alive.
9. As a reader who wants to respond in depth, I want an email link in the footer, so that I can write to the author directly.
10. As a reader following an old WordPress URL (e.g. `/covid`), I want a 301 to the post's new home, so that bookmarks and old external links keep working.
11. As a reader visiting `www.jhihcing.li`, I want a 301 to the apex domain, so that there is one canonical address.
12. As a reader using a feed reader, I want a valid Atom feed per language, so that I can subscribe to new posts.
13. As a reader with JS disabled, I want the entire site (except the like button and future islands) to work, so that content never depends on script.
14. As a reader of the future "how to start pottery" post, I want the embedded pottery-map island to load only on that page, so that the rest of the site pays nothing for it.

### Author

15. As the author, I want to write a post as one markdown file under one language, so that publishing has no more friction than the old Eleventy setup.
16. As the author, I want to translate a post only when I feel like it, so that the English edition can grow lazily without blocking zh-TW publishing.
17. As the author, I want the two posts that exist only on live WordPress (「2023 ~ 2024」, 「2025」) migrated before cutover, so that no writing is lost.
18. As the author, I want 「一切不滅定律」 kept published in the new site (confirmed 2026-07-30), even though the live homepage omits it.
19. As the author, I want per-page view counts accumulated permanently in a JSON ledger inside this repo, so that my analytics history is mine and survives any vendor decision.
20. As the author, I want to be alerted when the weekly analytics snapshot fails, so that gaps in the ledger are noticed within a week, not discovered months later.
21. As the author, I want like counts stored in my own Cloudflare D1, so that this data is also mine.
22. As the author, I want the like endpoint rate-limited and deduplicated well enough to keep counts honest, without any user accounts.
23. As the author, I want the site title, author, and canonical URL defined in one place, so that feeds, hreflang, and meta tags never drift out of sync again (the Eleventy setup had placeholder drift).
24. As the author, I want the old Eleventy/GitHub Pages deployment artifacts removed in the same effort, so that the repo has exactly one deployment story.

### Agent / maintainer

25. As a maintaining agent, I want a clean `astro build` plus a post-build assertion suite as the verification bar, so that "done" is checkable without a human.
26. As a maintaining agent, I want the likes Worker testable through its HTTP interface with a local D1, so that I can change it without touching production.
27. As a maintaining agent, I want the snapshot job's merge logic as a pure function, so that its tests need no network.
28. As a maintaining agent, I want `STATE.md`/`WORKLOG.md` kept current through the rebuild, so that any session cut-off loses no context.

## Implementation Decisions

- **Framework**: Astro, static output for all site pages. The Cloudflare adapter is introduced only where server behavior is needed (root language redirect, if not expressible as a Cloudflare redirect rule). Islands are a capability held in reserve for the pottery-map app — the rebuild itself ships zero islands.
- **Hosting**: Cloudflare Pages, deployed from this repo. GitHub Pages workflow and `public/CNAME` are deleted. DNS zone on Cloudflare free plan; registration stays at Namecheap. The obsolete pre-rebuild STATE items (push old commit, switch Pages source) are cancelled, not executed.
- **Domain**: canonical `https://jhihcing.li` (apex). `www` → apex 301 via Cloudflare rule. `jcli.io` lapses; nothing may reference it.
- **i18n structure**: locale-prefixed routes `/zh-TW/` and `/en/`; zh-TW is the default/primary edition. `/` performs an Accept-Language redirect to one of the two. hreflang pairs emitted only when a translation actually exists. Content is organized per-locale; a post is one file in one locale, optionally mirrored in the other. All 8 existing posts (5 in repo + 2 scraped + hello-world set) land in zh-TW.
- **Content migration**: live WordPress is the source of truth, not the 2024-12-20 XML. The two missing posts are re-exported or scraped from the live site. Old WordPress slugs get Cloudflare redirect rules to their `/zh-TW/...` homes.
- **Typography/perf**: system font stack only; no webfont files may enter the build. No client-side framework runtime on content pages. Feeds via Astro's RSS tooling, one per language, fed from the same central site metadata.
- **Likes**: one Cloudflare Worker + D1 table keyed by post path. Endpoints: read count, increment. No cookies, no accounts; abuse control via rate limiting + coarse dedupe (e.g. hashed IP within a time window — exact scheme is the implementer's call, requirement is "honest enough counts, zero tracking"). The button is a few lines of vanilla JS that degrades to nothing without JS. This Worker is the designated future home of pottery-map API endpoints.
- **Analytics**: Cloudflare Web Analytics beacon on all pages. A weekly scheduled job queries the Cloudflare GraphQL Analytics API (RUM per-page dataset; free-plan retention ~30d, unsampled window ~7d — weekly cadence stays inside it), merges results into a committed JSON ledger of cumulative per-page counts, and alerts on failure. Numbers are understood to be sampled estimates. Scheduler host (GitHub Action vs Worker cron) is the implementer's call; the merge logic must be a pure function regardless.
- **Comments**: none, by decision. Footer email link only.

## Testing Decisions

- Tests assert external behavior only — never Astro internals, component structure, or CSS.
- **Seam 1 — built output** (primary): run the production build, assert on the emitted site: locale routes exist and contain all expected posts; hreflang pairs are present exactly where translations exist; feeds parse as valid Atom; no webfont or third-party requests appear in the HTML (beacon excepted); old-slug redirect mappings exist.
- **Seam 2 — Worker HTTP interface**: black-box request/response tests against the likes Worker (and language-redirect middleware if implemented in code) with a local/simulated D1. Covers count read, increment, dedupe window, rate limit, and unknown-path behavior.
- **Seam 3 — snapshot merge function**: pure-function tests: (GraphQL response fixture + existing ledger) → new ledger. Covers first run, overlap weeks, missing pages, malformed response. The cron/HTTP shell around it stays thin and untested.
- No other seams. Prior art: none — this repo currently has zero tests ("clean build" was the bar); these seams establish it.

## Out of Scope

- The pottery-map mini app itself (separate project; this rebuild only guarantees a place for it to land as an island).
- Visual design and styling rules — the user will introduce these separately via their impeccable-skill rule set. The rebuild ships the structural skeleton (title left, minimal post list right, Yoneko-like) with deliberately plain styling.
- Any comment/discussion system (Bluesky, giscus, webmentions — evaluated and rejected).
- Translating any existing post to English.
- Paid analytics services; Cloudflare paid plans.
- The DNS/nameserver switch itself (user-only manual action; agents may only prepare instructions).

## Further Notes

- Execution order from the decision record: DNS move → Astro rebuild + content top-up → Pages cutover → beacon + snapshot agent → likes Worker. The Astro rebuild may start before the DNS move; the cutover may not.
- The WordPress export XML is gitignored because it contains private drafts and commenter emails — scraped/re-exported content must be similarly screened before commit.
- Cloudflare edge (proxy) analytics exist for free with zero setup and can serve as a sanity cross-check on the beacon numbers, but are not the ledger source.
- Site chrome (nav labels, footer) should be bilingual-aware from day one — hardcoded zh-TW strings in shared layouts will leak into `/en/`.
