import { apiSlice } from './apiSlice';
import type { List } from './types';

/**
 * One class and subject the signed-in teacher teaches (TeachingCard in openapi.yaml).
 * className and subjectName are not in the contract yet: a teacher has no access to /classes or
 * /subjects, so the screen cannot look the names up. They are optional until the contract has them.
 */
export type TeachingCard = {
  classId: string;
  subjectId: string;
  openAssessments: number;
  studentsWithoutGrade: number;
  className?: string;
  subjectName?: string;
};

export const teachingApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getMyTeaching: build.query<List<TeachingCard>, void>({
      query: () => '/me/teaching',
      providesTags: ['Grades'],
    }),
  }),
});

export const { useGetMyTeachingQuery } = teachingApi;
