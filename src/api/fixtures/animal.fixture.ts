import { randomAnimal } from '@_api/factories/animal.factory';
import { getAuthHeader } from '@_api/factories/auth-header.factory';
import { AnimalModel } from '@_api/models/animal.model';
import { AnimalsRequest } from '@_api/requests/animals.request';
import { test as base, expect } from '@playwright/test';

export type CreatedAnimal = AnimalModel & { id: number };

type AnimalApiHelper = {
  createAnimal: (
    token: string,
    overrides?: Partial<AnimalModel>,
  ) => Promise<CreatedAnimal>;
};

type AnimalFixtures = {
  animalApiHelper: AnimalApiHelper;
};

// Creates animals via the API for a given user and deletes them all after the test.
export const animalTest = base.extend<AnimalFixtures>({
  animalApiHelper: async ({ request }, use) => {
    const createdAnimals: { id: number; token: string }[] = [];

    await use({
      createAnimal: async (token, overrides) => {
        const animalData = randomAnimal(overrides);
        const animalsRequest = new AnimalsRequest(
          request,
          getAuthHeader(token),
        );
        const response = await animalsRequest.create(animalData);
        await expect(response).toBeOK();

        const body = (await response.json()) as { data: { id: number } };
        const createdAnimal: CreatedAnimal = {
          ...animalData,
          id: body.data.id,
        };
        createdAnimals.push({ id: createdAnimal.id, token });
        return createdAnimal;
      },
    });

    for (const animal of createdAnimals) {
      const animalsRequest = new AnimalsRequest(
        request,
        getAuthHeader(animal.token),
      );
      await animalsRequest.delete(animal.id);
    }
  },
});
