import { apiSlice } from './apiSlice';
import type { Page } from './types';

export type Subject = { id: string; name: string; code: string; grades: string[] };
export type TeachingClass = { id: string; name: string; grade: string };
export type TeachingTeacher = { id: string; firstName: string; lastName: string };
export type TeachingAssignment = { classId: string; subjectId: string; teacherId: string };
export type UpdateTeachingAssignmentInput = {
  classId: string;
  subjectId: string;
  teacherId: string | null;
};

export const subjectsAssignmentsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    listSubjects: build.query<Page<Subject>, void>({
      query: () => '/subjects',
      providesTags: ['Subjects'],
    }),
    listClasses: build.query<Page<TeachingClass>, void>({
      query: () => '/classes',
      providesTags: ['Classes'],
    }),
    listTeachers: build.query<Page<TeachingTeacher>, void>({
      query: () => '/staff',
      providesTags: ['Staff'],
    }),
    getTeachingAssignments: build.query<{ items: TeachingAssignment[] }, string>({
      query: (classId) => `/classes/${classId}/teaching-assignments`,
      providesTags: ['TeachingAssignments'],
    }),
    updateTeachingAssignment: build.mutation<void, UpdateTeachingAssignmentInput>({
      query: ({ classId, ...body }) => ({
        url: `/classes/${classId}/teaching-assignments`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['TeachingAssignments'],
    }),
  }),
});

export const {
  useListSubjectsQuery,
  useListClassesQuery,
  useListTeachersQuery,
  useGetTeachingAssignmentsQuery,
  useUpdateTeachingAssignmentMutation,
} = subjectsAssignmentsApi;
