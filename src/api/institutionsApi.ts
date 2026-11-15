import { apiSlice } from './apiSlice';

export type CreateInstitutionInput = {
  name: string;
  type: string;
  year?: string;
};

export type CreateInstitutionStructureInput = {
  levels: string[];
  classesPerLevel: number;
  year: string;
};

export const institutionsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    createInstitution: build.mutation<{ id: string }, CreateInstitutionInput>({
      query: (body) => ({ url: '/institutions', method: 'POST', body }),
    }),
    createInstitutionStructure: build.mutation<
      { id: string },
      { institutionId: string; body: CreateInstitutionStructureInput }
    >({
      query: ({ institutionId, body }) => ({
        url: `/institutions/${institutionId}/structure`,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useCreateInstitutionMutation, useCreateInstitutionStructureMutation } =
  institutionsApi;
