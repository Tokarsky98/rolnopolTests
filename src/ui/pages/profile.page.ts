import { NavbarComponent } from '@_ui/components/navbar.component';
import { Page } from '@playwright/test';

export class ProfilePage {
  readonly page: Page;
  readonly navbar: NavbarComponent;

  constructor(page: Page) {
    this.page = page;
    this.navbar = new NavbarComponent(page);
  }
}
