import { HeadersModel } from '@_api/models/headers.model';
import { apiUrls } from '@_api/utils/api.util';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class FinancialRequest {
  accountUrl: string;
  transactionsUrl: string;

  constructor(
    protected request: APIRequestContext,
    protected headers?: HeadersModel,
  ) {
    this.accountUrl = apiUrls.financialAccountUrl;
    this.transactionsUrl = apiUrls.financialTransactionsUrl;
  }

  async getAccount(): Promise<APIResponse> {
    return await this.request.get(this.accountUrl, { headers: this.headers });
  }

  async deposit(amount: number): Promise<APIResponse> {
    return await this.request.post(this.transactionsUrl, {
      headers: this.headers,
      data: {
        type: 'income',
        amount,
        description: 'Test deposit',
        cardNumber: '4111111111111111',
        cvv: '123',
      },
    });
  }
}
