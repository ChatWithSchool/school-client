import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useGetMeQuery } from '../../api/authApi';
import { errorMessage } from '../../api/errors';
import { useListLessonsQuery } from '../../api/lessonsApi';
import { useAppSelector } from '../../app/hooks';
import { EmptyState, ErrorState, ForbiddenState, LoadingSkeleton } from '../../components/StateViews';
import {
  Badge,
  Button,
  FileDropzone,
  PageHeader,
  Table,
  type TableColumn,
} from '../../components/ui';
import { downloadLessonsCsv, downloadTemplateCsv } from './csv';

type ValidationRow = {
  id: string;
  issue: string;
  status: 'תקין' | 'שגיאה';
  lesson: string;
  line: number;
  tone: 'success' | 'danger';
};

const SAMPLE_ROWS: ValidationRow[] = [
  { id: '1', issue: '—', status: 'תקין', lesson: 'מתמטיקה · ח1 · יום א׳ שיעור 1', line: 1, tone: 'success' },
  { id: '2', issue: '—', status: 'תקין', lesson: 'עברית · ח2 · יום א׳ שיעור 1', line: 2, tone: 'success' },
  {
    id: '3',
    issue: 'שיבוץ כפול של המורה בח2',
    status: 'שגיאה',
    lesson: 'אנגלית · ח1 · יום ב׳ שיעור 3',
    line: 3,
    tone: 'danger',
  },
  {
    id: '4',
    issue: 'שגיאת בחירת חדר',
    status: 'שגיאה',
    lesson: 'מדעים · ח3 · יום ג׳ שיעור 2',
    line: 4,
    tone: 'danger',
  },
];

function validateFile(fileName: string): ValidationRow[] {
  if (fileName.toLowerCase().includes('valid')) return SAMPLE_ROWS.slice(0, 2);
  return SAMPLE_ROWS;
}

const columns: TableColumn<ValidationRow>[] = [
  {
    key: 'line',
    header: 'שורה',
    cell: (row) => row.line,
    numeric: true,
    className: 'min-w-32 text-end',
  },
  {
    key: 'lesson',
    header: 'שיעור',
    cell: (row) => row.lesson,
    className: 'min-w-32 text-end',
  },
  {
    key: 'status',
    header: 'סטטוס',
    cell: (row) => (
      <Badge tone={row.tone} size="S">
        {row.status}
      </Badge>
    ),
    className: 'min-w-32 text-end',
  },
  {
    key: 'issue',
    header: 'שגיאה / התנגשות',
    cell: (row) => row.issue,
    className: 'min-w-48 text-end',
  },
];

function isForbidden(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'status' in error && error.status === 403;
}

function ScreenHeader({ action }: { action?: ReactNode }) {
  return (
    <PageHeader
      title="ייבוא וייצוא מערכת שעות"
      subtitle="מנהל · בדיקת קובץ Excel לפני אישור"
      breadcrumbs={[{ label: 'מערכת שעות', to: '/schedule/t01' }, { label: 'ייבוא וייצוא' }]}
      actions={action}
    />
  );
}

