# Learning & Certification Tracker — Test Suite

Playwright + TypeScript test framework for `learning-cert-tracker.html`.

## Prerequisites

- Node.js 18+
- The `learning-cert-tracker.html` file in the **parent directory** of this folder

## Setup

```bash
# Install dependencies
npm install

# Install Playwright browsers (first time only)
npx playwright install
```

## Project structure

```
lct-tests/
├── tests/
│   ├── dashboard.spec.ts   # Dashboard stats and charts
│   ├── courses.spec.ts     # Add / filter / progress / remove / persist
│   └── certs.spec.ts       # Add / expiry states / remove / persist
├── pages/
│   ├── BasePage.ts         # Shared navigation helpers
│   ├── CoursesPage.ts      # Page Object for Courses tab
│   └── CertsPage.ts        # Page Object for Certifications tab
├── fixtures/
│   ├── fixtures.ts         # Custom test fixtures (auto clear storage)
│   └── testData.ts         # Reusable course/cert input data
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

## Running tests

| Command | What it does |
|---|---|
| `npm test` | Run all tests headless, all browsers |
| `npm run test:chromium` | Chromium only (fastest for local dev) |
| `npm run test:headed` | Watch tests run in a real browser |
| `npm run test:ui` | Open Playwright UI mode (best for debugging) |
| `npm run test:debug` | Step through tests with DevTools |
| `npm run test:dashboard` | Dashboard tests only |
| `npm run test:courses` | Course tests only |
| `npm run test:certs` | Certification tests only |
| `npm run test:report` | Open last HTML report |

## Design decisions

**Page Object Model (POM)**  
Each tab has a dedicated page object (`CoursesPage`, `CertsPage`) that owns its locators and actions. Tests stay readable; locator changes are one-place fixes.

**Custom fixtures**  
`fixtures.ts` extends Playwright's `test` with pre-wired page objects that automatically clear `localStorage` before each test — so every test starts with a clean slate.

**Test data in one place**  
`fixtures/testData.ts` holds all reusable course/cert inputs. Change a field once, it propagates to every test that uses it.

**Persistence tests**  
Each domain has a persistence spec that calls `page.reload()` and verifies data survives, exercising the `localStorage` integration end-to-end.

**Expiry date logic**  
`expiringCert` in testData computes its expiry as 30 days from the current date at runtime — no hardcoded future dates that silently become stale.

## Adding new tests

1. Add test data to `fixtures/testData.ts`
2. Add helper methods to the relevant page object if needed
3. Write specs in the appropriate `tests/*.spec.ts` file using the custom `test` import from `fixtures/fixtures.ts`
