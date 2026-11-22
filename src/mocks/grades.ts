import { http, HttpResponse } from 'msw';
import { authz, err } from './http';
import { shared } from './shared';

export const gradeHandlers = [
  http.get('*/api/grades/:id/history', ({ params, request }) => {
    const access = authz(request, 'G03', 'read');
    if (access.res) return access.res;
    if (!shared.grades.some((grade) => grade.id === params.id))
      return err(404, 'NOT_FOUND', 'הציון לא נמצא');
    return HttpResponse.json({
      items: shared.gradeHistory.filter((change) => change.gradeId === params.id),
    });
  }),
];
