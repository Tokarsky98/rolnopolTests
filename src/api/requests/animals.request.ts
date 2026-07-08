import { AnimalModel } from '@_api/models/animal.model';
import { HeadersModel } from '@_api/models/headers.model';
import { apiUrls } from '@_api/utils/api.util';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class AnimalsRequest {
  url: string;

  constructor(
    protected request: APIRequestContext,
    protected headers?: HeadersModel,
  ) {
    this.url = apiUrls.animalsUrl;
  }

  async getAll(): Promise<APIResponse> {
    return await this.request.get(this.url, { headers: this.headers });
  }

  async create(data: AnimalModel): Promise<APIResponse> {
    return await this.request.post(this.url, { headers: this.headers, data });
  }

  async delete(id: number): Promise<APIResponse> {
    return await this.request.delete(`${this.url}/${id}`, {
      headers: this.headers,
    });
  }
}
