import { test as base } from '@playwright/test';
import { CoursesPage } from '../pages/CoursesPage';
import { CertsPage } from '../pages/CertsPage';
import { BasePage } from '../pages/BasePage';

type Fixtures = {
  basePage: BasePage;
  coursesPage: CoursesPage;
  certsPage: CertsPage;
};

export const test = base.extend<Fixtures>({
  basePage: async ({ page }, use) => {
    const p = new BasePage(page);
    await p.goto();
    await p.clearStorage();
    await use(p);
  },

  coursesPage: async ({ page }, use) => {
    const p = new CoursesPage(page);
    await p.navigateToCourses();
    await p.clearStorage();
    await p.navigateToCourses();
    await use(p);
  },

  certsPage: async ({ page }, use) => {
    const p = new CertsPage(page);
    await p.navigateToCerts();
    await p.clearStorage();
    await p.navigateToCerts();
    await use(p);
  },
});

export { expect } from '@playwright/test';
