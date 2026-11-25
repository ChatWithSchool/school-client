import { http, HttpResponse } from 'msw';
import { authz, err } from './http';
import { CLASSES, STAFF, SUBJECTS, shared } from './shared';

export const reportHandlers = [
  http.get('*/api/reports/transcript/:studentId', ({ params, request }) => {
    const a = authz(request, 'G07', 'read');
    if (a.res) return a.res;
    const student = shared.students.find((s) => s.id === params.studentId);
    if (!student) return err(404, 'NOT_FOUND', 'התלמיד לא נמצא');
    const term = new URL(request.url).searchParams.get('term') ?? 'א';
    const cls = CLASSES.find((c) => c.id === student.classId);
    const teacher = STAFF.find((t) => t.id === cls?.homeroomTeacherId);
    const assignments = shared.teachingAssignments.filter((a) => a.classId === student.classId);
    const subjectRows = assignments.map((a) => {
      const subject = SUBJECTS.find((s) => s.id === a.subjectId);
      const assessmentsForSubject = shared.assessments.filter(
        (asm) => asm.subjectId === a.subjectId && asm.classId === student.classId,
      );
      const grades = assessmentsForSubject.flatMap((asm) =>
        shared.grades.filter((g) => g.assessmentId === asm.id && g.studentId === student.id),
      );
      const entered = grades.filter((g) => g.score !== null);
      const avg =
        entered.length > 0
          ? Math.round(entered.reduce((s, g) => s + (g.score ?? 0), 0) / entered.length)
          : null;
      return {
        subjectId: a.subjectId,
        subjectName: subject?.name ?? a.subjectId,
        finalGrade: avg,
        missingCount: grades.length - entered.length,
      };
    });
    const missingGrades = subjectRows
      .filter((r) => r.missingCount > 0 || r.finalGrade === null)
      .map((r) => ({ subjectName: r.subjectName, missingCount: r.missingCount }));
    return HttpResponse.json({
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      className: cls?.name ?? '',
      term,
      homeroomTeacher: teacher ? `${teacher.firstName} ${teacher.lastName}` : '',
      subjects: subjectRows,
      missingGrades,
    });
  }),

  http.post('*/api/reports/transcripts/bulk', async ({ request }) => {
    const a = authz(request, 'G07', 'write');
    if (a.res) return a.res;
    const body = (await request.json()) as { classId: string; term: string };
    const students = shared.students.filter((s) => s.classId === body.classId);
    if (!students.length) return err(404, 'NOT_FOUND', 'הכיתה לא נמצאה');
    return HttpResponse.json({ count: students.length, classId: body.classId, term: body.term });
  }),
];
