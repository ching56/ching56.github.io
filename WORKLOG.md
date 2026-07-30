# WORKLOG.md — append-only reasoning trail

> Log **before** acting on anything non-trivial (commit, delete/rename, config/workflow/dependency change, deploy-touching work): Intent + Why, then fill Result after. Never rewrite old entries. Format rules in `AGENTS.md` § Work log.

## 2026-07-30 · claude-code
- Intent: replace old Parcel site with Eleventy sources on master, preserve old blog
- Why: user requested single-branch history; old site reachable via `old-blog` tag and prior commits
- Result: committed (this entry ships in the same commit) (sources + Actions deploy workflow; `_site/` gitignored; CNAME moved to `public/`; WordPress export excluded from git as it contains private data). Not pushed.

## 2026-07-30 · claude-code
- Intent: make repo agent-independent (AGENTS.md canonical, CLAUDE.md symlink) and add WORKLOG/STATE handoff mechanism
- Why: user will alternate between Claude Code and Codex; sessions may be cut off mid-task
- Result: wrote `AGENTS.md`, `STATE.md`, `WORKLOG.md`; replaced `CLAUDE.md` with symlink to `AGENTS.md`. Uncommitted.

## 2026-07-30 · claude-code
- Intent: commit agent-config files (AGENTS.md, CLAUDE.md symlink, STATE.md, WORKLOG.md, docs/agents/)
- Why: user requested; makes handoff mechanism visible to any agent cloning the repo
- Result: committed `57359cd`
## 2026-07-30 · claude-code
- Intent: record the site-architecture decisions from the grilling interview into STATE.md (no implementation yet)
- Why: interview reached shared understanding on 10 structural decisions (Astro rebuild, Cloudflare Pages, domain, analytics, likes, bilingual structure); losing them would force re-litigating everything
- Result: STATE.md rewritten with decision record + new execution backlog
## 2026-07-30 · claude-code
- Intent: publish the site-rebuild spec to the local issue tracker (.scratch/site-rebuild/spec.md, Status: ready-for-agent)
- Why: /to-spec invoked after the grilling interview; seams confirmed with user (built output / Worker HTTP / snapshot merge fn); visual rules explicitly deferred to user's impeccable skill
- Result: spec written (problem, solution, 28 user stories, implementation+testing decisions, out-of-scope)
## 2026-07-30 · claude-code
- Intent: create PRODUCT.md via /impeccable init (product truth only, no visual decisions)
- Why: impeccable installed; init interview answered 3 gaps: purpose = sharing & connection; site name "The Return" is NOT binding (open decision); works section will cover ALL works (pottery + web + others), not pottery-only
- Result: PRODUCT.md written; naming decision added to STATE.md waiting-on-user
## 2026-07-30 · claude-code
- Intent: publish 7 approved tracer-bullet tickets to .scratch/site-rebuild/issues/ (to-tickets flow)
- Why: user approved the breakdown; dependency graph: 01 root; 02/03/07 parallel after 01; 04 after 02+03; 05 gate; 06 after 05
- Result: 01..07 written, all Status: ready-for-agent

## 2026-07-30 17:40 · codex
- Intent: implement site-rebuild ticket 01 as a TDD tracer bullet: replace the active build with Astro, render one real zh-TW post end to end, and add assertions against `dist/`
- Why: the user invoked `$implement`; ticket 01 is the unblocked frontier and establishes the agreed built-output test seam for later tickets
- Result: implementation green — `astro check` has zero errors, the dev server returned HTTP 200 for both routes, and the full `npm test` build + 2 built-output assertions pass; required code review and final commit handoff remain

## 2026-07-30 18:00 · codex
- Intent: address every hard/partial finding from the required two-axis review, update the now-stale Astro contributor guidance, and remove the route-helper duplication flagged as a judgement call
- Why: ticket 01 is not complete while its no-JS assertion has a blind spot or the next agent is directed to obsolete Eleventy commands
- Result: done — `AGENTS.md` now documents the transitional Astro architecture, the assertion rejects every script tag, route helpers are shared, and `npm run check` + `npm test` pass

## 2026-07-30 18:04 · codex
- Intent: commit the reviewed ticket 01 fixes and final handoff state
- Why: the `$implement` workflow requires the completed work on the current branch, and the issue tracker must not advertise a resolved ticket as ready for another agent
- Result: done — review fixes and the resolved handoff ship in this commit

## 2026-07-30 18:05 · codex
- Intent: append the outcome of the 17:40 implementation entry without rewriting its original result, and close the last no-webfont assertion gap found by the final review
- Why: `WORKLOG.md` is append-only, and a provider allowlist cannot prove that arbitrary remote font stylesheets are absent
- Result: in progress — preserve the old entry, reject every remote stylesheet, rerun verification, and append the outcome

## 2026-07-30 18:06 · codex
- Intent: record the completed ticket 01 audit and return the handoff to the next frontier
- Why: the prior entry must remain unchanged while its result is captured append-only for the next agent
- Result: done — the original 17:40 result is preserved; implementation is in `1b9a751`, review fixes are in `75946a5`, arbitrary remote stylesheets are now rejected, and the final `npm run check` + `npm test` pass; this audit ships in the following commit

