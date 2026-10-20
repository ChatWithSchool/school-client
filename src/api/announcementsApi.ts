import { apiSlice } from './apiSlice';
import type { Announcement, Page } from './types';

/** Reference: how a screen adds its endpoints. Copy this file for your screen. */
export const announcementsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    listAnnouncements: build.query<Page<Announcement>, { page?: number; size?: number } | void>({
      query: (params) => ({ url: '/announcements', params: params ?? undefined }),
      providesTags: ['Announcements'],
    }),
    createAnnouncement: build.mutation<
      { id: string },
      { title: string; body: string; pinned?: boolean }
    >({
      query: (body) => ({ url: '/announcements', method: 'POST', body }),
      invalidatesTags: ['Announcements'],
    }),
    markAnnouncementRead: build.mutation<void, string>({
      query: (id) => ({ url: `/announcements/${id}/read`, method: 'POST' }),
      invalidatesTags: ['Announcements'],
    }),
  }),
});

export const {
  useListAnnouncementsQuery,
  useCreateAnnouncementMutation,
  useMarkAnnouncementReadMutation,
} = announcementsApi;
