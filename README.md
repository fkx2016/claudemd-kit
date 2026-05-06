<!-- METADATA
name: claudemd-kit
canonical_name: claudemd-kit
status: Shipped
created: 2026-04-29
last_touched: 2026-04-29
one_liner: Lead-magnet landing page + downloadable kit teaching the four-layer CLAUDE.md system for Claude Code. Live at claudemd.kurkalabs.dev.
related_projects: agentsmd-kit, kurkalabs-landing-template
related_repos: github.com/fkx2016/claudemd-kit, github.com/fkx2016/agentsmd-kit
tags: lead-magnet, claude-code, kurka-labs, cloudflare-pages, resend, ai-tooling
-->

# claudemd-kit

> The CLAUDE.md Starter Kit. A composable `.claude/` setup for Claude Code, plus the landing page that delivers it.
>
> Live at [claudemd.kurkalabs.dev](https://claudemd.kurkalabs.dev). Article: [CLAUDE.md Is Not a Config File](https://fkxx.substack.com).

A [Kurka Labs](https://kurkalabs.dev) project.

## What's in this repo

```
articles/                The two published essays
kit/                     Source for the downloadable kit (14 files)
landing/                 Cloudflare Pages site (single HTML file)
worker/                  Cloudflare Worker — handles email capture
scripts/                 Build + deploy
CLAUDE.md                The project's own CLAUDE.md (we eat our own dog food)
.claude/                 Project permissions + commands
docs/SETUP.md            Full deploy walkthrough
```

## Stack

- **Cloudflare Pages** for the landing page
- **Cloudflare Workers** for the subscription API
- **Cloudflare R2** for hosting the downloadable kit
- **Cloudflare D1** (optional) for storing subscribers locally
- **Cloudflare Turnstile** for bot protection
- **Resend** for email delivery + audience management

## Quick start

See [docs/SETUP.md](./docs/SETUP.md) for the full walkthrough. TL;DR:

```bash
# 1. Build the kit
bash scripts/build-kit.sh

# 2. Set Worker secrets
cd worker
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put TURNSTILE_SECRET_KEY

# 3. Deploy everything
cd .. && bash scripts/deploy.sh
```

## License

MIT. See [LICENSE](./LICENSE).
