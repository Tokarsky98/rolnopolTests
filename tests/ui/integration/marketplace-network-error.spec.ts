import { expect, test } from '@_src/merge.fixture';
import { marketplaceApiRoutes } from '@_src/ui/routes/marketplace.routes';
import { MarketplacePage } from '@_ui/pages/marketplace.page';

test(
  'marketplace page shows an error notification when the offers request fails',
  { tag: ['@TC-005', '@INTEGRATION'] },
  async ({ page, loggedInUser: _loggedInUser }): Promise<void> => {
    await page.route(marketplaceApiRoutes.offers, (route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' }),
      }),
    );

    const marketplacePage = new MarketplacePage(page);
    await marketplacePage.goto();

    await expect(marketplacePage.notification.alert).toContainText(
      'Internal server error',
    );
  },
);
