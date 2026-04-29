# The CLAUDE.md Starter Kit

### A drop-in `.claude/` setup with working examples of every subsystem. Companion to *"CLAUDE.md Is Not a Config File."*

---

The previous piece argued that the CLAUDE.md / `.claude` system is the most overlooked productivity surface in agentic coding, and that the leverage comes from composition — building a small library of fragments and assembling each project's configuration from them.

This piece is the kit. Real templates, real examples, immediately usable. Drop them into `~/.claude/` and your repos, edit the placeholders, and you've gone from a single CLAUDE.md to a layered system in about twenty minutes.

The full kit is available as a download at the end. Below I walk through six of the most important pieces with commentary on what they're for and how to customize them.

---

## What's in the kit

```
home/                              → goes in ~/.claude/
├── CLAUDE.md                      Lean global identity
├── templates/
│   ├── cloudflare-worker.md
│   ├── python-package.md
│   ├── react-frontend.md
│   └── monorepo.md
├── commands/
│   └── standup.md                 /standup command
└── agents/
    └── code-reviewer.md           Specialist with isolated context

project/                           → goes in <repo>/
├── CLAUDE.md                      Uses @imports
├── CLAUDE.local.md                Gitignored personal scratchpad
├── frontend/
│   └── CLAUDE.md                  Subdirectory (path-scoped)
└── .claude/
    ├── settings.json              Allow/deny lists
    ├── rules/database.md          Path-scoped rule
    └── skills/security-review/SKILL.md   Auto-triggering skill
```

Fourteen files. Together they exercise every subsystem the previous article described: instructions (CLAUDE.md, rules), workflows (commands, skills), specialists (agents), permissions (settings.json), and the composition pattern (`@imports`).

---

## 1. The Global Identity File

Goes in `~/.claude/CLAUDE.md`. Loads in every session, every project. Should be short — under 100 lines, ideally 50.

```markdown
# Personal CLAUDE.md

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
- Never run destructive commands without confirming.
- Never invent APIs or function signatures. Read the source if uncertain.

## Templates

Project templates live in ~/.claude/templates/. Project CLAUDE.md files
should @import from this library where applicable.
```

This file is doing one job: setting a baseline of expectations that hold everywhere. It's not a personality; it's a contract. The "Always" and "Never" sections are the most valuable real estate — they're the rules you've already gotten burned by enough times to want them encoded.

Customize it once, then mostly leave it alone. The fact that this is short is the feature. Long global files compete for context against everything else; short ones earn their permanent slot.

---

## 2. A Stack Template (Cloudflare Worker)

Goes in `~/.claude/templates/cloudflare-worker.md`. Imported by any project that deploys to Workers. The composition pattern in action.

```markdown
# Cloudflare Worker conventions

## Stack

- TypeScript Workers via Wrangler
- D1 for relational data, R2 for blob storage, KV for hot config
- Workers AI / AI Gateway when LLMs are involved

## Wrangler patterns

- Deploy: `cd <worker-dir> && npx wrangler deploy`
- Local dev: `npx wrangler dev` (use `--local` for local D1/KV)
- Production deploys go to `--branch=main`. Never `--branch=production`
  (that's a Preview branch — silent failure mode).
- Tail logs: `npx wrangler tail <worker-name>`

## Secrets

- Never commit secrets. Use `wrangler secret put <KEY>` for runtime secrets.
- Store dev secrets in `.dev.vars` (gitignored).
- Reference in code via `env.SECRET_NAME`, never `process.env`.

## Common gotchas

- `console.log` works in `wrangler tail` but is stripped in production logs.
- D1 prepared statements use `?` (positional), not `$1`.
- Cron triggers run with empty request — handle null request defensively.

## Ask before acting

- Schema migrations on production D1
- New secrets being added
- Custom domain or routing changes
```

This is the kind of file most people never write because it feels like documentation. But it's not documentation — it's instruction. Every gotcha here is something Claude would otherwise have to relearn in every session of every Workers project you start.

The kit includes four such templates: `cloudflare-worker.md`, `python-package.md`, `react-frontend.md`, `monorepo.md`. Add your own as you build them up. Rust, Go, Elixir, Swift, mobile — anything you touch more than once deserves a fragment.

