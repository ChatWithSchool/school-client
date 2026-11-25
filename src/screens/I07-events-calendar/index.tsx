import { useState } from 'react';
import { useGetMeQuery } from '../../api/authApi';
import { useCreateEventMutation, useListEventsQuery } from '../../api/eventsApi';
import type { SchoolEvent } from '../../api/types';
import { useAppSelector } from '../../app/hooks';
import { ErrorState, ForbiddenState, LoadingSkeleton } from '../../components/StateViews';
import {
  Alert,
  Badge,
  Button,
  Card,
  DatePicker,
  EmptyState,
  Modal,
  PageHeader,
  Select,
  Table,
  TextField,
  type BadgeTone,
} from '../../components/ui';
import { canWrite, usePermission } from '../../features/auth/usePermission';

type EventType = SchoolEvent['type'];

const eventTypes: { value: EventType; label: string; tone: BadgeTone }[] = [
  { value: 'holiday', label: 'חג', tone: 'success' },
  { value: 'event', label: 'אירוע', tone: 'primary' },
  { value: 'parents_day', label: 'ימי הורים', tone: 'warning' },
  { value: 'vacation', label: 'חופשה', tone: 'info' },
];

const gradeOptions = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'יא', 'יב'].map(
  (grade) => ({
    value: grade,
    label: grade,
  }),
);

type FormState = {
  title: string;
  type: EventType;
  start: string;
  end: string;
  gradeLevels: string[];
};

const pad = (value: number) => String(value).padStart(2, '0');

/** YYYY-MM-DD לפי השעון המקומי (toISOString היה מזיז יום אחורה בישראל) */
const toDateString = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const fromDateString = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const formatDate = (value: string) => value.split('-').reverse().join('/');

const emptyForm = (): FormState => {
  const today = toDateString(new Date());
  return { title: '', type: 'event', start: today, end: today, gradeLevels: [] };
};

const columns = [
  { key: 'title', header: 'כותרת', cell: (event: SchoolEvent) => event.title },
  {
    key: 'type',
    header: 'סוג',
    cell: (event: SchoolEvent) => {
      const info = eventTypes.find((item) => item.value === event.type);
      return <Badge tone={info?.tone ?? 'neutral'}>{info?.label ?? event.type}</Badge>;
    },
  },
  {
    key: 'start',
    header: 'תאריך התחלה',
    cell: (event: SchoolEvent) => formatDate(event.startDate),
  },
  { key: 'end', header: 'תאריך סיום', cell: (event: SchoolEvent) => formatDate(event.endDate) },
  {
    key: 'scope',
    header: 'חל על',
    cell: (event: SchoolEvent) =>
      event.gradeLevels.length ? event.gradeLevels.join(', ') : 'כל המוסד',
  },
];

export default function Screen() {
  const level = usePermission('I07');
  const canManage = canWrite(level);
  // usePermission מחזיר undefined גם בזמן הטעינה וגם כשאין הרשאה. הבקשה ל-me משותפת (RTK Query) ואינה נשלחת פעמיים.
  const token = useAppSelector((state) => state.auth.token);
  const { isLoading: loadingPermissions } = useGetMeQuery(undefined, { skip: !token });

  const { data, isError } = useListEventsQuery();
  const [createEvent] = useCreateEventMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [titleError, setTitleError] = useState('');
  const [formError, setFormError] = useState('');

  if (loadingPermissions) {
    return <LoadingSkeleton />;
  }

  if (level === undefined) {
    return <ForbiddenState />;
  }

  const updateForm = (patch: Partial<FormState>) =>
    setForm((current) => ({ ...current, ...patch }));

  const openForm = () => {
    setForm(emptyForm());
    setTitleError('');
    setFormError('');
    setIsFormOpen(true);
  };

  const saveEvent = async () => {
    const title = form.title.trim();
    setTitleError('');
    setFormError('');

    if (title.length < 2) {
      setTitleError('חובה להזין כותרת (לפחות 2 תווים)');
      return false;
    }

    if (!form.start || !form.end) {
      setFormError('חובה לבחור תאריך התחלה ותאריך סיום');
      return false;
    }

    if (form.end < form.start) {
      setFormError('תאריך הסיום לא יכול להיות לפני תאריך ההתחלה');
      return false;
    }

    try {
      await createEvent({
        title,
        type: form.type,
        startDate: form.start,
        endDate: form.end,
        gradeLevels: form.gradeLevels,
      }).unwrap();
      return true;
    } catch {
      setFormError('אירעה שגיאה בשמירה. נסו שוב.');
      return false;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="יומן אירועים בית ספרי"
        subtitle="חגים, אירועים, ימי הורים וחופשות"
        actions={canManage ? <Button onClick={openForm}>הוספת אירוע</Button> : undefined}
      />

      {isError ? (
        <ErrorState message="אירעה שגיאה בטעינת האירועים. נסו שוב." />
      ) : (
        <Table
          caption="רשימת אירועי בית הספר"
          rows={data?.items}
          getRowId={(event) => event.id}
          columns={columns}
          empty={<EmptyState variant="first-use" title="אין אירועים ביומן" />}
        />
      )}

      <Card padding="M">
        <h2 className="mb-3 text-h2 text-fg">מקרא סוגי אירועים</h2>
        <ul className="flex flex-wrap gap-3">
          {eventTypes.map((item) => (
            <li key={item.value}>
              <Badge tone={item.tone}>{item.label}</Badge>
            </li>
          ))}
        </ul>
      </Card>

      <Modal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        title="הוספת אירוע"
        description="הגדירו את סוג האירוע, התאריכים וההיקף שלו."
        size="M"
        footer="double"
        confirmLabel="הוסף אירוע"
        onConfirm={saveEvent}
      >
        <div className="space-y-4">
          <TextField
            label="כותרת האירוע"
            required
            value={form.title}
            onChange={(event) => updateForm({ title: event.target.value })}
            placeholder="לדוגמה: חופשת פסח"
            error={titleError || undefined}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Select
              label="סוג אירוע"
              required
              options={eventTypes}
              value={form.type}
              onValueChange={(value) => updateForm({ type: value as EventType })}
              placeholder="בחרו סוג"
            />

            <Select
              label="חל על שכבות"
              multi
              options={gradeOptions}
              value={form.gradeLevels}
              onValueChange={(value) => updateForm({ gradeLevels: value })}
              placeholder="כל המוסד"
              hint="אם לא נבחרה שכבה, האירוע חל על כל המוסד."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <DatePicker
              mode="single"
              label="תאריך התחלה"
              value={form.start ? fromDateString(form.start) : null}
              onChange={(value) => updateForm({ start: value ? toDateString(value) : '' })}
            />

            <DatePicker
              mode="single"
              label="תאריך סיום"
              value={form.end ? fromDateString(form.end) : null}
              onChange={(value) => updateForm({ end: value ? toDateString(value) : '' })}
            />
          </div>

          {formError ? <Alert tone="danger">{formError}</Alert> : null}
        </div>
      </Modal>
    </div>
  );
}
