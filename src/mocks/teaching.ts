import { http, HttpResponse } from 'msw';
import { termOf, type TeachingCard } from '../api/teachingApi';
import { authz } from './http';
import { CLASSES, SUBJECTS, shared } from './shared';

/**
 * G08: the classes and subjects of the signed-in teacher, from the shared mock data. With
 * ?termId, only the assessments of that term count (the mock data has no termId: by their date;
 * an assessment without a date counts in every term).
 */
export const teachingHandlers = [
  http.get('*/api/me/teaching', ({ request }) => {
    const a = authz(request, 'G08', 'read');
    if (a.res) return a.res;
    const termId = new URL(request.url).searchParams.get('termId');
    const inTerm = (date: string | null) =>
      !termId || date === null || termOf(new Date(date)) === termId;
    const items: TeachingCard[] = shared.teachingAssignments
      .filter((t) => t.teacherId === a.user.email)
      .map((t) => {
        const assessments = shared.assessments.filter(
          (x) => x.classId === t.classId && x.subjectId === t.subjectId && inTerm(x.date),
        );
        const missing = shared.grades.filter(
          (g) => g.score === null && assessments.some((x) => x.id === g.assessmentId),
        );
        return {
          classId: t.classId,
          subjectId: t.subjectId,
          openAssessments: new Set(missing.map((g) => g.assessmentId)).size,
          studentsWithoutGrade: new Set(missing.map((g) => g.studentId)).size,
          className: CLASSES.find((c) => c.id === t.classId)?.name,
          subjectName: SUBJECTS.find((s) => s.id === t.subjectId)?.name,
          studentCount: shared.students.filter((s) => s.classId === t.classId).length,
        };
      });
    return HttpResponse.json({ items });
  }),
];
