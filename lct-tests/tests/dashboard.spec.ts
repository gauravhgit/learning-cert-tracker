import { test, expect } from '../fixtures/fixtures';
import { COURSES, CERTS } from '../fixtures/testData';
import { CoursesPage } from '../pages/CoursesPage';
import { CertsPage } from '../pages/CertsPage';

test.describe('Dashboard', () => {
  test('shows zero stats on a fresh load', async ({ basePage }) => {
    expect(await basePage.getStatValue('Total courses')).toBe('0');
    expect(await basePage.getStatValue('Completed')).toBe('0');
    expect(await basePage.getStatValue('Avg progress')).toBe('0%');
    expect(await basePage.getStatValue('Certifications')).toBe('0');
  });

  test('stat counts update when a course is added', async ({ page, basePage }) => {
    const courses = new CoursesPage(page);
    await courses.clickTab('Courses');
    await courses.addCourse(COURSES.cloudBasics);
    await courses.clickTab('Dashboard');

    expect(await basePage.getStatValue('Total courses')).toBe('1');
    expect(await basePage.getStatValue('Avg progress')).toBe('50%');
  });

  test('completed count increments correctly', async ({ page, basePage }) => {
    const courses = new CoursesPage(page);
    await courses.clickTab('Courses');
    await courses.addCourse(COURSES.mlCrash);        // completed
    await courses.addCourse(COURSES.cloudBasics);    // in-progress
    await courses.clickTab('Dashboard');

    expect(await basePage.getStatValue('Total courses')).toBe('2');
    expect(await basePage.getStatValue('Completed')).toBe('1');
  });

  test('certification stat updates after adding a cert', async ({ page, basePage }) => {
    const certs = new CertsPage(page);
    await certs.clickTab('Certifications');
    await certs.addCert(CERTS.awsCcp);
    await certs.clickTab('Dashboard');

    expect(await basePage.getStatValue('Certifications')).toBe('1');
  });

  test('category chart renders for added courses', async ({ page }) => {
    const courses = new CoursesPage(page);
    await courses.clickTab('Courses');
    await courses.addCourse(COURSES.cloudBasics);
    await courses.clickTab('Dashboard');

    const chart = page.locator('#category-chart');
    await expect(chart).toContainText('Cloud');
    await expect(chart).toContainText('50%');
  });

  test('recent activity shows latest course', async ({ page }) => {
    const courses = new CoursesPage(page);
    await courses.clickTab('Courses');
    await courses.addCourse(COURSES.cloudBasics);
    await courses.clickTab('Dashboard');

    const recent = page.locator('#recent-list');
    await expect(recent).toContainText(COURSES.cloudBasics.name);
  });
});
