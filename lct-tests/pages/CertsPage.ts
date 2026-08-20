import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export interface CertInput {
  name: string;
  issuer?: string;
  category?: 'Cloud' | 'Data & AI' | 'Security' | 'DevOps' | 'Leadership' | 'Other';
  earnedDate?: string;   // YYYY-MM-DD
  expiryDate?: string;   // YYYY-MM-DD
  url?: string;
}

export class CertsPage extends BasePage {
  readonly addButton: Locator;
  readonly modal: Locator;
  readonly nameInput: Locator;
  readonly issuerInput: Locator;
  readonly categorySelect: Locator;
  readonly earnedInput: Locator;
  readonly expiryInput: Locator;
  readonly urlInput: Locator;
  readonly saveButton: Locator;
  readonly certList: Locator;

  constructor(page: Page) {
    super(page);
    this.modal          = page.locator('#modal-cert');
    this.addButton      = page.getByRole('button', { name: '+ Add certification' });
    this.nameInput      = page.locator('#cert-name');
    this.issuerInput    = page.locator('#cert-issuer');
    this.categorySelect = page.locator('#cert-category');
    this.earnedInput    = page.locator('#cert-earned');
    this.expiryInput    = page.locator('#cert-expiry');
    this.urlInput       = page.locator('#cert-url');
    this.saveButton     = page.getByRole('button', { name: 'Save certification' });
    this.certList       = page.locator('#cert-list');
  }

  async navigateToCerts() {
    await this.goto();
    await this.clickTab('Certifications');
  }

  async openAddModal() {
    await this.addButton.click();
    await expect(this.modal).toHaveClass(/open/);
  }

  async fillCertForm(cert: CertInput) {
    await this.nameInput.fill(cert.name);
    if (cert.issuer)      await this.issuerInput.fill(cert.issuer);
    if (cert.category)    await this.categorySelect.selectOption(cert.category);
    if (cert.earnedDate)  await this.earnedInput.fill(cert.earnedDate);
    if (cert.expiryDate)  await this.expiryInput.fill(cert.expiryDate);
    if (cert.url)         await this.urlInput.fill(cert.url);
  }

  async addCert(cert: CertInput) {
    await this.openAddModal();
    await this.fillCertForm(cert);
    await this.saveButton.click();
    await expect(this.modal).not.toHaveClass(/open/);
  }

  async getCertCard(name: string): Promise<Locator> {
    return this.certList.locator('.cert-card').filter({ hasText: name });
  }

  async removeCert(name: string) {
    const card = await this.getCertCard(name);
    await card.getByRole('button', { name: 'Remove' }).click();
  }

  async getExpiryText(name: string): Promise<string> {
    const card = await this.getCertCard(name);
    const expiry = card.locator('.expiry-ok, .expiry-warn, .expiry-exp');
    return (await expiry.textContent()) ?? '';
  }
}
