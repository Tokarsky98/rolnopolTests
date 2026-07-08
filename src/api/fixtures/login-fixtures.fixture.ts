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
  createUserWithAnimal: async ({ userApiHelper, animalApiHelper }, use) => {
    const user = await userApiHelper.createUser();
    const animal = await animalApiHelper.createAnimal(user.token);
    await use({ user, animal });
  },
});
