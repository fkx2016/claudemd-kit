---
description: Turn a debugging session into a structured postmortem document
---

You are writing a postmortem from the conversation context.

## Inputs

Pull from the conversation:
- What was the original problem report?
- What was the root cause (the actual underlying issue, not the surface symptom)?
- What was the fix?
- What hypotheses were wrong along the way?
- How long did it take to find?

If any of these aren't clear from context, ask before guessing.

## Output format

```markdown
# Postmortem: <one-line title>

**Date:** <today>
**Duration:** <approx, from first symptom to fix>
**Severity:** <production / staging / dev>

## Symptom

<What was visible to the user/observer. One paragraph.>

## Root cause

<The actual underlying issue. Not "the bug was in the code" — be specific
about which assumption was wrong, which interaction was unexpected, which
edge case wasn't covered.>

## Fix

<What changed. Link to the commit/PR if available.>

## What we got wrong on the way

<Bulleted list of hypotheses that turned out to be wrong. This is the most
valuable section — it's where the learning lives. Be honest.>

## Action items

<What to do so this doesn't happen again. Concrete: "add test X", "update
runbook Y", "configure alert Z". Not vague: "be more careful".>
```

## Rules

- Write in past tense.
- Be specific about technical details — file:line, exact error messages, command output.
- Don't blame people. Blame missing tests, missing docs, ambiguous APIs, surprising defaults.
- If the postmortem is short (< 100 words), the issue probably didn't deserve one. Say so and stop.
