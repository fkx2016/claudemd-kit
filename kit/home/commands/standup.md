---
description: Generate a daily standup summary from recent commits and changes
---

You are generating a daily standup summary for me.

## Steps

1. Run `git log --since="yesterday" --author="$(git config user.email)" --oneline` to see my commits.
2. Run `git diff --stat HEAD~5..HEAD` to see recent file changes.
3. Read CLAUDE.md and the most recent SESSION_LOG if one exists.
4. Write a 3-section standup:
   - **Yesterday:** What I shipped (from commits, in plain English).
   - **Today:** What's in progress, based on uncommitted changes and open TODOs.
   - **Blockers:** Anything that looks stuck (failing tests, open questions in code comments, TODOs marked urgent).

## Format

- Under 150 words total.
- Plain prose, no jargon.
- Format for Slack — single-line bullets, no nested lists.
- If nothing happened yesterday, say so. Don't pad.
