import { Page, Locator } from '@playwright/test';
import path from 'path';

export class BasePage {
  readonly page: Page;
  readonly fileUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.fileUrl = `file://${path.resolve(__dirname, '../../learning-cert-tracker.html')}`;
  }

  async goto() {
    await this.page.goto(this.fileUrl);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickTab(name: 'Dashboard' | 'Courses' | 'Certifications') {
    await this.page.getByRole('button', { name }).click();
  }

  async getStatValue(label: string): Promise<string> {
    const stat = this.page.locator('.stat').filter({ hasText: label });
    return (await stat.locator('.stat-val').textContent()) ?? '';
  }

  /** Clear localStorage so each test starts with a blank state */
  async clearStorage() {
    await this.page.evaluate(() => localStorage.clear());
    await this.page.reload();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
