import { describe, expect, it } from 'vitest';
import {
  canPrintTranscript,
  getMissingGrades,
  getTranscriptSelectionMode,
  missingGradeLabel,
} from './missingGrades';

describe('G07 · תצוגת ציונים חסרים', () => {
  it('מפרט ציון אחד חסר בצורה מדויקת', () => {
    expect(missingGradeLabel('אנגלית', 1)).toBe('אנגלית – ציון אחד חסר');
  });

  it('מפרט מספר ציונים חסרים', () => {
    expect(missingGradeLabel('מתמטיקה', 3)).toBe('מתמטיקה – 3 ציונים חסרים');
  });

  it('מסביר כשלא הוזנו ציונים כלל', () => {
    expect(missingGradeLabel('עברית', 0)).toBe('עברית – לא הוזנו ציונים');
  });

  it('מזהה מקצוע ללא ציון גם אם אין רשומות ציון חסרות', () => {
    const missing = getMissingGrades([
      {
        subjectId: 'sub-sci',
        subjectName: 'מדעים',
        finalGrade: null,
        missingCount: 0,
      },
    ]);

    expect(missing).toEqual([{ subjectName: 'מדעים', missingCount: 0 }]);
    expect(canPrintTranscript(1, 1, missing.length)).toBe(false);
  });

  it('לא מסמן מקצוע עם ציון שהוזנו בו כל הציונים', () => {
    expect(
      getMissingGrades([
        {
          subjectId: 'sub-sci',
          subjectName: 'מדעים',
          finalGrade: 90,
          missingCount: 0,
        },
      ]),
    ).toEqual([]);
  });

  it('מזהה בחירת כיתה בלי תלמיד', () => {
    expect(getTranscriptSelectionMode('cls-z1', '')).toBe('class');
  });

  it('מזהה בחירת תלמיד בתוך כיתה', () => {
    expect(getTranscriptSelectionMode('cls-z1', 'stu-1')).toBe('student');
  });

  it('מאפשר הדפסה רק לאחר טעינת כל התעודות וללא ציונים חסרים', () => {
    expect(canPrintTranscript(1, 1, 0)).toBe(true);
  });

  it('משבית הדפסה כשהציונים חסרים', () => {
    expect(canPrintTranscript(1, 1, 2)).toBe(false);
  });

  it('משבית הדפסה לפני טעינת כל תעודות הכיתה', () => {
    expect(canPrintTranscript(3, 10, 0)).toBe(false);
  });
});
