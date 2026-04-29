# Where everything goes

A reference for thinking about the layered CLAUDE.md system. Read this once after install; you won't need to come back.

## The four layers

CLAUDE.md is loaded from four scopes. Each layer has a job. Stop conflating them and a lot of friction disappears.

```
~/.claude/CLAUDE.md           "You"    style, defaults, every project
<repo>/CLAUDE.md              "Team"   committed, shared with collaborators
<repo>/CLAUDE.local.md        "Local"  gitignored, just this checkout
<repo>/subdir/CLAUDE.md       "Path"   loads only when working in subdir/
```

Most specific wins. When the project says "use 2-space indent" and your global says "use 4-space," the project wins inside that repo.

## Layer 1: `~/.claude/CLAUDE.md` — You

**What it's for:** Things that are true regardless of which project you're in. Your name, your communication style, defaults you want everywhere.

**What goes here:**
- Identity ("Hi, I'm <name>, I work on...")
- Communication preferences ("Be direct. Skip the disclaimers.")
- Universal defaults ("ALWAYS use ripgrep over grep. Use jq for JSON.")
- Pointers to your templates: `@templates/python-package.md` (loaded on demand)

**What does NOT go here:**
- Project-specific facts ("Our database is Postgres 15") — that's Layer 2
- Per-machine stuff ("My API key is...") — that's Layer 3 OR an env var

**Hard cap:** ~100 lines. If yours is longer, you're putting Layer 2 stuff here. The article calls this "the editorial layer" for a reason — it should be lean.

**Kit example:** `home/CLAUDE.md`. The placeholder is intentionally minimal. Replace `[Your name]` and `[your stack]` with your details and you're done.

## Layer 2: `<repo>/CLAUDE.md` — The team

**What it's for:** The codebase's constitution. Committed to git. Read by every collaborator AND every Claude session. Should answer "what does someone need to know to work here?"

**What goes here:**
- The stack (versions, package manager, test runner)
- File layout (where do new things go?)
- Conventions (naming, error handling, logging style)
- Build / test / deploy commands
- Things that have bitten the team before — "always run migrations through Alembic, never raw SQL"
- `@imports` to fragment files in `.claude/rules/` and `.claude/skills/`

**What does NOT go here:**
- Personal preferences ("I like dark mode") — Layer 1
- Stuff you haven't pushed yet ("Working on a refactor of...") — Layer 3
- Subdirectory specifics ("React components use hooks") — Layer 4

**Sweet spot:** 50–150 lines, ideally most of it as `@imports`. The CLAUDE.md itself is a table of contents; the actual rules live in `.claude/rules/`.

**Kit example:** `project/CLAUDE.md`. Notice it has placeholders and explicit `@import` references — copy this shape.

## Layer 3: `<repo>/CLAUDE.local.md` — Just you

**What it's for:** Things specific to your checkout that shouldn't bother anyone else. **Gitignored.** Personal scratchpad.

**What goes here:**
- "I'm currently in the middle of refactoring X — don't touch Y until I'm done"
- "On this machine, the dev server runs on port 3030 because 3000 is taken"
- "Skip running migrations locally; my DB is in a weird state"
- Notes about where you left off: "Picked up the task in BUG-1234, blocked on review"
- Per-machine workarounds

**What does NOT go here:**
- API keys or credentials — use env vars, never check into a file you might forget to gitignore
- Anything the rest of the team needs to know — that's Layer 2
- Permanent rules — those don't change session to session

**Discipline:** Whatever's in here is FRESH. If you wrote it last week and you don't remember what it means, delete it. Stale Layer 3 content actively misleads.

**Kit example:** `project/CLAUDE.local.md`. Treat it as a starting point with examples; clear it out when you start a real project.

## Layer 4: `<repo>/subdir/CLAUDE.md` — Path-scoped

**What it's for:** Rules that ONLY apply when working in a specific part of the codebase. Loaded ON DEMAND when Claude is operating in that subtree.

