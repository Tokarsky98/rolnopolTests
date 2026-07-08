import { getAuthHeader } from '@_api/factories/auth-header.factory';
import { AnimalsRequest } from '@_api/requests/animals.request';
import { expect, test } from '@_src/merge.fixture';

test(
  'animal fixture can be overridden with a specific animal type',
  { tag: ['@TC-007', '@API'] },
  async ({ request, createUser, animalApiHelper }): Promise<void> => {
    const animal = await animalApiHelper.createAnimal(createUser.token, {
      type: 'cow',
      amount: 3,
    });

    const animalsRequest = new AnimalsRequest(
      request,
      getAuthHeader(createUser.token),
    );
    const response = await animalsRequest.getAll();
    const body = await response.json();

    const createdAnimal = body.data.find(
      (item: { id: number }) => item.id === animal.id,
    );
    expect(createdAnimal).toMatchObject({ type: 'cow', amount: 3 });
  },
);
