// In production the root route is a Cloudflare Pages Function
// (functions/index.js) that sends readers to the zh-TW home.
// `astro dev` doesn't run Pages Functions, so without this
// the dev root is a 404. This dev-only middleware calls that same function
// for "/"; builds are untouched.
export function devRootRedirect() {
  return {
    name: "dev-root-redirect",
    hooks: {
      "astro:server:setup": ({ server }) => {
        server.middlewares.use(async (req, res, next) => {
          const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
          if (url.pathname !== "/") return next();
          const { onRequest } = await import("../../functions/index.js");
          const response = onRequest({
            request: new Request(url, {
              headers: { "Accept-Language": req.headers["accept-language"] ?? "" },
            }),
          });
          res.statusCode = response.status;
          response.headers.forEach((value, name) => res.setHeader(name, value));
          res.end();
        });
      },
    },
  };
}
