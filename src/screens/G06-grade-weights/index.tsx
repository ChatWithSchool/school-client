import { useEffect, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { useGetMeQuery } from '../../api/authApi';
import { useGetGradingWeightsQuery, usePutGradingWeightsMutation } from '../../api/gradingApi';
import type { WeightEntry } from '../../api/gradingApi';
import { errorMessage } from '../../api/errors';
import { canWrite } from '../../features/auth/usePermission';
import {
  Alert,
  Button,
  Card,
  PageHeader,
  Select,
  Table,
  TextField,
  type TableColumn,
} from '../../components/ui';
import { ErrorState, ForbiddenState, LoadingSkeleton } from '../../components/StateViews';
import { useToast } from '../../components/ui';
import { SUBJECTS } from '../../mocks/shared';

const TERMS = [
  { value: 'term-a', label: "מחצית א'" },
  { value: 'term-b', label: "מחצית ב'" },
];

const GRADE_LEVELS = [
  { value: 'ז', label: 'שכבה ז׳' },
  { value: 'ח', label: 'שכבה ח׳' },
  { value: 'ט', label: 'שכבה ט׳' },
];

const TYPE_LABELS: Record<WeightEntry['type'], string> = {
  exam: 'מבחן',
  quiz: 'בוחן',
  assignment: 'עבודה / מטלה',
};

type WeightRow = { type: WeightEntry['type']; label: string; percent: number };

export default function G06GradeWeights() {
  const toast = useToast();
  const token = useAppSelector((s) => s.auth.token);
  const me = useGetMeQuery(undefined, { skip: !token });
  const permission = me.data?.permissions['G06'];
  const editable = canWrite(permission);

  const [gradeLevel, setGradeLevel] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [termId, setTermId] = useState('term-a');
  const [rows, setRows] = useState<WeightRow[]>([]);
  const [validationError, setValidationError] = useState('');

  const subjectOptions = SUBJECTS.map((s) => ({ value: s.id, label: s.name }));

  const skip = !gradeLevel || !subjectId;
  const { data, isLoading, isError, error, refetch } = useGetGradingWeightsQuery(
    { gradeLevel, subjectId, termId },
    { skip },
  );

  const [putWeights, { isLoading: isSaving }] = usePutGradingWeightsMutation();

  const isClosed = termId === 'term-b';

  useEffect(() => {
    if (!data) return;
    const item = data.items[0];
    if (!item) {
      setRows([]);
      return;
    }
    setRows(
      item.weights.map((w) => ({
        type: w.type,
        label: TYPE_LABELS[w.type],
        percent: w.percent,
      })),
    );
    setValidationError('');
  }, [data]);

  const total = rows.reduce((s, r) => s + r.percent, 0);

  function handleChange(type: WeightEntry['type'], value: string) {
    const num = Math.max(0, Math.min(100, Number(value) || 0));
    setRows((prev) => prev.map((r) => (r.type === type ? { ...r, percent: num } : r)));
    setValidationError('');
  }

  async function handleSave() {
    if (total !== 100) {
      setValidationError(`סכום המשקלים הוא ${total}% – חייב להיות בדיוק 100%`);
      return;
    }
    try {
      await putWeights({
        gradeLevel,
        subjectId,
        termId,
        weights: rows.map(({ type, percent }) => ({ type, percent })),
      }).unwrap();
      toast({ tone: 'success', message: 'המשקלים נשמרו בהצלחה' });
    } catch {
      toast({ tone: 'danger', message: 'שגיאה בשמירת המשקלים' });
    }
  }

  const columns: TableColumn<WeightRow>[] = [
    { key: 'label', header: 'סוג הערכה', cell: (row) => row.label },
    {
      key: 'percent',
      header: 'משקל %',
      numeric: true,
      className: 'w-36',
      cell: (row) =>
        isClosed || !editable ? (
          <span>{row.percent}%</span>
        ) : (
          <TextField
            type="number"
            label="משקל"
            min={0}
            max={100}
            value={String(row.percent)}
            onChange={(e) => handleChange(row.type, e.target.value)}
            className="w-24"
          />
        ),
    },
  ];

  if (!token || me.isLoading) return <LoadingSkeleton />;
  if (me.isError)
    return <ErrorState message={errorMessage(me.error)} onRetry={() => void me.refetch()} />;
  if (!permission) return <ForbiddenState />;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="משקלים לציון סופי"
        breadcrumbs={[{ label: 'ציונים' }, { label: 'משקלים לציון סופי' }]}
      />

      <div className="flex flex-wrap gap-4">
        <Select
          label="שכבה"
          options={GRADE_LEVELS}
          value={gradeLevel}
          onValueChange={setGradeLevel}
          placeholder="בחרו שכבה"
          className="w-40"
        />
        <Select
          label="מקצוע"
          options={subjectOptions}
          value={subjectId}
          onValueChange={setSubjectId}
          placeholder="בחרו מקצוע"
          className="w-48"
        />
        <Select
          label="מחצית"
          options={TERMS}
          value={termId}
          onValueChange={setTermId}
          className="w-48"
        />
      </div>

      {!skip && isError && (
        <ErrorState message={errorMessage(error)} onRetry={() => void refetch()} />
      )}

      {skip && (
        <p className="text-body text-fg-secondary">בחרו שכבה, מקצוע ומחצית כדי לראות את המשקלים.</p>
      )}

      {!skip && isLoading && <LoadingSkeleton rows={4} />}

      {!skip && !isLoading && !isError && rows.length === 0 && (
        <p className="text-body text-fg-secondary">לא נמצאו משקלים לבחירה זו.</p>
      )}

      {!skip && !isLoading && !isError && rows.length > 0 && (
        <>
          {isClosed && (
            <Alert tone="info" title="מחצית סגורה">
              המחצית נעולה לעריכה. לא ניתן לשנות משקלים.
            </Alert>
          )}

          <Card padding="M" className="flex flex-col gap-4">
            <p className="text-h3 text-fg">משקלים</p>
            <Table
              caption="טבלת משקלים לציון סופי"
              columns={columns}
              rows={rows}
              getRowId={(r) => r.type}
            />
            <Alert tone="info">סה״כ: {total}%</Alert>
          </Card>

          {validationError && <Alert tone="danger">{validationError}</Alert>}

          {!isClosed && editable && (
            <div className="flex gap-3">
              <Button onClick={handleSave} loading={isSaving}>
                שמור
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
