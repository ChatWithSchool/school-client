import { apiSlice } from './apiSlice';

export type WeightEntry = { type: 'exam' | 'quiz' | 'assignment'; percent: number };

export type GradingWeight = {
  id: string;
  gradeLevel: string;
  subjectId: string;
  termId: string;
  weights: WeightEntry[];
};

export type PutGradingWeightsBody = {
  gradeLevel: string;
  subjectId: string;
  termId: string;
  weights: WeightEntry[];
};

export const gradingApi = apiSlice
  .enhanceEndpoints({ addTagTypes: ['GradingWeights'] })
  .injectEndpoints({
    endpoints: (build) => ({
      getGradingWeights: build.query<
        { items: GradingWeight[] },
        { gradeLevel?: string; subjectId?: string; termId?: string }
      >({
        query: (params) => ({
          url: '/grading/weights',
          params,
        }),
        providesTags: ['GradingWeights'],
      }),
      putGradingWeights: build.mutation<void, PutGradingWeightsBody>({
        query: (body) => ({ url: '/grading/weights', method: 'PUT', body }),
        invalidatesTags: ['GradingWeights'],
      }),
    }),
  });

export const { useGetGradingWeightsQuery, usePutGradingWeightsMutation } = gradingApi;
