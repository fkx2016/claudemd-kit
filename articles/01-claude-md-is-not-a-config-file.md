# CLAUDE.md Is Not a Config File

### And the .claude folder is not a folder of dotfiles. It's the most important productivity surface in agentic coding, and almost nobody is using it deliberately.

---

If you've used Claude Code more than casually, you've created a CLAUDE.md. Maybe two. Maybe you ran `/init` once, glanced at the result, edited a line, and moved on.

That's most people. And most people are leaving the most important productivity feature in agentic coding entirely on the table.

CLAUDE.md is not a config file. It's not documentation. It's the editorial layer of a layered context system that determines what your AI assistant knows the moment a session starts. The `.claude` folder isn't a junk drawer of dotfiles — it's a small, well-designed operating system for personalized AI behavior, with five distinct subsystems that compose.

If you're running a single project, the surface looks small. If you're running a constellation — multiple repos, multiple deployment targets, shared conventions you keep retyping into every new chat — the surface is large, and the leverage from configuring it deliberately is enormous.

This piece is a field guide. The first half lays out the architecture. The second half is technique: how to set this up at the system level, how to set it up per project, and how to know when something should move from one layer to another.

---

## The Four-Layer Mental Model

CLAUDE.md exists in four scopes, loaded in this order of precedence (most specific wins):

1. **Global / user** — `~/.claude/CLAUDE.md`. Applies to every project on your machine.
2. **Project (shared)** — `<repo>/CLAUDE.md`. Committed to git. Shared with collaborators.
3. **Project (local)** — `<repo>/CLAUDE.local.md`. Gitignored. Your personal notes for *this* project.
4. **Path-scoped** — `<repo>/some/subdir/CLAUDE.md`. Loads only when Claude actually works inside that subdirectory.

Layers 1–3 load in full at session start. Layer 4 loads lazily, on demand. This isn't trivia — it's a budget consideration. Your context window is finite, and stuffing everything into the root CLAUDE.md means everything gets paid for at every session, even when you're working in a corner of the codebase that doesn't need it.

The right way to think about these layers isn't "where files live." It's *who they're for*:

- Global is for **you**. Your style, your habits, your "always do X" rules.
- Project shared is for the **team**. The constitution of the codebase.
- Project local is for **this machine, this checkout**. Sandbox URLs, debug flags.
- Path-scoped is for **the part of the codebase under your cursor right now**.

Conflate any two of these and you'll feel friction. Personal preferences in the shared CLAUDE.md leak into your team's experience. Project-specific architecture rules in the global file mess up unrelated projects. Frontend rules in the root file get loaded even when you're touching the database layer.

---

## The .claude Folder: Five Subsystems

The `.claude/` folder lives both per-project and globally (`~/.claude/`). Same structure, different scope:

```
.claude/
├── CLAUDE.md
├── settings.json
├── settings.local.json
├── agents/
├── commands/
├── skills/
├── hooks/
├── rules/
├── plugins/
└── projects/
```

Five conceptual subsystems live here:

- **Instructions** — `CLAUDE.md` plus `rules/`. What Claude should know.
- **Workflows** — `commands/` plus `skills/`. Reusable multi-step actions.
- **Specialists** — `agents/`. Subagents with isolated context windows.
- **Permissions** — `settings.json` and `settings.local.json`. Allow/deny lists for tools.
- **Memory** — the global `~/.claude/` and the auto-memory file. Persistence across sessions.

Two confusions worth heading off immediately, because they trip up almost everyone:

**Commands vs skills** look almost identical on disk. Both are markdown files with YAML frontmatter. The difference is the trigger model. **Commands wait for you to type `/something`.** **Skills watch the conversation and activate themselves** when the description in their frontmatter matches what you're doing. A skill is autonomous; a command is on-demand.

**Agents vs skills** also feel similar. The difference is the execution context. A skill runs in your main session, consuming your context. An agent runs in a *fresh, isolated context window*, does its job, returns a compressed result, and disappears. Use agents when you need work done that would otherwise blow up your main context — code review of a 30-file PR, a security audit, a deep-research subtask.

Once you've internalized those two distinctions, the rest of the folder makes sense.

---

## The Composition Pattern: @imports

Here's the feature most people miss entirely. CLAUDE.md supports an `@import` directive:

```markdown
@~/.claude/templates/cloudflare-worker.md
@./docs/api-conventions.md
```

The referenced file's contents get pulled into context as if they were inline. Imports are recursive up to depth 5. First-time imports from external locations trigger an approval dialog.

This is what unlocks the *composition pattern*. Instead of every project's CLAUDE.md being a standalone monolith, you build a library of fragments and each project's CLAUDE.md assembles the right ones.

```markdown
# CLAUDE.md for FundingGuard

@~/.claude/templates/identity.md
@~/.claude/templates/cloudflare-worker.md
@~/.claude/templates/d1-conventions.md

## Project-specific

This is FundingGuard, a watchdog for AI/cloud service funding status...
```

