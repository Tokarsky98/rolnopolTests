import { HeadersModel } from '@_api/models/headers.model';
import { apiUrls } from '@_api/utils/api.util';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class MarketplaceRequest {
  offersUrl: string;
  myOffersUrl: string;

  constructor(
    protected request: APIRequestContext,
    protected headers?: HeadersModel,
  ) {
    this.offersUrl = apiUrls.marketplaceOffersUrl;
    this.myOffersUrl = apiUrls.marketplaceMyOffersUrl;
  }

  async getOffers(): Promise<APIResponse> {
    return await this.request.get(this.offersUrl, { headers: this.headers });
  }

  async getMyOffers(): Promise<APIResponse> {
    return await this.request.get(this.myOffersUrl, { headers: this.headers });
  }

  async cancelOffer(offerId: number): Promise<APIResponse> {
    return await this.request.delete(`${this.offersUrl}/${offerId}`, {
      headers: this.headers,
    });
  }
}