export default function Screen() {
  const token = useAppSelector((state) => state.auth.token);
  const me = useGetMeQuery(undefined, { skip: !token });
  const hasAccess = me.data?.permissions.T04 === 'full';
  const lessons = useListLessonsQuery(undefined, { skip: !hasAccess });
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('הקובץ לא נקלט. נסו שוב.');
  const [results, setResults] = useState<ValidationRow[]>(SAMPLE_ROWS);
  const [committed, setCommitted] = useState(false);

  useEffect(() => {
    if (uploadState !== 'uploading') return;

    const timer = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 95) {
          window.clearInterval(timer);
          return 100;
        }
        return current + 20;
      });
    }, 180);

    return () => window.clearInterval(timer);
  }, [uploadState]);

  const handleFiles = (files: File[]) => {
    const file = files[0];
    if (!file) return;

    setCommitted(false);
    setFileName(file.name);
    setUploadState('uploading');
    setProgress(25);
    setError('הקובץ לא נקלט. נסו שוב.');

    window.setTimeout(() => {
      setResults(validateFile(file.name));
      setUploadState('done');
      setProgress(100);
    }, 450);
  };

  const handleReject = () => {
    setUploadState('error');
    setError('סוג הקובץ אינו נתמך. יש לבחור Excel או CSV.');
  };

  const openFilePicker = () => {
    dropzoneRef.current?.querySelector<HTMLInputElement>('input[type="file"]')?.click();
  };

  const clearResults = () => {
    setFileName(null);
    setUploadState('idle');
    setProgress(0);
    setResults([]);
    setCommitted(false);
  };

  const handleCommit = () => {
    setCommitted(true);
  };

  if (!token || me.isLoading) return <LoadingSkeleton />;
  if (me.isError) {
    if (isForbidden(me.error)) return <ForbiddenState />;
    return <ErrorState message={errorMessage(me.error)} onRetry={() => void me.refetch()} />;
  }
  if (!hasAccess) return <ForbiddenState />;

  if (lessons.isLoading || lessons.isFetching) {
    return (
      <div className="space-y-6">
        <ScreenHeader />
        <LoadingSkeleton />
      </div>
    );
  }

  if (lessons.isError) {
    if (isForbidden(lessons.error)) return <ForbiddenState />;
    return (
      <div className="space-y-6">
        <ScreenHeader />
        <ErrorState message={errorMessage(lessons.error)} onRetry={() => void lessons.refetch()} />
      </div>
    );
  }

  if (!lessons.data) {
    return (
      <div className="space-y-6">
        <ScreenHeader />
        <ErrorState message="לא התקבלו נתוני מערכת השעות." onRetry={() => void lessons.refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <ScreenHeader />

      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="secondary" size="M" type="button" onClick={downloadTemplateCsv}>
          הורדת תבנית
        </Button>
        <Button
          variant="secondary"
          size="M"
          type="button"
          disabled={lessons.data.items.length === 0}
          onClick={() => downloadLessonsCsv(lessons.data.items)}
        >
          ייצוא נוכחית
        </Button>
        <Button variant="primary" size="M" type="button" onClick={openFilePicker}>
          ייבוא מקובץ
        </Button>
      </div>

      <div className="space-y-5">
        <FileDropzone
          ref={dropzoneRef}
          accept=".xlsx,.xls,.csv"
          state={uploadState}
          onFiles={handleFiles}
          onReject={handleReject}
          fileName={fileName ?? undefined}
          progress={progress}
          error={error}
          hint="Excel או CSV · עד 5MB"
          className="!bg-subtle"
        />

        {lessons.data.items.length === 0 && (
          <EmptyState title="אין שיעורים לייצוא" text="כשיתווספו שיעורים, אפשר יהיה להוריד אותם כקובץ CSV." />
        )}

        {results.length > 0 && (
          <section className="overflow-hidden rounded-xl border border-line bg-surface shadow-xs">
            <div className="flex items-center justify-between border-b border-line bg-surface px-5 py-3">
              <h2 className="text-h3 text-fg">תוצאות בדיקה</h2>
              {committed && (
                <Badge tone="success" size="S">
                  נוצרה טיוטה לבדיקה
                </Badge>
              )}
            </div>

            <Table
              caption="תוצאות בדיקה של קובץ מערכת שעות"
              rows={results}
              columns={columns}
              getRowId={(row) => row.id}
              wrapperClassName="border-0 rounded-none"
            />
          </section>
        )}

        {results.length > 0 && (
          <div className="flex justify-end gap-2">
            <Button variant="primary" size="M" type="button" onClick={handleCommit}>
              ייבא תקינות
            </Button>
            <Button variant="secondary" size="M" type="button" onClick={clearResults}>
              ביטול
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
