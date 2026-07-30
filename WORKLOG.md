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
