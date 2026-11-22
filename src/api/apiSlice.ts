import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { logout } from '../features/auth/authSlice';
import type { RootState } from '../app/store';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL ?? '/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

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
