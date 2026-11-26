# Cloudflare Pages cutover runbook

This runbook is the zero-context checklist for moving `jhihcing.li` from the
current WordPress/Bluehost path to this repository's Astro build. Account and
DNS changes are user-only. An agent may prepare repository files and run the
read-only verification commands, but must not operate Cloudflare, Namecheap,
or production deployment controls.

## Current state (checked 2026-07-30 19:38 Asia/Taipei; nameservers and apex A rechecked unchanged 2026-11-22)

- Authoritative nameservers: `ns1.bluehost.com`, `ns2.bluehost.com`
- Apex A record: `66.235.200.145`
- `www` CNAME: `jhihcing.li`
- `https://jhihcing.li/`, `https://www.jhihcing.li/`, and
  `https://jhihcing.li/covid` returned an HTTP 403 Cloudflare challenge, not
  the Astro build

The Cloudflare DNS prerequisite is therefore incomplete. The obsolete GitHub
Pages workflow (which still invoked the removed Eleventy build) and the CNAME
for a retired, unrelated domain were safely removed during repository
preparation; neither served the current WordPress production site.

## 1. User: move authoritative DNS to Cloudflare

1. In Cloudflare, open **Domains > Onboard a domain**, enter `jhihcing.li`, and
   select the Free plan.
2. Review the scanned zone before continuing. Preserve every record still in
   use, especially MX, TXT, CAA, verification, mail, and other non-web records.
   A nameserver change does not copy missing records later. Keep the current
   apex/`www` web records during activation so the old site remains the
   fallback until Pages is attached.
3. If DNSSEC is active at Namecheap, disable it before changing nameservers.
   A stale DS record can make the domain unreachable.
4. Copy the two nameservers assigned on the Cloudflare zone's **Overview**
   page. They are unique to the zone; do not substitute names from an example.
5. In Namecheap, open **Domain List > jhihcing.li > Manage > Domain**. At
   **Nameservers**, choose **CustomDNS**, replace both Bluehost values with the
   two exact Cloudflare-assigned nameservers, and save with the checkmark.
6. Return to the Cloudflare zone and select **Check nameservers**. Wait until
   the zone status is **Active**. Propagation can take up to 24–48 hours.
7. Confirm both public resolvers return only the assigned Cloudflare
   nameservers:

   ```sh
   dig +short NS jhihcing.li @1.1.1.1
   dig +short NS jhihcing.li @8.8.8.8
   ```

Cloudflare's [full-zone setup guide](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/)
documents the record review, DNSSEC precaution, assigned nameservers, and
activation check. Namecheap's [Cloudflare DNS guide](https://www.namecheap.com/support/knowledgebase/article.aspx/9607/2210/how-to-set-up-dns-records-for-your-domain-in-a-cloudflare-account/)
documents the exact CustomDNS controls and warns that records left only at the
old DNS provider stop applying after the switch.

Stop here if the two resolver checks do not agree or Cloudflare is not Active.

## 2. User: create and verify the Pages project

The preparation commit containing `public/_redirects` must first be present on
`origin/master`; Cloudflare cannot build an unpushed local commit.

1. In Cloudflare, open **Workers & Pages > Create application > Pages > Import
   an existing Git repository**.
2. Authorize the Cloudflare GitHub application for
   `ching56/ching56.github.io`, select the repository, and begin setup.
3. Use these build settings:

   | Setting | Value |
   | --- | --- |
   | Production branch | `master` |
   | Build command | `yarn build` |
   | Build output directory | `dist` |
   | Root directory | `/` (repository root) |
   | `NODE_VERSION` | `22.16.0` |
   | `YARN_VERSION` | `1.22.22` |

4. Select **Save and Deploy**. The build must succeed, and its log must show
   Astro emitting `dist/`. The project will then redeploy each pushed
   `master` commit through Cloudflare's Git integration.
5. Before changing the web records, verify the generated `*.pages.dev` URL:

   ```sh
   curl --silent --show-error --head https://PROJECT.pages.dev/en/
   curl --silent --show-error --head https://PROJECT.pages.dev/zh-tw/
   curl --silent --show-error https://PROJECT.pages.dev/zh-TW/ | rg 'november-bottles'
   curl --silent --show-error --head https://PROJECT.pages.dev/
   ```

   Expected: `/en/` is HTTP 302 to `/zh-TW/` (the English edition is
   parked); `/zh-tw/` is HTTP 301 to `/zh-TW/`; the Chinese feed links the
   newest post; `/` is HTTP 302 to `/zh-TW/` whatever the reader's
   language.

