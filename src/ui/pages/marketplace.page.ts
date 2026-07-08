import { CreatedAnimal } from '@_api/fixtures/animal.fixture';
import { Locator, Page } from '@playwright/test';

export class MarketplacePage {
  readonly page: Page;
  readonly createOfferTab: Locator;
  readonly myOffersTab: Locator;
  readonly itemTypeSelect: Locator;
  readonly itemIdSelect: Locator;
  readonly priceInput: Locator;
  readonly descriptionInput: Locator;
  readonly createOfferButton: Locator;
  readonly myOffersList: Locator;

  constructor(page: Page) {
    this.page = page;
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
}
