import { expect, test } from '@_src/merge.fixture';
import { MarketplacePage } from '@_ui/pages/marketplace.page';

test(
  'user can create a marketplace offer for their own animal',
  { tag: ['@TC-002', '@UI'] },
  async ({
    page,
    loggedInUserWithAnimal,
    marketplaceApiHelper,
  }): Promise<void> => {
    const price = 42;
    const description = 'For sale, good condition';

    const { user, animal } = loggedInUserWithAnimal;
    marketplaceApiHelper.trackOfferCleanup(user.token);

    const marketplacePage = new MarketplacePage(page);
    await marketplacePage.goto();
    await marketplacePage.createOfferForAnimal(animal, price, description);

    await marketplacePage.myOffersTab.click();
    await expect(marketplacePage.myOffersList).toContainText(description);
  },
);
