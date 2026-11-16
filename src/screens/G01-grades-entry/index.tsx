import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GradeCell, MetricCard, PageHeader, Table, type TableColumn } from '../../components/ui';
import { EmptyState, ErrorState, LoadingSkeleton } from '../../components/StateViews';
import { errorMessage } from '../../api/errors';

type GradeRow = {
  id: string;
  name: string;
  score: number | null;
  scoreInput: string;
  feedback: string;
  updatedAt: string;
  error?: string;
  saveError?: string;
  saveState: 'idle' | 'saving' | 'saved' | 'error';
};

const INITIAL_ROWS: GradeRow[] = [
  {
    id: 'stu-1',
    name: 'אורי כהן',
    score: 84,
    scoreInput: '84',
    feedback: 'עבודה מסודרת ותקינה.',
    updatedAt: '10:15',
    saveState: 'saved',
  },
  {
    id: 'stu-2',
    name: 'מיה לוי',
    score: 91,
    scoreInput: '91',
    feedback: 'הבנת את החומר היטב.',
    updatedAt: '10:17',
    saveState: 'saved',
  },
  {
    id: 'stu-3',
    name: 'יונתן שמיר',
    score: 76,
    scoreInput: '76',
    feedback: 'מומלץ לחזור על תרגילי חישוב.',
    updatedAt: '10:19',
    saveState: 'saved',
  },
  {
    id: 'stu-4',
    name: 'שירה דוד',
    score: null,
    scoreInput: '',
    feedback: '',
    updatedAt: 'טרם נשמר',
    saveState: 'idle',
  },
  {
    id: 'stu-5',
    name: 'נוי רז',
    score: 88,
    scoreInput: '88',
    feedback: 'הצגה טובה, שיפר משמעותית.',
    updatedAt: '10:18',
    saveState: 'saved',
  },
  {
    id: 'stu-6',
    name: 'דניאל פרץ',
    score: 67,
    scoreInput: '67',
    feedback: 'צריך לעבוד על הבהרה של החומר.',
    updatedAt: '10:20',
    saveState: 'saved',
  },
];

type ScreenProps = {
  loadRows?: () => Promise<GradeRow[]>;
  saveGrade?: (row: GradeRow) => Promise<void>;
};

const loadMockRows = async () => INITIAL_ROWS.map((row) => ({ ...row }));
const saveMockGrade = async () => {};

function formatAverage(value: number) {
  return Number.isInteger(value) ? `${value.toFixed(1)}` : value.toFixed(1);
}

