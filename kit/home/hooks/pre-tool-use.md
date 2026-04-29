# Hooks: pre-tool-use example

Hooks let you intercept Claude Code's tool invocations and block, modify, or log them.
This is an EXAMPLE hook configuration. Real hooks are configured in `~/.claude/settings.json`
under the `hooks` field, with the actual logic in shell scripts or Node scripts.

## Why use a pre-tool-use hook

- **Prevent destructive operations** that the deny list missed
- **Log every shell command** to your own audit trail
- **Add confirmations** for specific risky patterns (e.g., any `git push origin main`)
- **Modify** the command before it runs (e.g., always add `--dry-run` first)

## Example: log every Bash command before execution

In `~/.claude/settings.json`:

```json
{
  "hooks": {
    "pre-tool-use": [
      {
        "match": { "tool": "Bash" },
        "command": "echo \"[$(date -Iseconds)] $CLAUDE_TOOL_INPUT\" >> ~/.claude/bash-audit.log"
      }
    ]
  }
}
```

Every Bash invocation gets timestamped and logged. If something goes sideways at 3am, you have a record.

## Example: block any rm operation outside known dirs

```json
{
  "hooks": {
    "pre-tool-use": [
      {
        "match": { "tool": "Bash", "pattern": "^rm " },
        "command": "~/.claude/hooks/check-rm-safety.sh"
      }
    ]
  }
}
```

Where `check-rm-safety.sh` exits non-zero (blocking the command) if the path doesn't match an allowlist of safe dirs.

## Example: notify on production deploy

```json
{
  "hooks": {
    "pre-tool-use": [
      {
        "match": { "tool": "Bash", "pattern": "wrangler deploy" },
        "command": "~/.claude/hooks/notify-deploy.sh"
      }
    ]
  }
}
```

## Hook script tips

- Hooks receive context via env vars (`CLAUDE_TOOL_NAME`, `CLAUDE_TOOL_INPUT`).
- Exit 0 = allow. Non-zero = block.
- Keep hooks fast. They run synchronously and add latency to every matched invocation.
- For complex logic, write a real script and shell out. Don't put 50 lines of JSON in `command`.
- Test hooks with a known-safe command first; a broken hook can lock you out of tool use.

## What this file is for

This is documentation/example, not active config. Put actual hook scripts in `~/.claude/hooks/scripts/`
and reference them from `settings.json`.
