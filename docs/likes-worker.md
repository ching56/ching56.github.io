# Likes Worker

The `jhihcing-api` Worker owns the blog's `/api/likes` endpoint and is the future API home for the pottery map. It stores only aggregate counts, one-day dedupe hashes, and one-minute rate-limit hashes. Raw IP addresses, cookies, and accounts are not stored or created.

## Local demo

1. Run `corepack yarn likes:migrate:local`.
2. Create an ignored `.dev.vars` file containing `LIKES_HASH_SECRET=replace-with-a-local-secret`.
3. Run `corepack yarn likes:dev`.
4. Read a count with `curl 'http://localhost:8787/api/likes?path=%2Fzh-TW%2Fblog%2F2022%2F'`.
5. Increment it with `curl -X POST -H 'content-type: application/json' --data '{"path":"/zh-TW/blog/2022/"}' http://localhost:8787/api/likes`.

Before production deployment, create the D1 database, replace the placeholder `database_id` in `wrangler.jsonc`, set `LIKES_HASH_SECRET`, apply the remote migration, and deploy the Worker. The declared `jhihcing.li/api/*` route is attached by that deployment. These account-bound production steps follow ticket 05's Pages cutover.
