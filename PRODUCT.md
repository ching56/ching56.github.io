# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro (settled 2026-07-30 in the grilling interview; static output, Cloudflare Pages, islands reserved for interactive embeds like the pottery-map mini app). Replaces an in-repo Eleventy setup and a live WordPress site. See `.scratch/site-rebuild/spec.md` and `STATE.md` § Decision record.

## Users

- Primary: zh-TW readers — friends, acquaintances, and strangers who find the author's writing; general audience, not tech-specific. Often on mobile and possibly slow connections.
- Secondary (future): English-language readers via the `/en/` edition, which starts empty and grows only as the author chooses to translate.
- The author (李至青 / JHIH-CING LI) as writer and maintainer.

## Product Purpose

A personal site whose core purpose is **sharing and connection**: the author wants their writing to reach people who resonate with it and to receive real reader responses. Success = genuine reader interaction (likes sent, emails received), not traffic volume. Existing writing is personal-life material: yearly reviews (2022, 2023~2024, 2025), illness (確診), reflections (一切不滅定律), an about page.

## Positioning

A quiet, extremely fast, zero-tracking personal site: no cookies, no consent banner, no comment farm — readers respond through a one-click anonymous like or a direct email. Interaction is deliberately low-friction and human-scale rather than social-platform-scale.

## Operating Context

- Content is written in Traditional Chinese (zh-TW) as markdown; publishing = committing a file. Bilingual URL structure `/zh-TW/` + `/en/` with partial translation allowed.
- Read on the public web at `https://jhihcing.li`; readers may arrive from old WordPress links (301-redirected).
- Maintained across AI-agent sessions via `STATE.md` / `WORKLOG.md` handoff (see `AGENTS.md`).

## Capabilities and Constraints

- Static Astro site on Cloudflare Pages; likes via a Cloudflare Worker + D1 (anonymous, no accounts); page views via cookieless Cloudflare beacon + a weekly snapshot ledger committed to the repo.
- Hard constraint: extremely fast on slow connections — system-font stack only (no webfont downloads; Chinese webfonts are MB-scale), no framework JS on content pages, islands load only where embedded.
- No comment/discussion system (decided; Bluesky evaluated and rejected — audience isn't there). Footer email link is the conversation channel.
- **Works section (confirmed 2026-07-30):** the site will have an independent works area showcasing ALL of the author's works — pottery, web projects, and anything else — not just a pottery gallery. Its information architecture is future work; a pottery-map mini app (separate project) will embed as an island in a "how to start pottery" post and in works.
- Undecided product facts: site name (see Brand Commitments); works-section IA and form.

## Brand Commitments

- Domain `jhihcing.li` and the author's name 李至青 / JHIH-CING LI are binding.
- **Site name is OPEN**: "The Return" was the WordPress-era name and the user has explicitly NOT committed to keeping it ("換掉/再想"). Do not treat "The Return" as binding in new design or metadata work; keep the name easily changeable (single metadata source) and raise the naming decision before launch.
- Aesthetic references the user volunteered during planning (not binding briefs, recorded as taste evidence): leerob.com, muan.co, jlord.computer (newspaper style), marcel.io (tabs), chris.eidhof.nl (minimal list), overreacted.io. Current WordPress theme's skeleton (title left, minimal post list right) noted as a liked starting point.

## Evidence on Hand

- 8 real posts (5 in `content/blog/`, 2 only on live WordPress pending migration, plus about). No testimonials, metrics, or press — nothing to showcase or fabricate.
- Pottery works exist physically but no digitized asset inventory is confirmed yet; future works section must not fabricate portfolio content.
- WordPress export XML (gitignored — contains private drafts and commenter emails; never commit derived private data).

## Product Principles

1. **Connection over reach** — every feature is judged by whether it helps a real reader respond, not by growth metrics.
2. **Fast is a feature** — slow-connection readers are first-class; anything that adds page weight must justify itself against the zero-JS, zero-webfont baseline.
3. **Reader privacy is absolute** — no cookies, no tracking, no banners; interaction never requires identity.
4. **Data sovereignty** — counts, likes, and content live in places the author owns (repo, own D1); vendors are replaceable.
5. **Writing friction stays near zero** — one markdown file publishes; translation, likes, analytics never add steps to writing.