export default function Screen({
  loadRows = loadMockRows,
  saveGrade = saveMockGrade,
}: ScreenProps = {}) {
  const [rows, setRows] = useState<GradeRow[]>();
  const [loadError, setLoadError] = useState<string>();
  const gradeRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const saveTimers = useRef<Record<string, number>>({});
  const saveVersions = useRef<Record<string, number>>({});

  const average = useMemo(() => {
    const filled = (rows ?? []).filter((row) => row.score !== null && Number.isFinite(row.score));
    if (filled.length === 0) return null;
    const total = filled.reduce((sum, row) => sum + (row.score ?? 0), 0);
    return total / filled.length;
  }, [rows]);

  const ungradedCount = useMemo(
    () => (rows ?? []).filter((row) => row.score === null || row.score === undefined).length,
    [rows],
  );

  const load = useCallback(async () => {
    setRows(undefined);
    setLoadError(undefined);
    try {
      setRows(await loadRows());
    } catch (error) {
      setLoadError(errorMessage(error));
    }
  }, [loadRows]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(
    () => () => {
      for (const id of Object.keys(saveTimers.current)) {
        window.clearTimeout(saveTimers.current[id]);
        saveVersions.current[id] = (saveVersions.current[id] ?? 0) + 1;
      }
    },
    [],
  );

  const scheduleSave = (row: GradeRow) => {
    const { id } = row;
    window.clearTimeout(saveTimers.current[id]);
    const version = (saveVersions.current[id] ?? 0) + 1;
    saveVersions.current[id] = version;
    saveTimers.current[id] = window.setTimeout(() => {
      delete saveTimers.current[id];
      void saveGrade(row).then(
        () => {
          if (saveVersions.current[id] !== version) return;
          setRows((current) =>
            current?.map((entry) =>
              entry.id === id ? { ...entry, saveError: undefined, saveState: 'saved' } : entry,
            ),
          );
        },
        () => {
          if (saveVersions.current[id] !== version) return;
          setRows((current) =>
            current?.map((entry) =>
              entry.id === id
                ? { ...entry, saveError: 'שמירת הציון נכשלה', saveState: 'error' }
                : entry,
            ),
          );
        },
      );
    }, 350);
  };

  const cancelSave = (id: string) => {
    window.clearTimeout(saveTimers.current[id]);
    delete saveTimers.current[id];
    saveVersions.current[id] = (saveVersions.current[id] ?? 0) + 1;
  };

  const handleGradeChange = (id: string, raw: string) => {
    if (!rows) return;
    const sanitized = raw.trim();
    const currentRow = rows.find((row) => row.id === id);
    if (!currentRow) return;

    if (sanitized !== '') {
      const nextValue = Number(sanitized);
      if (!Number.isFinite(nextValue) || nextValue < 0 || nextValue > 100) {
        cancelSave(id);
        setRows((current) =>
          current?.map((row) =>
            row.id === id
              ? {
                  ...row,
                  scoreInput: raw,
                  error: 'הציון חייב להיות בין 0 ל-100',
                  saveError: undefined,
                  saveState: 'idle',
                }
              : row,
          ),
        );
        return;
      }
    }

    const nextRow: GradeRow = {
      ...currentRow,
      score: sanitized === '' ? null : Number(sanitized),
      scoreInput: sanitized,
      error: undefined,
      saveError: undefined,
      saveState: 'saving',
      updatedAt: 'מעתה',
    };
    setRows((current) => current?.map((row) => (row.id === id ? nextRow : row)));
    scheduleSave(nextRow);
  };

  const retrySave = (id: string) => {
    const row = rows?.find((entry) => entry.id === id);
    if (!row) return;
    const retrying = { ...row, saveError: undefined, saveState: 'saving' as const };
    setRows((current) => current?.map((entry) => (entry.id === id ? retrying : entry)));
    scheduleSave(retrying);
  };

  const focusNextGrade = (currentId: string) => {
    const currentIndex = (rows ?? []).findIndex((row) => row.id === currentId);
    const nextRow = rows?.[currentIndex + 1];
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
      className: 'w-60',
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
      className: 'w-40',
      cell: (row) => (
        <div className="space-y-1">
          <GradeCell
            ref={(node) => {
              gradeRefs.current[row.id] = node;
            }}
            label={`ציון עבור ${row.name}`}
            value={row.scoreInput}
            placeholder="—"
            error={row.error ?? row.saveError}
            state={
              row.error || row.saveState === 'error'
                ? 'error'
                : row.saveState === 'saving'
                  ? 'saving'
                  : row.saveState === 'saved'
                    ? 'saved'
                    : 'empty'
            }
            onChange={(event) => handleGradeChange(row.id, event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === 'ArrowDown') {
                event.preventDefault();
                focusNextGrade(row.id);
              }
            }}
            className="w-full min-w-24"
          />
          {row.saveState === 'error' && (
            <button
              type="button"
              className="text-caption text-danger-700 underline"
              onClick={() => retrySave(row.id)}
            >
              נסי שוב
            </button>
          )}
        </div>
      ),
    },
    {
      key: 'feedback',
      header: 'הערה',
      className: 'w-80',
      cell: (row) => (
        <label className="block">
          <span className="sr-only">הערה לתלמיד</span>
          <textarea
            aria-label={`הערה לתלמיד ${row.name}`}
            value={row.feedback}
            onChange={(event) =>
              setRows((current) =>
                current?.map((entry) =>
                  entry.id === row.id
                    ? { ...entry, feedback: event.target.value, updatedAt: 'מעתה' }
                    : entry,
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
      className: 'w-28',
      cell: (row) => <span className="text-body text-fg-secondary">{row.updatedAt}</span>,
    },
  ];

  return (
    <div className="space-y-4 p-4" dir="rtl">
      <PageHeader title="הזנת ציונים ומשוב" subtitle="כיתה ח1 · מתמטיקה · מבחן בשברים" />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="ממוצע כיתתי"
          value={average === null ? '—' : `${formatAverage(average)}`}
          trend="none"
          className="min-h-28"
          loading={rows === undefined && !loadError}
          data-testid="average-metric"
        />
        <MetricCard
          label="ללא ציון"
          value={String(ungradedCount)}
          trend="none"
          className="min-h-28"
          loading={rows === undefined && !loadError}
        />
        <MetricCard
          label="אחוזי השלמה"
          value={
            !rows?.length
              ? '0%'
              : `${Math.round((rows.filter((row) => row.score !== null).length / rows.length) * 100)}%`
          }
          trend="up"
          trendText="השלמה מתעדכנת"
          className="min-h-28"
          loading={rows === undefined && !loadError}
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
        {loadError ? (
          <ErrorState message={loadError} onRetry={() => void load()} />
        ) : rows === undefined ? (
          <LoadingSkeleton />
        ) : rows.length === 0 ? (
          <EmptyState title="אין תלמידים להצגה" text="אין תלמידים בכיתה הזאת." />
        ) : (
          <Table
            caption="טבלת הזנת ציונים ומשוב"
            rows={rows}
            getRowId={(row) => row.id}
            columns={columns}
            className="w-full"
            wrapperClassName="max-h-screen"
          />
        )}
      </section>
    </div>
  );
}
