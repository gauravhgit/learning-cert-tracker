import { test, expect } from '../fixtures/fixtures';
import { COURSES } from '../fixtures/testData';

test.describe('Courses — add', () => {
  test('adds a course with all fields and displays it', async ({ coursesPage }) => {
    await coursesPage.addCourse(COURSES.cloudBasics);

    const card = await coursesPage.getCourseCard(COURSES.cloudBasics.name);
    await expect(card).toBeVisible();
    await expect(card).toContainText(COURSES.cloudBasics.provider!);
    await expect(card).toContainText('Cloud');
    await expect(card).toContainText('50%');
    await expect(card).toContainText('12h');
  });

  test('adds a minimal course (name only)', async ({ coursesPage }) => {
    await coursesPage.addCourse(COURSES.minimal);
    const card = await coursesPage.getCourseCard(COURSES.minimal.name);
    await expect(card).toBeVisible();
  });

  test('does not add a course when name is empty', async ({ coursesPage }) => {
    await coursesPage.openAddModal();
    await coursesPage.saveButton.click();
    // Modal should remain open — empty name is rejected
    await expect(coursesPage.modal).toHaveClass(/open/);
  });

  test('modal closes on cancel', async ({ coursesPage }) => {
    await coursesPage.openAddModal();
    await coursesPage.cancelButton.click();
    await expect(coursesPage.modal).not.toHaveClass(/open/);
  });

  test('modal closes when clicking outside', async ({ coursesPage, page }) => {
    await coursesPage.openAddModal();
    await page.locator('#modal-course').click({ position: { x: 5, y: 5 } });
    await expect(coursesPage.modal).not.toHaveClass(/open/);
  });

  test('progress 100 auto-sets status to completed', async ({ coursesPage }) => {
    await coursesPage.addCourse({ ...COURSES.cloudBasics, progress: 100, status: 'in-progress' });
    const card = await coursesPage.getCourseCard(COURSES.cloudBasics.name);
    await expect(card).toContainText('Completed');
  });
});

test.describe('Courses — filter', () => {
  test.beforeEach(async ({ coursesPage }) => {
    await coursesPage.addCourse(COURSES.cloudBasics);   // in-progress
    await coursesPage.addCourse(COURSES.mlCrash);       // completed
    await coursesPage.addCourse(COURSES.securityPrep);  // not-started
  });

  test('All filter shows all courses', async ({ coursesPage }) => {
    await coursesPage.filterBy('All');
    const names = await coursesPage.getVisibleCourseNames();
    expect(names).toHaveLength(3);
  });

  test('In progress filter shows only in-progress courses', async ({ coursesPage }) => {
    await coursesPage.filterBy('In progress');
    const names = await coursesPage.getVisibleCourseNames();
    expect(names).toEqual([COURSES.cloudBasics.name]);
  });

  test('Completed filter shows only completed courses', async ({ coursesPage }) => {
    await coursesPage.filterBy('Completed');
    const names = await coursesPage.getVisibleCourseNames();
    expect(names).toEqual([COURSES.mlCrash.name]);
  });

  test('Not started filter shows only not-started courses', async ({ coursesPage }) => {
    await coursesPage.filterBy('Not started');
    const names = await coursesPage.getVisibleCourseNames();
    expect(names).toEqual([COURSES.securityPrep.name]);
  });
});

test.describe('Courses — progress slider', () => {
  test('slider updates progress display', async ({ coursesPage }) => {
    await coursesPage.addCourse(COURSES.cloudBasics);
    await coursesPage.setProgressSlider(COURSES.cloudBasics.name, 80);
    const card = await coursesPage.getCourseCard(COURSES.cloudBasics.name);
    await expect(card).toContainText('80%');
  });

  test('slider at 100 marks course as completed', async ({ coursesPage }) => {
    await coursesPage.addCourse(COURSES.cloudBasics);
    await coursesPage.setProgressSlider(COURSES.cloudBasics.name, 100);
    const card = await coursesPage.getCourseCard(COURSES.cloudBasics.name);
    await expect(card).toContainText('Completed');
  });
});

test.describe('Courses — remove', () => {
  test('removes a course from the list', async ({ coursesPage }) => {
    await coursesPage.addCourse(COURSES.cloudBasics);
    await coursesPage.removeCourse(COURSES.cloudBasics.name);
    await expect(coursesPage.courseList).not.toContainText(COURSES.cloudBasics.name);
  });

  test('shows empty state after all courses removed', async ({ coursesPage }) => {
    await coursesPage.addCourse(COURSES.minimal);
    await coursesPage.removeCourse(COURSES.minimal.name);
    await expect(coursesPage.courseList).toContainText('No courses here yet');
  });
});

test.describe('Courses — persistence', () => {
  test('course survives a page reload', async ({ coursesPage, page }) => {
    await coursesPage.addCourse(COURSES.cloudBasics);

    // Snapshot localStorage state before reload
    const storageState = await page.evaluate(() =>
      JSON.stringify({ lct: localStorage.getItem('lct_data_v1') })
    );

    // Reload and re-inject storage in case file:// drops it
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.evaluate((state) => {
      const parsed = JSON.parse(state);
      if (!localStorage.getItem('lct_data_v1') && parsed.lct) {
        localStorage.setItem('lct_data_v1', parsed.lct);
        // Trigger app to re-read storage by reloading once more
        window.location.reload();
      }
    }, storageState);
    await page.waitForLoadState('domcontentloaded');

    await coursesPage.clickTab('Courses');
    const card = await coursesPage.getCourseCard(COURSES.cloudBasics.name);
    await expect(card).toBeVisible();
  });
});
