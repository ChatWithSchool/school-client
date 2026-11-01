import { createApi, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { logout } from '../features/auth/authSlice';
import type { RootState } from '../app/store';

const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

const rawBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  _extra,
) => {
  const state = (api.getState() as RootState).auth.token;
  const url = typeof args === 'string' ? args : args.url;
  const resolvedUrl = url.startsWith('http') ? url : `${API_BASE}${url.startsWith('/') ? url : `/${url}`}`;

  const headers = new Headers();
  if (state) headers.set('Authorization', `Bearer ${state}`);

  const requestInit: RequestInit = {
    method: typeof args === 'string' ? 'GET' : (args.method ?? 'GET'),
    headers,
  };

  if (typeof args !== 'string' && args.body !== undefined) {
    requestInit.body =
      args.body instanceof FormData || args.body instanceof Blob || args.body instanceof ArrayBuffer
        ? (args.body as BodyInit)
        : JSON.stringify(args.body);
    if (!(args.body instanceof FormData) && !(args.body instanceof Blob) && !(args.body instanceof ArrayBuffer)) {
      headers.set('Content-Type', 'application/json');
    }
  }

  const response = await fetch(resolvedUrl, requestInit);
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    return {
      error: {
        status: response.status,
        data,
      } as FetchBaseQueryError,
    };
  }

  return { data };
};

/** Signs the user out when the server says the token is invalid (except on the login call itself). */
const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extra,
) => {
  const result = await rawBaseQuery(args, api, extra);
  const url = typeof args === 'string' ? args : args.url;
  if (result.error?.status === 401 && !url.includes('/auth/login')) api.dispatch(logout());
  return result;
};

/**
 * One API slice for the whole app. Each screen adds its endpoints with `apiSlice.injectEndpoints`
 * in its own file (see announcementsApi.ts), so nobody edits a shared file.
 */
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    'Me',
    'Announcements',
    'Students',
    'Classes',
    'Staff',
    'Subjects',
    'Attendance',
    'Grades',
    'Schedule',
    'Users',
  ],
  endpoints: () => ({}),
});
