import { apiSlice } from './apiSlice';
import type { Assessment, Page } from './types';

/** What the G04 form sends: the fields of Assessment that the teacher chooses. */
export type AssessmentInput = Pick<
  Assessment,
  'title' | 'type' | 'classId' | 'subjectId' | 'date'
> & {
  weight?: number;
};

/**
 * G04 · Assessments. The contract has GET and POST /assessments only; PUT /assessments/{id}
 * (editing, part of v1-lite) is not in it yet, so for now only the mock answers it.
 */
export const assessmentsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    listAssessments: build.query<Page<Assessment>, void>({
      query: () => '/assessments',
      providesTags: ['Grades'],
    }),
    createAssessment: build.mutation<{ id: string }, AssessmentInput>({
      query: (body) => ({ url: '/assessments', method: 'POST', body }),
      invalidatesTags: ['Grades'],
    }),
    updateAssessment: build.mutation<{ id: string }, AssessmentInput & { id: string }>({
      query: ({ id, ...body }) => ({ url: `/assessments/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Grades'],
    }),
  }),
});

export const { useListAssessmentsQuery, useCreateAssessmentMutation, useUpdateAssessmentMutation } =
  assessmentsApi;
