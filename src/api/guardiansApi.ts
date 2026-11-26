import { apiSlice } from './apiSlice';

export type GuardianDto = {
    name: string;
    relation?: string;
    phone?: string;
    email?: string;
    /** set when the parent is linked; a temporary value for a parent who was only invited */
    userId?: string;
};

export type StudentWithGuardiansDto = {
    id: string;
    firstName: string;
    lastName: string;
    guardians: GuardianDto[];
};

export const guardiansApi = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        // The linked parents come with the student card (GET /students/{id}).
        getStudentGuardians: build.query<StudentWithGuardiansDto, string>({
            query: (studentId) => `/students/${studentId}`,
            providesTags: ['Students'],
        }),
        linkGuardian: build.mutation<
            { id: string },
            { studentId: string; email: string; relation?: string }
        >({
            query: ({ studentId, ...body }) => ({
                url: `/students/${studentId}/guardians`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Students'],
        }),
        unlinkGuardian: build.mutation<void, { studentId: string; guardianId: string }>({
            query: ({ studentId, guardianId }) => ({
                url: `/students/${studentId}/guardians/${encodeURIComponent(guardianId)}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Students'],
        }),
    }),
});

export const {
    useGetStudentGuardiansQuery,
    useLinkGuardianMutation,
    useUnlinkGuardianMutation,
} = guardiansApi;