---

## 3. A Project CLAUDE.md (Composition)

Goes in `<repo>/CLAUDE.md`. The shape that earns its place is short, structured, and `@import`-driven:

```markdown
@~/.claude/CLAUDE.md
@~/.claude/templates/cloudflare-worker.md

# ProjectName

One-paragraph description. What it does, who uses it, why it exists.

## Architecture

- Frontend: [stack]
- Backend: Cloudflare Worker at [domain]
- Data: D1 database `[name]`, R2 bucket `[name]`

## Build / Test / Deploy

- Local dev: `npm run dev`
- Tests: `npm test`
- Deploy production: `npm run deploy`

## Conventions

- Versions tracked in `src/version.ts`. Bump on every production deploy.
- Cache params (`?v=`) update via `scripts/bump_cache.py <version>`.
  Never edit by hand.
- Logs go through structured logger in `src/lib/log.ts`.
  No raw `console.log` in committed code.

## Immutable Rules

1. Never deploy production without running cache bump first.
2. Never commit without running `npm test` and `npm run lint`.
3. Never modify migration files after they've been applied to production.
```

Notice what's *not* in here: no rehash of Cloudflare conventions (those are imported), no rehash of personal preferences (those are imported), no documentation of what Cloudflare is or how Workers work. Just the project-specific delta — what makes *this* project different from the general patterns.

This file should fit on a screen. If it doesn't, something in it belongs in a fragment, a rule, or a skill.

---

## 4. Permissions (settings.json)

Goes in `<repo>/.claude/settings.json`. The safety layer.

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(npm test)",
      "Bash(git status)",
      "Bash(git diff *)",
      "Bash(git commit *)",
      "Read(*)",
      "Edit(*)",
      "Write(*)"
    ],
    "deny": [
      "Bash(rm -rf /*)",
      "Bash(rm -rf ~/*)",
      "Bash(git push --force *)",
      "Read(~/.ssh/*)",
      "Read(~/.aws/*)",
      "Read(*.env)",
      "Read(*credentials*)"
    ]
  }
}
```

Two principles:

**Deny list is non-negotiable.** Even if you do nothing else with this kit, copy the deny list. It's the difference between "I trust Claude" and "I trust Claude *and* I have guardrails for the moments when trust isn't enough." Both should be true.

**Allow list is optional and starts permissive.** Don't try to enumerate every possible command upfront. Anything not in either list triggers a confirmation prompt — that's a feature, not friction. Over time, you'll add things to allow as you confirm them repeatedly.

Pair with `settings.local.json` (gitignored) for personal overrides.

---

## 5. A Skill (Security Review)

Goes in `<repo>/.claude/skills/security-review/SKILL.md`. Activates automatically when the conversation matches the description.

```markdown
---
name: security-review
description: Reviews code changes for security issues. Activates when reviewing PRs, before merging, or when the user mentions "security check," "audit," "vulnerabilities," or asks if code is safe.
allowed-tools: Read, Grep, Glob
---

# Security Review Skill

When invoked, perform a focused security review of the relevant code.

## What to look for

1. Injection vectors (SQL, shell, HTML, eval/Function/innerHTML)
2. Auth issues (missing checks, timing attacks, JWT misuse)
3. Hardcoded secrets, secrets in logs or error messages
4. Cryptography misuse (MD5/SHA1, weak random, hardcoded IVs)
5. Input validation (path traversal, unsafe URL following, file uploads)

## Output format

Group findings by severity: Critical, High, Medium, Low.
Each finding: file:line — issue — suggested fix.
End with a one-line "Cleared" or "Issues found, see above."

If no issues, say so explicitly. Don't invent issues to look thorough.
```

The key difference from a command: you don't type `/security-review` to trigger this. You say "can you review the auth changes?" or "is this safe?" — and the skill activates because its description matched. The trigger is semantic, not syntactic.

That's why the description field is the single most important part of any skill. It's the only thing Claude sees when deciding whether to invoke. Bad description → skill never fires. Good description → it fires exactly when you'd want it to and stays out of the way otherwise.

---

## 6. An Agent (Code Reviewer)

Goes in `~/.claude/agents/code-reviewer.md` (global, available everywhere) or `<repo>/.claude/agents/code-reviewer.md` (project-specific). Spawned in an isolated context window.

```markdown
---
name: code-reviewer
description: Senior code reviewer focused on correctness, maintainability, and project conventions. Use when reviewing PRs, validating implementations before merge, or checking changes against CLAUDE.md rules.
model: sonnet
tools: Read, Grep, Glob, Bash(git diff *), Bash(git log *)
---

