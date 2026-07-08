import { CreatedAnimal, animalTest } from '@_api/fixtures/animal.fixture';
import { CreatedUser, userTest } from '@_api/fixtures/user.fixture';
import { mergeTests } from '@playwright/test';

export type UserWithAnimal = {
  user: CreatedUser;
  animal: CreatedAnimal;
};

type LoginFixtures = {
  createUserWithAnimal: UserWithAnimal;
};

const base = mergeTests(userTest, animalTest);

export const loginFixturesTest = base.extend<LoginFixtures>({
  // Ready-made user with one animal, for tests that need to log in as a user who isn't empty.
  createUserWithAnimal: async ({ userApiHelper, animalApiHelper }, use) => {
    const user = await userApiHelper.createUser();
    const animal = await animalApiHelper.createAnimal(user.token);
    await use({ user, animal });
  },
});
