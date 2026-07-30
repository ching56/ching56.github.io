# 06 — Analytics: beacon + self-owned snapshot ledger

**What to build:** The author can answer "how many times has each post been read, ever" from data they own: the Cloudflare Web Analytics beacon (cookieless, no banner) runs on all pages, and a weekly scheduled job pulls per-page view counts from the Cloudflare GraphQL Analytics API and merges them into a cumulative JSON ledger committed to this repo. The merge logic is a pure function (Seam 3) — (API response + existing ledger) → new ledger — with tests covering first run, overlapping weeks, missing pages, and malformed responses. The job alerts the author on failure (a silent gap is the failure mode that matters). Weekly cadence stays inside the free plan's ~7-day unsampled window; numbers are understood to be sampled estimates.

**Blocked by:** 05 — Cloudflare Pages cutover (beacon token and RUM data require the live zone).

**Status:** ready-for-agent

- [ ] Beacon present on all pages of the live site; no cookies set (verified in a real browser)
- [ ] Merge function is pure and fully unit-tested (first run / overlap / missing pages / malformed input)
- [ ] Scheduled job runs weekly, commits ledger updates, and produces a visible alert on failure
- [ ] Ledger JSON accumulates per-page counts keyed by canonical path, surviving multiple runs idempotently
- [ ] Post-build assertion updated: beacon script is the ONLY third-party request in the HTML
- [ ] STATE.md/WORKLOG.md updated
