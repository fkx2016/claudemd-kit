---
description: Rules for files in src/db/ and migrations/
paths:
  - src/db/**
  - migrations/**
---

# Database rules

## Migrations are append-only

Once a migration has been applied to production, it can **never** be modified. Only add a new migration that corrects the issue.

If you need to "undo" something, write a new migration that reverses it.

## Schema changes

- All schema changes go through migrations. Never `ALTER TABLE` ad-hoc.
- Foreign keys: declare them. SQLite enforces only when `PRAGMA foreign_keys = ON`.
- Default to `NOT NULL` with explicit defaults rather than nullable columns.

## Queries

- Use prepared statements. Never string-concatenate user input into SQL.
- N+1 is the most common bug here. Batch with `IN (?,?,?)` or join.
- Index any column you filter or sort by. Check with `EXPLAIN QUERY PLAN`.
