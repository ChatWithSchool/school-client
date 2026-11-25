import { http, HttpResponse } from 'msw';
import type { GradingWeight, WeightEntry } from '../api/gradingApi';
import { authz, err } from './http';
import { SUBJECTS } from './shared/people';

type TermStatus = { termId: string; closed: boolean };

const TERMS = [
  { id: 'term-a', closed: false },
  { id: 'term-b', closed: true },
];

function seedGradingWeights(): GradingWeight[] {
  const gradeLevels = ['ז', 'ח', 'ט'];
  return gradeLevels.flatMap((gradeLevel) =>
    SUBJECTS.flatMap((subject) =>
      TERMS.map((term) => ({
        id: `gw-${gradeLevel}-${subject.id}-${term.id}`,
        gradeLevel,
        subjectId: subject.id,
        termId: term.id,
        weights: [
          { type: 'exam' as const, percent: 60 },
          { type: 'quiz' as const, percent: 20 },
          { type: 'assignment' as const, percent: 20 },
        ],
      })),
    ),
  );
}

function seedTermStatuses(): TermStatus[] {
  return TERMS.map((term) => ({ termId: term.id, closed: term.closed }));
}

let gradingWeights = seedGradingWeights();
let termStatuses = seedTermStatuses();

export function resetGradingMocks(): void {
  gradingWeights = seedGradingWeights();
  termStatuses = seedTermStatuses();
}

export const gradingHandlers = [
  http.get('*/api/grading/weights', ({ request }) => {
    const a = authz(request, 'G06', 'read');
    if (a.res) return a.res;
    const q = new URL(request.url).searchParams;
    const gradeLevel = q.get('gradeLevel');
    const subjectId = q.get('subjectId');
    const termId = q.get('termId');
    const items = gradingWeights.filter(
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
      weights: WeightEntry[];
    };
    const termStatus = termStatuses.find((term) => term.termId === body.termId);
    if (termStatus?.closed) return err(400, 'TERM_CLOSED', 'לא ניתן לשנות משקלים במחצית סגורה');
    const total = body.weights.reduce((s, w) => s + w.percent, 0);
    if (total !== 100)
      return err(400, 'VALIDATION_ERROR', `סכום המשקלים חייב להיות 100% (כרגע: ${total}%)`);
    const existing = gradingWeights.find(
      (w) =>
        w.gradeLevel === body.gradeLevel &&
        w.subjectId === body.subjectId &&
        w.termId === body.termId,
    );
    if (existing) existing.weights = body.weights.map((weight) => ({ ...weight }));
    return new HttpResponse(null, { status: 204 });
  }),
];
