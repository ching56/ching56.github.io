# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Personal blog ("The Return", 李至青的部落格, zh-TW) built with Eleventy 3 (ESM config), deployed to GitHub Pages with a custom domain (`CNAME`: www.jcli.io). Content is being migrated from WordPress — `thereturn.WordPress.2024-12-20.xml` is the export source. The old Parcel-based site (src/, index.html, etc.) is deleted but not yet committed.

## Commands

- `npx eleventy --serve` (or `yarn serve` / `npm run serve`) — dev server with live reload
- `npx eleventy` (`yarn build`) — production build into `_site/`
- `yarn debug` — build with `DEBUG=*`

There are no tests or linters. Dependencies are managed with yarn (`yarn.lock`).

## Architecture

Eleventy directory layout is non-default, set in `eleventy.config.js`:

- `content/` — input root. Blog posts live in `content/blog/` as `YYYY-MM-DD-slug.md` with frontmatter `title`, `date`, `layout: layouts/post.njk`, `tags: posts`. The `posts` tag is what feeds the post list and the Atom feed.
- `_includes/layouts/` — `base.njk` → `home.njk` / `post.njk`. `content/content.11tydata.js` sets `layouts/home.njk` as the directory default.
- `_data/metadata.js` — site title/url/author, referenced by templates.
- `_config/filters.js` — custom filters, registered as a plugin in the config.
- `public/` — passthrough-copied verbatim into `_site/` root (e.g. `public/css` → `/css`).
- `_site/` — build output. Not in `.gitignore` and currently untracked; do not commit it unless the user says deployment relies on it.

Key config behaviors (`eleventy.config.js`): markdown/HTML are pre-processed with Nunjucks; `draft: true` frontmatter excludes a page from production builds only; the eleventy-img transform plugin rewrites all `<img>` in output HTML to avif/webp; `{% css %}` / `{% js %}` bundle shortcodes are available.

## Known inconsistencies

- The Atom feed metadata in `eleventy.config.js` still has starter-template placeholders ("Blog Title", example.com) that don't match `_data/metadata.js`.
- `_data/metadata.js` says the site URL is `https://jhihcing.li/` but `CNAME` is `www.jcli.io`.
