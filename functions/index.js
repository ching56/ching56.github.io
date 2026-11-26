// The root route. The English edition has no posts yet and is parked (its
// /en/ paths redirect in public/_redirects), so every reader goes to the
// zh-TW home. Temporary (302), so the root can negotiate languages again
// once English posts exist.
export function onRequest({ request }) {
  return new Response(null, {
    status: 302,
    headers: {
      "Cache-Control": "private, no-store",
      Location: new URL("/zh-TW/", request.url).href,
    },
  });
}
