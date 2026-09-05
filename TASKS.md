# El-Bisne-Frontend - Task Plan

| ID   | Type    | Title                               | Description                                                                                                                      | Priority | Suggested Skill | Done |
| ---- | ------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------- | --------------- | ---- |
| F-01 | Feature | Add automated test suite            | Configure Vitest/Jest + React Testing Library; add unit tests for services, hooks, and components; add e2e tests with Playwright | High     | test-automation | [x]  |
| F-02 | Feature | Implement CI/CD pipeline            | Add GitHub Actions workflow for lint, typecheck, test, and build on PR/push; add preview deployments                             | High     | ci-cd           | [ ]  |
| F-03 | Feature | Add Storybook for component library | Document and test shared components (Container, Buttons, Nav, QRCode) in isolation                                               | Medium   | storybook       | [ ]  |
| F-04 | Feature | Internationalization (i18n)         | Add next-intl or similar for multi-language support across modules                                                               | Medium   | i18n            | [ ]  |
| F-05 | Feature | API client enhancements             | Add request/response interceptors, retry logic, caching (SWR/TanStack Query), and proper error boundaries                        | High     | data-fetching   | [ ]  |
| F-06 | Feature | Role-based access control (RBAC) UI | Extend auth module with permission guards, role-based navigation, and conditional rendering                                      | High     | auth-rbac       | [ ]  |
| F-07 | Feature | Dark mode support                   | Add theme switching (light/dark/system) with Tailwind v4 CSS variables and persist to localStorage                               | Medium   | theming         | [ ]  |
| F-08 | Feature | Onboarding flow completion          | Complete multi-step onboarding wizard for business-admin and platform-admin modules                                              | Medium   | wizard-forms    | [ ]  |
| F-09 | Feature | Real-time notifications             | Integrate WebSocket/SSE for live notifications in platform-admin and business-admin                                              | Low      | realtime        | [ ]  |
| F-10 | Feature | Audit logging dashboard             | Add audit log viewer with filtering, export, and real-time updates for platform-admin                                            | Low      | audit-logging   | [ ]  |

| ID   | Type | Title                                                       | Description                                                                                                            | Priority | Suggested Skill   | Done |
| ---- | ---- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------- | ----------------- | ---- |
| B-01 | Bug  | Missing global npm directory breaks `npm ls -g`             | `C:\Users\user1\AppData\Roaming\npm` doesn't exist; fix by creating directory or configuring npm prefix                | High     | npm-config        | [ ]  |
| B-02 | Bug  | No test runner configured                                   | `package.json` has no test script; `tests/MANUAL.md` is only testing approach                                          | High     | test-automation   | [ ]  |
| B-03 | Bug  | ESLint ignores may be too broad                             | `eslint.config.mjs` ignores `.next/`, `out/`, `build/` but may miss other generated files                              | Low      | linting           | [ ]  |
| B-04 | Bug  | TypeScript `strict: true` but no `noUncheckedIndexedAccess` | Consider enabling stricter array/object access checks                                                                  | Low      | typescript        | [ ]  |
| B-05 | Bug  | `rfetch` local resolver only works in development           | `fetch-api.ts` resolves to local handlers only when `NODE_ENV !== 'production'`; document or fix for prod-like testing | Medium   | api-client        | [ ]  |
| B-06 | Bug  | No error boundary components                                | React error boundaries missing for graceful error handling in modules                                                  | Medium   | error-handling    | [ ]  |
| B-07 | Bug  | Environment validation incomplete                           | `src/config/env.ts` reads env vars but doesn't validate required ones at startup                                       | High     | config-validation | [ ]  |
| B-08 | Bug  | Missing `package-lock.json` in repo                         | Should be committed for reproducible installs (check `.gitignore`)                                                     | Low      | npm-config        | [ ]  |

| ID   | Type   | Title                                                             | Description                                                                                                           | Priority | Suggested Skill    | Done |
| ---- | ------ | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------- | ------------------ | ---- |
| C-01 | Change | Migrate to Tailwind v4 fully                                      | Currently using `@tailwindcss/postcss` plugin; ensure all v4 features (CSS-first config, `@theme`) are leveraged      | Medium   | tailwind           | [ ]  |
| C-02 | Change | Upgrade to React 19 stable                                        | Currently on `^19.0.0` (likely RC); verify compatibility with Orbita UI and other deps                                | High     | react-upgrade      | [ ]  |
| C-03 | Change | Consolidate API clients                                           | Two clients exist (`api-client.ts` and `fetch-api.ts`); unify or clearly document separation of concerns              | Medium   | api-client         | [ ]  |
| C-04 | Change | Add Path aliases to ESLint                                        | `tsconfig.json` has `@/*` paths; ensure ESLint resolver recognizes them via `eslint-import-resolver-typescript`       | Low      | linting            | [ ]  |
| C-05 | Change | Extract shared hooks to `src/shared/hooks`                        | Auth hooks in `src/modules/auth/hooks/`; create shared hooks for common patterns (useLocalStorage, useDebounce, etc.) | Medium   | hooks              | [ ]  |
| C-06 | Change | Add `.nvmrc` or `package.json#engines`                            | Pin Node.js version (currently 22.x per README) for team consistency                                                  | Low      | node-version       | [ ]  |
| C-07 | Change | Document module architecture                                      | Expand README with module dependency graph, data flow diagrams, and extension guidelines                              | Medium   | documentation      | [ ]  |
| C-08 | Change | Replace `MANUAL.md` with executable tests                         | Convert manual test checklist to automated tests; remove `tests/MANUAL.md`                                            | High     | test-automation    | [ ]  |
| C-09 | Change | Add bundle analysis                                               | Configure `@next/bundle-analyzer` or `webpack-bundle-analyzer` to monitor bundle size                                 | Low      | performance        | [ ]  |
| C-10 | Change | Standardize component props with `React.ComponentPropsWithoutRef` | Ensure consistent polymorphic component patterns across shared components                                             | Medium   | component-patterns | [ ]  |

---

## Notes

- **No skills currently available** in opencode — the "Suggested Skill" column indicates what _would_ help if skills existed
- Priorities: **High** = blocks development/production; **Medium** = improves DX/quality; **Low** = nice-to-have
- Start with **B-01, B-02, B-07, F-01, F-05, C-08** as they unblock other work
- Consider creating custom skills for recurring patterns (e.g., `api-client`, `test-automation`, `rbac`)
