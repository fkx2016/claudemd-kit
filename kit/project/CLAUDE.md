@~/.claude/CLAUDE.md
@~/.claude/templates/cloudflare-worker.md

# ProjectName

One-paragraph description. What it does, who uses it, why it exists.

## Architecture

- Frontend: [stack]
- Backend: Cloudflare Worker at `[domain]`
- Data: D1 database `[name]`, R2 bucket `[name]`
- External APIs: [list]

## Build / Test / Deploy

- Local dev: `npm run dev`
- Tests: `npm test`
- Deploy production: `npm run deploy` (runs cache bump, then wrangler deploy)
- Deploy preview: pushes to non-main branches auto-deploy via CI

## Conventions

- Versions tracked in `src/version.ts`. Bump on every production deploy.
- Cache params (`?v=`) update via `scripts/bump_cache.py <version>`. Never edit by hand.
- Database migrations in `migrations/`. Apply with `wrangler d1 migrations apply`.
- Logs go through structured logger in `src/lib/log.ts`. No raw `console.log` in committed code.

## Immutable Rules

1. Never deploy production without running cache bump first.
2. Never commit without running `npm test` and `npm run lint`.
3. Never modify files in `migrations/` after they've been applied to production. Only add new ones.
