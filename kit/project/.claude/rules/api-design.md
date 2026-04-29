---
description: Conventions for HTTP API endpoints (REST, GraphQL, RPC)
paths:
  - src/api/**
  - src/routes/**
  - app/api/**
  - api/**
---

# API design rules

## URL structure (REST)

- Resource names are PLURAL, lowercase, hyphenated: `/api/v1/customer-orders`, not `/CustomerOrder` or `/customer_order`.
- IDs are in the path: `/api/v1/orders/{id}`. Sub-resources are nested: `/api/v1/orders/{id}/items`.
- Filtering, sorting, pagination go in QUERY STRING, not in the path. `?status=pending&sort=-created_at&limit=20`.
- Verbs in URLs are an anti-pattern. Prefer HTTP method semantics: POST creates, PUT replaces, PATCH updates, DELETE removes. Reserve verb URLs for actions that don't fit (`/api/v1/orders/{id}/cancel`).

## Versioning

- Version in the path (`/api/v1/...`), not in headers. Easier to debug, easier to log, easier to migrate.
- New version when you make breaking changes only. Adding optional fields is not breaking.
- Don't expose internal version numbers. v1, v2, v3 — that's it.

## Status codes

- 200 OK = success with body.
- 201 Created = success, return the created resource (or its URL in `Location`).
- 204 No Content = success with no body.
- 400 Bad Request = client sent invalid data.
- 401 Unauthorized = no auth or invalid auth (NOT for "you can't access this").
- 403 Forbidden = authenticated but not allowed.
- 404 Not Found = resource doesn't exist (or you don't want to confirm it does).
- 409 Conflict = state collision (e.g., duplicate, optimistic lock failure).
- 422 Unprocessable Entity = validation failed on otherwise well-formed input.
- 429 Too Many Requests = rate limited. Include `Retry-After`.
- 5xx = server's fault. NEVER use 5xx for client errors.

## Request and response bodies

- JSON with consistent casing. snake_case OR camelCase, not both. Stick to one across the API.
- Errors return a consistent shape:
  ```json
  { "error": { "code": "VALIDATION_FAILED", "message": "Email is invalid", "field": "email" } }
  ```
- Don't return server stack traces or internal paths in error messages. Leak nothing.
- Pagination: `{ "items": [...], "next_cursor": "..." }` for cursor-based, or `{ "items": [...], "total": 42, "page": 1 }` for page-based. Pick one.

## GraphQL specifics

- Mutations return the modified entity, not just `{ success: true }`. Saves a round trip.
- Use input types for mutation arguments, not loose args.
- Pagination uses Relay-style connections (`edges`, `pageInfo`) by default.
- Don't expose internal IDs as the GraphQL ID — use opaque global IDs.

## Don't

- Don't put auth tokens in URLs (they leak via logs, referrer headers, browser history).
- Don't return different shapes for the same endpoint based on user. Return ALL fields the user is allowed to see; let them ignore what they don't need.
- Don't use 200 for errors with `{ "error": ... }` in the body. Use the right status code.
