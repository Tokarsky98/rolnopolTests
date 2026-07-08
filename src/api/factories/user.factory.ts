import { UserModel } from '@_api/models/user.model';
import { faker } from '@faker-js/faker';

// The app requires a 3-20 character displayedName, letters/numbers/spaces/hyphens only.
// Stripping disallowed characters from a generated name can leave it too short, so retry until it fits.
function randomDisplayedName(): string {
  let name = '';
  while (name.length < 3) {
    name = faker.person.firstName().replace(/[^a-zA-Z0-9\s-]/g, '');
  }
  return name;
}

export function randomUser(): UserModel {
  return {
    email: faker.internet.email(),
    displayedName: randomDisplayedName(),
    password: `Aa1!${faker.string.alphanumeric(8)}`,
  };
}
