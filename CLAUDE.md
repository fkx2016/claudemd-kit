@~/.claude/CLAUDE.md
@~/.claude/templates/cloudflare-worker.md

# claudemd-kit

The CLAUDE.md Starter Kit — landing page, lead-magnet capture, downloadable kit, and the articles that explain it. A Kurka Labs project.

## Architecture

- **Landing**: Cloudflare Pages serving `landing/public/` (static HTML, no build step)
- **API**: Cloudflare Worker (`worker/`) handling `POST /api/subscribe`
- **Storage**: R2 hosts `claudemd-kit.zip`; D1 (`claudemd-kit-db`) stores subscribers
- **Email**: Resend transactional + audience for follow-up
- **Bot protection**: Cloudflare Turnstile on the form
- **Domain**: `claudemd.kurkalabs.dev` (subdomain on existing Kurka Labs zone)

## Build / Test / Deploy

- Build the downloadable kit: `bash scripts/build-kit.sh` (produces `dist/claudemd-kit.zip`)
- Deploy worker: `cd worker && npx wrangler deploy`
- Deploy landing: `npx wrangler pages deploy landing/public --project-name=claudemd-kit`
- Upload kit zip to R2: `bash scripts/upload-kit.sh`
- Full deploy: `bash scripts/deploy.sh`

## Conventions

- Articles live in `articles/` as Markdown. Filenames are numbered (`01-...`, `02-...`) for ordering.
- Kit source lives in `kit/`. The build script is the only thing that produces zips. Never commit a zip.
- Landing page is intentionally a single HTML file. No build step, no framework. Edit `landing/public/index.html` directly.
- Worker uses ES modules (`export default { fetch(...) }`). No CommonJS.
- All secrets via `wrangler secret put`, never in `wrangler.toml` or code.

## Immutable Rules

1. Never commit the zip. Build artifacts live in `dist/` (gitignored). The zip is uploaded to R2 by the upload script.
2. Never commit `.dev.vars`, `.wrangler/`, or anything in `node_modules/`.
3. The Turnstile sitekey is public (it's in the HTML); the secret is set via `wrangler secret put TURNSTILE_SECRET_KEY` and never appears in any committed file.
4. Email validation lives in the Worker, not just the client. Client-side validation is UX, not security.
5. The `kit/home/CLAUDE.md` file users download must NOT contain Frank-specific references. It's a template for them to customize.
