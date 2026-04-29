# Setup walkthrough

End-to-end deploy of [claudemd.kurkalabs.dev](https://claudemd.kurkalabs.dev). About 30 minutes.

## Prerequisites

- Cloudflare account
- Resend account with verified sending domain
- `kurkalabs.dev` zone in Cloudflare
- Wrangler CLI installed: `npm install -g wrangler`

## Step 1. Set up Cloudflare Turnstile

1. Open [dash.cloudflare.com → Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile)
2. Click **Add site**
3. Configure:
   - Site name: `claudemd-kit`
   - Domain: `claudemd.kurkalabs.dev`
   - Widget mode: **Managed**
4. Save. Copy the **Site key** and **Secret key**.

Edit `landing/public/index.html` — replace `REPLACE_WITH_TURNSTILE_SITEKEY` with the **site key**.

## Step 2. Set up Resend

1. Visit [resend.com/audiences](https://resend.com/audiences)
2. Create audience: `claudemd-kit-subscribers`
3. Copy the audience ID (UUID)
4. At [resend.com/api-keys](https://resend.com/api-keys), create an API key with Full Access
5. Verify your sending domain at [resend.com/domains](https://resend.com/domains) (DKIM/SPF DNS records)

## Step 3. Configure the Worker

Edit `worker/wrangler.toml`:

```toml
[vars]
RESEND_AUDIENCE_ID = "your-audience-uuid"
FROM_EMAIL         = "kurka@kurkalabs.dev"
FROM_NAME          = "Frank @ Kurka Labs"
DOWNLOAD_URL       = "https://pub-XXX.r2.dev/claudemd-kit.zip"
ARTICLE_URL        = "https://fkxx.substack.com/p/claude-md-is-not-a-config-file"
ALLOWED_ORIGIN     = "https://claudemd.kurkalabs.dev"
```

## Step 4. Set Worker secrets

```bash
cd worker
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put TURNSTILE_SECRET_KEY
```

## Step 5. R2 bucket

```bash
npx wrangler r2 bucket create kurkalabs-public
```

Enable public access at [Cloudflare → R2 → kurkalabs-public](https://dash.cloudflare.com/?to=/:account/r2/default/buckets/kurkalabs-public/settings) → Settings → Public access → Allow Access.

Update `DOWNLOAD_URL` in `wrangler.toml` to the public URL.

## Step 6. (Optional) D1

```bash
npx wrangler d1 create claudemd-kit-db
# uncomment [[d1_databases]] in wrangler.toml, paste database_id
cd worker
npx wrangler d1 execute claudemd-kit-db --remote --file=schema.sql
```

## Step 7. First deploy

```bash
bash scripts/deploy.sh
```

## Step 8. Custom domain

At [Cloudflare Pages → claudemd-kit → Custom domains](https://dash.cloudflare.com/?to=/:account/pages/view/claudemd-kit/domains), add `claudemd.kurkalabs.dev`.

For `/api/*` routing on the custom domain, uncomment `[[routes]]` in `worker/wrangler.toml` and redeploy.

## Step 9. Smoke test

```bash
curl https://claudemd.kurkalabs.dev/api/health
# Expect: {"ok":true,"service":"claudemd-kit-subscribe"}
```

Then test the live form with your real email.

## Troubleshooting

- **Bot check failed**: Turnstile sitekey wrong, or domain doesn't match Turnstile config.
- **Email not arriving**: Check [resend.com/emails](https://resend.com/emails). Search spam for "Kurka Labs".
- **CORS errors**: `ALLOWED_ORIGIN` must exactly match (no trailing slash).
- **/api/* returns 404**: Route binding hasn't propagated, or `_redirects` not picked up.
