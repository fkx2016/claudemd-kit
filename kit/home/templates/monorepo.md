# Monorepo conventions

(Fragment for `@import` from any monorepo's root CLAUDE.md.)

## Layout

```
packages/   # publishable / shared libraries
apps/       # deployable applications
docs/       # cross-cutting documentation
tools/      # scripts, codegen, internal tooling
```

## Workspace boundaries

- An app may depend on packages. Packages may depend on other packages.
- Apps must **not** depend on other apps directly. Cross-app communication is API-only.
- Packages must **not** depend on apps.
- If two apps need the same code, extract to a package.

## Shared types

- Cross-package types live in `packages/types` (or similar named package).
- Don't duplicate type definitions across packages — import from `types`.
- Don't put domain types inside an app. They probably belong in a shared package.

## Versioning

- Internal packages versioned together (Lerna fixed mode or changesets).
- External packages from npm pinned to exact versions in lockfile.

## Build order

- Each package builds independently. No circular dependencies.
- Use Turborepo or Nx for parallel/cached builds.
- CI builds packages first, then apps.

## Ask before acting

- Creating a new package or app (suggest scope and naming first)
- Moving code between packages
- Changing build orchestration
