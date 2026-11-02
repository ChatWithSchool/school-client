import { useRef, useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  useCreateAssessmentMutation,
  useListAssessmentsQuery,
  useUpdateAssessmentMutation,
  type AssessmentInput,
} from '../../api/assessmentsApi';
import { useGetMeQuery } from '../../api/authApi';
import { errorMessage, fieldErrors } from '../../api/errors';
import { useGetMyTeachingQuery, type TeachingCard } from '../../api/teachingApi';
import type { Assessment } from '../../api/types';
import { ErrorState, ForbiddenState } from '../../components/StateViews';
import {
  Alert,
  Badge,
  Button,
  Card,
  DatePicker,
  EmptyState,
  PageHeader,
  Select,
  Table,
  TextField,
  useToast,
  type BadgeTone,
  type TableColumn,
} from '../../components/ui';
import { canWrite, usePermission } from '../../features/auth/usePermission';
import { pathFor } from '../../routes/screens';

type Kind = Assessment['type'];

const KIND: Record<Kind, { label: string; tone: BadgeTone }> = {
  exam: { label: 'מבחן', tone: 'primary' },
  quiz: { label: 'בוחן', tone: 'neutral' },
  assignment: { label: 'מטלה', tone: 'neutral' },
};
const KIND_OPTIONS = (Object.keys(KIND) as Kind[]).map((k) => ({ value: k, label: KIND[k].label }));

type Form = {
  classId: string;
  title: string;
  type: Kind | '';
  subjectId: string;
  weight: string;
  date: Date | null;
};
const EMPTY: Form = { classId: '', title: '', type: '', subjectId: '', weight: '', date: null };

/** yyyy-mm-dd of the local day, and back. */
const pad = (n: number) => String(n).padStart(2, '0');
const toIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromIso = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
/** "10.10": the day and the month, as in the Figma table. */
const shortDate = (s: string) => s.split('-').reverse().slice(0, 2).join('.');

const nameOf = (cards: TeachingCard[], classId: string, subjectId: string) => {
  const c = cards.find((x) => x.classId === classId && x.subjectId === subjectId);
  return [c?.className ?? classId, c?.subjectName ?? subjectId].join(' · ');
};

/** The checks of the form before it is sent; the server checks them again. */
function validate(f: Form) {
  const out: Record<string, string> = {};
  if (!f.classId) out.classId = 'חובה לבחור כיתה';
  if (f.title.trim().length < 2) out.title = 'חובה שם (לפחות 2 תווים)';
  if (!f.type) out.type = 'חובה לבחור סוג';
  if (!f.subjectId) out.subjectId = 'חובה לבחור מקצוע';
  const w = Number(f.weight);
  if (f.weight.trim() && !(Number.isFinite(w) && w >= 0 && w <= 100))
    out.weight = 'משקל בין 0 ל-100';
  return out;
}