Now you're not retyping conventions across five projects. You're not silently letting them drift apart. You're not trying to keep one giant CLAUDE.md in sync with reality. The fragments are the source of truth. The project files are recipes that combine them.

Anyone who has built software for more than ten minutes will recognize this immediately as good architecture. DRY. Single source of truth. Composition over inheritance. The same instincts that make you reach for shared modules in code apply to CLAUDE.md files. The fact that almost nobody uses `@imports` this way is a signal of how new this whole system still is.

---

## Auto Memory: The Learned Layer

CLAUDE.md is the editorial layer — what *you* tell Claude. Auto memory is the learned layer — what Claude figures out over time and writes back to itself.

Introduced in v2.1.59, auto memory captures things like: build commands you ran successfully, error patterns you taught Claude to avoid, conventions Claude observed in your code, workarounds you walked it through. It only persists what looks useful in future sessions. Only the first 200 lines / 25KB load per conversation.

Two practical implications:

**Review auto memory periodically.** Open `/memory` and read what's been saved. Errors propagate. If Claude saved an incorrect entry six weeks ago, it has been giving itself worse advice ever since. A monthly five-minute review prevents months of accumulated drift.

**Auto memory tells you what's missing from your CLAUDE.md.** If Claude keeps re-learning the same thing across sessions, it's because that thing isn't in your editorial layer yet. Promote it. The auto-memory file is, in effect, a continuous diff between what you've documented and what your project actually requires.

