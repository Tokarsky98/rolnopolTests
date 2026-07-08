import { Locator, Page } from '@playwright/test';

export class NavbarComponent {
  readonly root: Locator;
  readonly welcomeText: Locator;

  constructor(page: Page) {
    this.root = page.getByTestId('nav-profile');
    this.welcomeText = this.root.locator('.nav-text-user-name');
  }
}
