---
name: security-review
description: Reviews code changes for security issues. Activates when reviewing PRs, before merging, or when the user mentions "security check," "audit," "vulnerabilities," or asks if code is safe.
allowed-tools: Read, Grep, Glob
---

# Security Review Skill

When invoked, perform a focused security review of the relevant code.

## What to look for

1. **Injection vectors**
   - String concatenation into SQL, shell commands, file paths, HTML
   - User input reaching `eval`, `exec`, `Function()`, `innerHTML`

2. **Authentication & authorization**
   - Endpoints that should require auth but don't
   - Authorization checks that compare strings without timing-safe comparison
   - JWTs used without verification

3. **Secrets & credentials**
   - Hardcoded API keys, passwords, tokens (any string > 20 chars that looks random)
   - Secrets in logs, error messages, or client-bound responses
   - `.env` files in commits

4. **Cryptography misuse**
   - MD5 or SHA1 for anything security-sensitive
   - Hardcoded IVs or salts
   - Weak random sources (`Math.random()`) for security purposes

5. **Input validation**
   - User input written to disk without path sanitization
   - URLs followed without allowlist
   - File uploads without type/size limits

## Output format

Group findings by severity: **Critical**, **High**, **Medium**, **Low**.
Each finding: `file:line — issue — suggested fix.`
End with a one-line "Cleared" or "Issues found, see above."

If no issues, say so explicitly. Don't invent issues to look thorough.
