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
