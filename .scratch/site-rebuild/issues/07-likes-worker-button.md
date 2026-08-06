# 07 — Likes: Worker + D1 + post button

**What to build:** A reader who enjoyed a post can press a like button — no login, no cookies — and see the count tick up; the author's like data lives in their own D1. One Cloudflare Worker exposes read-count and increment endpoints keyed by post path, with rate limiting and coarse dedupe (e.g. hashed IP in a time window — implementer's call; the requirement is "honest enough counts, zero tracking"). The button is a few lines of vanilla JS on post pages that degrades to nothing when JS is off. Tested black-box through the Worker's HTTP interface with a local/simulated D1 (Seam 2). Demoable locally against a dev Worker; production wiring lands automatically once 05 is live. This Worker is the designated future home of pottery-map API endpoints — name and structure it accordingly.

**Blocked by:** 01 — Astro scaffold + first post end-to-end. (Parallel with 02/03; production verification after 05.)

**Status:** resolved

- [x] Worker endpoints: get count, increment; unknown paths and bad methods handled sanely
- [x] HTTP black-box tests with local D1 cover: read, increment, dedupe window, rate limit, unknown path
- [x] No cookies, no accounts, no raw-IP storage; whatever dedupe key exists is hashed and windowed
- [x] Button on post pages shows current count, increments on press, disappears gracefully without JS
- [x] Post pages remain framework-JS-free — the button is vanilla JS, not an island
- [x] STATE.md/WORKLOG.md updated

## Answer

The `jhihcing-api` Worker exposes same-origin GET/POST `/api/likes` behavior backed by D1, accepts only published canonical post paths, atomically rate-limits window-specific client hashes, and uses expiring daily hashes for coarse dedupe without cookies, accounts, or raw-IP storage. Post pages include one hidden-by-default, localized vanilla-JavaScript control; JavaScript-disabled readers see nothing, and no Astro island/runtime is emitted.

The Worker HTTP seam is covered with simulated-D1 black-box tests for reads, increments, same-window dedupe, later-window likes, rate limiting, unknown paths, and unsupported methods. The initial migration was also applied successfully to local Wrangler D1. Production account binding, secret creation, migration, deployment, and verification remain correctly sequenced after ticket 05; the production route is already declared in `wrangler.jsonc`.
