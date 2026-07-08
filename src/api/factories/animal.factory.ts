import { AnimalModel } from '@_api/models/animal.model';
import { faker } from '@faker-js/faker';

export function randomAnimal(overrides?: Partial<AnimalModel>): AnimalModel {
  return {
    type: 'chicken',
    amount: faker.number.int({ min: 1, max: 50 }),
    ...overrides,
  };
}
