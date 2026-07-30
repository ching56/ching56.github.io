# STATE.md — handoff document

> Any agent: read this first, update it after every milestone. Format rules in `AGENTS.md` § Handoff mechanism.

## Now

Nothing in flight. Next natural task: WordPress content migration (see Backlog).

## In progress

- (none)

## Waiting on user

- Push the migration commit and tag: `git push origin master old-blog` (nothing has been pushed yet).
- Repo Settings → Pages: switch source from "Deploy from a branch" to "GitHub Actions" — until then the site serves the old master root, which no longer has built files after push.
- Decide canonical domain: `_data/metadata.js` says `jhihcing.li`, `public/CNAME` says `www.jcli.io`. Agents should not guess.

## Backlog

- Migrate remaining posts from `thereturn.WordPress.2024-12-20.xml` (local only, gitignored) into `content/blog/` as markdown.
- Fix Atom feed placeholders in `eleventy.config.js` (title "Blog Title", base "https://example.com/") to match `_data/metadata.js` — blocked on the domain decision above.
