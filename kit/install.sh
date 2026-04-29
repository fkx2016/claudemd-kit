#!/usr/bin/env bash
# install.sh - install the CLAUDE.md Starter Kit
# Run from the unzipped kit directory: bash install.sh

set -e

KIT_ROOT="$(cd "$(dirname "$0")" && pwd)"
HOME_CLAUDE="$HOME/.claude"

echo ""
echo "  CLAUDE.md Starter Kit installer"
echo "  --------------------------------"
echo ""

# Step 1: Install the home/ contents to ~/.claude/
echo "[1/2] Installing global files to $HOME_CLAUDE/"

if [ -f "$HOME_CLAUDE/CLAUDE.md" ]; then
    BACKUP="$HOME_CLAUDE/CLAUDE.md.bak.$(date +%Y%m%d-%H%M%S)"
    cp "$HOME_CLAUDE/CLAUDE.md" "$BACKUP"
    echo "      Backed up existing CLAUDE.md -> $BACKUP"
fi

mkdir -p "$HOME_CLAUDE"
cp -rn "$KIT_ROOT/home/." "$HOME_CLAUDE/" 2>/dev/null || cp -r "$KIT_ROOT/home/." "$HOME_CLAUDE/"
echo "      Installed: CLAUDE.md, templates/, commands/, agents/, hooks/"

# Step 2: Project files - explain how to use
echo ""
echo "[2/2] Project files (NOT auto-installed)"
echo "      The 'project/' directory is a template for new repos."
echo "      To use in a project:"
echo ""
echo "         cp -r $KIT_ROOT/project/. /path/to/your/repo/"
echo ""

echo ""
echo "Done. Next steps:"
echo "  1. Edit $HOME_CLAUDE/CLAUDE.md - replace the placeholders with your details"
echo "  2. Open Claude Code in any project to confirm the global config loads"
echo "  3. (Optional) Copy project/ contents into your active repos"
echo ""
echo "Read the article: https://fkxx.substack.com/p/claude-md-is-not-a-config-file"
