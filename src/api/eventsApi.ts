import { apiSlice } from './apiSlice';
import type { List, SchoolEvent } from './types';

export type CreateEventBody = Omit<SchoolEvent, 'id'>;

export const eventsApi = apiSlice.enhanceEndpoints({ addTagTypes: ['Events'] }).injectEndpoints({
  endpoints: (build) => ({
    listEvents: build.query<List<SchoolEvent>, { from?: string; to?: string } | void>({
      query: (params) => ({ url: '/events', params: params ?? undefined }),
      providesTags: ['Events'],
    }),
    createEvent: build.mutation<{ id: string }, CreateEventBody>({
      query: (body) => ({ url: '/events', method: 'POST', body }),
      invalidatesTags: ['Events'],
    }),
  }),
});

export const { useListEventsQuery, useCreateEventMutation } = eventsApi;
