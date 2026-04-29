-- D1 schema for claudemd-kit subscribers
-- Apply with: npx wrangler d1 execute claudemd-kit-db --remote --file=schema.sql

CREATE TABLE IF NOT EXISTS subscribers (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT NOT NULL UNIQUE,
  source        TEXT NOT NULL DEFAULT 'unknown',
  created_at    TEXT NOT NULL,
  last_seen_at  TEXT,
  unsubscribed  INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_subscribers_source ON subscribers(source);
CREATE INDEX IF NOT EXISTS idx_subscribers_created ON subscribers(created_at);
