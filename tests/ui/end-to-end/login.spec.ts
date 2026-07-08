import { expect, test } from '@_src/merge.fixture';
import { LoginPage } from '@_ui/pages/login.page';

test(
  'newly registered user can log in',
  { tag: ['@TC-001', '@UI'] },
  async ({ page, createUser }): Promise<void> => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const profilePage = await loginPage.login(
      createUser.email,
      createUser.password,
    );

    await expect(profilePage.navbar.welcomeText).toHaveText(
      `Welcome, ${createUser.displayedName}`,
    );
  },
);
