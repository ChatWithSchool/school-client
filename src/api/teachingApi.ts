import { apiSlice } from './apiSlice';
import type { List } from './types';

/**
 * One class and subject the signed-in teacher teaches (TeachingCard in openapi.yaml).
 * className and subjectName are not in the contract yet: a teacher has no access to /classes or
 * /subjects, so the screen cannot look the names up. They are optional until the contract has them.
 * studentCount (G04, the "28/30" of the graded column) is not in the contract either.
 */
export type TeachingCard = {
  classId: string;
  subjectId: string;
  openAssessments: number;
  studentsWithoutGrade: number;
  className?: string;
  subjectName?: string;
  studentCount?: number;
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
