import { apiSlice } from './apiSlice';

export type SubjectRow = {
  subjectId: string;
  subjectName: string;
  finalGrade: number | null;
  missingCount: number;
};

export type TranscriptData = {
  studentId: string;
  studentName: string;
  className: string;
  term: string;
  homeroomTeacher: string;
  subjects: SubjectRow[];
  missingGrades: { subjectName: string; missingCount: number }[];
};

export const reportsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getTranscript: build.query<TranscriptData, { studentId: string; term: string }>({
      query: ({ studentId, term }) => `/reports/transcript/${studentId}?term=${term}`,
    }),
  }),
});

export const { useGetTranscriptQuery } = reportsApi;
