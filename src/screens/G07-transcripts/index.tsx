import { useAppSelector } from '../../app/hooks';
import { useGetMeQuery } from '../../api/authApi';
import { useGetTranscriptQuery } from '../../api/reportsApi';
import type { TranscriptData } from '../../api/reportsApi';
import { errorMessage } from '../../api/errors';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Button, PageHeader, Select } from '../../components/ui';
import { ErrorState, ForbiddenState, LoadingSkeleton } from '../../components/StateViews';
import {
  canPrintTranscript,
  getMissingGrades,
  getTranscriptSelectionMode,
  missingGradeLabel,
} from './missingGrades';
import { useListClassesQuery, useListStudentsQuery } from '../../api/selectionApi';

const TERMS = [
  { value: 'א', label: "מחצית א'" },
  { value: 'ב', label: "מחצית ב'" },
];

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

      <div className="mt-8 flex flex-col gap-6 text-body text-fg">
        <div className="flex flex-col gap-2">
          <span className="text-label text-fg-secondary">הערת מחנך/ת</span>
          {data.homeroomTeacher && (
            <span className="text-label text-fg-secondary">{data.homeroomTeacher}</span>
          )}
          <div className="flex h-20 flex-col justify-center gap-8">
            <div className="h-px w-full bg-line" />
            <div className="h-px w-full bg-line" />
          </div>
        </div>
        <div className="flex gap-8">
          <div className="flex flex-1 flex-col gap-2">
            <span className="text-label text-fg-secondary">חתימת מחנך/ת</span>
            <div className="h-12 border-b border-line" />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <span className="text-label text-fg-secondary">חתימת מנהל/ת</span>
            <div className="h-12 border-b border-line" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SingleTranscript({
  studentId,
  term,
  onLoaded,
}: {
  studentId: string;
  term: string;
  onLoaded: (data: TranscriptData) => void;
}) {
  const { data, isLoading, isError, error, refetch } = useGetTranscriptQuery({ studentId, term });

  useEffect(() => {
    if (data) onLoaded(data);
  }, [data, onLoaded]);

  if (isLoading) return <LoadingSkeleton rows={6} />;
  if (isError) return <ErrorState message={errorMessage(error)} onRetry={() => void refetch()} />;
  if (!data) return null;
  return <TranscriptPreview data={data} />;
}

export default function G07Transcripts() {
  const token = useAppSelector((s) => s.auth.token);
  const me = useGetMeQuery(undefined, { skip: !token });
  const permission = me.data?.permissions['G07'];

  const [term, setTerm] = useState('א');
  const [classId, setClassId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [transcriptResults, setTranscriptResults] = useState<Record<string, TranscriptData>>({});
  const classes = useListClassesQuery();
  const students = useListStudentsQuery(
    { classId: classId || undefined, size: 25 },
    { skip: !classId || !token },
  );

  const handleTranscriptLoaded = useCallback((data: TranscriptData) => {
    setTranscriptResults((current) =>
      current[data.studentId]?.subjects === data.subjects
        ? current
        : { ...current, [data.studentId]: data },
    );
  }, []);

  useEffect(() => {
    setTranscriptResults({});
  }, [classId, studentId, term]);

  const classOptions =
    classes.data?.items.map((c) => ({ value: c.id, label: `כיתה ${c.name}` })) ?? [];
  const classStudents = classId ? (students.data?.items ?? []) : [];
  const studentOptions = classStudents.map((student) => ({
    value: student.id,
    label: `${student.firstName} ${student.lastName}`,
  }));

  if (!token || me.isLoading) return <LoadingSkeleton />;
  if (me.isError) return <ErrorState message={errorMessage(me.error)} onRetry={() => void me.refetch()} />;
  if (!permission) return <ForbiddenState />;
  if (classes.isLoading || (classId && students.isLoading)) return <LoadingSkeleton rows={4} />;
  if (classes.isError)
    return <ErrorState message={errorMessage(classes.error)} onRetry={() => void classes.refetch()} />;
  if (classId && students.isError)
    return <ErrorState message={errorMessage(students.error)} onRetry={() => void students.refetch()} />;

  const selectionMode = getTranscriptSelectionMode(classId, studentId);
  const isStudent = selectionMode === 'student';
  const isClass = selectionMode === 'class';
  const expectedCount = isStudent ? 1 : isClass ? classStudents.length : 0;
  const transcripts = Object.values(transcriptResults).filter((data) =>
    data.term === term &&
    (isStudent
      ? data.studentId === studentId
      : isClass
        ? data.className === classes.data?.items.find((c) => c.id === classId)?.name
        : false),
  );
  const allMissing = transcripts.flatMap((transcript) =>
    getMissingGrades(transcript.subjects).map((missing) => ({
      studentName: isClass ? transcript.studentName : undefined,
      ...missing,
    })),
  );
  const canPrint = canPrintTranscript(transcripts.length, expectedCount, allMissing.length);

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .transcript-preview { page-break-after: always; }
        }
      `}</style>

      <div className="flex flex-col gap-6">
        <PageHeader
          title="הפקת תעודות"
          breadcrumbs={[{ label: 'ציונים' }, { label: 'הפקת תעודות' }]}
          className="no-print"
        />

        <div className="no-print flex flex-wrap gap-4">
          <Select
            label="מחצית"
            options={TERMS}
            value={term}
            onValueChange={setTerm}
            className="w-48"
          />
          <Select
            label="כיתה"
            options={classOptions}
            value={classId}
            onValueChange={(value) => {
              setClassId(value);
              setStudentId('');
            }}
            placeholder="בחרו כיתה"
            className="w-64"
          />
          {classId && (
            <Select
              label="תלמיד"
              options={studentOptions}
              value={studentId}
              onValueChange={setStudentId}
              placeholder="כל תלמידי הכיתה"
              className="w-64"
            />
          )}
        </div>

        {!classId && (
          <p className="text-body text-fg-secondary">
            בחרו מחצית וכיתה כדי לראות תצוגה מקדימה.
          </p>
        )}

        {isStudent && (
          <SingleTranscript studentId={studentId} term={term} onLoaded={handleTranscriptLoaded} />
        )}

        {isClass && classStudents.map((s) => (
          <SingleTranscript
            key={s.id}
            studentId={s.id}
            term={term}
            onLoaded={handleTranscriptLoaded}
          />
        ))}

        {allMissing.length > 0 && (
          <Alert tone="warning" title="בדיקות לפני הפקה – ציונים חסרים" className="no-print">
            <ul className="mt-1 list-disc ps-4 text-body">
              {allMissing.map((missing) => (
                <li key={`${missing.studentName ?? ''}-${missing.subjectName}`}>
                  {missing.studentName && <strong>{missing.studentName}: </strong>}
                  {missingGradeLabel(missing.subjectName, missing.missingCount)}
                </li>
              ))}
            </ul>
          </Alert>
        )}

        {classId && (
          <div className="no-print flex gap-3">
            <Button
              onClick={() => window.print()}
              disabled={!canPrint}
              title={!canPrint ? 'לא ניתן להפיק תעודה לפני השלמת הציונים' : undefined}
            >
              {isClass ? 'הדפס תעודות לכיתה' : 'הדפס תעודה'}
            </Button>
            <Button variant="secondary" disabled>
              הפק לכל הכיתה (קובץ מאוחד)
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
