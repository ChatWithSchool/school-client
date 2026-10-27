import { useState, type ChangeEvent, type FormEvent } from 'react';
import { ForbiddenState } from '../../components/StateViews';
import {
  Alert,
  Badge,
  Button,
  DatePicker,
  EmptyState,
  PageHeader,
  Table,
  Tabs,
  TextField,
  useToast,
  type TableColumn,
} from '../../components/ui';
import { canWrite, usePermission } from '../../features/auth/usePermission';

// Sprint 1: mock data kept in the screen. The API (GET/PUT /institutions/{id}, POST /terms)
// is connected in sprint 4.
type Institution = { name: string; address: string; phone: string; email: string };
type Term = { id: string; name: string; start: Date; end: Date };
type TermErrors = { name?: string; start?: string; end?: string };

const INITIAL_INSTITUTION: Institution = {
  name: 'בית ספר לדוגמה',
  address: 'רחוב הדוגמה 1, תל אביב',
  phone: '03-1234567',
  email: 'office@school.example',
};

const INITIAL_TERMS: Term[] = [
  { id: 't1', name: "מחצית א'", start: new Date(2026, 8, 1), end: new Date(2027, 0, 31) },
  { id: 't2', name: "מחצית ב'", start: new Date(2027, 1, 1), end: new Date(2027, 5, 30) },
];

const fmt = (d: Date) => d.toLocaleDateString('he-IL');
const overlaps = (a: Term, b: Term) => a.start <= b.end && b.start <= a.end;

function TermStatus({ term }: { term: Term }) {
  const now = new Date();
  if (now < term.start) return <Badge tone="info">עתידי</Badge>;
  if (now > term.end) return <Badge tone="neutral">הסתיים</Badge>;
  return <Badge tone="success">פעיל</Badge>;
}

const columns: TableColumn<Term>[] = [
  { key: 'name', header: 'שם', cell: (t) => t.name },
  { key: 'start', header: 'תאריך התחלה', cell: (t) => fmt(t.start), numeric: true },
  { key: 'end', header: 'תאריך סיום', cell: (t) => fmt(t.end), numeric: true },
  { key: 'status', header: 'סטטוס', cell: (t) => <TermStatus term={t} /> },
];

export default function Screen() {
  const level = usePermission('I03');
  const toast = useToast();
  const editable = canWrite(level);

  // details tab
  const [saved, setSaved] = useState<Institution>(INITIAL_INSTITUTION);
  const [form, setForm] = useState<Institution>(INITIAL_INSTITUTION);
  const [nameError, setNameError] = useState<string>();

  // terms tab
  const [terms, setTerms] = useState<Term[]>(INITIAL_TERMS);
  const [newName, setNewName] = useState('');
  const [newStart, setNewStart] = useState<Date | null>(null);
  const [newEnd, setNewEnd] = useState<Date | null>(null);
  const [termErrors, setTermErrors] = useState<TermErrors>({});
  const [overlapMessage, setOverlapMessage] = useState<string>();

  if (!level) return <ForbiddenState />;

  const setField = (key: keyof Institution) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value });

  function saveDetails(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setNameError('חובה למלא שם');
      return;
    }
    setNameError(undefined);
    setSaved(form);
    toast({ tone: 'success', message: 'פרטי המוסד נשמרו' });
  }

  function cancelDetails() {
    setForm(saved);
    setNameError(undefined);
  }

  function addTerm(e: FormEvent) {
    e.preventDefault();
    setOverlapMessage(undefined);
    const errs: TermErrors = {};
    if (!newName.trim()) errs.name = 'חובה למלא שם';
    if (!newStart) errs.start = 'חובה לבחור תאריך התחלה';
    if (!newEnd) errs.end = 'חובה לבחור תאריך סיום';
    if (newStart && newEnd && newEnd < newStart)
      errs.end = 'תאריך הסיום לא יכול להיות לפני תאריך ההתחלה';
    setTermErrors(errs);
    if (Object.keys(errs).length || !newStart || !newEnd) return;

    const candidate: Term = {
      id: `t${Date.now()}`,
      name: newName.trim(),
      start: newStart,
      end: newEnd,
    };
    const clash = terms.find((t) => overlaps(t, candidate));
    if (clash) {
      setOverlapMessage(
        `המחזור חופף ל"${clash.name}" (${fmt(clash.start)} – ${fmt(clash.end)}). מחזורי הערכה לא יכולים לחפוף, ולכן המחזור לא נוסף.`,
      );
      return;
    }
    setTerms([...terms, candidate].sort((a, b) => a.start.getTime() - b.start.getTime()));
    setNewName('');
    setNewStart(null);
    setNewEnd(null);
    toast({ tone: 'success', message: 'מחזור ההערכה נוסף' });
  }

  const detailsTab = (
    <form onSubmit={saveDetails} noValidate className="max-w-xl space-y-4">
      <TextField
        label="שם"
        required
        value={form.name}
        onChange={setField('name')}
        error={nameError}
        readOnly={!editable}
      />
      <TextField
        label="כתובת"
        value={form.address}
        onChange={setField('address')}
        readOnly={!editable}
      />
      <TextField
        label="טלפון"
        value={form.phone}
        onChange={setField('phone')}
        readOnly={!editable}
      />
      <TextField
        label="אימייל ליצירת קשר"
        type="email"
        value={form.email}
        onChange={setField('email')}
        readOnly={!editable}
      />
      {editable && (
        <div className="flex items-center gap-2">
          <Button type="submit">שמור</Button>
          <Button variant="secondary" onClick={cancelDetails}>
            בטל שינויים
          </Button>
        </div>
      )}
    </form>
  );

  const termsTab = (
    <div className="space-y-6">
      <Table
        caption="מחזורי הערכה"
        columns={columns}
        rows={terms}
        getRowId={(t) => t.id}
        empty={<EmptyState title="עוד לא הוגדרו מחזורים" text="הוסיפו מחזור הערכה ראשון." />}
      />
      {editable && (
        <form onSubmit={addTerm} noValidate className="max-w-xl space-y-4">
          <h2 className="text-h3 text-fg">הוספת מחזור</h2>
          {overlapMessage && (
            <Alert tone="danger" title="חפיפה בין מחזורים">
              {overlapMessage}
            </Alert>
          )}
          <TextField
            label="שם"
            required
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            error={termErrors.name}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <DatePicker
              label="תאריך התחלה"
              required
              value={newStart}
              onChange={setNewStart}
              error={termErrors.start}
            />
            <DatePicker
              label="תאריך סיום"
              required
              value={newEnd}
              onChange={setNewEnd}
              error={termErrors.end}
            />
          </div>
          <Button type="submit" icon="leading" iconName="plus">
            הוסף מחזור
          </Button>
        </form>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="פרטי המוסד והגדרות" subtitle="פרטי בית הספר ומחזורי הערכה" />
      <Tabs
        label="הגדרות המוסד"
        items={[
          { value: 'details', label: 'פרטים', content: detailsTab },
          { value: 'year', label: 'שנת לימודים', disabled: true },
          { value: 'terms', label: 'מחזורי הערכה', content: termsTab },
        ]}
      />
    </div>
  );
}
