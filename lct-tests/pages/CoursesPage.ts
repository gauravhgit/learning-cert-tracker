import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export interface CourseInput {
  name: string;
  provider?: string;
  category?: 'Cloud' | 'Data & AI' | 'Security' | 'DevOps' | 'Leadership' | 'Other';
  status?: 'not-started' | 'in-progress' | 'completed';
  progress?: number;
  dueDate?: string;
  hours?: number;
}

export class CoursesPage extends BasePage {
  readonly addButton: Locator;
  readonly modal: Locator;
  readonly nameInput: Locator;
  readonly providerInput: Locator;
  readonly categorySelect: Locator;
  readonly statusSelect: Locator;
  readonly progressInput: Locator;
  readonly dueDateInput: Locator;
  readonly hoursInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly courseList: Locator;

  constructor(page: Page) {
    super(page);
    this.modal          = page.locator('#modal-course');
    this.addButton      = page.getByRole('button', { name: '+ Add course' });
    this.nameInput      = page.locator('#c-name');
    this.providerInput  = page.locator('#c-provider');
    this.categorySelect = page.locator('#c-category');
    this.statusSelect   = page.locator('#c-status');
    this.progressInput  = page.locator('#c-progress');
    this.dueDateInput   = page.locator('#c-due');
    this.hoursInput     = page.locator('#c-hours');
    this.saveButton     = page.getByRole('button', { name: 'Save course' });
    this.cancelButton   = page.getByRole('button', { name: 'Cancel' }).first();
    this.courseList     = page.locator('#course-list');
  }

  async navigateToCourses() {
    await this.goto();
    await this.clickTab('Courses');
  }

  async openAddModal() {
    await this.addButton.click();
    await expect(this.modal).toHaveClass(/open/);
  }

  async fillCourseForm(course: CourseInput) {
    await this.nameInput.fill(course.name);
    if (course.provider)              await this.providerInput.fill(course.provider);
    if (course.category)              await this.categorySelect.selectOption(course.category);
    if (course.status)                await this.statusSelect.selectOption(course.status);
    if (course.progress !== undefined) await this.progressInput.fill(String(course.progress));
    if (course.dueDate)               await this.dueDateInput.fill(course.dueDate);
    if (course.hours !== undefined)   await this.hoursInput.fill(String(course.hours));
  }

  async addCourse(course: CourseInput) {
    await this.openAddModal();
    await this.fillCourseForm(course);
    await this.saveButton.click();
    await expect(this.modal).not.toHaveClass(/open/);
  }

  async getCourseCard(name: string): Promise<Locator> {
    return this.courseList.locator('.card').filter({ hasText: name });
  }

  async removeCourse(name: string) {
    const card = await this.getCourseCard(name);
    await card.getByRole('button', { name: 'Remove' }).click();
  }

  async setProgressSlider(name: string, value: number) {
    const card = await this.getCourseCard(name);
    const slider = card.locator('input[type=range]');
    await slider.fill(String(value));
    await slider.dispatchEvent('input');
  }

  async filterBy(filter: 'All' | 'In progress' | 'Completed' | 'Not started') {
    await this.page.getByRole('button', { name: filter }).click();
  }

  async getVisibleCourseNames(): Promise<string[]> {
    return this.courseList.locator('.card-title').allTextContents();
  }
}
