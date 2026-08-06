# STATE.md — handoff document

> Any agent: read this first, update it after every milestone. Format rules in `AGENTS.md` § Handoff mechanism.

## Decision record (2026-07-30 grilling interview — settled, do not re-litigate)

1. **Framework**: rebuild on **Astro** (replaces the current Eleventy setup). Reason: user has a concrete island use case — a pottery-map mini app to embed in a "how to start pottery" post and a works page. The map app itself is a separate project; this repo only provides the island slot.
2. **Deploy**: **Cloudflare Pages** (replaces GitHub Pages). DNS moves to Cloudflare (free zone); domain registration stays at Namecheap.
3. **Domain**: canonical = `https://jhihcing.li` (apex). `www` 301 → apex. The retired legacy domain will not be renewed and must not appear in active repository content.
4. **Analytics**: Cloudflare Web Analytics beacon (cookieless, no banner) + a weekly agent/cron snapshot via Cloudflare GraphQL API accumulating per-page counts into a JSON in this repo (free plan retention is only ~30d RUM / 7d unsampled, hence the snapshot). Numbers are sampled estimates; snapshot job needs a failure alert.
5. **Likes**: self-built — Cloudflare Worker + D1, anonymous like button, no cookie/login. This Worker later doubles as API skeleton for the pottery-map app.
6. **Comments/discussion**: none. Contact appears through the homepage introduction and per-article response endings; there is no global footer email. (Bluesky rejected: user has no social base there; audience is zh-TW.)
7. **Fonts**: system font stack only, zero webfont download (Chinese webfonts are MB-scale; site must be fast on slow connections).
8. **i18n**: bilingual structure NOW — `/zh-TW/` + `/en/` URL prefixes, hreflang. Root `/` redirects by browser Accept-Language to `/zh-TW/` or `/en/`. Partial translation allowed (a post may exist in one language only). All existing posts go to `/zh-TW/`, English left empty to grow.
9. **Content**: the 2024-12-20 WordPress export is STALE. Live site (https://jhihcing.li, still WordPress) has 2 posts not in the export: "2023 ~ 2024" (2024-12-22) and "2025" (2026-01-01) — re-export or scrape before cutover. Also: "一切不滅定律" (2023-01-27) is missing from the live homepage but user confirmed (2026-07-30) it STAYS published in the new site. Add Cloudflare redirect rules for old WP slugs (`/covid` etc. → `/zh-TW/blog/...`).
10. **Design**: the earlier Yoneko-style skeleton is no longer binding; the user explicitly authorized a replacement redesign. The confirmed Impeccable direction is now **Story Journal**: `李至青` remains a small, regular-weight signature with `0.08em` tracking; the homepage is one uninterrupted author-first narrative; Posts/About tabs and decorative glass are removed; only a quiet plain-text locale switch remains in shared chrome; and the calm chronological register remains the content structure. This supersedes the earlier Accession Tabs navigation treatment.
11. **Critique disposition (2026-08-06)**: address all four fresh Impeccable findings. Canonical email = `jcli@pm.me`. Index hierarchy = primary `文章` with secondary `最近更新` rather than a year pretending to group the whole archive. Site title = `李至青`; because the author signature uses the same text, implementation must avoid rendering two adjacent `李至青` labels.
12. **Homepage introduction and stage (2026-08-06)**: the zh-TW About narrative precedes the article list as three compact, title-free, regular-weight paragraphs; zh-TW names only `李至青`, without English romanization, and its opening sentence is not bold. The close uses plain, un-underlined `jcli@pm.me` text as the mail link; the global footer is removed. Above 64.0625rem the homepage is a two-column stage with all content left-aligned and a full-height, title-free, frameless creative-coding region on the right; mobile remains one column. Posts/About header links are removed so the introduction flows directly into the chronology; legacy About URLs still point to `/zh-TW/#about`, and no standalone About page is generated. Shared chrome contains only the regular-weight signature and an unbordered plain-text locale switch. Content sections, compact article rows, response endings, and the creative region are frameless. No type may exceed `1.5rem`. The register header says only `文章`—no `最近更新`, duplicate date, or article count. Article rows use 1.25 title/date leading, `0.375rem` desktop and `0.5rem` mobile vertical padding, and render at 52px desktop / 60px mobile while the full row remains clickable.

Execution order: DNS move → Astro rebuild + content top-up → Pages cutover → beacon + snapshot agent → likes Worker. Each step independently verifiable.

## Now

Ticket 07 is implemented, reviewed, and locally resolved in `840edea` plus the pending review-fix commit: D1-backed GET/POST behavior, atomic windowed rate limiting, expiring daily dedupe hashes, strict published-path validation, a hidden-by-default vanilla-JS post control, Wrangler configuration/migration, and black-box HTTP tests. Production deployment and verification remain account-bound after ticket 05. The Story Journal homepage refinement and music-link-card implementation remain separate uncommitted milestones; local Impeccable installations/captures and `.scratch/product-ideas/` remain out of scope. Exact next step: commit the ticket 07 review corrections and final handoff without staging unrelated work, then return to the user-owned DNS/Cloudflare boundary.

## In progress

- The lawful, respectful `Music link card` feature is implemented and documented: strict optional frontmatter schema; semantic zero-JS component; verified Apple Music → Spotify → YouTube ordering; secure/accessibly disclosed new-tab links; quiet responsive styling; and the two approved posts populated with their citation lines removed. Combined verification now passes all 20 built-site tests; independent Impeccable finish review is PASS with no findings. Captures: `music-card-desktop.png` and `music-card-mobile.png`.
- The follow-up Impeccable Live homepage pass is implemented as Story Journal, including the later regular-weight identity and dense 52px/60px article-register rhythm; it is documented in `DESIGN.md` and the route brief, verified, and remains uncommitted beside the music-card milestone.
- The original Accession Tabs implementation and selected critique fixes are complete in `b5ab20e`; the uncommitted Story Journal milestone supersedes its tab/glass navigation while retaining the author-first compact register.
- Ticket 05 repository preparation and review are complete; cutover is paused at the user's DNS/Cloudflare account actions.

## Waiting on user

- **DNS move and Pages setup (paused)**: push the prepared commits through `b5ab20e`, then follow `docs/cloudflare-pages-cutover.md` sections 1–4. Agent must only prepare and verify these account actions.
- (cancelled) push the obsolete migration commit / switch GitHub Pages source to Actions — do not execute either item.

## Backlog

- Rebuild work: tickets 01–04 and local ticket 07 implementation are resolved; ticket 05 is prepared and waits for the user's DNS move; ticket 07 production deployment/verification follows that cutover. Tickets live in `.scratch/site-rebuild/issues/`.
- Post-fix Impeccable P2: on an article without a translation, distinguish a language-edition-home destination (for example `English 首頁`) from a same-article translation link; no release-blocking P0/P1 findings remain.
- Add real creative-coding content to the reserved desktop homepage region; it intentionally remains empty until authored.
- Works section (ALL works: pottery, web, …) — IA undecided, waits for digitized assets (PRODUCT.md).
- Pottery-map mini app: separate project, embeds later as Astro island.
