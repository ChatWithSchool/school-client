import { useEffect, useState } from 'react';
import { Alert, Button, PageHeader, Select, Table, type TableColumn } from '../../components/ui';
import { ErrorState, ForbiddenState, LoadingSkeleton } from '../../components/StateViews';
import { useToast } from '../../components/ui';
import { usePermission, canWrite } from '../../features/auth/usePermission';
import { CLASSES, shared, type GradingWeight } from '../../mocks/shared';

const TERMS = [
  { value: 'א', label: "מחצית א'" },
  { value: 'ב', label: "מחצית ב'" },
];

const TYPE_LABELS: Record<GradingWeight['assessmentType'], string> = {
  exam: 'מבחן',
  quiz: 'בוחן',
  assignment: 'עבודה / מטלה',
};

type WeightRow = {
  assessmentType: GradingWeight['assessmentType'];
  label: string;
  weight: number;
};

export default function G06GradeWeights() {
  const toast = useToast();
  const permission = usePermission('G06');
  const editable = canWrite(permission);
  const [classId, setClassId] = useState('');
  const [term, setTerm] = useState('א');
  const [status, setStatus] = useState<'idle' | 'loading' | 'saving' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [rows, setRows] = useState<WeightRow[]>([]);
  const [validationError, setValidationError] = useState('');

  const classOptions = CLASSES.map((c) => ({ value: c.id, label: `כיתה ${c.name}` }));

  const isClosed =
    !!classId &&
    (shared.termStatuses.find((t) => t.classId === classId && t.term === term)?.closed ?? false);

  useEffect(() => {
    if (!classId) {
      setRows([]);
      return;
    }
    setStatus('loading');
    setValidationError('');
    const timer = setTimeout(() => {
      try {
        const weights = shared.gradingWeights.filter(
          (w) => w.classId === classId && w.term === term,
        );
        setRows(
          weights.map((w) => ({
            assessmentType: w.assessmentType,
            label: TYPE_LABELS[w.assessmentType],
            weight: w.weight,
          })),
        );
        setStatus('idle');
      } catch {
        setErrorMsg('שגיאה בטעינת המשקלים');
        setStatus('error');
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [classId, term]);

  const total = rows.reduce((s, r) => s + r.weight, 0);

  function handleWeightChange(type: GradingWeight['assessmentType'], value: string) {
    const num = Math.max(0, Math.min(100, Number(value) || 0));
    setRows((prev) => prev.map((r) => (r.assessmentType === type ? { ...r, weight: num } : r)));
    setValidationError('');
  }

  function handleSave() {
    if (total !== 100) {
      setValidationError(`סכום המשקלים הוא ${total}% – חייב להיות בדיוק 100%`);
      return;
    }
    setStatus('saving');
    setTimeout(() => {
      rows.forEach(({ assessmentType, weight }) => {
        const existing = shared.gradingWeights.find(
          (w) => w.classId === classId && w.term === term && w.assessmentType === assessmentType,
        );
        if (existing) existing.weight = weight;
      });
      setStatus('idle');
      toast({ tone: 'success', message: 'המשקלים נשמרו בהצלחה' });
    }, 400);
  }

  const columns: TableColumn<WeightRow>[] = [
    {
      key: 'label',
      header: 'סוג הערכה',
      cell: (row) => row.label,
    },
    {
      key: 'weight',
      header: 'משקל %',
      numeric: true,
      className: 'w-36',
      cell: (row) =>
        isClosed ? (
          <span>{row.weight}%</span>
        ) : (
          <input
            type="number"
            min={0}
            max={100}
            value={row.weight}
            onChange={(e) => handleWeightChange(row.assessmentType, e.target.value)}
            className="w-20 rounded-md border border-line bg-surface px-2 py-1 text-body text-fg focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        ),
    },
  ];

  if (permission === undefined) return <LoadingSkeleton />;
  if (!permission) return <ForbiddenState />;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="משקלים לציון סופי" />

      <div className="flex flex-wrap gap-4">
        <Select
          label="כיתה"
          options={classOptions}
          value={classId}
          onValueChange={setClassId}
          placeholder="בחרו כיתה"
          className="w-48"
        />
        <Select
          label="מחצית"
          options={TERMS}
          value={term}
          onValueChange={setTerm}
          className="w-48"
        />
      </div>

      {status === 'error' && (
        <ErrorState
          message={errorMsg}
          onRetry={() => {
            setStatus('idle');
            setClassId('');
          }}
        />
      )}

      {!classId && status !== 'error' && (
        <p className="text-body text-fg-secondary">בחרו כיתה ומחצית כדי לראות את המשקלים.</p>
      )}

      {classId && status === 'loading' && <LoadingSkeleton rows={4} />}

      {classId && status !== 'loading' && status !== 'error' && rows.length === 0 && (
        <p className="text-body text-fg-secondary">לא נמצאו משקלים לכיתה ומחצית שנבחרו.</p>
      )}

      {classId && status !== 'loading' && status !== 'error' && rows.length > 0 && (
        <>
          {isClosed && (
            <Alert tone="info" title="מחצית סגורה">
              המחצית נעולה לעריכה. לא ניתן לשנות משקלים.
            </Alert>
          )}

          <Table
            caption="טבלת משקלים לציון סופי"
            columns={columns}
            rows={rows}
            getRowId={(r) => r.assessmentType}
          />

          <div
            className={`flex items-center justify-between rounded-lg border px-4 py-3 text-body-strong ${
              total === 100
                ? 'border-success-100 bg-success-50 text-success-700'
                : 'border-warning-100 bg-warning-50 text-warning-700'
            }`}
          >
            <span>סה״כ</span>
            <span>{total}%</span>
          </div>

          {validationError && <Alert tone="danger">{validationError}</Alert>}

          {!isClosed && editable && (
            <div className="flex gap-3">
              <Button onClick={handleSave} loading={status === 'saving'}>
                שמור
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
