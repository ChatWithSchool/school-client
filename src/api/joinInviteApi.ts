import { apiSlice } from './apiSlice';
import type { RoleKey } from './types';

/** What the invite link shows before signing up (InvitePreview in the contract). */
export type InvitePreview = {
  institutionName: string;
  role: RoleKey;
  email: string;
  /** expired or used: the screen explains it and asks for a new invite */
  status: 'valid' | 'expired' | 'used';
};

export type AcceptInviteBody = Record<'firstName' | 'lastName' | 'password', string> & {
  phone?: string;
};

/** A02 · joining by invite (public: no token needed). */
export const joinInviteApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getInvitePreview: build.query<InvitePreview, string>({
      query: (token) => `/invites/${encodeURIComponent(token)}`,
    }),
    acceptInvite: build.mutation<
      { token: string; landing: string },
      { token: string; body: AcceptInviteBody }
    >({
      query: ({ token, body }) => ({
        url: `/invites/${encodeURIComponent(token)}/accept`,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetInvitePreviewQuery, useAcceptInviteMutation } = joinInviteApi;
