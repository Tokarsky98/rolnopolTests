import { HeadersModel } from '@_api/models/headers.model';

export function getAuthHeader(token: string): HeadersModel {
  return { Authorization: `Bearer ${token}` };
}
