import { apiSlice } from './apiSlice';
import type { Invite, Page, RoleKey } from './types';

/** v1: no real email goes out; the content comes back with the response for the invites log. */
export type InviteMail = { to: string; subject: string; body: string; sentAt: string };
type SendResult = { id: string; mail?: InviteMail };

/** A07 · inviting users and pending invites. */
export const invitesApi = apiSlice.enhanceEndpoints({ addTagTypes: ['Invites'] }).injectEndpoints({
  endpoints: (build) => ({
    listInvites: build.query<Page<Invite>, { status?: Invite['status'] }>({
      query: (params) => ({ url: '/invites', params }),
      providesTags: ['Invites'],
    }),
    createInvite: build.mutation<SendResult, { email: string; role: RoleKey }>({
      query: (body) => ({ url: '/invites', method: 'POST', body }),
      invalidatesTags: ['Invites'],
    }),
    resendInvite: build.mutation<SendResult, string>({
      query: (id) => ({ url: `/invites/${id}/resend`, method: 'POST' }),
      invalidatesTags: ['Invites'],
    }),
    cancelInvite: build.mutation<void, string>({
      query: (id) => ({ url: `/invites/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Invites'],
    }),
  }),
});

export const {
  useListInvitesQuery,
  useCreateInviteMutation,
  useResendInviteMutation,
  useCancelInviteMutation,
} = invitesApi;
