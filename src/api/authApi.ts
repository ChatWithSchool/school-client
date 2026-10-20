import { apiSlice } from './apiSlice';
import type { Me } from './types';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<{ token: string; landing: string }, { email: string; password: string }>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),
    getMe: build.query<Me, void>({
      query: () => '/auth/me',
      providesTags: ['Me'],
    }),
  }),
});

export const { useLoginMutation, useGetMeQuery } = authApi;
