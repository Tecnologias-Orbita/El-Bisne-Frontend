# AGENTS.md — El Bisne Frontend

## 1. Build / Lint / Test Commands

| Task | Command |
|------|---------|
| Install deps | `GITHUB_TOKEN=<token> npm install` |
| Dev server | `npm run dev` |
| Build production | `npm run build` |
| Start prod server | `npm run start` |
| Lint (all) | `npm run lint` |
| Lint single file | `npx eslint path/to/file.ts` |
| Typecheck | `npx tsc --noEmit` |
| Run tests | *No test runner configured yet* |

**No automated test suite exists.** Manual tests are listed in `tests/MANUAL.md`. When adding tests, use Vitest or Jest with React Testing Library; place files under `tests/` or `__tests__/` alongside source.

## 2. Code Style Guidelines

### TypeScript (tsconfig.json)
- **Strict mode**: `strict: true` — no `any`, explicit return types on exported functions
- **Module**: ESNext, bundler resolution, `isolatedModules: true`
- **Paths**: `@/*` maps to `./src/*` — always use path aliases
- **JSX**: `react-jsx` (no import React needed)

### Imports
- Use `@/` alias for all internal imports (`@/modules/auth/services/auth.service`)
- External packages first, then internal, grouped with blank lines
- Prefer named exports; default only for pages/components
- Type imports: `import type { Foo } from "..."`

### Formatting (Prettier via VS Code)
- `editor.formatOnSave: true`
- ESLint fixes on save (`source.fixAll.eslint`)
- Sort imports on save (`source.sortImports`)
- Single quotes, trailing commas, 2-space indent (Prettier defaults)

### Naming Conventions
| Kind | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `PrimaryButton`, `PublicAccessNav` |
| Hooks | camelCase + `use` prefix | `useLogin`, `usePublicBusiness` |
| Services | camelCase + `Service` suffix | `authService`, `publicBusinessService` |
| Types/Interfaces | PascalCase | `AuthenticatedUser`, `PublicBusinessData` |
| Constants | UPPER_SNAKE_CASE | `SESSION_KEY`, `LOCAL_DEVELOPMENT` |
| Files (components) | PascalCase.tsx | `Container.tsx` |
| Files (hooks/services/types) | kebab-case.ts | `use-login.ts`, `auth.types.ts` |

### React Patterns
- **Client components**: `"use client"` directive at top
- **Server components**: default (no directive)
- **Props**: `type Props = { ... }` or `PropsWithChildren<{ ... }>`
- **Children**: `PropsWithChildren` for wrappers
- **State**: `useState`, `useReducer` — avoid `useEffect` for derived state (use `useMemo`)
- **Events**: `useCallback` for handlers passed to children

### Error Handling
- **API layer**: `ApiError` class (status + message) in `src/lib/api/api-client.ts`
- **Services**: throw `ApiError` on non-ok responses; parse error payload via `errorMessage()`
- **Hooks**: catch errors, set user-facing message in state (`error: string | null`)
- **Forms**: prevent default, `try/catch/finally`, set `isSubmitting` flag

### Async / Data Fetching
- **Client**: hooks return `{ data, error, isLoading, mutate }` pattern
- **Server**: `apiClient<T>(path, options)` — typed, throws `ApiError`
- **Local dev**: `rfetch` swaps `fetch` for `localApiResolver` when `NODE_ENV === "local_develop"`

### Environment & Config
- `src/config/env.ts` — single source of truth
- `NEXT_PUBLIC_API_URL` (default `/api/backend`)
- `NEXT_PUBLIC_APP_URL` optional
- `.env.example` documents required vars

### Architecture (per README)
```
src/
├── app/              # Thin Next.js route handlers only
├── config/           # env.ts
├── lib/api/          # api-client.ts, fetch-api.ts, local-api-resolver.ts
├── modules/
│   ├── auth/         # login, session, platform admin check
│   ├── platform-admin/
│   ├── business-admin/
│   ├── public-business/
│   ├── platform-public/
│   ├── onboarding/
│   └── home/
└── shared/
    └── components/   # Reusable UI (Container, Buttons, Nav, QRCode...)
```
- Each feature = independent module under `modules/`
- Modules own: `components/`, `hooks/`, `services/`, `types/`
- `app/` routes import module pages only

### UI / Styling
- Tailwind CSS v4 (`@tailwindcss/postcss`)
- `tailwind-merge` for class composition (`twMerge`)
- Orbita UI (`@tecnologias-orbita/orbita-ui-react`) for base components
- Lucide icons (`lucide-react`)

### Git / Commits
- No formal commit convention enforced; prefer conventional commits
- Pre-commit hook not configured; run `npm run lint` before push

### VS Code Settings (`.vscode/settings.json`)
- Format on save (Prettier)
- ESLint auto-fix on save
- Organize imports on save
- TypeScript auto-import on save