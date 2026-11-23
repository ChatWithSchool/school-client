import { http, HttpResponse } from 'msw';
import { authz } from './http';

export const institutionHandlers = [
  http.post('*/api/institutions', ({ request }) => {
    const a = authz(request, 'I01', 'write');
    if (a.res) return a.res;
    return HttpResponse.json({ id: 'inst-1' }, { status: 201 });
  }),

  http.post('*/api/institutions/:id/structure', ({ params, request }) => {
    const a = authz(request, 'I01', 'write');
    if (a.res) return a.res;
    return HttpResponse.json({ id: String(params.id) }, { status: 201 });
  }),
];
