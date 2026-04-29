#!/usr/bin/env bash
set -e
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ZIP_FILE="$REPO_ROOT/dist/claudemd-kit.zip"
R2_BUCKET="kurkalabs-public"
R2_KEY="claudemd-kit.zip"

if [ ! -f "$ZIP_FILE" ]; then
  echo "✗ Zip not found: $ZIP_FILE"
  echo "  Run scripts/build-kit.sh first."
  exit 1
fi

echo "→ Uploading $ZIP_FILE to R2 ($R2_BUCKET/$R2_KEY)..."
npx wrangler r2 object put "$R2_BUCKET/$R2_KEY" --file="$ZIP_FILE"

echo ""
echo "✓ Uploaded."
