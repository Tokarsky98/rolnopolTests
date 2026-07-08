import { getAuthHeader } from '@_api/factories/auth-header.factory';
import { FinancialRequest } from '@_api/requests/financial.request';
import { MarketplaceRequest } from '@_api/requests/marketplace.request';
import { expect, test } from '@_src/merge.fixture';
import { injectSession } from '@_ui/helpers/session.helper';
import { MarketplacePage } from '@_ui/pages/marketplace.page';

const price = 42;
const depositAmount = 100;

test(
  'buyer can purchase another user offer using deposited funds',
  { tag: ['@TC-006', '@UI', '@API'] },
  async ({
    page,
    request,
    userApiHelper,
    animalApiHelper,
    marketplaceApiHelper,
  }): Promise<void> => {
    // Known app bug: _updateFinancialBalances compares userId as a number
    // against a stringified id, so it never finds the accounts and never
    // actually transfers funds, even though the purchase itself succeeds.
    test.fail();

    const seller = await userApiHelper.createUser();
    const animal = await animalApiHelper.createAnimal(seller.token);

    const sellerMarketplaceRequest = new MarketplaceRequest(
      request,
      getAuthHeader(seller.token),
    );
    const offerResponse = await sellerMarketplaceRequest.createOffer({
      itemType: 'animal',
      itemId: animal.id,
      price,
      description: 'Selling to a buyer',
    });
    const offerBody = await offerResponse.json();
    const offerId = offerBody.data.offer.id as number;
    marketplaceApiHelper.trackOfferCleanup(seller.token);

    const buyer = await userApiHelper.createUser();
    const buyerFinancialRequest = new FinancialRequest(
      request,
      getAuthHeader(buyer.token),
    );

    // A newly created account may inherit a non-zero balance left over from
    // an orphaned account of a previously deleted user with the same id, so
    // the assertion below compares against this baseline instead of 0.
    const initialAccountResponse = await buyerFinancialRequest.getAccount();
    const initialAccountBody = await initialAccountResponse.json();
    const initialBalance = initialAccountBody.data.account.balance as number;

    await buyerFinancialRequest.deposit(depositAmount);
    await injectSession(page.context(), buyer);

    const marketplacePage = new MarketplacePage(page);
    await marketplacePage.goto();
    await marketplacePage.buyOffer(offerId, seller.displayedName);

    await expect(marketplacePage.notification.alert.first()).toContainText(
      'Purchase completed successfully',
    );

    const accountResponse = await buyerFinancialRequest.getAccount();
    const accountBody = await accountResponse.json();
    expect(accountBody.data.account.balance).toBe(
      initialBalance + depositAmount - price,
    );
  },
);
