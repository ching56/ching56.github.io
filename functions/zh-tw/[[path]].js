// Paths on Cloudflare Pages are case-sensitive, so a hand-typed /zh-tw/
// (or /ZH-TW/...) would be a 404. Send it to the real /zh-TW/ path. The case
// is compared here rather than trusted to the route, so the correctly cased
// /zh-TW/ passes straight through to its page even if the route matches it.
export function onRequest({ request, next }) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/zh-tw(?=\/|$)/i, "/zh-TW");
  if (path === url.pathname) return next();
  url.pathname = path === "/zh-TW" ? "/zh-TW/" : path;
  return Response.redirect(url.href, 301);
}
