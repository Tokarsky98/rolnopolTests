import { CreatedUser } from '@_api/fixtures/user.fixture';
import { BASE_URL } from '@_config/env.config';
import { BrowserContext } from '@playwright/test';

// Injects the registration token directly - no second login, so it never
// gets invalidated and stays valid for API cleanup as well.
export async function injectSession(
  context: BrowserContext,
  { token, displayedName, userId }: CreatedUser,
): Promise<void> {
  const cookies = {
    rolnopolToken: encodeURIComponent(token),
    rolnopolIsLogged: 'true',
    rolnopolUserLabel: displayedName,
    rolnopolUserId: String(userId),
  };

  await context.addCookies(
    Object.entries(cookies).map(([name, value]) => ({
      name,
      value,
      url: BASE_URL,
    })),
  );
}
