import assert from "node:assert/strict";
import test from "node:test";

import worker from "../worker/index.js";

class SimulatedD1 {
  constructor() {
    this.counts = new Map();
    this.dedupes = new Set();
    this.rateWindows = new Map();
  }

  prepare(query) {
    return new SimulatedStatement(this, query);
  }
}

class SimulatedStatement {
  constructor(database, query) {
    this.database = database;
    this.query = query.replace(/\s+/g, " ").trim();
    this.values = [];
  }

  bind(...values) {
    this.values = values;
    return this;
  }

  async first() {
    if (this.query.startsWith("SELECT count FROM post_likes")) {
      return { count: this.database.counts.get(this.values[0]) ?? 0 };
    }

    if (this.query.startsWith("INSERT INTO rate_limits") && this.query.includes("RETURNING")) {
      const key = `${this.values[0]}:${this.values[1]}`;
      const count = this.database.rateWindows.get(key) ?? 0;
      if (count >= this.values[2]) return null;
      this.database.rateWindows.set(key, count + 1);
      return { request_count: count + 1 };
    }

    throw new Error(`Unsupported first query: ${this.query}`);
  }

  async run() {
    if (this.query.startsWith("INSERT INTO post_likes")) {
      const path = this.values[0];
      this.database.counts.set(path, (this.database.counts.get(path) ?? 0) + 1);
      return { success: true };
    }

    if (this.query.startsWith("INSERT OR IGNORE INTO like_dedupes")) {
      const existed = this.database.dedupes.has(this.values[0]);
      this.database.dedupes.add(this.values[0]);
      return { success: true, meta: { changes: existed ? 0 : 1 } };
    }

    if (this.query.startsWith("INSERT INTO rate_limits")) {
      const key = `${this.values[0]}:${this.values[1]}`;
      this.database.rateWindows.set(key, (this.database.rateWindows.get(key) ?? 0) + 1);
      return { success: true };
    }

    if (this.query.startsWith("DELETE FROM rate_limits")) {
      for (const key of this.database.rateWindows.keys()) {
        if (Number(key.slice(key.lastIndexOf(":") + 1)) < this.values[0]) {
          this.database.rateWindows.delete(key);
        }
      }
      return { success: true };
    }

    if (this.query.startsWith("DELETE FROM like_dedupes")) {
      return { success: true };
    }

    throw new Error(`Unsupported run query: ${this.query}`);
  }
}

function createEnvironment() {
  return {
    LIKES_DB: new SimulatedD1(),
    LIKES_HASH_SECRET: "test-only-secret",
    LIKES_NOW: 1_800_000,
  };
}

test("a reader can get the zero count for a known post", async () => {
  const request = new Request(
    "https://jhihcing.li/api/likes?path=%2Fzh-TW%2Fblog%2F2022%2F",
  );

  const response = await worker.fetch(request, createEnvironment());

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    path: "/zh-TW/blog/2022/",
    count: 0,
    liked: false,
  });
  assert.equal(response.headers.get("set-cookie"), null);
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("repeat increments in the dedupe window count once", async () => {
  const environment = createEnvironment();
  const makeRequest = () =>
    new Request("https://jhihcing.li/api/likes", {
      method: "POST",
      headers: { "cf-connecting-ip": "203.0.113.8", "content-type": "application/json" },
      body: JSON.stringify({ path: "/zh-TW/blog/covid/" }),
    });

  await worker.fetch(makeRequest(), environment);
  const response = await worker.fetch(makeRequest(), environment);

  assert.deepEqual(await response.json(), {
    path: "/zh-TW/blog/covid/",
    count: 1,
    liked: true,
  });
});

test("the same reader can like again in a later dedupe window", async () => {
  const environment = createEnvironment();
  const makeRequest = () =>
    new Request("https://jhihcing.li/api/likes", {
      method: "POST",
      headers: { "cf-connecting-ip": "203.0.113.8", "content-type": "application/json" },
      body: JSON.stringify({ path: "/zh-TW/blog/covid/" }),
    });

  await worker.fetch(makeRequest(), environment);
  environment.LIKES_NOW += 86_400;
  const response = await worker.fetch(makeRequest(), environment);

  assert.equal((await response.json()).count, 2);
});

test("requests beyond the client rate limit receive 429", async () => {
  const environment = createEnvironment();
  let response;

  for (let index = 0; index < 31; index += 1) {
    response = await worker.fetch(
      new Request("https://jhihcing.li/api/likes", {
        headers: { "cf-connecting-ip": "203.0.113.9" },
      }),
      environment,
    );
  }

  assert.equal(response.status, 429);
  assert.equal(response.headers.get("retry-after"), "60");
});

test("unknown paths and unsupported methods are rejected", async () => {
  const environment = createEnvironment();
  const unknownPost = await worker.fetch(
    new Request(
      "https://jhihcing.li/api/likes?path=%2Fzh-TW%2Fblog%2Fdoes-not-exist%2F",
    ),
    environment,
  );
  const badMethod = await worker.fetch(
    new Request("https://jhihcing.li/api/likes", { method: "DELETE" }),
    environment,
  );

  assert.equal(unknownPost.status, 404);
  assert.equal(badMethod.status, 405);
  assert.equal(badMethod.headers.get("allow"), "GET, POST");
});

test("a reader can increment a post count", async () => {
  const environment = createEnvironment();
  const request = new Request("https://jhihcing.li/api/likes", {
    method: "POST",
    headers: {
      "cf-connecting-ip": "203.0.113.4",
      "content-type": "application/json",
    },
    body: JSON.stringify({ path: "/zh-TW/blog/2022/" }),
  });

  const response = await worker.fetch(request, environment);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    path: "/zh-TW/blog/2022/",
    count: 1,
    liked: true,
  });
  assert.equal(response.headers.get("set-cookie"), null);
});
