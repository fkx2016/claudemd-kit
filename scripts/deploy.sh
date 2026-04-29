#!/usr/bin/env bash
set -e
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

echo "▸ STEP 1/4 — Build kit"
bash scripts/build-kit.sh
echo ""

echo "▸ STEP 2/4 — Upload to R2"
bash scripts/upload-kit.sh
echo ""

echo "▸ STEP 3/4 — Deploy Worker"
cd worker && npx wrangler deploy && cd ..
echo ""

echo "▸ STEP 4/4 — Deploy Pages site"
npx wrangler pages deploy landing/public --project-name=claudemd-kit --branch=main
echo ""

echo "✓ All deployed."
echo "Smoke test: curl https://claudemd.kurkalabs.dev/api/health"
