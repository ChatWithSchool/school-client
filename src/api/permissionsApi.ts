import { apiSlice } from './apiSlice';

export type RoleKey =
  | 'management'
  | 'coordinator'
  | 'secretary'
  | 'homeroom'
  | 'teacher'
  | 'parent'
  | 'student';

export type AccessLevel = 'full' | 'scoped' | 'read';

export interface PermissionScreen {
  screenId: string;
  name: string;
  module: string;
  level: AccessLevel;
}

export interface MyPermissions {
  role: RoleKey;
  roleName: string;
  scope: { classIds: string[]; studentIds: string[] };
  screens: PermissionScreen[];
}

/** A05 · ההרשאות שלי: GET /me/permissions */
export const permissionsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getMyPermissions: build.query<MyPermissions, void>({
      query: () => ({ url: '/me/permissions' }),
      providesTags: ['Me'],
    }),
  }),
});

export const { useGetMyPermissionsQuery } = permissionsApi;