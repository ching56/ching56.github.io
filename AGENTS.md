# AGENTS.md

Guidance for any AI coding agent (Claude Code, Codex, etc.) working in this repository. `CLAUDE.md` is a symlink to this file — edit this one.

## Session protocol (read this first)

1. **Start**: read `STATE.md`. It is the handoff document — it tells you what is in progress, what the exact next step is, and what is waiting on the user. Trust it over guesses from git status.
2. **During**: keep `WORKLOG.md` current (see "Work log" below). Log *before* acting on anything non-trivial, not after.
3. **End or milestone**: update `STATE.md` so that an agent with zero conversation context could continue. Assume you may be cut off at any moment — update it when a milestone lands, not only at session end.

## What this is

Personal blog (working title "The Return", 李至青的部落格, zh-TW) rebuilt as a static Astro 7 site for Cloudflare Pages. The title remains an open product decision; metadata is centralized so it can change once. The public WordPress content is migrated, while the Pages account and DNS cutover remain user-owned. `thereturn.WordPress.2024-12-20.xml` is stale and gitignored because it contains private drafts and commenter emails; never commit it. The pre-2025 Parcel site is preserved at the `old-blog` git tag.

## Commands

- `yarn serve` (or `yarn dev`) — Astro dev server with live reload
- `yarn build` — production build into `dist/`
- `yarn check` — Astro/TypeScript diagnostics
- `yarn test` — production build followed by assertions against `dist/`
- `yarn -s motion:record <url>` — headless Chrome frame-by-frame recording of a page's motion, as JSON (`--help` for options)

A versioned pre-commit hook (`.githooks/pre-commit` → `scripts/bump-updated.mjs`) sets `updated:` to today's Asia/Taipei date on any staged post or page whose Markdown body changed. `yarn install` activates it through `prepare` (`core.hooksPath`). Don't bypass it with `--no-verify` for content edits.

There is no linter. A clean `yarn check` plus `yarn test` is the verification bar. Dependencies are managed with Yarn 1 (`yarn.lock`; version pinned in `package.json`).

### Verifying bugs the user saw

`yarn check` plus `yarn test` don't see motion or devices. For a bug the user reports:

1. Reproduce it on the platform they saw it on before changing code: an iPhone report means the iOS Simulator (its Safari reaches `yarn dev` at localhost), not desktop Chrome.
2. Verify motion frame by frame on that platform. Open any dev page with `?probe` to get a frame recording overlaid on the page, or run `yarn -s motion:record` on desktop. The probe reads computed styles, not the screen: on iOS, also record the Simulator screen and read its frames, since iOS can hold back frames during a fast flick.
3. If it doesn't reproduce there, say so. Don't fix a neighbouring bug and call the reported one fixed.

How to do each step: `docs/testing-motion.md`.

## Architecture

The active Astro scaffold uses the default project roots:

- `astro.config.mjs` — static output, canonical site URL, trailing-slash/directory routes.
- `src/config/site.js` — the single source for site title, canonical URL, description, and author.
- `src/content.config.ts` / `src/content/posts/` — typed Markdown collections organized by locale.
- `src/pages/` — locale-prefixed list and post routes; the first tracer lives under `/zh-TW/`.
- `src/layouts/` / `src/styles/` — shared document head/layout and system-font-only CSS. `global.css` only `@import`s ordered partials (base, header, bottle, dock, navigation, intro, diary, register, article, responsive); the import order is the cascade order. Keep every source file under 300 lines.
- `src/scripts/bottle-home.js` — the home bottle's state machines, inlined minified by `BottleMark.astro`.
- `scripts/motion-probe.js` / `src/lib/dev-motion-probe.mjs` / `scripts/record-motion.mjs` — the `?probe` frame recorder, injected into `astro dev` pages only, and its headless Chrome runner (`docs/testing-motion.md`).
- `tests/built-site.test.mjs` — behavioral assertions against production output (routes, content, metadata, no runtime JS beyond the likes script and the homepage bottle loader, no webfonts).
- `public/` — static assets and Cloudflare's `_redirects` file, copied verbatim into `dist/`.
- `dist/` — generated build output, gitignored.

The Eleventy sources, config, dependencies, GitHub Pages workflow, and legacy CNAME are gone. Cloudflare Pages is the sole intended deployment path, but its account-side setup and production cutover remain user-owned. The local verification path is `yarn check` plus `yarn test`.

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

- None currently documented.
