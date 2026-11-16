import { useEffect, useState } from 'react';
import { Alert, Button, PageHeader, Select } from '../../components/ui';
import { ErrorState, LoadingSkeleton } from '../../components/StateViews';
import { CLASSES, SUBJECTS, shared } from '../../mocks/shared';

const TERMS = [
  { value: 'א', label: "מחצית א'" },
  { value: 'ב', label: "מחצית ב'" },
];

type SubjectRow = {
  subjectId: string;
  subjectName: string;
  finalGrade: number | null;
  missingCount: number;
};

type TranscriptData = {
  studentId: string;
  studentName: string;
  className: string;
  term: string;
  subjects: SubjectRow[];
  missingGrades: { subjectName: string; missingCount: number }[];
};

function getTranscript(studentId: string, term: string): TranscriptData {
  const { students, teachingAssignments, assessments, grades } = shared;
  const student = students.find((s) => s.id === studentId);
  if (!student) throw new Error('תלמיד לא נמצא');
  const cls = CLASSES.find((c) => c.id === student.classId);

  const subjectRows: SubjectRow[] = teachingAssignments
    .filter((a) => a.classId === student.classId)
    .map((a) => {
      const subject = SUBJECTS.find((s) => s.id === a.subjectId);
      const asmList = assessments.filter(
        (asm) => asm.subjectId === a.subjectId && asm.classId === student.classId,
      );
      const gradeList = asmList.flatMap((asm) =>
        grades.filter((g) => g.assessmentId === asm.id && g.studentId === student.id),
      );
      const entered = gradeList.filter((g) => g.score !== null);
      const avg =
        entered.length > 0
          ? Math.round(entered.reduce((s, g) => s + (g.score ?? 0), 0) / entered.length)
          : null;
      return {
        subjectId: a.subjectId,
        subjectName: subject?.name ?? a.subjectId,
        finalGrade: avg,
        missingCount: gradeList.length - entered.length,
      };
    });

  return {
    studentId: student.id,
    studentName: `${student.firstName} ${student.lastName}`,
    className: cls?.name ?? '',
    term,
    subjects: subjectRows,
    missingGrades: subjectRows
      .filter((r) => r.missingCount > 0)
      .map((r) => ({ subjectName: r.subjectName, missingCount: r.missingCount })),
  };
}

function TranscriptPreview({ data }: { data: TranscriptData }) {
  return (
    <div className="transcript-preview mx-auto w-full max-w-2xl rounded-xl border border-line bg-surface p-8 shadow-sm print:border-none print:shadow-none">
      <div className="mb-6 text-center">
        <h2 className="text-h2 text-fg">בית ספר לדוגמה</h2>
        <p className="text-body text-fg-secondary">תעודת הישגים</p>
      </div>

      <div className="mb-6 flex justify-between text-body text-fg">
        <span>
          <strong>שם תלמיד/ה:</strong> {data.studentName}
        </span>
        <span>
          <strong>כיתה:</strong> {data.className}
        </span>
        <span>
          <strong>מחצית:</strong> {data.term === 'א' ? "א'" : "ב'"}
        </span>
      </div>

      <table className="w-full border-collapse text-body text-fg">
        <thead>
          <tr className="border-b border-line bg-subtle">
            <th className="py-2 pe-4 text-start text-label font-semibold">מקצוע</th>
            <th className="py-2 text-center text-label font-semibold">ציון</th>
          </tr>
        </thead>
        <tbody>
          {data.subjects.map((row) => (
            <tr key={row.subjectId} className="border-b border-line last:border-0">
              <td className="py-2 pe-4">{row.subjectName}</td>
              <td className="py-2 text-center">
                {row.finalGrade !== null ? row.finalGrade : <span className="text-fg-muted">—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-8 flex justify-between text-body text-fg">
        <div className="flex flex-col gap-2">
          <span className="text-label text-fg-secondary">הערת מחנך/ת</span>
          <div className="h-px w-48 bg-line" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-label text-fg-secondary">חתימת מנהל/ת</span>
          <div className="h-px w-48 bg-line" />
        </div>
      </div>
    </div>
  );
}

export default function G07Transcripts() {
  const [term, setTerm] = useState('א');
  const [selection, setSelection] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [transcripts, setTranscripts] = useState<TranscriptData[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  const classOptions = CLASSES.map((c) => ({ value: `class:${c.id}`, label: `כיתה ${c.name}` }));
  const studentOptions = shared.students.map((s) => ({
    value: `student:${s.id}`,
    label: `${s.firstName} ${s.lastName}`,
  }));

  useEffect(() => {
    if (!selection) {
      setTranscripts([]);
      return;
    }
    setStatus('loading');
    const timer = setTimeout(() => {
      try {
        if (selection.startsWith('student:')) {
          const studentId = selection.replace('student:', '');
          setTranscripts([getTranscript(studentId, term)]);
        } else {
          const classId = selection.replace('class:', '');
          const students = shared.students.filter((s) => s.classId === classId);
          setTranscripts(students.map((s) => getTranscript(s.id, term)));
        }
        setStatus('idle');
      } catch (e) {
        setErrorMsg(e instanceof Error ? e.message : 'שגיאה בטעינת הנתונים');
        setStatus('error');
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [selection, term]);

  const allMissing = transcripts.flatMap((t) =>
    t.missingGrades.map((m) => ({ ...m, studentName: t.studentName })),
  );
  const canPrint = transcripts.length > 0 && allMissing.length === 0;

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .transcript-preview { page-break-after: always; }
        }
      `}</style>

      <div className="flex flex-col gap-6">
        <PageHeader title="הפקת תעודות" className="no-print" />

        <div className="no-print flex flex-wrap gap-4">
          <Select
            label="מחצית"
            options={TERMS}
            value={term}
            onValueChange={setTerm}
            className="w-48"
          />
          <Select
            label="כיתה או תלמיד"
            options={[...classOptions, ...studentOptions]}
            value={selection}
            onValueChange={setSelection}
            placeholder="בחרו כיתה או תלמיד"
            className="w-64"
          />
        </div>

        {status === 'loading' && <LoadingSkeleton rows={6} />}

        {status === 'error' && (
          <ErrorState
            message={errorMsg}
            onRetry={() => {
              setStatus('idle');
              setSelection('');
            }}
          />
        )}

        {status === 'idle' && !selection && (
          <p className="text-body text-fg-secondary">
            בחרו מחצית וכיתה או תלמיד כדי לראות תצוגה מקדימה.
          </p>
        )}

        {status === 'idle' && transcripts.length > 0 && (
          <>
            {allMissing.length > 0 && (
              <Alert tone="warning" title="בדיקות לפני הפקה – ציונים חסרים" className="no-print">
                <ul className="mt-1 list-disc ps-4 text-body">
                  {allMissing.map((m, i) => (
                    <li key={i}>
                      {transcripts.length > 1 && <strong>{m.studentName}: </strong>}
                      {m.subjectName} – {m.missingCount} ציון{m.missingCount > 1 ? 'ות' : ''} חסר
                      {m.missingCount > 1 ? 'ות' : ''}
                    </li>
                  ))}
                </ul>
              </Alert>
            )}

            {transcripts.map((t) => (
              <TranscriptPreview key={t.studentId} data={t} />
            ))}

            <div className="no-print flex gap-3">
              <Button
                onClick={() => window.print()}
                disabled={!canPrint}
                title={!canPrint ? 'לא ניתן להפיק תעודה עם ציונים חסרים' : undefined}
              >
                {transcripts.length > 1 ? 'הדפס תעודות לכיתה' : 'הדפס תעודה'}
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
