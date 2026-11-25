import { apiSlice } from './apiSlice'; // כמו ב-invitesApi.ts

export interface StudentFormRecord {
  id: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  birthDate: string;
  className: string;
  phone: string;
  phoneExtra: string;
  parentEmail: string;
  address: string;
  notes: string;
  tags: string[];
}

export type StudentFormPayload = Omit<StudentFormRecord, 'id'>;

export interface CheckDuplicateParams {
  nationalId?: string;
  parentEmail?: string;
  excludeId?: string;
}

export interface CheckDuplicateResult {
  nationalIdExists: boolean;
  parentEmailExists: boolean;
}

export interface ClassDto {
  id: string;
  name: string;
}

export interface StudentTagDto {
  id: string;
  name: string;
}

export const studentsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // GET /students/{id} שייך ל-S03 לפי החוזה. עד שמתאמים מי מוסיף אותו,
    // הוא מוגדר כאן. אם S03 מוסיפה אותו קודם - למחוק מכאן ולייבא את שלה.
    getStudent: build.query<StudentFormRecord, string>({
      query: (id) => `/students/${encodeURIComponent(id)}`,
    }),

    createStudent: build.mutation<StudentFormRecord, StudentFormPayload>({
      query: (body) => ({ url: '/students', method: 'POST', body }),
    }),

    updateStudent: build.mutation<StudentFormRecord, { id: string; body: StudentFormPayload }>({
      query: ({ id, body }) => ({
        url: `/students/${encodeURIComponent(id)}`,
        method: 'PUT',
        body,
      }),
    }),

    checkStudentDuplicate: build.query<CheckDuplicateResult, CheckDuplicateParams>({
      query: (params) => ({ url: '/students/check-duplicate', params }),
    }),

    // אם כבר קיימים hooks לכיתות ולתגיות תלמיד במקום אחר - לייבא אותם ולמחוק את שני אלה
    getClasses: build.query<{ items: ClassDto[] }, void>({
      query: () => '/classes',
    }),

    getStudentTags: build.query<{ items: StudentTagDto[] }, void>({
      query: () => '/student-tags',
    }),
  }),
});

export const {
  useGetStudentQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useLazyCheckStudentDuplicateQuery,
  useGetClassesQuery,
  useGetStudentTagsQuery,
} = studentsApi;