## 2026-07-30 18:08 · codex
- Intent: close the last adversarial review gap by applying the font-rule assertion to inline page styles as well as emitted CSS files
- Why: a page-level `@font-face` or `@import` could otherwise bypass the promised no-webfont regression guard
- Result: in progress — strengthen the page assertion, rerun `npm test`, and append the verified outcome

## 2026-07-30 18:09 · codex
- Intent: record the final inline-style audit outcome without rewriting the entry above
- Why: the next agent needs an append-only record that the strengthened assertion was actually exercised against a fresh production build
- Result: done — `npm test` rebuilt both routes and both built-output assertions passed with inline and emitted font rules covered; the change ships in the following commit

## 2026-07-30 18:10 · codex
- Intent: eliminate the remaining mismatch between inline and emitted CSS font-rule assertions
- Why: the emitted-CSS matcher accepts only `@import url(...)`, while valid quoted `@import "…"` syntax must also fail the no-webfont guard
- Result: in progress — share the broader matcher across both artifact types, rerun `npm test`, and append the outcome

## 2026-07-30 18:11 · codex
- Intent: record the shared-matcher audit result without rewriting the entry above
- Why: the final handoff should show that both inline and emitted CSS were verified with the same rule
- Result: done — one matcher now rejects `@font-face` and every `@import` form in HTML and emitted CSS; the fresh production build and both assertions pass, and this change ships in the following commit

## 2026-07-30 18:19 · codex
- Intent: claim site-rebuild ticket 02 and inventory the five legacy Markdown posts against the live WordPress posts and about page before changing content
- Why: the live site is the content source of truth, while the stale export is private and must not enter git; an explicit inventory prevents missing or accidentally importing non-public material
- Result: in progress — verify only publicly rendered titles, dates, slugs, and article bodies, then start the first built-output red/green content slice

## 2026-07-30 18:26 · codex
- Intent: record the completed public-content inventory and start the built-output TDD slices with `Hello world!`
- Why: WordPress.com's public API mirror returned only six `status: publish` posts and the selected public fields; adding the user-confirmed hidden `一切不滅定律` yields the required seven without touching drafts, comments, or the private export
- Result: inventory complete — live-only posts are `2023 ~ 2024` (2024-12-22, old slug `2023-2024`) and `2025` (2026-01-01, old slug `2025-2`); the live copies also identify corrupt legacy characters that must be restored to `未來` and `解隔`; next add the failing `Hello world!` artifact assertion

## 2026-07-30 18:38 · codex
- Intent: remove the tracked Eleventy sources, config, and Eleventy-only dependencies after preserving all public writing in seven Astro post routes plus `/zh-TW/about/`
- Why: the content slices and focused built-output assertions are green, so the legacy build can now be removed without risking the author's only copy; ticket 02 requires Astro to be the repo's single build story
- Result: in progress — delete only `_config/`, `_data/`, `_includes/`, `content/`, and `eleventy.config.js`, update the Yarn manifest/lockfile, then run the full artifact suite

## 2026-07-30 18:41 · codex
- Intent: commit the ticket 02 implementation snapshot and run the required two-axis review against task-start commit `20b3d96`
- Why: all nine built-output tests pass, Astro diagnostics are clean, and the code-review skill requires a fixed committed diff for independent Standards and Spec agents
- Result: in progress — verify the cleanup diff, commit only ticket 02 files while preserving unrelated dirty work, then address every actionable review finding before resolving the ticket

## 2026-07-30 18:50 · codex
- Intent: address both code-review duplication findings, expand the no-JS/no-webfont audit across every migrated content page, and finish the ticket 02 handoff
- Why: the Standards review found repeated post assertions and duplicated article markup; the Spec review otherwise confirmed the content implementation, while its workflow finding belongs explicitly to ticket 05 (`05-pages-cutover.md`) and must not expand this ticket into deployment changes
- Result: in progress — introduce one shared article component and one enumerated post assertion table, rerun the final bar, resolve ticket 02, and commit only ticket-owned handoff hunks

## 2026-07-30 18:54 · codex
- Intent: record the reviewed ticket 02 outcome and commit its final handoff without absorbing unrelated dirty work
- Why: both duplication findings are fixed, all nine content artifacts now share the no-JS/no-webfont audit, `yarn run check` reports zero diagnostics, and `yarn test` passes all nine assertions
- Result: done — ticket 02 is resolved; the obsolete GitHub Pages workflow is a reviewed, documented exception owned by ticket 05, and the next implementation frontier is ticket 03

## 2026-07-30 19:00 · codex
- Intent: claim site-rebuild ticket 03 and implement its bilingual structure through the agreed built-output and redirect HTTP seams, one red/green behavior at a time
- Why: ticket 02 is resolved and ticket 03 is the next unblocked frontier; externally observed locale pages and Request-to-Response redirect behavior cover the reader-visible contract without coupling tests to Astro internals
- Result: in progress — first add a failing artifact assertion for the `/en/` edition, then implement locale-aware chrome, language switching, partial-translation/hreflang rules, and the root Accept-Language redirect before the required review

