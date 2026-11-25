import type { SubjectRow } from '../../api/reportsApi';

export function missingGradeLabel(subjectName: string, missingCount: number) {
  if (missingCount === 0) return `${subjectName} – לא הוזנו ציונים`;
  if (missingCount === 1) return `${subjectName} – ציון אחד חסר`;
  return `${subjectName} – ${missingCount} ציונים חסרים`;
}

export function getMissingGrades(subjects: SubjectRow[]) {
  return subjects
    .filter((subject) => subject.missingCount > 0 || subject.finalGrade === null)
    .map(({ subjectName, missingCount }) => ({ subjectName, missingCount }));
}

export function getTranscriptSelectionMode(classId: string, studentId: string) {
  if (studentId) return 'student';
  if (classId) return 'class';
  return 'none';
}

export function canPrintTranscript(
  transcriptCount: number,
  expectedCount: number,
  missingCount: number,
) {
  return transcriptCount === expectedCount && expectedCount > 0 && missingCount === 0;
}
