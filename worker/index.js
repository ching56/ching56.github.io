const JSON_HEADERS = {
  "cache-control": "no-store",
  "content-type": "application/json; charset=utf-8",
};
const POST_PATH = /^\/(?:zh-TW|en)\/blog\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/;
const RATE_LIMIT = 30;

export default {
  async fetch(request, environment) {
    const url = new URL(request.url);
    if (url.pathname !== "/api/likes") {
      return json({ error: "Not found" }, 404);
    }
    if (!['GET', 'POST'].includes(request.method)) {
      return json({ error: "Method not allowed" }, 405, { allow: "GET, POST" });
    }

    const clientAddress = request.headers.get("cf-connecting-ip") ?? "local";
    const now = environment.LIKES_NOW ?? Math.floor(Date.now() / 1000);
    const clientKey = await digest(environment.LIKES_HASH_SECRET, clientAddress);
    const rateWindow = Math.floor(now / 60);
    const rateRow = await environment.LIKES_DB.prepare(
      "SELECT request_count FROM rate_limits WHERE client_key = ? AND window_start = ?",
    ).bind(clientKey, rateWindow).first();
    if ((rateRow?.request_count ?? 0) >= RATE_LIMIT) {
      return json({ error: "Rate limit exceeded" }, 429, { "retry-after": "60" });
    }
    await environment.LIKES_DB.prepare(
      "INSERT INTO rate_limits (client_key, window_start, request_count) VALUES (?, ?, 1) ON CONFLICT(client_key, window_start) DO UPDATE SET request_count = request_count + 1",
    ).bind(clientKey, rateWindow).run();

    if (request.method === "GET") {
      const path = url.searchParams.get("path");
      if (!isPostPath(path)) return json({ error: "Unknown post path" }, 404);
      const row = await getCount(environment.LIKES_DB, path);
      return json({ path, count: row, liked: false });
    }

    let path;
    try {
      path = (await request.json()).path;
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }
    if (!isPostPath(path)) return json({ error: "Unknown post path" }, 404);

    const dedupeWindow = Math.floor(now / 86_400);
    const token = await digest(
      environment.LIKES_HASH_SECRET,
      `${clientAddress}\n${path}\n${dedupeWindow}`,
    );
    const insertion = await environment.LIKES_DB.prepare(
      "INSERT OR IGNORE INTO like_dedupes (token, expires_at) VALUES (?, ?)",
    ).bind(token, (dedupeWindow + 1) * 86_400).run();
    if (insertion.meta.changes === 1) {
      await environment.LIKES_DB.prepare(
        "INSERT INTO post_likes (path, count) VALUES (?, 1) ON CONFLICT(path) DO UPDATE SET count = count + 1",
      ).bind(path).run();
    }

    return json({ path, count: await getCount(environment.LIKES_DB, path), liked: true });
  },
};

function isPostPath(path) {
  return typeof path === "string" && POST_PATH.test(path);
}

async function getCount(database, path) {
  const row = await database.prepare(
    "SELECT count FROM post_likes WHERE path = ?",
  ).bind(path).first();
  return row?.count ?? 0;
}

async function digest(secret, value) {
  if (!secret) throw new Error("LIKES_HASH_SECRET is required");
  const input = new TextEncoder().encode(`${secret}\n${value}`);
  const bytes = await crypto.subtle.digest("SHA-256", input);
  return [...new Uint8Array(bytes)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function json(body, status = 200, headers = {}) {
  return Response.json(body, {
    status,
    headers: { ...JSON_HEADERS, ...headers },
  });
}