**What goes here:**
- Frontend conventions (in `frontend/CLAUDE.md`) that backend sessions don't need to load
- Database migration rules (in `migrations/CLAUDE.md`) — only relevant when touching schemas
- Test fixtures rules (in `tests/CLAUDE.md`) — irrelevant during feature work
- Generated code warnings (in `generated/CLAUDE.md` — "DO NOT EDIT, regenerate via X")

**Why this matters:** Layer 2 is loaded on every session. Layer 4 is loaded only when relevant. Putting "frontend uses tailwind" in Layer 2 wastes context budget on every backend session. Move it to `frontend/CLAUDE.md` and pay the cost only when working there.

**Rule of thumb:** If a rule applies to one quadrant of the codebase, it's a Layer 4 candidate. If you have to ask "does this matter for backend work?" and the answer is "no" — Layer 4.

**Kit example:** `project/frontend/CLAUDE.md`. Real frontend rules in a real path-scoped file.

## How to think about it

When you have a new piece of guidance to add, ask in this order:

1. **Is this true everywhere I work?** → Layer 1 (`~/.claude/CLAUDE.md`)
2. **Is this true for this project specifically?** → Layer 2 (`<repo>/CLAUDE.md`)
3. **Is this true only for this checkout / right now?** → Layer 3 (`<repo>/CLAUDE.local.md`)
4. **Is this true only inside this subtree?** → Layer 4 (`<repo>/subdir/CLAUDE.md`)

Most beginners shove everything into Layer 1 because it's the first one they discover. Resist this. Layer 1 should stay lean. Promote things UP only when they're truly universal.

## Promoting between layers

**Layer 3 → Layer 2:** "I keep telling Claude this every session in CLAUDE.local.md" → it's not actually local; promote to Layer 2 and commit it.

**Layer 2 → Layer 4:** "Backend sessions are wasting tokens loading frontend rules" → split into `frontend/CLAUDE.md`.

**Layer 4 → Layer 2:** "I keep adding the same guidance to multiple subdirs" → it's actually project-wide; promote up.

**Layer 2 → Layer 1:** "Every project I work on has this rule" → it's part of how YOU work; move to Layer 1 (template).

The layers aren't static. Things move as the project matures and as you notice patterns.

## The `.claude/` folder

Each layer can have a `.claude/` folder next to its CLAUDE.md. The folder holds the subsystems that the CLAUDE.md `@imports`:

```
~/.claude/
+-- CLAUDE.md           layer 1 entry point
+-- templates/          stack-specific fragments, @imported as needed
+-- commands/           slash commands available everywhere
+-- agents/             reusable agent definitions
+-- hooks/              pre/post tool-use scripts
+-- settings.json       allow/deny lists

<repo>/
+-- CLAUDE.md           layer 2 entry point
+-- CLAUDE.local.md     layer 3
+-- frontend/CLAUDE.md  layer 4
+-- .claude/
    +-- settings.json   project-specific tool config
    +-- rules/          project-specific rules, @imported by CLAUDE.md
    +-- skills/         project-specific procedural knowledge
```

Same shape, different scope. The kit ships both.

## Common mistakes

| Mistake | Symptom | Fix |
|---|---|---|
| Layer 1 too long | Slow startup, off-topic context bleed | Move project-specific bits to Layer 2 |
| Layer 2 missing | New collaborators ask the same questions | Write the constitution; commit it |
| Layer 3 stale | Claude follows old guidance you forgot about | Audit local.md weekly; delete what doesn't apply |
| Everything in Layer 2 | Frontend sessions load DB rules; budget burns | Split into Layer 4 `subdir/CLAUDE.md` files |
| Secrets in any layer | Credentials in git history | Use env vars + `.dev.vars` (gitignored) |

## When in doubt

Read the article: [CLAUDE.md Is Not a Config File](https://fkxx.substack.com/p/claude-md-is-not-a-config-file). It explains the *why* behind every rule above.

Then start typing. The kit's defaults are intentional but not sacred — edit aggressively. The point is to have a system you can think about, not a system you fear changing.
