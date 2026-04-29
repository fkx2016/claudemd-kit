# Node + TypeScript conventions

(Fragment for `@import` from any Node.js + TypeScript project's CLAUDE.md.)

## Stack

- Node.js 20 LTS+ (use `engines` field in package.json)
- TypeScript 5+ in strict mode
- pnpm or npm (specify per project; never yarn 1.x)
- ESM modules (`"type": "module"` in package.json)
- Vitest for testing (or jest if legacy); supertest for HTTP integration tests
- ESLint + Prettier; ESLint flat config (`eslint.config.js`)

## File layout

```
src/
  index.ts              entry point
  lib/                  utilities (no side effects on import)
  routes/               HTTP handlers (if web app)
  services/             external API clients
  types/                shared types
tests/                  test files matching src/ structure
dist/                   build output, gitignored
package.json
tsconfig.json
```

## TypeScript

- `strict: true` always. No `any` without a comment explaining why.
- Prefer `interface` for public APIs, `type` for unions and computed types.
- Use `import type` for type-only imports.
- Don't `as any` — use `unknown` and narrow.
- `satisfies` over type assertions when possible.

## Async / errors

- All async functions return `Promise<T>`. No `void` for async unless intentional fire-and-forget.
- Catch errors at boundaries (HTTP handlers, message consumers), not in every leaf function.
- Throw `Error` subclasses with meaningful names (`NotFoundError`, `ValidationError`), not strings.
- `for await` over `.then` chains for sequential async.

## Common gotchas

- ESM + Node = `.js` extensions in import paths even when source is `.ts`. ESLint can enforce.
- `__dirname` doesn't exist in ESM. Use `import.meta.url` + `fileURLToPath`.
- Top-level `await` works in ESM but not CommonJS.
- `process.env` values are strings — coerce explicitly with `Number()` or `=== 'true'`.

## Testing

- Vitest in unit + integration mode. `--watch` during dev, full run in CI.
- Test files: `*.test.ts` next to source OR `tests/**/*.test.ts` parallel structure.
- One assertion focus per test. Long tests with multiple `expect`s are usually two tests.
- Mock external services at the HTTP layer (msw or vi.mock), not the SDK.

## Ask before acting

- Adding a new dependency (especially one with native bindings)
- Changing module system (ESM <-> CommonJS)
- Modifying tsconfig.json `target`, `module`, or `moduleResolution`
