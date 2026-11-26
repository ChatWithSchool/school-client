import { apiSlice } from './apiSlice';
import type { GradeChange, List } from './types';

export const gradesApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getGradeHistory: build.query<List<GradeChange>, string>({
      query: (gradeId) => `/grades/${gradeId}/history`,
    }),
  }),
});

export const { useGetGradeHistoryQuery } = gradesApi;
