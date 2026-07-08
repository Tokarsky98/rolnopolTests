import { LoginModel } from '@_api/models/login.model';
import { UserModel } from '@_api/models/user.model';
import { apiUrls } from '@_api/utils/api.util';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class AuthRequest {
  registerUrl: string;
  loginUrl: string;

  constructor(protected request: APIRequestContext) {
    this.registerUrl = apiUrls.registerUrl;
    this.loginUrl = apiUrls.loginUrl;
  }

  async register(data: UserModel): Promise<APIResponse> {
    return await this.request.post(this.registerUrl, { data });
  }

  async login(data: LoginModel): Promise<APIResponse> {
    return await this.request.post(this.loginUrl, { data });
  }
}
