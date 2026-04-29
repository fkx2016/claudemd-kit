# CLAUDE.md Starter Kit

A drop-in `.claude/` setup for Claude Code.

## What's in this kit

```
home/                              → goes in ~/.claude/
├── CLAUDE.md                      Lean global identity
├── templates/
│   ├── cloudflare-worker.md
│   ├── python-package.md
│   ├── react-frontend.md
│   └── monorepo.md
├── commands/standup.md
└── agents/code-reviewer.md

project/                           → goes in <repo>/
├── CLAUDE.md                      Uses @imports
├── CLAUDE.local.md                Gitignored personal scratchpad
├── frontend/CLAUDE.md             Subdirectory (path-scoped) example
└── .claude/
    ├── settings.json              Allow/deny lists
    ├── rules/database.md          Path-scoped rule
    └── skills/security-review/SKILL.md
```

## Install

**Global (once):**
```bash
cp -r home/* ~/.claude/         # macOS / Linux / WSL
```
PowerShell: `Copy-Item -Path home\* -Destination $env:USERPROFILE\.claude\ -Recurse`

**Per project:**
```bash
cp -r project/* /path/to/your/repo/
cp -r project/.claude /path/to/your/repo/
```

Then edit `<repo>/CLAUDE.md` with your project's actual details.

## License

MIT. Use, modify, share.