Cloudflare's [Astro Pages guide](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)
specifies the `dist` output and Git-backed deploy flow. Its current v3
[build image](https://developers.cloudflare.com/pages/configuration/build-image/)
supports Node `22.16.0` and lets `NODE_VERSION`/`YARN_VERSION` pin the runtime
and package manager used here.

Stop here if the Pages deployment or any `*.pages.dev` check fails.

## 3. User: attach the production hostnames

1. Open the Pages project, then **Custom domains > Set up a domain**. Add
   `jhihcing.li`. When Cloudflare reports the existing apex A record
   (`66.235.200.145`) conflicts with the Pages record, approve replacing only
   that old web record with the Pages-managed CNAME. Do not delete or modify
   MX, TXT, CAA, mail, or verification records. Wait until the apex custom
   domain is Active.
2. Repeat **Set up a domain** for `www.jhihcing.li`. When prompted, approve
   replacing only the old `www` CNAME (`jhihcing.li`) with the Pages-managed
   CNAME. Do not merely create a standalone CNAME to `*.pages.dev`, because an
   unassociated Pages hostname can return HTTP 522.
3. In **DNS > Records**, confirm both `@` and `www` now show the
   Pages-managed `PROJECT.pages.dev` target and **Proxied** (orange cloud), and
   that the preserved non-web records are still present.
4. Confirm both custom domains show Active and have valid HTTPS before adding
   the canonical redirect.

See Cloudflare's [Pages custom-domain procedure](https://developers.cloudflare.com/pages/configuration/custom-domains/).

## 4. User: make `www` permanently redirect to the apex

1. In the `jhihcing.li` zone, open **Rules > Overview > Create rule > Redirect
   Rule**.
2. Name it `www to apex` and choose **Custom filter expression**:

   ```text
   http.host eq "www.jhihcing.li"
   ```

3. Choose a dynamic target URL and enter:

   ```text
   concat("https://jhihcing.li", http.request.uri.path)
   ```

4. Select status **301**, enable **Preserve query string**, and deploy the
   rule. The `www` DNS record must remain proxied (orange cloud), since Single
   Redirects only run on proxied traffic.

Cloudflare documents these controls in [Create a redirect rule in the dashboard](https://developers.cloudflare.com/rules/url-forwarding/single-redirects/create-dashboard/)
and the available [Single Redirect settings](https://developers.cloudflare.com/rules/url-forwarding/single-redirects/settings/).

## 5. Agent: verify the production contract read-only

Run each command without `-L`; every reported status/location must match
exactly. Query strings on `www` should be retained.

```sh
curl -sS -o /dev/null -w '%{http_code} %{redirect_url}\n' \
  'https://www.jhihcing.li/covid?source=cutover'
curl -sS -o /dev/null -w '%{http_code} %{redirect_url}\n' \
  https://jhihcing.li/hello-world
curl -sS -o /dev/null -w '%{http_code} %{redirect_url}\n' \
  https://jhihcing.li/about
curl -sS -o /dev/null -w '%{http_code} %{redirect_url}\n' \
  https://jhihcing.li/2022-2
curl -sS -o /dev/null -w '%{http_code} %{redirect_url}\n' \
  https://jhihcing.li/covid
curl -sS -o /dev/null -w '%{http_code} %{redirect_url}\n' \
  https://jhihcing.li/conservation-of-mass
curl -sS -o /dev/null -w '%{http_code} %{redirect_url}\n' \
  https://jhihcing.li/2023-2024
curl -sS -o /dev/null -w '%{http_code} %{redirect_url}\n' \
  https://jhihcing.li/2025-2
```

Expected results:

| Request | Status and location |
| --- | --- |
| `www` `/covid?source=cutover` | `301 https://jhihcing.li/covid?source=cutover` |
| `/hello-world` | `301 https://jhihcing.li/zh-TW/` |
| `/about` | `301 https://jhihcing.li/zh-TW/#about` |
| `/2022-2` | `301 https://jhihcing.li/zh-TW/` |
| `/covid` | `301 https://jhihcing.li/zh-TW/` |
| `/conservation-of-mass` | `301 https://jhihcing.li/zh-TW/` |
| `/2023-2024` | `301 https://jhihcing.li/zh-TW/` |
| `/2025-2` | `301 https://jhihcing.li/zh-TW/` |

The old posts behind these slugs are hidden (`published: false`), so every
legacy slug lands on the zh-TW home; `public/_redirects` is the source of truth.

Then verify the redirects and built content:

```sh
curl -sS -D - -o /dev/null https://jhihcing.li/
curl -sS -D - -o /dev/null https://jhihcing.li/en/
curl -sS -D - -o /dev/null https://jhihcing.li/zh-tw/
curl -sS https://jhihcing.li/zh-TW/ | rg 'november-bottles'
curl -sS https://jhihcing.li/zh-TW/atom.xml | rg \
  'application/atom\+xml|<feed|<entry'
```

Expected: `/` and `/en/` redirect 302 to `/zh-TW/`, `/zh-tw/` redirects 301
to `/zh-TW/`, the feed links the
newest post, and the Atom response contains a feed with entries.

The committed old-slug rules live in `public/_redirects` and are asserted from
the generated `dist/_redirects` artifact by `yarn test`. Cloudflare's
[Pages redirects documentation](https://developers.cloudflare.com/pages/configuration/redirects/)
defines that artifact format. The only Pages Function route is `/`, so it does
not overlap the seven static legacy paths.

## 6. Agent: close the cutover only after verification

After every check above passes against production:

1. Confirm `.github/workflows/deploy.yml` and `public/CNAME` remain absent and
   that no obsolete deployment instructions have returned.
2. Mark ticket 05 resolved and update `STATE.md`/`WORKLOG.md` with the observed
   nameservers, deployment URL, redirect results, and verification time.
3. Run `corepack yarn run check` and `corepack yarn test`, review the final
   diff, and commit it.
4. Push the cleanup commit to `master`; wait for its Pages deployment and rerun
   the production checks once more.

Do not start ticket 06 until this final deployment is verified.
