# 05 — Cloudflare Pages cutover to jhihcing.li

**What to build:** The new site is live at `https://jhihcing.li`: a Cloudflare Pages project deploys this repo on push; the GitHub Pages workflow and `public/CNAME` are deleted (single deployment story); `www.jhihcing.li` 301s to apex; every old WordPress slug (`/hello-world`, `/about`, `/2022-2`, `/covid`, `/conservation-of-mass`, plus the 2 newly migrated posts' old slugs) 301s to its new `/zh-TW/...` home. Nothing anywhere references `jcli.io` (domain lapses).

⚠️ **User-only prerequisite:** the DNS move (add `jhihcing.li` zone on Cloudflare free plan, switch nameservers at Namecheap) must be done by the user. This ticket includes preparing exact step-by-step instructions and verifying afterward — an agent must not attempt account/DNS changes itself.

**Blocked by:** 02 — Full content migration; 03 — Bilingual structure; 04 — Atom feed per language. (Plus the user's DNS move.)

**Status:** ready-for-agent

- [ ] Cloudflare Pages project builds and deploys from this repo; production URL serves the built site
- [ ] `https://jhihcing.li/` reachable, serving the new site (post-cutover verification)
- [ ] `www` → apex 301 verified; old WP slugs 301 to correct new URLs (each one checked)
- [ ] GitHub Pages workflow and CNAME removed; obsolete pre-rebuild STATE items marked cancelled
- [ ] No reference to `jcli.io` remains in the repo
- [ ] STATE.md/WORKLOG.md updated
