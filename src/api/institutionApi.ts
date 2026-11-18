import { apiSlice } from './apiSlice';

export type InstitutionDto = {
  id: string;
  name: string;
  type: 'elementary' | 'middle' | 'high' | 'mixed';
  address?: string;
  phone?: string;
  contactEmail?: string;
  activeYearId?: string;
};

export type TermDto = {
  id: string;
  name: string;
  /** date, YYYY-MM-DD */
  startDate: string;
  /** date, YYYY-MM-DD */
  endDate: string;
  status: 'open' | 'closed';
};

export const institutionApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getInstitution: build.query<InstitutionDto, string>({
      query: (id) => `/institutions/${id}`,
    }),
    listTerms: build.query<{ items: TermDto[] }, { yearId?: string } | void>({
      query: (params) => ({ url: '/terms', params: params ?? undefined }),
    }),
  }),
});

export const { useGetInstitutionQuery, useListTermsQuery } = institutionApi;
