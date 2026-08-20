import { test, expect } from '../fixtures/fixtures';
import { CERTS } from '../fixtures/testData';

test.describe('Certifications - add', () => {
  test('adds a certification with all fields', async ({ certsPage }) => {
    await certsPage.addCert(CERTS.awsCcp);

    const card = await certsPage.getCertCard(CERTS.awsCcp.name);
    await expect(card).toBeVisible();
    await expect(card).toContainText(CERTS.awsCcp.issuer!);
    await expect(card).toContainText('Cloud');
  });

  test('adds a minimal cert (name only)', async ({ certsPage }) => {
    await certsPage.addCert(CERTS.minimal);
    const card = await certsPage.getCertCard(CERTS.minimal.name);
    await expect(card).toBeVisible();
  });

  test('does not add a cert when name is empty', async ({ certsPage }) => {
    await certsPage.openAddModal();
    await certsPage.saveButton.click();
    await expect(certsPage.modal).toHaveClass(/open/);
  });

  test('shows credential link when URL is provided', async ({ certsPage }) => {
    await certsPage.addCert(CERTS.withUrl);
    const card = await certsPage.getCertCard(CERTS.withUrl.name);
    await expect(card.getByText('View credential ↗')).toBeVisible();
  });
});

test.describe('Certifications - expiry status', () => {
  test('shows valid status for a future expiry', async ({ certsPage }) => {
    await certsPage.addCert(CERTS.awsCcp);
    const text = await certsPage.getExpiryText(CERTS.awsCcp.name);
    expect(text).toMatch(/Valid until/);
  });

  test('shows Expired for a past expiry date', async ({ certsPage }) => {
    await certsPage.addCert(CERTS.expiredCert);
    const text = await certsPage.getExpiryText(CERTS.expiredCert.name);
    expect(text).toBe('Expired');
  });

  test('shows warning for expiry within 90 days', async ({ certsPage }) => {
    await certsPage.addCert(CERTS.expiringCert);
    const card = await certsPage.getCertCard(CERTS.expiringCert.name);
    await expect(card.locator('.expiry-warn')).toBeVisible();
    const text = await certsPage.getExpiryText(CERTS.expiringCert.name);
    expect(text).toMatch(/Expires in \d+ days/);
  });

  test('no expiry text when no expiry date provided', async ({ certsPage }) => {
    await certsPage.addCert(CERTS.minimal);
    const card = await certsPage.getCertCard(CERTS.minimal.name);
    const expiry = card.locator('.expiry-ok, .expiry-warn, .expiry-exp');
    await expect(expiry).toHaveCount(0);
  });
});

test.describe('Certifications - remove', () => {
  test('removes a cert from the list', async ({ certsPage }) => {
    await certsPage.addCert(CERTS.awsCcp);
    await certsPage.removeCert(CERTS.awsCcp.name);
    await expect(certsPage.certList).not.toContainText(CERTS.awsCcp.name);
  });

  test('shows empty state after all certs removed', async ({ certsPage }) => {
    await certsPage.addCert(CERTS.minimal);
    await certsPage.removeCert(CERTS.minimal.name);
    await expect(certsPage.certList).toContainText('No certifications yet');
  });
});

test.describe('Certifications - persistence', () => {
  test('cert survives a page reload', async ({ certsPage, page }) => {
    await certsPage.addCert(CERTS.awsCcp);
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await certsPage.clickTab('Certifications');
    const card = await certsPage.getCertCard(CERTS.awsCcp.name);
    await expect(card).toBeVisible();
  });
});
