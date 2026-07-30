# STATE.md — handoff document

> Any agent: read this first, update it after every milestone. Format rules in `AGENTS.md` § Handoff mechanism.

## Decision record (2026-07-30 grilling interview — settled, do not re-litigate)

1. **Framework**: rebuild on **Astro** (replaces the current Eleventy setup). Reason: user has a concrete island use case — a pottery-map mini app to embed in a "how to start pottery" post and a works page. The map app itself is a separate project; this repo only provides the island slot.
2. **Deploy**: **Cloudflare Pages** (replaces GitHub Pages). DNS moves to Cloudflare (free zone); domain registration stays at Namecheap.
3. **Domain**: canonical = `https://jhihcing.li` (apex). `www` 301 → apex. `jcli.io` will NOT be renewed (remove `public/CNAME` value on rebuild).
4. **Analytics**: Cloudflare Web Analytics beacon (cookieless, no banner) + a weekly agent/cron snapshot via Cloudflare GraphQL API accumulating per-page counts into a JSON in this repo (free plan retention is only ~30d RUM / 7d unsampled, hence the snapshot). Numbers are sampled estimates; snapshot job needs a failure alert.
5. **Likes**: self-built — Cloudflare Worker + D1, anonymous like button, no cookie/login. This Worker later doubles as API skeleton for the pottery-map app.
6. **Comments/discussion**: none. Footer email link only. (Bluesky rejected: user has no social base there; audience is zh-TW.)
7. **Fonts**: system font stack only, zero webfont download (Chinese webfonts are MB-scale; site must be fast on slow connections).
8. **i18n**: bilingual structure NOW — `/zh-TW/` + `/en/` URL prefixes, hreflang. Root `/` redirects by browser Accept-Language to `/zh-TW/` or `/en/`. Partial translation allowed (a post may exist in one language only). All existing posts go to `/zh-TW/`, English left empty to grow.
9. **Content**: the 2024-12-20 WordPress export is STALE. Live site (https://jhihcing.li, still WordPress) has 2 posts not in the export: "2023 ~ 2024" (2024-12-22) and "2025" (2026-01-01) — re-export or scrape before cutover. Also: "一切不滅定律" (2023-01-27) is missing from the live homepage but user confirmed (2026-07-30) it STAYS published in the new site. Add Cloudflare redirect rules for old WP slugs (`/covid` etc. → `/zh-TW/blog/...`).
10. **Design**: keep the current Yoneko-style skeleton (title left, minimal post list right; cf. chris.eidhof.nl / muan.co). Details in a later design session.

Execution order: DNS move → Astro rebuild + content top-up → Pages cutover → beacon + snapshot agent → likes Worker. Each step independently verifiable.

## Now

Ticket 01 (`.scratch/site-rebuild/issues/01-astro-scaffold-tracer.md`) is resolved: Astro scaffold, one real zh-TW post, centralized metadata, and built-output assertions are complete. No implementation is in flight. On the user's next rebuild go-ahead, open ticket 02 (`.scratch/site-rebuild/issues/02-content-migration.md`) and begin by inventorying the five legacy Markdown posts against the live WordPress post list before moving files.

## In progress

- (none)

## Waiting on user

- **Site name decision**: "The Return" is explicitly NOT confirmed for the new site (PRODUCT.md § Brand Commitments). Keep name in one metadata source; decide before launch.
- **DNS move**: add `jhihcing.li` as a Cloudflare free zone, then change nameservers at Namecheap (user-only action; agent can prepare instructions).
- (superseded) old items — push migration commit / switch Pages source to GitHub Actions — are OBSOLETE if the Astro+Cloudflare rebuild proceeds; do not execute them.

## Backlog

- Rebuild work: ticket 01 resolved; tickets 02/03/07 are now unblocked, with 02 the next execution-order frontier. Tickets live in `.scratch/site-rebuild/issues/`.
- Site naming decision before launch (see Waiting on user).
- Design session: visual world via impeccable new-work, after ticket 01 gives it a running surface (PRODUCT.md carries the taste evidence).
- Configure impeccable live mode once the Astro dev server exists (skipped during init — old stack was about to be replaced).
- Works section (ALL works: pottery, web, …) — IA undecided, waits for digitized assets (PRODUCT.md).
- Pottery-map mini app: separate project, embeds later as Astro island.
