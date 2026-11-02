import { apiSlice } from './apiSlice';
import type { Page } from './types';

export type Subject = { id: string; name: string; code: string; grades: string[] };
export type TeachingClass = { id: string; name: string; grade: string };
export type TeachingTeacher = { id: string; firstName: string; lastName: string };
export type TeachingAssignment = { classId: string; subjectId: string; teacherId: string };
export type TeachingAssignmentData = {
  classes: TeachingClass[];
  teachers: TeachingTeacher[];
  assignments: TeachingAssignment[];
};
export type CreateSubjectInput = Omit<Subject, 'id'>;
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
    createSubject: build.mutation<{ id: string }, CreateSubjectInput>({
      query: (body) => ({ url: '/subjects', method: 'POST', body }),
      invalidatesTags: ['Subjects', 'TeachingAssignments'],
    }),
    getTeachingAssignments: build.query<TeachingAssignmentData, void>({
      query: () => '/teaching-assignments',
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
  useCreateSubjectMutation,
  useGetTeachingAssignmentsQuery,
  useUpdateTeachingAssignmentMutation,
} = subjectsAssignmentsApi;
