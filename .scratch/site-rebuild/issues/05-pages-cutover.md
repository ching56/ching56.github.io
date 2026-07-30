# 05 — Cloudflare Pages cutover to jhihcing.li

**What to build:** The new site is live at `https://jhihcing.li`: a Cloudflare Pages project deploys this repo on push; the GitHub Pages workflow and `public/CNAME` are deleted (single deployment story); `www.jhihcing.li` 301s to apex; every old WordPress slug (`/hello-world`, `/about`, `/2022-2`, `/covid`, `/conservation-of-mass`, plus the 2 newly migrated posts' old slugs) 301s to its new `/zh-TW/...` home. Nothing anywhere references the retired legacy domain.

⚠️ **User-only prerequisite:** the DNS move (add `jhihcing.li` zone on Cloudflare free plan, switch nameservers at Namecheap) must be done by the user. This ticket includes preparing exact step-by-step instructions and verifying afterward — an agent must not attempt account/DNS changes itself.

**Blocked by:** 02 — Full content migration; 03 — Bilingual structure; 04 — Atom feed per language. (Plus the user's DNS move.)

**Status:** claimed

- [ ] Cloudflare Pages project builds and deploys from this repo; production URL serves the built site
- [ ] `https://jhihcing.li/` reachable, serving the new site (post-cutover verification)
- [ ] `www` → apex 301 verified; old WP slugs 301 to correct new URLs (each one checked)
- [x] GitHub Pages workflow and CNAME removed; obsolete pre-rebuild STATE items marked cancelled
- [x] No reference to the retired legacy domain remains in the repo
- [x] STATE.md/WORKLOG.md updated

## Comments

### 2026-07-30 — repository preparation complete; waiting on user

Read-only verification found the domain still authoritative on Bluehost and
serving the pre-cutover host, so the live criteria remain unchecked. Commit
`38994ee` adds the tested Cloudflare redirect artifact, exact account/cutover
runbook, and single-deployment cleanup; `9cda7ce` addresses all required
Standards/Spec review findings. The user must push the preparation, complete
runbook sections 1–4, and report the zone plus both Pages custom domains Active.
An agent then runs every section 5 production check before resolving this
ticket. Do not start ticket 06 while this ticket remains claimed.
