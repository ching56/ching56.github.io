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
