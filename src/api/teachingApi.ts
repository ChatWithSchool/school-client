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

/**
 * The terms of the year, for the term selector. A teacher has no access to GET /terms (I03), and
 * /me/teaching has no termId parameter in the contract yet, so for now they are fixed here.
 */
export const TERMS = [
  { id: 'term-1', name: 'מחצית א׳' },
  { id: 'term-2', name: 'מחצית ב׳' },
];

/** The term of a day: Sept to Jan is the first, Feb to Aug the second. */
export const termOf = (day: Date) =>
  day.getMonth() >= 1 && day.getMonth() <= 7 ? 'term-2' : 'term-1';

export const teachingApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getMyTeaching: build.query<List<TeachingCard>, { termId?: string } | void>({
      query: (params) => ({ url: '/me/teaching', params: params ?? undefined }),
      providesTags: ['Grades'],
    }),
  }),
});

export const { useGetMyTeachingQuery } = teachingApi;
