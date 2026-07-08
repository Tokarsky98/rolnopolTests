import { getAuthHeader } from '@_api/factories/auth-header.factory';
import { MarketplaceRequest } from '@_api/requests/marketplace.request';
import { test as base } from '@playwright/test';

type MarketplaceApiHelper = {
  trackOfferCleanup: (token: string) => void;
};

type MarketplaceFixtures = {
  marketplaceApiHelper: MarketplaceApiHelper;
};

export const marketplaceTest = base.extend<MarketplaceFixtures>({
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
});
