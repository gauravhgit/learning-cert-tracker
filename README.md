Learning & Certification Tracker

This project exists primarily to showcase test automation generated entirely using AI (Claude by Anthropic). The app itself is a simple learning and certification tracker — the real story is the Playwright framework built around it.

What this is

A self-contained, single-file HTML web app for tracking courses and professional certifications, paired with a full Playwright + TypeScript test automation framework. Both the app and the tests were created through a conversational AI session — no boilerplate was written by hand.

The goal: demonstrate what AI-assisted test automation looks like end-to-end, from a working app to a structured, maintainable test suite.

Repository structure
├── learning-cert-tracker.html   # The app under test — open in any browser
└── lct-tests/
    ├── tests/
    │   ├── dashboard.spec.ts    # Stats, charts, recent activity
    │   ├── courses.spec.ts      # Add / filter / progress / remove / persist
    │   └── certs.spec.ts        # Add / expiry states / remove / persist
    ├── pages/
    │   ├── BasePage.ts          # Shared navigation and storage helpers
    │   ├── CoursesPage.ts       # Page Object for the Courses tab
    │   └── CertsPage.ts         # Page Object for the Certifications tab
    ├── fixtures/
    │   ├── fixtures.ts          # Custom test fixtures (auto-clears localStorage)
    │   └── testData.ts          # Reusable typed course and cert inputs
    ├── playwright.config.ts
    ├── package.json
    └── tsconfig.json

Setup

Prerequisites: Node.js 18+

bash
cd lct-tests
npm install
npx playwright install   # downloads browsers — one-time, ~300 MB
Running tests
Command	What it does
npm test	Run all tests headless across all browsers
npm run test:chromium	Chromium only — fastest for local dev
npm run test:headed	Watch tests run in a real browser
npm run test:ui	Open Playwright UI mode — best for debugging
npm run test:debug	Step through tests with DevTools
npm run test:dashboard	Dashboard tests only
npm run test:courses	Course tests only
npm run test:certs	Certification tests only
npm run test:report	Open the last HTML report

Browser support

Tests run across four Playwright projects by default:

Chromium (Desktop Chrome)
Firefox
WebKit (Desktop Safari)
Mobile Chrome (Pixel 5)

Run npm run test:chromium for the fastest local feedback loop.

License

MIT
