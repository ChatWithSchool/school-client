import { apiSlice } from './apiSlice';

export type AvailableTeacher = {
  id: string;
  name: string;
  subjects: string;
  hoursThatDay: number;
};

export type UncoveredLesson = {
  id: string;
  lessonNumber: number;
  className: string;
  subject: string;
  absentTeacher: string;
};

type ListResponse<T> = { items: T[] };

/** T03: available teachers and lessons without a teacher. */
export const substitutesApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    listAvailableTeachers: build.query<
      ListResponse<AvailableTeacher>,
      { date: string; slot: string }
    >({
      query: (params) => ({ url: '/staff/available', params }),
    }),
    listUncoveredLessons: build.query<ListResponse<UncoveredLesson>, void>({
      query: () => ({ url: '/lessons', params: { uncovered: true } }),
    }),
  }),
});

export const { useListAvailableTeachersQuery, useListUncoveredLessonsQuery } = substitutesApi;