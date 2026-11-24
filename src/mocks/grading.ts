import { http, HttpResponse } from 'msw';
import { authz, err } from './http';
import { shared } from './shared';

export const gradingHandlers = [
  http.get('*/api/grading/weights', ({ request }) => {
    const a = authz(request, 'G06', 'read');
    if (a.res) return a.res;
    const q = new URL(request.url).searchParams;
    const gradeLevel = q.get('gradeLevel');
    const subjectId = q.get('subjectId');
    const termId = q.get('termId');
    const items = shared.gradingWeights.filter(
      (w) =>
        (!gradeLevel || w.gradeLevel === gradeLevel) &&
        (!subjectId || w.subjectId === subjectId) &&
        (!termId || w.termId === termId),
    );
    return HttpResponse.json({ items });
  }),

  http.put('*/api/grading/weights', async ({ request }) => {
    const a = authz(request, 'G06', 'write');
    if (a.res) return a.res;
    const body = (await request.json()) as {
      gradeLevel: string;
      subjectId: string;
      termId: string;
      weights: { type: string; percent: number }[];
    };
    const termStatus = shared.termStatuses.find((t) => t.termId === body.termId);
    if (termStatus?.closed) return err(400, 'TERM_CLOSED', 'לא ניתן לשנות משקלים במחצית סגורה');
    const total = body.weights.reduce((s, w) => s + w.percent, 0);
    if (total !== 100)
      return err(400, 'VALIDATION_ERROR', `סכום המשקלים חייב להיות 100% (כרגע: ${total}%)`);
    const existing = shared.gradingWeights.find(
      (w) =>
        w.gradeLevel === body.gradeLevel &&
        w.subjectId === body.subjectId &&
        w.termId === body.termId,
    );
    if (existing)
      existing.weights = body.weights.map((w) => ({
        type: w.type as 'exam' | 'quiz' | 'assignment',
        percent: w.percent,
      }));
    return new HttpResponse(null, { status: 204 });
  }),
];
