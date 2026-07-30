# AGENTS.md

Guidance for any AI coding agent (Claude Code, Codex, etc.) working in this repository. `CLAUDE.md` is a symlink to this file — edit this one.

## Session protocol (read this first)

1. **Start**: read `STATE.md`. It is the handoff document — it tells you what is in progress, what the exact next step is, and what is waiting on the user. Trust it over guesses from git status.
2. **During**: keep `WORKLOG.md` current (see "Work log" below). Log *before* acting on anything non-trivial, not after.
3. **End or milestone**: update `STATE.md` so that an agent with zero conversation context could continue. Assume you may be cut off at any moment — update it when a milestone lands, not only at session end.

## What this is

Personal blog (working title "The Return", 李至青的部落格, zh-TW) being rebuilt as a static Astro 7 site for Cloudflare Pages. The title remains an open product decision; metadata is centralized so it can change once. The first Astro tracer is active, while legacy Eleventy source and deployment files remain only until their scheduled cleanup tickets. Content is being migrated from WordPress — `thereturn.WordPress.2024-12-20.xml` is stale and gitignored because it contains private drafts and commenter emails; never commit it. The pre-2025 Parcel site is preserved at the `old-blog` git tag.

## Commands

- `yarn serve` (or `yarn dev`) — Astro dev server with live reload
- `yarn build` — production build into `dist/`
- `yarn check` — Astro/TypeScript diagnostics
- `yarn test` — production build followed by assertions against `dist/`

There is no linter. A clean `yarn check` plus `yarn test` is the verification bar. Dependencies are managed with Yarn 1 (`yarn.lock`; version pinned in `package.json`).

## Architecture

The active Astro scaffold uses the default project roots:

- `astro.config.mjs` — static output, canonical site URL, trailing-slash/directory routes.
- `src/config/site.js` — the single source for site title, canonical URL, description, and author.
- `src/content.config.ts` / `src/content/posts/` — typed Markdown collections organized by locale.
- `src/pages/` — locale-prefixed list and post routes; the first tracer lives under `/zh-TW/`.
- `src/layouts/` / `src/styles/` — shared document head/layout and system-font-only baseline CSS.
- `tests/built-site.test.mjs` — behavioral assertions against production output (routes, content, metadata, no webfonts/runtime JS).
- `public/` — copied verbatim into `dist/`; it still contains legacy files pending later cleanup.
- `dist/` — generated build output, gitignored.

Legacy Eleventy directories (`content/`, `_includes/`, `_data/`, `_config/`) and `eleventy.config.js` are deliberately still present for ticket 02. The existing GitHub Pages workflow still targets `_site/` and is obsolete; ticket 05 replaces it during the Cloudflare Pages cutover. Do not treat that workflow as the current local verification path.

## Work log

`WORKLOG.md` (repo root, append-only) is the shared reasoning trail across agents and sessions. The point is *proactive* reasoning: state what you are about to do and why **before** doing it, so an interrupted session still shows intent, not just wreckage.

Log an entry before any non-trivial action — commits, file deletions/renames, config or workflow changes, dependency changes, anything touching deployment. Routine reads and trivial edits don't need entries.

Entry format:

```markdown
## 2026-07-30 14:05 · claude-code
- Intent: move CNAME into public/ so the Actions artifact carries the domain
- Why: Pages via Actions serves the artifact, not repo root
- Result: done, build verified (11 files)
```

Fill `Result:` after the action (including failures — a failed attempt is exactly what the next agent needs to know). Never rewrite old entries; append corrections.

## Handoff mechanism

`STATE.md` (repo root) has four sections; keep all four present even when empty:

- **Now** — the single task in flight, with the *exact next step* spelled out (command to run, file to edit). This is the resume point.
- **In progress** — other started-but-unfinished threads.
- **Waiting on user** — decisions or manual steps only the user can do.
- **Backlog** — known future work, one line each.

Rules: update `STATE.md` immediately after completing or abandoning the "Now" item; when picking up a session, verify the "Now" step against reality (git log, build output) before executing it — the previous agent may have stopped between doing and recording; if `STATE.md` and `WORKLOG.md` disagree, the worklog's last entry is the fresher truth.

## Agent skills

The following applies to agents with the corresponding skills installed; other agents can ignore it, but should respect `.scratch/` and `docs/adr/` conventions if they encounter them.

### Issue tracker

Issues and specs live as local markdown files under `.scratch/<feature-slug>/` in this repo. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`, recorded as `Status:` lines in issue files. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.

## Known inconsistencies

- The inactive Eleventy Atom feed still has starter placeholders; ticket 02 removes the legacy setup and ticket 04 introduces locale feeds from Astro metadata.
- `public/CNAME` still contains `www.jcli.io`, so Astro copies it into `dist/`; ticket 05 removes it at the Cloudflare cutover. Canonical page metadata already uses `https://jhihcing.li`.