/** G04 · Assessments: the teacher's tests and assignments, and a form to create or edit one. */
export default function Assessments() {
  const level = usePermission('G04');
  const { data: me } = useGetMeQuery();
  const { data, isError, error, refetch } = useListAssessmentsQuery();
  // a teacher chooses only her own classes and subjects (management has no G08)
  const { data: teaching } = useGetMyTeachingQuery(undefined, { skip: level !== 'scoped' });
  const cards = teaching?.items ?? [];

  const [create, { isLoading: creating }] = useCreateAssessmentMutation();
  const [update, { isLoading: updating }] = useUpdateAssessmentMutation();
  const toast = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const first = useRef<HTMLButtonElement>(null);

  // after the render that opens the form (a locked select cannot take focus before it)
  const focusForm = () => setTimeout(() => first.current?.focus());

  const [editing, setEditing] = useState<Assessment | null>(null);
  // from G08 ("מבחן חדש") the class and subject come already chosen
  const [form, setForm] = useState<Form>(() => ({
    ...EMPTY,
    classId: params.get('classId') ?? '',
    subjectId: params.get('subjectId') ?? '',
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [saved, setSaved] = useState<{ id: string; classId: string; subjectId: string } | null>(
    null,
  );

  // the server answers 403; the role's permissions also say so before the list arrives
  if ((error as { status?: number } | undefined)?.status === 403 || (me && !level))
    return <ForbiddenState />;

  // a teacher sees her own assessments, management sees all of them
  const rows = data?.items.filter((a) => level !== 'scoped' || a.teacherId === me?.user.id);
  const writable = canWrite(level) && level === 'scoped';
  const studentsOf = (classId: string) => cards.find((c) => c.classId === classId)?.studentCount;

  // the weights of each class and subject must add up to 100 (before the report cards)
  const sums = new Map<string, { classId: string; subjectId: string; total: number }>();
  for (const a of rows ?? []) {
    const key = `${a.classId}|${a.subjectId}`;
    const s = sums.get(key) ?? { classId: a.classId, subjectId: a.subjectId, total: 0 };
    s.total += a.weight ?? 0;
    sums.set(key, s);
  }
  const offWeights = [...sums.values()].filter((s) => s.total !== 100);

  const classOptions = [...new Map(cards.map((c) => [c.classId, c.className ?? c.classId]))].map(
    ([value, label]) => ({ value, label }),
  );
  const subjectOptions = [
    ...new Map(
      cards
        .filter((c) => !form.classId || c.classId === form.classId)
        .map((c) => [c.subjectId, c.subjectName ?? c.subjectId]),
    ),
  ].map(([value, label]) => ({ value, label }));
  // after grades were entered the assessment stays in its class and subject
  const locked = Boolean(editing?.gradedCount);

  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors(({ [key]: _, ...rest }) => rest);
  };

  const chooseClass = (classId: string) => {
    const keeps = cards.some((c) => c.classId === classId && c.subjectId === form.subjectId);
    setForm((f) => ({ ...f, classId, subjectId: keeps ? f.subjectId : '' }));
    setErrors(({ classId: _, ...rest }) => rest);
  };

  const startNew = () => {
    setEditing(null);
    setForm(EMPTY);
    setErrors({});
    setFormError('');
    focusForm();
  };

  const startEdit = (a: Assessment) => {
    setEditing(a);
    setForm({
      classId: a.classId,
      title: a.title,
      type: a.type,
      subjectId: a.subjectId,
      weight: a.weight === undefined ? '' : String(a.weight),
      date: a.date ? fromIso(a.date) : null,
    });
    setErrors({});
    setFormError('');
    setSaved(null);
    focusForm();
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    setFormError('');
    if (Object.keys(found).length) return;
    const body: AssessmentInput = {
      title: form.title.trim(),
      type: form.type as Kind,
      classId: form.classId,
      subjectId: form.subjectId,
      date: form.date ? toIso(form.date) : null,
      weight: form.weight.trim() ? Number(form.weight) : undefined,
    };
    try {
      if (editing) {
        await update({ id: editing.id, ...body }).unwrap();
        toast({ tone: 'success', message: 'השינויים נשמרו' });
        setSaved(null);
      } else {
        const { id } = await create(body).unwrap();
        toast({ tone: 'success', message: 'המבחן נוצר' });
        setSaved({ id, classId: body.classId, subjectId: body.subjectId });
      }
      setEditing(null);
      setForm(EMPTY);
    } catch (err) {
      const fields = fieldErrors(err);
      if (Object.keys(fields).length) setErrors(fields);
      else setFormError(errorMessage(err));
    }
  }

  const columns: TableColumn<Assessment>[] = [
    {
      key: 'title',
      header: 'שם',
      cell: (a) => <span className="text-body-strong">{a.title}</span>,
    },
    {
      key: 'type',
      header: 'סוג',
      cell: (a) => (
        <Badge tone={KIND[a.type].tone} size="S">
          {KIND[a.type].label}
        </Badge>
      ),
      className: 'w-28',
    },
    {
      key: 'date',
      header: 'תאריך',
      cell: (a) => (a.date ? shortDate(a.date) : '—'),
      numeric: true,
      className: 'w-28',
    },
    {
      key: 'weight',
      header: 'משקל',
      cell: (a) => `${a.weight ?? 0}%`,
      numeric: true,
      className: 'w-28',
    },
    {
      key: 'graded',
      header: 'ציונים הוזנו',
      cell: (a) => {
        const total = studentsOf(a.classId);
        return total === undefined ? (a.gradedCount ?? 0) : `${a.gradedCount ?? 0}/${total}`;
      },
      numeric: true,
      className: 'w-28',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="ניהול מבחנים ומטלות"
        actions={
          writable && (
            <Button icon="leading" iconName="plus" onClick={startNew}>
              יצירת חדש
            </Button>
          )
        }
      />

      <Card padding="M" className="space-y-4">
        <h2 className="text-h3 text-fg">רשימה</h2>
        {offWeights.length > 0 && (
          <Alert tone="warning" title="סכום המשקלים צריך להיות 100%">
            <ul>
              {offWeights.map((s) => (
                <li key={`${s.classId}|${s.subjectId}`}>
                  {nameOf(cards, s.classId, s.subjectId)}: כרגע{' '}
                  <span className="num">{s.total}%</span>
                </li>
              ))}
            </ul>
          </Alert>
        )}
        {isError ? (
          <ErrorState message={errorMessage(error)} onRetry={refetch} />
        ) : (
          <Table
            caption="מבחנים ומטלות"
            columns={columns}
            rows={rows}
            getRowId={(a) => a.id}
            onRowClick={writable ? startEdit : undefined}
            empty={<EmptyState title="עוד אין מבחנים" text="מבחן שתיצרי יופיע כאן." />}
            wrapperClassName="-mx-4 -mb-4"
          />
        )}
      </Card>

      {writable && (
        <Card padding="M">
          <form onSubmit={onSubmit} noValidate className="space-y-4" aria-labelledby="g04-form">
            <h2 id="g04-form" className="text-h3 text-fg">
              {editing ? 'עריכה' : 'יצירה'}
            </h2>
            {saved && (
              <Alert tone="success" dismissible onDismiss={() => setSaved(null)}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span>המבחן נוצר, ואפשר להזין לו ציונים.</span>
                  <Button
                    size="S"
                    variant="secondary"
                    onClick={() =>
                      navigate(
                        `${pathFor('G01')}?${new URLSearchParams({
                          classId: saved.classId,
                          subjectId: saved.subjectId,
                          assessmentId: saved.id,
                        })}`,
                      )
                    }
                  >
                    להזנת ציונים
                  </Button>
                </div>
              </Alert>
            )}
            {formError && <ErrorState message={formError} />}
            <div className="grid grid-cols-2 gap-x-3 gap-y-4">
              <Select
                ref={first}
                label="כיתה / קבוצה"
                required
                placeholder="בחירה"
                options={classOptions}
                value={form.classId}
                onValueChange={chooseClass}
                disabled={locked}
                hint={locked ? 'כבר הוזנו ציונים, אי אפשר להחליף כיתה' : undefined}
                error={errors.classId}
              />
              <TextField
                label="שם"
                required
                placeholder="הקלידו כאן"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                error={errors.title}
              />
              <Select
                label="סוג"
                required
                placeholder="בחירה"
                options={KIND_OPTIONS}
                value={form.type}
                onValueChange={(v) => set('type', v as Kind)}
                error={errors.type}
              />
              <Select
                label="מקצוע"
                required
                placeholder="בחירה"
                options={subjectOptions}
                value={form.subjectId}
                onValueChange={(v) => set('subjectId', v)}
                disabled={locked}
                error={errors.subjectId}
              />
              <TextField
                label="משקל %"
                placeholder="הקלידו כאן"
                inputMode="numeric"
                value={form.weight}
                onChange={(e) => set('weight', e.target.value)}
                error={errors.weight}
              />
              <DatePicker
                label="תאריך"
                value={form.date}
                onChange={(d) => set('date', d)}
                error={errors.date}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" loading={creating || updating}>
                {editing ? 'שמירת שינויים' : 'יצירה'}
              </Button>
              {editing && (
                <Button variant="secondary" onClick={startNew}>
                  ביטול
                </Button>
              )}
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