## 2026-07-30 19:05 · codex
- Intent: add the deployment-facing root Pages Function only after pinning its Accept-Language choices and cache behavior through its public HTTP response
- Why: Cloudflare Pages' documented file routing maps `functions/index.js` exactly to `/`; testing real `Request` inputs and `Response` status/headers keeps the dynamic redirect externally verifiable without introducing an Astro server adapter
- Result: in progress — first capture the required red for Chinese, English/non-Chinese, missing-header, and `Vary: Accept-Language` behavior, then add the minimal Function

## 2026-07-30 19:07 · codex
- Intent: complete the partial-translation authoring skeleton with an English article route and extend the existing performance audit to the English edition
- Why: the empty English list correctly hides zh-TW-only posts, but a future English Markdown entry would otherwise link to a missing page; no production translation may be invented solely to make that path externally exercisable today
- Result: in progress — add the symmetric content-driven route without adding English content, remove the diagnostics hint, then run the complete artifact/HTTP suite

## 2026-07-30 19:09 · codex
- Intent: commit the green ticket 03 implementation snapshot and run the required two-axis review against task-start commit `93e3d90`
- Why: Astro diagnostics are clean and all 13 artifact/HTTP assertions pass; the review skill needs a fixed committed diff and must evaluate repo standards independently from ticket/spec fidelity
- Result: in progress — stage only ticket 03 files and this task's WORKLOG hunks, preserve pre-existing product-ideas/tooling work, then address every actionable review finding

## 2026-07-30 19:13 · codex
- Intent: address all required review findings before resolving ticket 03: harden Accept-Language quality handling, remove duplicated locale-list rendering, and refresh the handoff frontier
- Why: the Spec review found valid `Q=0`/wildcard inputs that choose the wrong locale; the Standards review found the two list pages repeat query/sort/row logic and that the committed STATE resume point became stale at the snapshot milestone
- Result: in progress — reproduce the negotiation bugs with HTTP-level red tests, fix them, extract one locale-aware post-list component, then run the final verification bar

## 2026-07-30 19:15 · codex
- Intent: resolve ticket 03 and commit the reviewed fixes plus final zero-context handoff
- Why: both review axes are now satisfied, `yarn run check` reports zero errors/warnings/hints, and `yarn test` passes all 13 production-artifact and redirect HTTP assertions
- Result: in progress — stage only ticket-owned review/finalization changes, commit them, then append the resulting commit hashes without absorbing unrelated work

## 2026-07-30 19:16 · codex
- Intent: record the completed ticket 03 review and commit outcome without rewriting prior append-only entries
- Why: the handoff should distinguish the initial implementation snapshot from the review fixes and show that no required work remains
- Result: done — implementation is `7ac871b`; all Standards/Spec findings are addressed in `58f3156`; ticket 03 is resolved, `yarn run check` is clean, and all 13 `yarn test` assertions pass

## 2026-07-30 19:20 · codex
- Intent: claim site-rebuild ticket 04 and implement locale-specific Atom feeds through the agreed built-output seam, one red/green behavior at a time
- Why: tickets 02 and 03 are resolved; feed-reader-visible XML artifacts and locale-page discovery links cover the complete ticket contract without testing Astro internals
- Result: in progress — first assert that both stable feed URLs emit parseable Atom XML, then cover centralized metadata, complete zh-TW entries, the empty English feed, and locale-specific discovery before review

## 2026-07-30 19:22 · codex
- Intent: declare the existing `sax` XML parser as a direct test dependency before adding Atom artifact assertions
- Why: “parse as valid Atom” must exercise emitted XML with a strict parser, and tests must not depend on `sax` remaining an incidental transitive dependency
- Result: in progress — add the dev dependency with Yarn 1, then use it only at the built-output seam

## 2026-07-30 19:25 · codex
- Intent: record the XML-parser dependency and diagnostics outcomes without rewriting the entries above
- Why: the initial sandboxed registry lookup failed, and Yarn 1 treats bare `yarn check` as its own networked command rather than this repo's script; both details matter to the next agent
- Result: done — the approved Yarn retry declared `sax@^1.6.1`; `corepack yarn run check` invokes `astro check` correctly and reports zero errors, warnings, or hints

## 2026-07-30 19:26 · codex
- Intent: commit the green ticket 04 implementation snapshot and run the required two-axis review against task-start commit `427e78a`
- Why: both feeds pass strict XML/RFC-structure assertions, all locale entries/discovery links are covered through `dist/`, and the code-review skill requires a fixed committed diff for independent Standards and Spec agents
- Result: in progress — stage only ticket 04 files and this task's appended WORKLOG hunks, preserve unrelated product-ideas/tooling changes, then address every actionable review finding before resolving the ticket
