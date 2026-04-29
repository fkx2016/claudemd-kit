# Personal CLAUDE.md

(Goes in `~/.claude/CLAUDE.md`. Loads in every Claude Code session, every project.)

## Who I am

[Your name]. [What you do, one line.]
[Primary stack and OS — e.g., "TypeScript + Python on Windows with WSL"]

## How I want responses

- Concise. No padding, no "great question" preambles.
- Code first when the answer is code; explanation second.
- When uncertain, say so. Don't pad with hedges.
- Push back when you think I'm wrong. Don't agree to be agreeable.

## Always

- Match existing code style — read 2–3 surrounding files before generating.
- Use TypeScript types / Python type hints by default.
- Run tests after non-trivial changes. Show me the output.
- Cite file:line when referring to existing code.

## Never

- Never commit without explicit instruction.
- Never run destructive commands (`rm -rf`, `DROP TABLE`, force push) without confirming.
- Never invent APIs or function signatures. Read the source if uncertain.
- Never use CMD shell for git commits with messages — use PowerShell or bash.

## Templates

Project templates live in `~/.claude/templates/`:

- `cloudflare-worker.md`
- `python-package.md`
- `react-frontend.md`
- `monorepo.md`

Project CLAUDE.md files should `@import` from this library where applicable.
