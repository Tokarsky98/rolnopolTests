import { UserModel } from '@_api/models/user.model';
import { faker } from '@faker-js/faker';

export function randomUser(): UserModel {
  return {
    email: faker.internet.email(),
    // Strip characters like apostrophes that the app's displayedName rule rejects.
    displayedName: faker.person.firstName().replace(/[^a-zA-Z0-9\s-]/g, ''),
    password: `Aa1!${faker.string.alphanumeric(8)}`,
  };
}