You are a senior code reviewer with deep familiarity with this codebase.

## Your priorities, in order

1. Correctness. Does the code do what it claims? Are edge cases handled?
2. Project conventions. Read CLAUDE.md and any .claude/rules/. Does the
   change comply?
3. Maintainability. Will the next person to touch this understand it?
4. Performance. Only flag if measurably bad. Don't theorize.
5. Style. Last priority. Mention only if it violates a documented rule.

## Output

- Lead with the verdict: Approve, Approve-with-comments, or Request-changes.
- Then must-fix items (numbered, with file:line and suggested fix).
- Then nice-to-haves (briefly).
- End with a one-line summary suitable for a PR comment.

## What you don't do

- You don't apologize. You give your read.
- You don't pad with praise. If the code is good, say "Approve" and stop.
- You don't suggest tests unless tests are missing for the changed behavior.
```

The win is the *isolated context*. When this agent runs, it spawns its own session, reads the diff and the rules, forms an opinion, and reports back. Your main session doesn't get cluttered with thousands of tokens of intermediate exploration. You get the verdict and the must-fix list.

The `tools:` field is also doing important work — restricting an agent to the minimum tools it needs makes it faster, safer, and more focused. A reviewer doesn't need write access. A doc generator doesn't need shell access. Be tight.

---

## How they fit together

These pieces are designed to compose. Imagine a typical session:

You open Claude Code in a Cloudflare project. The session starts and Claude loads your global `~/.claude/CLAUDE.md` (identity, communication style), then your project's `<repo>/CLAUDE.md` which `@imports` `~/.claude/templates/cloudflare-worker.md` (Workers conventions) — so Claude already knows you, your stack, and this project's specifics.

You navigate to `frontend/`. The path-scoped `frontend/CLAUDE.md` loads on demand, layering React-specific rules on top.

You ask "is this auth code safe?" The `security-review` skill recognizes the question and activates, doing a structured pass over the changed files. It returns a clean report.

You're ready to merge. You invoke the `code-reviewer` agent. It spawns in its own context, reads the diff and the rules, writes a verdict, and disappears. Your main session is uncluttered.

You ship. Tomorrow you run `/standup` to summarize what happened. The command pulls from git log and writes a Slack-ready blurb in 150 words.

That's not Claude Code with a config file. That's an environment.

---

## Customization, in order of leverage

If you only do one thing, do this:

1. **Replace the placeholders in `~/.claude/CLAUDE.md`** with your actual identity and rules. 5 minutes.
2. **Pick the templates you'll actually use** and edit the others or delete them. 10 minutes.
3. **Copy `settings.json` deny list** into every project. Even if you don't add allow rules, the deny list is the safety net. 2 minutes per project.
4. **Add your first custom skill** for a procedure you do repeatedly. Replace the security-review skill with something you actually need.
5. **Review auto memory monthly.** Run `/memory` and prune what's wrong, promote what's right into your CLAUDE.md.

Each step compounds. After two months of this, your environment will feel notably more aligned to how you actually work.

---

## Download

Full kit: **[claudemd.kurkalabs.dev](https://claudemd.kurkalabs.dev)**

Fourteen files, ~15KB, MIT license. Drop into `~/.claude/` and your repos. Edit the placeholders. Iterate from there.

If you're new to the *why* behind this structure, read [CLAUDE.md Is Not a Config File](https://fkxx.substack.com/p/claude-md-is-not-a-config-file) first. If you're ready to build, this kit will save you a few hours of trial and error.

---

## Sources

- [Claude Code memory documentation](https://code.claude.com/docs/en/memory)
- [Claude Code skills documentation](https://code.claude.com/docs/en/skills)
- [Anatomy of the .claude folder — Avi Chawla](https://blog.dailydoseofds.com/p/anatomy-of-the-claude-folder)
