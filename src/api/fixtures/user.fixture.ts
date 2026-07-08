import { getAuthHeader } from '@_api/factories/auth-header.factory';
import { randomUser } from '@_api/factories/user.factory';
import { UserModel } from '@_api/models/user.model';
import { AuthRequest } from '@_api/requests/auth.request';
import { UsersRequest } from '@_api/requests/users.request';
import { test as base, expect } from '@playwright/test';

type AuthResponseBody = {
  data: { user: { id: number }; token: string };
};

export type CreatedUser = UserModel & {
  userId: number;
  token: string;
};

type UserApiHelper = {
  createUser: () => Promise<CreatedUser>;
};

type UserFixtures = {
  userApiHelper: UserApiHelper;
  createUser: CreatedUser;
};

export const userTest = base.extend<UserFixtures>({
  userApiHelper: async ({ request }, use) => {
    const authRequest = new AuthRequest(request);
    const createdUsers: CreatedUser[] = [];

    await use({
      createUser: async () => {
        const userData = randomUser();
        const registerResponse = await authRequest.register(userData);
        await expect(registerResponse).toBeOK();

        const body = (await registerResponse.json()) as AuthResponseBody;
        const createdUser: CreatedUser = {
          ...userData,
          userId: body.data.user.id,
          token: body.data.token,
        };
        createdUsers.push(createdUser);
        return createdUser;
      },
    });

    for (const user of createdUsers) {
      // Token may be stale if the test logged in again via the UI.
      const loginResponse = await authRequest.login(user);
      await expect(loginResponse).toBeOK();

      const body = (await loginResponse.json()) as AuthResponseBody;

      const usersRequest = new UsersRequest(
        request,
        getAuthHeader(body.data.token),
      );
      await usersRequest.deleteProfile();
    }
  },

  // For tests that just need one ready-made user, no explicit call needed.
  createUser: async ({ userApiHelper }, use) => {
    const createdUser = await userApiHelper.createUser();
    await use(createdUser);
  },
});
