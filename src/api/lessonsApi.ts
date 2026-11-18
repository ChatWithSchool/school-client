import { apiSlice } from './apiSlice';
import type { Lesson, List } from './types';

export const lessonsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    listLessons: build.query<List<Lesson>, void>({
      query: () => '/lessons',
      providesTags: ['Schedule'],
    }),
  }),
});

export const { useListLessonsQuery } = lessonsApi;
