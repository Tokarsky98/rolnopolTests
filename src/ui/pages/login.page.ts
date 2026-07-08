import { ProfilePage } from '@_ui/pages/profile.page';
import { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.submitButton = page.getByTestId('login-submit-btn');
  }

  async goto(): Promise<void> {
    await this.page.goto('/login.html');
  }

  async login(email: string, password: string): Promise<ProfilePage> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    return new ProfilePage(this.page);
  }
}
