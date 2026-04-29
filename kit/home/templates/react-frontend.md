# React frontend conventions

(Fragment for `@import` from any React + TypeScript project's CLAUDE.md.)

## Stack

- React 18+ with TypeScript (strict mode)
- Vite or Next.js (specify per project)
- Tailwind for styling unless project says otherwise
- TanStack Query for server state
- Zustand or React Context for client state — no Redux unless legacy
- Vitest + React Testing Library

## Components

- Functional components only. No classes.
- Co-locate component, styles, and tests: `Button.tsx`, `Button.test.tsx`.
- One component per file. Helper components for that file may live alongside.
- Props: typed inline for small, named interface for >3 props.
- Default exports for components. Named exports for hooks and utilities.

## Hooks

- Custom hooks in `hooks/` directory, prefix with `use`.
- Don't conditionally call hooks. Don't call hooks inside loops.
- Clean up effects properly. Memory leaks compound.

## Accessibility

- Semantic HTML first. `<button>`, not `<div onClick>`.
- Every form input has a label, programmatically associated.
- Keyboard navigation must work. Test it.
- ARIA only when semantic HTML can't express the meaning.

## Performance

- `React.memo` is not free — only when measured.
- `useMemo` / `useCallback` only for expensive computations or stable references that matter.
- Code-split routes. Lazy-load heavy components.
- Images: `width` and `height` attributes always; `loading="lazy"` below the fold.

## Ask before acting

- Adding a new global dependency
- Changing routing structure
- Modifying build configuration
