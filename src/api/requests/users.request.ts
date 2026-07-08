import { HeadersModel } from '@_api/models/headers.model';
import { apiUrls } from '@_api/utils/api.util';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class UsersRequest {
  url: string;

  constructor(
    protected request: APIRequestContext,
    protected headers?: HeadersModel,
  ) {
    this.url = apiUrls.usersProfileUrl;
  }

  async deleteProfile(): Promise<APIResponse> {
    return await this.request.delete(this.url, { headers: this.headers });
  }
}
