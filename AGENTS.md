# AGENTS.md

Guidance for any AI coding agent (Claude Code, Codex, etc.) working in this repository. `CLAUDE.md` is a symlink to this file — edit this one.

## Session protocol (read this first)

1. **Start**: read `STATE.md`. It is the handoff document — it tells you what is in progress, what the exact next step is, and what is waiting on the user. Trust it over guesses from git status.
2. **During**: keep `WORKLOG.md` current (see "Work log" below). Log *before* acting on anything non-trivial, not after.
3. **End or milestone**: update `STATE.md` so that an agent with zero conversation context could continue. Assume you may be cut off at any moment — update it when a milestone lands, not only at session end.

## What this is

Personal blog ("The Return", 李至青的部落格, zh-TW) built with Eleventy 3 (ESM config), deployed to GitHub Pages via GitHub Actions with a custom domain (`public/CNAME`: www.jcli.io). Content is being migrated from WordPress — `thereturn.WordPress.2024-12-20.xml` is the export source (gitignored: it contains private drafts and commenter emails; never commit it). The pre-2025 Parcel site is preserved at the `old-blog` git tag.

## Commands

- `npx eleventy --serve` (or `yarn serve`) — dev server with live reload
- `npx eleventy` (`yarn build`) — production build into `_site/`
- `yarn debug` — build with `DEBUG=*`

There are no tests or linters; a clean `npx eleventy` build is the verification bar. Dependencies are managed with yarn (`yarn.lock`).

## Architecture

Eleventy directory layout is non-default, set in `eleventy.config.js`:

- `content/` — input root. Blog posts live in `content/blog/` as `YYYY-MM-DD-slug.md` with frontmatter `title`, `date`, `layout: layouts/post.njk`, `tags: posts`. The `posts` tag is what feeds the post list and the Atom feed.
- `_includes/layouts/` — `base.njk` → `home.njk` / `post.njk`. `content/content.11tydata.js` sets `layouts/home.njk` as the directory default.
- `_data/metadata.js` — site title/url/author, referenced by templates.
- `_config/filters.js` — custom filters, registered as a plugin in the config.
- `public/` — passthrough-copied verbatim into `_site/` root (e.g. `public/css` → `/css`).
- `_site/` — build output, gitignored. Deployment is `.github/workflows/deploy.yml` (build + deploy to Pages on push to master).

Key config behaviors (`eleventy.config.js`): markdown/HTML are pre-processed with Nunjucks; `draft: true` frontmatter excludes a page from production builds only; the eleventy-img transform plugin rewrites all `<img>` in output HTML to avif/webp; `{% css %}` / `{% js %}` bundle shortcodes are available.

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

- The Atom feed metadata in `eleventy.config.js` still has starter-template placeholders ("Blog Title", example.com) that don't match `_data/metadata.js`.
- `_data/metadata.js` says the site URL is `https://jhihcing.li/` but `public/CNAME` is `www.jcli.io`.
