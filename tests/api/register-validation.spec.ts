import { AuthRequest } from '@_api/requests/auth.request';
import { expect, test } from '@_src/merge.fixture';

test(
  'registration rejects a duplicate email',
  { tag: ['@TC-004', '@API'] },
  async ({ request, createUser }): Promise<void> => {
    const authRequest = new AuthRequest(request);

    const duplicateResponse = await authRequest.register({
      email: createUser.email,
      displayedName: createUser.displayedName,
      password: createUser.password,
    });

    expect(duplicateResponse.status()).toBe(409);

    const body = await duplicateResponse.json();
    expect(body.error).toContain('already exists');
  },
);
