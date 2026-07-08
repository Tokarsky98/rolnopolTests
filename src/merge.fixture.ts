import { marketplaceTest } from '@_api/fixtures/marketplace.fixture';
import { authenticatedUserTest } from '@_ui/fixtures/authenticated-user.fixture';
import { mergeTests } from '@playwright/test';

export const test = mergeTests(authenticatedUserTest, marketplaceTest);

export { expect } from '@playwright/test';
