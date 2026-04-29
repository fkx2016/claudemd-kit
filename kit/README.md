# CLAUDE.md Starter Kit

A drop-in `.claude/` setup for Claude Code.

## Read this first

**[STRUCTURE.md](STRUCTURE.md)** — explains the four-layer system (`~/.claude/CLAUDE.md`, `<repo>/CLAUDE.md`, `<repo>/CLAUDE.local.md`, `<repo>/subdir/CLAUDE.md`), what goes where, and how to think about promoting things between layers. Five-minute read; saves you weeks of misuse.

## What's in this kit

```
home/                              -> goes in ~/.claude/
+-- CLAUDE.md                      Lean global identity (Layer 1)
+-- templates/
|   +-- cloudflare-worker.md
|   +-- python-package.md
|   +-- node-typescript.md
|   +-- fastapi.md
|   +-- react-frontend.md
|   +-- monorepo.md
+-- commands/
|   +-- standup.md                 /standup
|   +-- postmortem.md              /postmortem
|   +-- explain.md                 /explain
+-- agents/
|   +-- code-reviewer.md           Senior reviewer
|   +-- test-writer.md             Coverage agent
+-- hooks/
    +-- pre-tool-use.md            Example hook config

project/                           -> goes in <repo>/
+-- CLAUDE.md                      Layer 2 (committed, team-wide)
+-- CLAUDE.local.md                Layer 3 (gitignored, personal)
+-- frontend/CLAUDE.md             Layer 4 (path-scoped)
+-- .claude/
    +-- settings.json              Allow/deny lists
    +-- rules/
    |   +-- database.md
    |   +-- api-design.md
    |   +-- secrets.md
    +-- skills/
        +-- security-review/SKILL.md
        +-- dependency-audit/SKILL.md

install.sh, install.ps1            Run one of these to install
STRUCTURE.md                       READ THIS - the four-layer system explained
```

## Install (the easy way)

**macOS / Linux / WSL:**
```bash
bash install.sh
```

**Windows PowerShell:**
```powershell
powershell -ExecutionPolicy Bypass -File install.ps1
```

The installer copies `home/` -> `~/.claude/`, backs up any existing `CLAUDE.md`, and tells you what to do next.

## Install (manual)

```bash
# Global (Layer 1) - run once
cp -r home/* ~/.claude/

# Per project (Layers 2-4) - for each repo
cp -r project/* /path/to/your/repo/
cp -r project/.claude /path/to/your/repo/
```

Then edit `~/.claude/CLAUDE.md` to replace placeholders with your actual identity.

## Where things go (the short version)

- `~/.claude/CLAUDE.md` -> "You" - your style, your defaults, every project
- `<repo>/CLAUDE.md` -> "Team" - committed, the codebase's constitution
- `<repo>/CLAUDE.local.md` -> "Local" - gitignored, just your checkout
- `<repo>/subdir/CLAUDE.md` -> "Path" - loads only when working in that subtree

Most specific wins. **For the long version with examples, common mistakes, and how to promote things between layers, read [STRUCTURE.md](STRUCTURE.md).**

## What to customize first

1. `~/.claude/CLAUDE.md` — replace the `[Your name]` and stack placeholders. 5 minutes.
2. `~/.claude/templates/` — keep what matches your stack, delete the rest, add your own.
3. `<repo>/.claude/settings.json` — review the deny list, adjust the allow list to match your project's tooling.

## What to read

- **[STRUCTURE.md](STRUCTURE.md)** — the four-layer system. Read this.
- The article: [CLAUDE.md Is Not a Config File](https://fkxx.substack.com/p/claude-md-is-not-a-config-file) — the *why* behind everything.
- Each template, command, agent, and skill has comments explaining its intent.

## License

MIT. Use, modify, share.
