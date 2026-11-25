import { apiSlice } from './apiSlice';
import type { Page, SchoolClass, Student } from './types';

export const selectionApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    listClasses: build.query<Page<SchoolClass>, void>({
      query: () => '/classes',
      providesTags: ['Classes'],
    }),
    listStudents: build.query<Page<Student>, { classId?: string; page?: number; size?: number }>({
      query: ({ classId, page, size }) => ({
        url: '/students',
        params: { class: classId, page, size },
      }),
      providesTags: ['Students'],
    }),
  }),
});

export const { useListClassesQuery, useListStudentsQuery } = selectionApi;
