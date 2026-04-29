---
name: dependency-audit
description: Audits project dependencies for known vulnerabilities, outdated versions, and unused packages. Activates when the user mentions "audit dependencies," "check for vulns," "are my deps up to date," "dependabot," or runs before a major release.
allowed-tools: Read, Grep, Glob, Bash(npm audit*), Bash(pnpm audit*), Bash(pip-audit*), Bash(cargo audit*), Bash(npm outdated*), Bash(npm ls*)
---

# Dependency Audit Skill

When invoked, audit the project's dependencies and produce an actionable report.

## Detect the ecosystem

Look for these manifests in order:
- `package.json` + `package-lock.json` / `pnpm-lock.yaml` -> npm/pnpm
- `pyproject.toml` / `requirements.txt` -> Python
- `Cargo.toml` + `Cargo.lock` -> Rust
- `go.mod` + `go.sum` -> Go
- `Gemfile` + `Gemfile.lock` -> Ruby

If multiple, audit each.

## What to check

1. **Known vulnerabilities** (CVEs)
   - npm/pnpm: `npm audit --json` (or `pnpm audit --json`)
   - Python: `pip-audit` if available, else flag for manual review
   - Rust: `cargo audit`
   - Go: `govulncheck ./...` if available

2. **Outdated dependencies**
   - npm: `npm outdated --json`
   - pip: `pip list --outdated`
   - cargo: check Cargo.toml versions vs. crates.io latest

3. **Unused dependencies**
   - npm: `depcheck` if available, else manual scan: grep imports against `dependencies` in package.json
   - Python: similar grep approach against `pyproject.toml`

4. **Suspicious patterns**
   - Dependencies on git URLs or local paths in production
   - Pinned to old major versions when current major has security fixes
   - Transitive dependencies with vulnerabilities (often missed)

## Output format

Group by severity. Each finding includes:
- Package name + current version
- Issue (CVE / outdated / unused)
- Recommended action with exact command

```
## Critical (fix today)
- package@1.0.0 - CVE-2024-XXXXX RCE via crafted input
  Fix: npm install package@1.2.3

## High (fix this week)
- ...

## Outdated (review)
- ...

## Unused (consider removing)
- ...
```

End with a one-line summary: total count by severity, plus the single most urgent action.

## What you don't do

- You don't auto-update dependencies. You report; the human decides.
- You don't flag transitive deps the user can't directly fix unless there's a documented mitigation.
- You don't pad findings with low-severity noise. If everything's clean, say so.
