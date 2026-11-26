// Paths on Cloudflare Pages are case-sensitive, so a hand-typed /zh-tw/
// would be a 404. Send it to the real /zh-TW/ path. The route is
// case-sensitive too (verified on a preview deploy: /zh-TW/ never reaches
// this, and other casings like /ZH-TW/ don't either), but the case is still
// compared here, so the real path would pass straight through if it did.
export function onRequest({ request, next }) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/zh-tw(?=\/|$)/i, "/zh-TW");
  if (path === url.pathname) return next();
  url.pathname = path === "/zh-TW" ? "/zh-TW/" : path;
  return Response.redirect(url.href, 301);
}
