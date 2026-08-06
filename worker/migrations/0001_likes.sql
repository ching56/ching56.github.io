CREATE TABLE post_likes (
  path TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0)
);

CREATE TABLE like_dedupes (
  token TEXT PRIMARY KEY,
  expires_at INTEGER NOT NULL
);

CREATE TABLE rate_limits (
  client_key TEXT NOT NULL,
  window_start INTEGER NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (client_key, window_start)
);

CREATE INDEX like_dedupes_expiry ON like_dedupes (expires_at);
