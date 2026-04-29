# CLAUDE.md Starter Kit

A drop-in `.claude/` setup for Claude Code.

## What's in this kit

```
home/                              -> goes in ~/.claude/
+-- CLAUDE.md                      Lean global identity
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
+-- CLAUDE.md                      Uses @imports
+-- CLAUDE.local.md                Gitignored personal scratchpad
+-- frontend/CLAUDE.md             Subdirectory (path-scoped) example
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
# Global (once)
cp -r home/* ~/.claude/

# Per project (for each repo)
cp -r project/* /path/to/your/repo/
cp -r project/.claude /path/to/your/repo/
```

Then edit `~/.claude/CLAUDE.md` to replace the placeholders with your actual identity.

## What to customize first

1. `~/.claude/CLAUDE.md` — replace the `[Your name]` and stack placeholders. 5 minutes.
2. `~/.claude/templates/` — keep the templates that match what you build, delete the rest, add your own.
3. `<repo>/.claude/settings.json` — review the deny list, adjust the allow list to match your project's tooling.

## What to read

- The article: [CLAUDE.md Is Not a Config File](https://fkxx.substack.com/p/claude-md-is-not-a-config-file) — explains the *why* behind the structure.
- Each template, command, agent, and skill has comments explaining its intent. Read before editing.

## License

MIT. Use, modify, share.
