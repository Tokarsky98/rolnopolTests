import { CreatedAnimal } from '@_api/fixtures/animal.fixture';
import { NotificationComponent } from '@_ui/components/notification.component';
import { Locator, Page } from '@playwright/test';

export class MarketplacePage {
  readonly page: Page;
  readonly notification: NotificationComponent;
  readonly createOfferTab: Locator;
  readonly myOffersTab: Locator;
  readonly itemTypeSelect: Locator;
  readonly itemIdSelect: Locator;
  readonly priceInput: Locator;
  readonly descriptionInput: Locator;
  readonly createOfferButton: Locator;
  readonly myOffersList: Locator;
  readonly offersFilterInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.notification = new NotificationComponent(page);
    this.createOfferTab = page
      .locator('.marketplace-tabs')
      .getByRole('button', { name: 'Create Offer' });
    this.myOffersTab = page.getByRole('button', { name: 'My Offers' });
    this.itemTypeSelect = page.getByLabel('Item Type');
    this.itemIdSelect = page.getByLabel('Item', { exact: true });
    this.priceInput = page.getByLabel('Price (ROL)');
    this.descriptionInput = page.getByLabel('Description (optional)');
    this.createOfferButton = page
      .locator('#createOfferForm')
      .getByRole('button', { name: 'Create Offer' });
    this.myOffersList = page.locator('#myOffers');
    this.offersFilterInput = page.getByPlaceholder(
      'Filter offers by any text...',
    );
  }

  async goto(): Promise<void> {
    await this.page.goto('/marketplace.html');
  }

  async createOfferForAnimal(
    animal: CreatedAnimal,
    price: number,
    description: string,
  ): Promise<void> {
    const optionLabel = `${animal.type} (${animal.amount} units)`;

    await this.createOfferTab.click();
    await this.itemTypeSelect.selectOption('animal');
    await this.itemIdSelect
      .locator('option', { hasText: optionLabel })
      .waitFor({ state: 'attached' });
    await this.itemIdSelect.selectOption({ label: optionLabel });
    await this.priceInput.fill(String(price));
    await this.descriptionInput.fill(description);
    await this.createOfferButton.click();
  }

  async buyOffer(offerId: number, sellerLabel: string): Promise<void> {
    await this.offersFilterInput.fill(sellerLabel);
    await this.page.locator(`.btn-buy[data-offer-id="${offerId}"]`).click();
    await this.page.getByTestId('confirmation-modal-confirm').click();
  }
}
