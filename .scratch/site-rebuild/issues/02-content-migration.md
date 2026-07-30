# 02 — Full content migration + Eleventy removal

**What to build:** All of the author's writing lives in the new site: the 5 posts already in the repo, the 2 posts that exist only on live WordPress (「2023 ~ 2024」 2024-12-22, 「2025」 2026-01-01 — re-export or scrape from https://jhihcing.li, screening out private data per the export-file rule in AGENTS.md), and the about page (關於). 「一切不滅定律」 stays published (user confirmed 2026-07-30). The old Eleventy sources, config, and dependencies are removed so the repo has exactly one build story. Every post is covered by the post-build assertion suite.

**Blocked by:** 01 — Astro scaffold + first post end-to-end.

**Status:** resolved

- [x] All 7 posts + about page render at `/zh-TW/...` URLs with correct titles, dates, and full body content
- [x] The 2 WordPress-only posts are migrated from the live site; no commenter emails or private drafts enter git
- [x] 「一切不滅定律」 is present and published
- [x] Eleventy config, layouts, `content/`, and Eleventy-only dependencies are removed; `astro build` is the only build
- [x] Post-build assertions enumerate and verify every post
- [x] STATE.md/WORKLOG.md updated
