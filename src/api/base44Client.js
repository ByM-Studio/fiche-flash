import { appParams } from '@/lib/app-params';

const { appId, appBaseUrl } = appParams;

const BASE_URL = appBaseUrl || `https://api.base44.com/api/apps/${appId}`;

export const base44 = {
  appId,
  baseUrl: BASE_URL,
  auth: {
    getUser: async () => null,
    login: async () => {},
    logout: async () => {},
  },
  api: async (path, options = {}) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    return res.json();
  }
};