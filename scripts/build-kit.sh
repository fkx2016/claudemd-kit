#!/usr/bin/env bash
set -e
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
KIT_SRC="$REPO_ROOT/kit"
DIST_DIR="$REPO_ROOT/dist"
OUT_FILE="$DIST_DIR/claudemd-kit.zip"
STAGING="$DIST_DIR/staging"

echo "→ Cleaning previous build..."
rm -rf "$STAGING" "$OUT_FILE"
mkdir -p "$STAGING/claudemd-kit"

echo "→ Staging files..."
cp -r "$KIT_SRC"/* "$STAGING/claudemd-kit/"
cp -r "$KIT_SRC/project/.claude" "$STAGING/claudemd-kit/project/" 2>/dev/null || true

echo "→ Creating zip..."
cd "$STAGING"
zip -r "$OUT_FILE" claudemd-kit -x "*.DS_Store" "*.swp"

echo "→ Cleaning staging..."
rm -rf "$STAGING"

SIZE=$(du -h "$OUT_FILE" | cut -f1)
COUNT=$(unzip -l "$OUT_FILE" | tail -1 | awk '{print $2}')
echo ""
echo "✓ Built: $OUT_FILE"
echo "  Size:  $SIZE"
echo "  Files: $COUNT"
