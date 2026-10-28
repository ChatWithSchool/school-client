import { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  FileDropzone,
  PageHeader,
  Table,
  type TableColumn,
} from '../../components/ui';

type ValidationRow = {
  id: string;
  issue: string;
  status: 'תקין' | 'אזהרה' | 'שגיאה';
  lesson: string;
  line: number;
  tone: 'success' | 'warning' | 'danger';
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
  {
    id: '5',
    issue: 'חדר המעבדה תפוס',
    status: 'אזהרה',
    lesson: 'ביולוגיה · ח4 · יום ד׳ שיעור 2',
    line: 5,
    tone: 'warning',
  },
];

function validateFile(fileName: string): ValidationRow[] {
  if (!fileName.toLowerCase().includes('valid')) {
    return SAMPLE_ROWS;
  }

  return [
    { id: '1', issue: '—', status: 'תקין', lesson: 'מתמטיקה · ח1 · יום א׳ שיעור 1', line: 1, tone: 'success' },
    { id: '2', issue: '—', status: 'תקין', lesson: 'עברית · ח2 · יום א׳ שיעור 1', line: 2, tone: 'success' },
  ];
}

const columns: TableColumn<ValidationRow>[] = [
  {
    key: 'issue',
    header: 'שגיאה / התנגשות',
    cell: (row) => row.issue,
    className: 'min-w-48 text-end',
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
    key: 'lesson',
    header: 'שיעור',
    cell: (row) => row.lesson,
    className: 'min-w-32 text-end',
  },
  {
    key: 'line',
    header: 'שורה',
    cell: (row) => row.line,
    numeric: true,
    className: 'min-w-32 text-end',
  },
];

export default function Screen() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('הקובץ לא נקלט. נסו שוב.');
  const [results, setResults] = useState<ValidationRow[]>([]);
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
      const next = validateFile(file.name);
      setResults(next);
      setUploadState('done');
      setProgress(100);
    }, 450);
  };

  const handleReject = () => {
    setUploadState('error');
    setError('סוג הקובץ אינו נתמך. יש לבחור Excel בלבד.');
  };

  const handleCommit = () => {
    setCommitted(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="ייבוא וייצוא מערכת שעות"
        subtitle="מנהל · בדיקת קובץ Excel לפני אישור"
        breadcrumbs={[{ label: 'מערכת שעות', to: '/schedule/t01' }, { label: 'ייבוא וייצוא' }]}
        actions={
          <>
            <Button variant="secondary" size="M" type="button">
              הורדת תבנית
            </Button>
            <Button variant="secondary" size="M" type="button">
              ייצוא נוכחי
            </Button>
          </>
        }
      />

      <div className="space-y-5">
        <FileDropzone
          accept=".xlsx,.xls,.csv"
          state={uploadState}
          onFiles={handleFiles}
          onReject={handleReject}
          fileName={fileName ?? undefined}
          progress={progress}
          error={error}
          hint="Excel בלבד · עד 5MB"
        />

        {results.length > 0 && (
          <section className="overflow-hidden rounded-xl border border-line bg-surface shadow-xs">
            <div className="flex items-center justify-between border-b border-line bg-subtle px-5 py-3">
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
            <Button variant="secondary" size="M" type="button">
              ביטול
            </Button>
            <Button variant="primary" size="M" type="button" onClick={handleCommit}>
              ייבוא תקינות
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
