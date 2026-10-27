import { apiSlice } from './apiSlice';
import type { List } from './types';

export type TeachingCard = {
  classId: string;
  subjectId: string;
  openAssessments: number;
  studentsWithoutGrade: number;
};

export const mySubjectsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    listMyTeaching: build.query<List<TeachingCard>, void>({
      query: () => ({ url: '/me/teaching' }),

    }),
  }),
});

export const { useListMyTeachingQuery } = mySubjectsApi;
