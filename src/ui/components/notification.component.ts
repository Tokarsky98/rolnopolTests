import { Locator, Page } from '@playwright/test';

export class NotificationComponent {
  readonly alert: Locator;

  constructor(page: Page) {
    this.alert = page.getByRole('alert').first();
  }
}
