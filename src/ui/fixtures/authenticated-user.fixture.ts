import { CreatedAnimal } from '@_api/fixtures/animal.fixture';
import { loginFixturesTest } from '@_api/fixtures/login-fixtures.fixture';
import { CreatedUser } from '@_api/fixtures/user.fixture';
import { injectSession } from '@_ui/helpers/session.helper';

export type AuthenticatedUserWithAnimal = {
  user: CreatedUser;
  animal: CreatedAnimal;
};

type AuthenticatedUserFixtures = {
  loggedInUser: CreatedUser;
  loggedInUserWithAnimal: AuthenticatedUserWithAnimal;
};

export const authenticatedUserTest =
  loginFixturesTest.extend<AuthenticatedUserFixtures>({
    loggedInUser: async ({ context, createUser }, use) => {
      await injectSession(context, createUser);
      await use(createUser);
    },

    loggedInUserWithAnimal: async ({ context, createUserWithAnimal }, use) => {
      const { user, animal } = createUserWithAnimal;
      await injectSession(context, user);
      await use({ user, animal });
    },
  });
