import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Button,
  GradeCell,
  MetricCard,
  PageHeader,
  Table,
  type TableColumn,
} from '../../components/ui';

type GradeRow = {
  id: string;
  name: string;
  score: number | null;
  feedback: string;
  updatedAt: string;
  error?: string;
  saveState: 'idle' | 'saving' | 'saved';
};

const INITIAL_ROWS: GradeRow[] = [
  { id: 'stu-1', name: 'אורי כהן', score: 84, feedback: 'עבודה מסודרת ותקינה.', updatedAt: '10:15', saveState: 'saved' },
  { id: 'stu-2', name: 'מיה לוי', score: 91, feedback: 'הבנת את החומר היטב.', updatedAt: '10:17', saveState: 'saved' },
  { id: 'stu-3', name: 'יונתן שמיר', score: 76, feedback: 'מומלץ לחזור על תרגילי חישוב.', updatedAt: '10:19', saveState: 'saved' },
  { id: 'stu-4', name: 'שירה דוד', score: null, feedback: '', updatedAt: 'טרם נשמר', saveState: 'idle' },
  { id: 'stu-5', name: 'נוי רז', score: 88, feedback: 'הצגה טובה, שיפר משמעותית.', updatedAt: '10:18', saveState: 'saved' },
  { id: 'stu-6', name: 'דניאל פרץ', score: 67, feedback: 'צריך לעבוד על הבהרה של החומר.', updatedAt: '10:20', saveState: 'saved' },
];

function formatAverage(value: number) {
  return Number.isInteger(value) ? `${value.toFixed(1)}` : value.toFixed(1);
}

export default function Screen() {
  const [rows, setRows] = useState<GradeRow[]>(INITIAL_ROWS);
  const gradeRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const average = useMemo(() => {
    const filled = rows.filter((row) => row.score !== null && Number.isFinite(row.score));
    if (filled.length === 0) return null;
    const total = filled.reduce((sum, row) => sum + (row.score ?? 0), 0);
    return total / filled.length;
  }, [rows]);

  const ungradedCount = useMemo(
    () => rows.filter((row) => row.score === null || row.score === undefined).length,
    [rows],
  );

  useEffect(() => {
    const timers = window.setTimeout(() => {
      setRows((current) =>
        current.map((row) =>
          row.saveState === 'saving' ? { ...row, saveState: 'saved', updatedAt: 'מעתה' } : row,
        ),
      );
    }, 350);

    return () => window.clearTimeout(timers);
  }, [rows]);

  const handleGradeChange = (id: string, raw: string) => {
    const sanitized = raw.trim();

    setRows((current) =>
      current.map((row) => {
        if (row.id !== id) return row;

        if (sanitized === '') {
          return { ...row, score: null, error: undefined, saveState: 'saved', updatedAt: 'ריק' };
        }

        const nextValue = Number(sanitized);
        if (!Number.isFinite(nextValue) || nextValue < 0 || nextValue > 100) {
          return { ...row, score: null, error: 'הציון חייב להיות בין 0 ל-100', saveState: 'saving' };
        }

        return {
          ...row,
          score: nextValue,
          error: undefined,
          saveState: 'saving',
          updatedAt: 'מעתה',
        };
      }),
    );
  };

  const focusNextGrade = (currentId: string) => {
    const currentIndex = rows.findIndex((row) => row.id === currentId);
    const nextRow = rows[currentIndex + 1];
    if (nextRow) {
      const input = gradeRefs.current[nextRow.id];
      input?.focus();
      input?.select();
    }
  };

  const columns: TableColumn<GradeRow>[] = [
    {
      key: 'student',
      header: 'תלמיד',
      className: 'w-[15rem]',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-caption text-primary-700">
            {row.name.slice(0, 1)}
          </span>
          <span className="text-body text-fg">{row.name}</span>
        </div>
      ),
    },
    {
      key: 'grade',
      header: 'ציון',
      className: 'w-[10rem]',
      cell: (row) => (
        <GradeCell
          ref={(node) => {
            gradeRefs.current[row.id] = node;
          }}
          label={`ציון עבור ${row.name}`}
          value={row.score === null ? '' : String(row.score)}
          placeholder="—"
          error={row.error}
          state={
            row.error ? 'error' : row.saveState === 'saving' ? 'saving' : row.saveState === 'saved' ? 'saved' : 'empty'
          }
          onChange={(event) => handleGradeChange(row.id, event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === 'ArrowDown') {
              event.preventDefault();
              focusNextGrade(row.id);
            }
          }}
          className="w-full min-w-[6.5rem]"
        />
      ),
    },
    {
      key: 'feedback',
      header: 'הערה',
      className: 'w-[22rem]',
      cell: (row) => (
        <label className="block">
          <span className="sr-only">הערה לתלמיד</span>
          <textarea
            aria-label={`הערה לתלמיד ${row.name}`}
            value={row.feedback}
            onChange={(event) =>
              setRows((current) =>
                current.map((entry) =>
                  entry.id === row.id ? { ...entry, feedback: event.target.value, updatedAt: 'מעתה' } : entry,
                ),
              )
            }
            rows={2}
            className="w-full resize-none rounded-md border border-line bg-subtle px-3 py-2 text-body text-fg placeholder:text-fg-muted focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            placeholder="הערה לתלמיד"
          />
        </label>
      ),
    },
    {
      key: 'updated',
      header: 'עודכן',
      className: 'w-[7rem]',
      cell: (row) => (
        <span className="text-body text-fg-secondary">{row.updatedAt}</span>
      ),
    },
  ];

  const hasError = rows.some((row) => row.error);

  return (
    <div className="space-y-4 p-4" dir="rtl">
      <PageHeader
        title="הזנת ציונים ומשוב"
        subtitle="כיתה ח1 · מתמטיקה · מבחן בשברים"
        actions={
          <Button variant="secondary" size="M">
            ייצוא CSV
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="ממוצע כיתתי"
          value={average === null ? '—' : `${formatAverage(average)}`}
          trend="none"
          className="min-h-[110px]"
          data-testid="average-metric"
        />
        <MetricCard
          label="ללא ציון"
          value={String(ungradedCount)}
          trend="none"
          className="min-h-[110px]"
        />
        <MetricCard
          label="אחוזי השלמה"
          value={average === null ? '0%' : `${Math.round((rows.filter((row) => row.score !== null).length / rows.length) * 100)}%`}
          trend="up"
          trendText="השלמה מתעדכנת"
          className="min-h-[110px]"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-subtle p-3">
        <div className="rounded-md border border-line bg-surface px-3 py-2 text-body text-fg-secondary">
          מבחן
        </div>
        <div className="rounded-md border border-line bg-surface px-3 py-2 text-body text-fg-secondary">
          כיתה
        </div>
        <div className="rounded-md border border-line bg-surface px-3 py-2 text-body text-fg-secondary">
          מועד
        </div>
      </div>

      <section className="rounded-xl border border-line bg-surface p-3 shadow-xs">
        <Table
          caption="טבלת הזנת ציונים ומשוב"
          rows={rows}
          getRowId={(row) => row.id}
          columns={columns}
          className="w-full"
          wrapperClassName="max-h-[70vh]"
          empty={<div className="p-4 text-center text-body text-fg-secondary">אין תלמידים להצגה.</div>}
        />
      </section>

      {hasError && (
        <div className="flex items-center gap-2 rounded-md border border-danger-200 bg-danger-50 px-3 py-2 text-body text-danger-700">
          <span aria-hidden="true">⚠</span>
          <span>הציון חייב להיות בין 0 ל-100</span>
        </div>
      )}
    </div>
  );
}
