# Frontend-specific conventions

(This file loads only when Claude is working in the `frontend/` directory.
General project rules are in the root CLAUDE.md.)

## Stack details specific to this app

- React 18 + Vite
- TanStack Query v5
- Tailwind via `@tailwindcss/vite`

## File organization

- `src/components/` — reusable components
- `src/features/<feature>/` — feature-scoped components, hooks, types
- `src/lib/` — utilities, no React
- `src/api/` — API client and query definitions

## Don't

- Don't import from another feature's directory. If two features need the same thing, hoist to `src/components/` or `src/lib/`.
- Don't put business logic in components. Use hooks.
- Don't add a new global state slice without discussion. Most state is server state (TanStack Query) or local component state.
