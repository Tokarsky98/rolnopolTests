import { getAuthHeader } from '@_api/factories/auth-header.factory';
import { userTest } from '@_api/fixtures/user.fixture';
import { MarketplaceRequest } from '@_api/requests/marketplace.request';

type MarketplaceApiHelper = {
  trackOfferCleanup: (token: string) => void;
};

type MarketplaceFixtures = {
  marketplaceApiHelper: MarketplaceApiHelper;
  marketplaceRequest: MarketplaceRequest;
};

export const marketplaceTest = userTest.extend<MarketplaceFixtures>({
  // Cancels any offer left active for a tracked user's token after the test.
  // Offers are never hard-deleted by the app, so cancelling is the only cleanup available.
  marketplaceApiHelper: async ({ request }, use) => {
    const tokensToClean: string[] = [];

    await use({
      trackOfferCleanup: (token: string) => {
        tokensToClean.push(token);
      },
    });

    for (const token of tokensToClean) {
      const marketplaceRequest = new MarketplaceRequest(
        request,
        getAuthHeader(token),
      );
      const response = await marketplaceRequest.getMyOffers();
      const body = (await response.json()) as {
        data: { offers: { id: number; status: string }[] };
      };

      for (const offer of body.data.offers) {
        if (offer.status === 'active') {
          await marketplaceRequest.cancelOffer(offer.id);
        }
      }
    }
  },

  // Ready-made marketplace client authenticated as the fixture's default user.
  marketplaceRequest: async ({ request, createUser }, use) => {
    await use(new MarketplaceRequest(request, getAuthHeader(createUser.token)));
  },
});
