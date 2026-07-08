import { requiredOfferFields } from '@_api/test-data/marketplace.data';
import { expect, test } from '@_src/merge.fixture';

test(
  'marketplace offers listing returns valid data',
  { tag: ['@TC-003', '@API'] },
  async ({ marketplaceRequest }): Promise<void> => {
    const response = await marketplaceRequest.getOffers();
    expect(response.status()).toBe(200);

    const body = await response.json();
    const [firstOffer] = body.data.offers;
    expect(firstOffer).toBeDefined();

    for (const field of requiredOfferFields) {
      expect.soft(firstOffer, `missing "${field}"`).toHaveProperty(field);
    }
  },
);
