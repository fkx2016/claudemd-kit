---
description: Deploy the claudemd-kit Worker and Pages site, in the right order
---

You are deploying the claudemd-kit project to production.

## Steps

1. Run `git status`. If there are uncommitted changes, stop and tell me. We don't deploy from a dirty tree.

2. Run the kit build:
   ```
   bash scripts/build-kit.sh
   ```
   Verify `dist/claudemd-kit.zip` exists and is < 50KB.

3. Upload the kit to R2:
   ```
   bash scripts/upload-kit.sh
   ```

4. Deploy the Worker:
   ```
   cd worker && npx wrangler deploy
   ```
   Verify deployment succeeded — check the output for the deployed URL.

5. Deploy the Pages site:
   ```
   npx wrangler pages deploy landing/public --project-name=claudemd-kit --branch=main
   ```
   Use `--branch=main` for production. Never `--branch=production`.

6. Smoke test:
   ```
   curl https://claudemd.kurkalabs.dev/api/health
   ```
   Expect `{"ok":true,...}`.

7. Report back: what was deployed, what URLs are live, any warnings.
