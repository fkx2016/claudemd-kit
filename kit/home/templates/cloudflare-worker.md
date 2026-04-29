# Cloudflare Worker conventions

(Fragment for `@import` from any project's CLAUDE.md that deploys to Workers.)

## Stack

- TypeScript Workers via Wrangler
- D1 for relational data
- R2 for blob storage
- KV for hot config
- Workers AI / AI Gateway when LLMs are involved

## Wrangler patterns

- Deploy: `cd <worker-dir> && npx wrangler deploy`
- Local dev: `npx wrangler dev` (use `--local` for local D1/KV)
- Production deploys go to `--branch=main`. **Never** `--branch=production` (that's a Preview branch — silent failure mode).
- Tail logs: `npx wrangler tail <worker-name>`
- D1 migrations: `wrangler d1 migrations apply <db> --remote`

## Secrets

- Never commit secrets. Use `wrangler secret put <KEY>` for runtime secrets.
- Store dev secrets in `.dev.vars` (gitignored).
- Reference in code via `env.SECRET_NAME`, never `process.env`.

## Common gotchas

- `console.log` works in `wrangler tail` but is stripped in production logs by default.
- Workers have a 10ms CPU limit on free tier, 30s on paid (CPU, not wall-clock).
- `fetch` is global, not imported.
- D1 prepared statements use `?` (positional), not `$1`.
- Cron triggers run with empty request — handle `null` request defensively.

## Testing

- Unit: vitest with `@cloudflare/workers-types`.
- Integration: against local Wrangler.
- For LLM-dependent code, mock at the `fetch` boundary, not the SDK.

## Ask before acting

- Schema migrations on production D1
- New secrets being added
- Custom domain or routing changes
- DNS or zone-level changes
