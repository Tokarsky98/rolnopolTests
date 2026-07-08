import { userTest } from '@_api/fixtures/user.fixture';
import { mergeTests } from '@playwright/test';

export const test = mergeTests(userTest);

export { expect } from '@playwright/test';
