---
description: Rules for handling secrets, credentials, and sensitive data
paths:
  - "**"
---

# Secrets handling rules

These rules apply to ALL files in this repository, not just config files.

## Never commit

- API keys (any string starting with `sk_`, `re_`, `gho_`, `ghp_`, `github_pat_`, `pat-`, `xoxb-`, `xoxp-`, etc.)
- Private keys (`-----BEGIN PRIVATE KEY-----`, `-----BEGIN RSA PRIVATE KEY-----`)
- AWS access keys (`AKIA...`) and secret keys
- Database connection strings with embedded passwords
- OAuth tokens, refresh tokens, JWT signing secrets
- `.env` files (use `.env.example` instead, with placeholder values)
- Service account JSON files
- Customer PII in test fixtures (use synthetic data)

## Where secrets actually go

- **Local dev:** `.dev.vars` (gitignored) or `.env` (gitignored)
- **Production runtime:** the platform's secret store
  - Cloudflare Workers: `wrangler secret put NAME`
  - Vercel: dashboard or `vercel env`
  - AWS: Secrets Manager or Parameter Store
  - Kubernetes: Secret resources, mounted as env vars
- **CI:** the CI provider's secret manager (GitHub Actions Secrets, etc.)
- **Sharing across team:** a password manager (1Password, Bitwarden, etc.), never Slack or email

## In code

- Reference secrets via `env.NAME` / `process.env.NAME` / `os.getenv("NAME")`. Never hardcode.
- Validate at startup that required secrets are present. Fail loudly if missing — don't run with empty strings.
- Don't log secrets. Don't put them in error messages. Don't echo them back to clients.
- Don't put secrets in URLs (they leak via logs, referrer headers, server access logs).

## Reviewing changes

When reviewing a diff, scan for:
- Strings longer than 20 chars that look random (`[A-Za-z0-9_-]{20,}`)
- Hardcoded credentials being moved from one file to another (still hardcoded!)
- Comments like `// TODO: change in prod` next to a credential
- New `.env*` files that aren't `.env.example`
- Secrets passed as command-line arguments (visible in process lists)

## If a secret leaks

1. Rotate the credential IMMEDIATELY (treat it as compromised).
2. Audit access logs for the leaked credential during the exposure window.
3. Remove from git history with `git filter-repo` or BFG. Force-push.
4. Tell the team so they can update local checkouts.

`git filter-repo --invert-paths --path <file>` for files that should never have been committed.
`git filter-repo --replace-text <patterns.txt>` for inline secrets in tracked files.

## Example .env.example

```
DATABASE_URL=postgres://user:password@localhost/dbname
RESEND_API_KEY=re_xxxxxxxxxxxx
JWT_SECRET=
```

The shape is committed; the values are not.