The cycle is: you write what you know. Claude observes and saves what it learns. You review periodically and promote the good stuff into CLAUDE.md (so it's stable and shareable) and prune the rest. Over months, the editorial layer compounds.

---

## Technique: System-wide Setup

The system-wide layer is the highest-leverage thing you'll configure, because it touches every project. Treat it accordingly.

**`~/.claude/CLAUDE.md` should be lean.** Aim for 50 lines, hard cap at 100. This file is a working contract — the few stable expectations that hold across every project you'll ever touch. It's not a personality dump. Things that belong:

- Who you are and how you work (one paragraph)
- Communication style preferences (concise, direct, prose vs bullets)
- Cross-language conventions you actually follow everywhere ("always types before implementations")
- Hard "never" rules ("never use CMD for git commit messages — always PowerShell")
- A note about where to find your project templates

Things that don't belong: anything project-specific, anything that changes monthly, your full life story.

**Build a `~/.claude/templates/` folder.** This is where the composition pattern lives. Each fragment is small and focused: `cloudflare-worker.md`, `react-conventions.md`, `python-package.md`, `monorepo-rules.md`. When you start a new project, you pick from the menu. The fragments evolve over time as you learn what actually matters; every project that imports them inherits the improvements automatically.

**Use `~/.claude/commands/` for cross-project workflows.** Anything you do constantly across projects belongs here. A few that earn their keep:

- `/standup` — generate a daily summary from recent commits
- `/securityscan` — quick scan against the current repo
- `/explain` — wrap an explanation request with your preferred output format
- `/postmortem` — turn a debugging session into a writeup

These show up as `/user:command-name`, distinguishing them from project-specific commands.

**`~/.claude/agents/` for specialists you reuse.** A code reviewer, a security auditor, a doc writer. Tool restrictions matter — a security auditor probably only needs `Read`, `Grep`, and `Glob`. Tighter tool grants make agents faster and safer.

**Settings: start permissive, tighten over time.** A minimal `settings.json` with a deny list for the truly destructive (`rm -rf /*`, `git push --force` to main, anything touching `~/.ssh/`) is better than an exhaustive allow list you maintain forever. Let Claude prompt you the first time it wants to do something new; you'll learn what to add.

---

## Technique: Per-Project Setup

Project setup is where most people overinvest in the wrong place. They write a 600-line CLAUDE.md the first day and then never update it because it's overwhelming. Don't do that.

**Start with `/init`.** Let Claude scan the repo and generate a baseline. Read what it produced. Most of it will be wrong or generic. That's fine — now you have something to edit.

**Trim ruthlessly to ~150 lines.** Beyond 200 lines, the model starts drifting. Anything that feels like documentation rather than instruction goes elsewhere. Anything path-specific goes to `.claude/rules/` or a subdirectory CLAUDE.md.

**The shape of a good project CLAUDE.md:**

```markdown
@~/.claude/templates/identity.md
@~/.claude/templates/cloudflare-worker.md

# ProjectName

One-paragraph description. What it does, who uses it, why it exists.

## Architecture

Five bullets. Major components, key dependencies, deployment target.

## Build / Test / Deploy

Exact commands. Not "run the deploy script" —
`cd src/worker && npx wrangler deploy`.

## Conventions

The five things a new contributor would get wrong without being told.

## Immutable Rules

The two or three rules that override any contradicting prompt.
```

That's it. If you find yourself writing more, you're either putting documentation in the wrong file, or you should be promoting things into skills, commands, or rules.

**`CLAUDE.local.md` for the things that aren't shared.** This is gitignored. Personal API endpoints. The exact path to your local mock service. Notes about the bug you're chasing today. It loads alongside the shared CLAUDE.md but never gets committed.

**Subdirectory CLAUDE.md when scope is genuinely sub-project.** A monorepo with `frontend/`, `worker/`, and `docs/` should have a CLAUDE.md in each. Frontend conventions don't apply to the worker. Worker conventions don't apply to the docs site. Path-scoped means relevant context loads only when needed, instead of competing for attention with everything else.

**`.claude/rules/` when CLAUDE.md gets crowded.** This is the escape valve. Take the section that's gotten too detailed, move it to a separate rules file, scope it by path. Your CLAUDE.md gets shorter; your guidance gets sharper.

---

## Technique: Knowing When to Promote

The trickiest skill in this whole system is knowing *what belongs where*. Here's a working heuristic:

- If it's **a fact Claude should hold every session** — "we use X library, deploy via Y, name things Z way" — it goes in CLAUDE.md.
- If it's **a multi-step procedure** — "to add a new article: 1. update articles.json, 2. create HTML in src/lab/, 3. update sitemap, 4. deploy" — it goes in a skill.
- If it's **a reusable prompt you keep retyping** — "write me a commit message in the style of ___" — it goes in a command.
- If it's **a specialist task that benefits from isolation** — code review, security audit, writing tests — it goes in an agent.
- If it's **path-specific** — frontend conventions, database rules, vendor folder restrictions — it goes in `.claude/rules/` or a subdirectory CLAUDE.md.
- If it's **something that should never happen** — destructive commands, secrets in commits — it goes in `settings.json` deny list, not in CLAUDE.md as a polite request.

The trap most people fall into: putting procedures in CLAUDE.md. The model reads the steps every session, but it doesn't actually run them — it just gets longer instructions to drown out the things that *do* belong there. Procedures want to be skills, where they activate when relevant and get out of the way otherwise.

---

## Anti-patterns

A short list of things that look reasonable and aren't:

**One giant CLAUDE.md.** Beyond ~200 lines, instruction-following degrades. If you're at 400 lines, you don't have a configuration file — you have a wishlist that the model is partially ignoring.

**Documentation in CLAUDE.md.** Architecture decision records, API reference, contributor onboarding — these are README and `docs/` material. CLAUDE.md is for *behavioral instructions*, not for explaining what the codebase is.

**Personal preferences in the shared CLAUDE.md.** "I prefer concise responses" is a global concern, not a project concern. Your collaborator does not want your preferences leaking into their sessions.

**Treating settings.json as optional.** If you don't have a deny list, you're one careless prompt away from `rm -rf /*`. Even a five-line deny list is better than nothing.

**Forgetting auto memory exists.** It's writing to itself whether you're paying attention or not. Review it monthly. Promote the good stuff. Prune the rest.

**Confusing skills with commands.** If you find yourself typing the same prompt repeatedly, you want a command. If you find yourself thinking "Claude should just *know* to do this when it sees X" — you want a skill.

---

## The Strategic Implication

Configuration files have always existed. `.bashrc`, `.vimrc`, `.gitconfig`. They share a property: they encode preferences once, and then your tooling behaves the way you want forever after, without you thinking about it.

The CLAUDE.md / `.claude` system is doing something subtly different and more powerful. It's encoding *context* — what the AI knows about you, your projects, your conventions, your "always" and "never" rules — in a way that composes across scopes and persists across sessions. It's not just configuring a tool. It's building an environment in which an intelligent agent operates.

The implication for anyone running more than one project is significant: you're not configuring Claude per project. You're building a personal AI configuration architecture. The shape of that architecture — what's global, what's shared, what's local, what's composed from fragments, what's promoted to a skill — determines how much friction you carry across every session of every project for the next several years.

Most people are at maybe 10% of what this system can do. A lean global CLAUDE.md, a project file or two, no templates, no skills, no rules, no agents, no auto-memory review. It works fine, in the sense that a Honda Civic with three flat tires also works fine.

The 10x is composition. A small library of fragments. A handful of skills for the procedures you actually run. Two or three agents for specialist work. A deny list you actually trust. Auto memory you review monthly. CLAUDE.md files that stay under 200 lines because everything that doesn't belong has somewhere better to go.

That's not a config setup. That's an environment. And it's the actual product Claude Code is shipping — the chat interface is just the part you can see.

---

## Sources

- [Claude Code memory documentation](https://code.claude.com/docs/en/memory)
- [Claude Code skills documentation](https://code.claude.com/docs/en/skills)
- [Anatomy of the .claude folder — Avi Chawla](https://blog.dailydoseofds.com/p/anatomy-of-the-claude-folder)
- [The .claude Directory Explained](https://www.claudedirectory.org/how-to/claude-folder)
