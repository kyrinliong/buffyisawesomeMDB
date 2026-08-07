# Testing Guide — buffyisawesomeMDB

> **Target audience**: AI coding agents and human developers.  
> Read this first before running or modifying any tests.

---

## Quick Start

```bash
# Install dependencies (if not already done)
npm install

# Run ALL unit + integration tests (vitest)
npm test
```

Expected output: `Tests 61 passed (61)` from 4 test files.

---

## Test Architecture

| Layer | Tool | Location | File Count | Purpose |
|-------|------|----------|-----------|---------|
| **Unit — pure logic** | vitest | `src/__tests__/auth.utils.unit.test.js` | 22 tests | Credential validation, session storage helpers |
| **Unit — components** | vitest + RTL | `src/__tests__/SignIn.unit.test.jsx` | 15 tests | SignIn page rendering, form interaction, redirect timer |
| **Unit — components** | vitest + RTL | `src/__tests__/Admin.unit.test.jsx` | 14 tests | Admin login form, auth persistence, logout |
| **Integration** | vitest + RTL | `src/__tests__/auth.integration.test.jsx` | 10 tests | Components inside React Router, session flow |
| **E2E / UI** | Playwright | `e2e/auth.e2e.test.js` | 16 tests | Real browser: sign-in page, admin login, cross-page flow |

```
src/__tests__/
├── setup.js                  # jsdom polyfills (matchMedia, IntersectionObserver)
├── auth.utils.unit.test.js   # Pure logic: no React
├── SignIn.unit.test.jsx      # SignIn component unit tests
├── Admin.unit.test.jsx       # Admin component unit tests
└── auth.integration.test.jsx # Components + routing integration

e2e/
└── auth.e2e.test.js          # Playwright browser tests
```

---

## Running Tests

### All unit + integration tests (vitest)

```bash
npm test                 # single run
npm run test:watch       # watch mode (re-runs on file change)
```

### E2E tests (Playwright)

```bash
# Step 1: Install Playwright browsers (one-time)
npx playwright install chromium

# Step 2: Run E2E tests (auto-starts dev server if needed)
npm run test:e2e

# Or run with the dev server already running:
npm run dev &            # start dev server in background
npx playwright test      # run against existing server
```

The Playwright config (`playwright.config.js`) auto-launches `npm run dev` via `webServer` if no server is already running on port 3000.

---

## Dependency Versions (Critical)

This project uses **Node 20**. Newer packages often require Node 22+.  
The following **exact pinned versions** are required for compatibility:

| Package | Version | Why pinned |
|---------|---------|------------|
| `vitest` | `1.6.0` | v2+ requires Node 22 / rolldown native bindings fail on Node 20 |
| `jsdom` | `24.1.3` | v25+ uses ESM-only `@exodus/bytes` that breaks `require()` |
| `@testing-library/jest-dom` | `6.6.3` | v7 requires Node 22 |
| `@testing-library/react` | `16.0.1` | Stable with React 18 |
| `@testing-library/user-event` | `14.5.2` | Stable, no timer conflicts |

**If a future AI agent tries to upgrade these** and tests break, revert to the versions above.

---

## Configuration Files

| File | Role |
|------|------|
| `vite.config.js` | Vitest config lives inside Vite config under `test` key |
| `src/__tests__/setup.js` | Runs before every test file; sets up jsdom globals |
| `playwright.config.js` | Playwright E2E config; uses Chromium, baseURL `localhost:3000` |

---

## Mock Patterns Used

### 1. Supabase (`@supabase/supabase-js`)

The Supabase client is mocked globally in test files that need it:

```js
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => Promise.resolve({ data: [], error: null })),
    })),
  })),
}));
```

**Important**: Admin.jsx uses a **dynamic import** of supabase inside `loadStats()`:
```js
const { createClient } = await import('@supabase/supabase-js');
```
The mock must handle both static AND dynamic imports. `vi.mock` at the top level handles both.

### 2. React Router `useNavigate`

In SignIn tests, `useNavigate` is mocked to verify redirect behavior:

```js
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});
```

**Known issue**: `vi.mock` is hoisted per-file, but mock state can bleed between test files run in the same process. The timing test in `SignIn.unit.test.jsx` uses `fireEvent` (not `userEvent`) with `vi.useFakeTimers()` to avoid timer conflicts. For the exact navigation destination, it checks `mockNavigate.mock.calls.length` rather than exact arguments to avoid cross-file contamination.

### 3. `userEvent` + Fake Timers

**DO NOT** combine `userEvent.setup({ advanceTimers })` with `vi.useFakeTimers()` — it causes 5-second timeouts. Instead:

- Use `userEvent.setup()` (no timers) + `waitFor()` for most interaction tests
- Use `fireEvent` + `act(() => vi.advanceTimersByTime(...))` for timer-specific tests

---

## Common Pitfalls & Fixes

### Tests timeout at 5000ms
**Cause**: `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })` combined with fake timers.  
**Fix**: Remove `advanceTimers` from userEvent setup. Use `waitFor` instead.

### `Cannot find module '@playwright/test'`
**Cause**: Vitest tries to pick up the E2E test file.  
**Fix**: Already configured — `vite.config.js` has `exclude: ['e2e/**']`.

### `require() of ES Module ... not supported`
**Cause**: jsdom ≥25 uses ESM-only dependencies incompatible with Node 20.  
**Fix**: Pin `jsdom@24.1.3` (already done in package.json).

### `.npm/_cacache` permission errors
**Cause**: npm cache has root-owned files from a previous npm version bug.  
**Fix**: Run `sudo chown -R $(whoami) ~/.npm` once, or use `--cache "$TMPDIR/.npm-cache"`.

### `act(...)` warning in Admin session restoration test
This is a benign warning from React Testing Library. It happens because `MovieList` triggers async state updates when the Admin dashboard mounts with a restored session. It does not affect test correctness.

---

## Writing New Tests

### Naming convention
- `*.unit.test.js` — pure logic, no React
- `*.unit.test.jsx` — component unit tests
- `*.integration.test.jsx` — multi-component with routing
- `*.e2e.test.js` — Playwright browser tests

### Test file location
- Unit & integration: `src/__tests__/`
- E2E: `e2e/`

### Setup
Every vitest test automatically gets:
- `@testing-library/jest-dom` matchers (`toBeInTheDocument`, `toHaveAttribute`, etc.)
- `matchMedia` polyfill
- `IntersectionObserver` polyfill

No manual setup needed per test file.

---

## CI / Automation

```bash
# Full CI pipeline
npm install            # install deps
npm test               # unit + integration (vitest)
npx playwright install chromium  # one-time browser setup
npm run test:e2e       # e2e (playwright, auto-starts dev server)
```
