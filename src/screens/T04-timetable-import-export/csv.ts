import type { Lesson } from '../../api/types';

type CsvValue = string | number | null;

const columns: { header: string; value: (lesson: Lesson) => CsvValue }[] = [
  { header: 'מזהה שיעור', value: (lesson) => lesson.id },
  { header: 'יום בשבוע', value: (lesson) => lesson.dayOfWeek },
  { header: 'שיעור', value: (lesson) => lesson.period },
  { header: 'מזהה כיתה', value: (lesson) => lesson.classId },
  { header: 'מזהה קבוצה', value: (lesson) => lesson.groupId },
  { header: 'מזהה מקצוע', value: (lesson) => lesson.subjectId },
  { header: 'מזהה מורה', value: (lesson) => lesson.teacherId },
  { header: 'מזהה חדר', value: (lesson) => lesson.roomId },
];

const quoteCsvValue = (value: CsvValue): string => `"${String(value ?? '').replace(/"/g, '""')}"`;

export function lessonsToCsv(lessons: Lesson[]): string {
  const rows = [
    columns.map(({ header }) => quoteCsvValue(header)),
    ...lessons.map((lesson) => columns.map(({ value }) => quoteCsvValue(value(lesson)))),
  ];

  return `\uFEFF${rows.map((row) => row.join(',')).join('\r\n')}\r\n`;
}

function downloadCsv(contents: string, fileName: string): void {
  const blob = new Blob([contents], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function downloadLessonsCsv(lessons: Lesson[]): void {
  downloadCsv(lessonsToCsv(lessons), 'מערכת-שעות.csv');
}

export function downloadTemplateCsv(): void {
  downloadCsv(lessonsToCsv([]), 'תבנית-מערכת-שעות.csv');
}
