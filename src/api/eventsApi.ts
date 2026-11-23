import { apiSlice } from './apiSlice';
import type { List, SchoolEvent } from './types';

export type CreateEventBody = Omit<SchoolEvent, 'id'>;

/** אין תג 'Events' ב-apiSlice (קובץ משותף), לכן אחרי הוספה המסך קורא ל-refetch. */
export const eventsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    listEvents: build.query<List<SchoolEvent>, { from?: string; to?: string } | void>({
      query: (params) => ({ url: '/events', params: params ?? undefined }),
    }),
    createEvent: build.mutation<{ id: string }, CreateEventBody>({
      query: (body) => ({ url: '/events', method: 'POST', body }),
    }),
  }),
});

export const { useListEventsQuery, useCreateEventMutation } = eventsApi;
