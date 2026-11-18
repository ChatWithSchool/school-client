import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useGetMeQuery } from '../../api/authApi';
import { useAppSelector } from '../../app/hooks';
import { Icon } from '../../components/Icon';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  EmptyState,
  PageHeader,
  Select,
  Table,
  TextArea,
  TextField,
  useToast,
} from '../../components/ui';
import { pathFor } from '../../routes/screens';
import { text } from '../../styles/recipes';
import { DEFAULT_STUDENT_ID, findStudent, fullName } from '../S03-student-card/mock';
import { studentCardPath } from '../S03-student-card/paths';
import {
  KIND_LABEL,
  notesFor,
  shortDate,
  todayIso,
  type BehaviorNote,
  type NoteKind,
} from './mock';

const KIND_TONE: Record<NoteKind, 'success' | 'warning' | 'neutral'> = {
  positive: 'success',
  discipline: 'warning',
  other: 'neutral',
};

type Props = {
  /** Set by the student card (S03) when this screen is shown inside its "behavior notes" tab. */
  studentId?: string;
  /** Inside S03: no page header (S03 already has the h1 and the breadcrumbs). */
  embedded?: boolean;
};

/**
 * S06 - behavior notes of one student: the list of notes and the "new note" form.
 * Stand-alone route: /students/s06?student=<id>. Inside S03 it is the "behavior notes" tab.
 */
export default function Screen({ studentId, embedded = false }: Props) {
  const [params] = useSearchParams();
  const id = studentId ?? params.get('student') ?? DEFAULT_STUDENT_ID;
  // key: switching to another student starts from that student's notes and an empty form
  return <BehaviorNotes key={id} studentId={id} embedded={embedded} />;
}

function BehaviorNotes({ studentId, embedded }: { studentId: string; embedded: boolean }) {
  const toast = useToast();
  const token = useAppSelector((s) => s.auth.token);
  const { data: me } = useGetMeQuery(undefined, { skip: !token });
  // a read-only role sees the list but not the form
  const readOnly = me?.permissions.S06 === 'read';
  const authorName = me ? `${me.user.firstName} ${me.user.lastName}` : 'אני';

  const student = findStudent(studentId);
  const [notes, setNotes] = useState<BehaviorNote[]>(() => notesFor(studentId));

  const [kind, setKind] = useState<NoteKind | ''>('');
  const [severity, setSeverity] = useState('');
  const [description, setDescription] = useState('');
  const [visibleToParent, setVisibleToParent] = useState(false);
  const [errors, setErrors] = useState<{ kind?: string; description?: string }>({});

  // stand-alone (S06): the form is always shown. Inside S03 (S03.3): it opens with the add button
  const [formOpen, setFormOpen] = useState(!embedded);

  const formRef = useRef<HTMLFormElement>(null);
  const kindRef = useRef<HTMLButtonElement>(null);

  const goToForm = () => {
    setFormOpen(true);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    kindRef.current?.focus();
  };

  // the form of the embedded version is not in the page until it is opened
  useEffect(() => {
    if (embedded && formOpen) kindRef.current?.focus();
  }, [embedded, formOpen]);

  const reset = () => {
    setKind('');
    setSeverity('');
    setDescription('');
    setVisibleToParent(false);
    setErrors({});
    if (embedded) setFormOpen(false);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!kind) next.kind = 'יש לבחור סוג הערה';
    if (!description.trim()) next.description = 'יש למלא תיאור';
    setErrors(next);
    if (next.kind || next.description || !kind) return;

    const note: BehaviorNote = {
      id: `n-${Date.now()}`,
      date: todayIso(),
      kind,
      severity: severity.trim(),
      authorName,
      visibleToParent,
      description: description.trim(),
    };
    setNotes((current) => [note, ...current]); // every note carries its author and date
    reset();
    toast({ tone: 'success', message: 'ההערה נשמרה' });
  };

  const addButton = !readOnly && !(embedded && formOpen) && (
    <Button icon="trailing" iconName="plus" onClick={goToForm}>
      הוספת הערה
    </Button>
  );

  return (
    <div className="space-y-6">
      {!embedded && (
        <PageHeader
          breadcrumbs={[{ label: 'תלמידים', to: pathFor('S01') }, { label: 'הערות התנהגות' }]}
          title="הערות התנהגות"
          subtitle={
            student && (
              <Link
                to={studentCardPath(student.id)}
                className="text-primary-600 hover:text-primary-700 hover:underline"
              >
                {fullName(student)} · {student.classLabel}
              </Link>
            )
          }
          actions={addButton}
        />
      )}

      <Card>
        <h2 className={`${text.h3} mb-4`}>{embedded ? 'הערות התנהגות' : 'רשימה'}</h2>
        <Table
          caption="רשימת הערות התנהגות"
          rows={notes}
          getRowId={(row) => row.id}
          empty={
            <EmptyState
              variant="first-use"
              title="עוד לא נרשמו הערות התנהגות"
              text="הערה ראשונה שתתועד תופיע כאן."
            />
          }
          columns={[
            { key: 'date', header: 'תאריך', numeric: true, cell: (row) => shortDate(row.date) },
            {
              key: 'kind',
              header: 'סוג',
              cell: (row) => (
                <Badge tone={KIND_TONE[row.kind]}>{KIND_LABEL[row.kind]}</Badge>
              ),
            },
            { key: 'severity', header: 'חומרה', cell: (row) => row.severity || '—' },
            {
              key: 'author',
              header: 'נכתב ע"י',
              cell: (row) => (
                <span className="flex items-center gap-2">
                  <Avatar name={row.authorName} size="S" />
                  <span className="text-body-strong">{row.authorName}</span>
                </span>
              ),
            },
            {
              key: 'visible',
              header: 'נראה להורה',
              cell: (row) =>
                row.visibleToParent ? (
                  <Icon name="check" className="text-success-700" label="כן" />
                ) : (
                  <span aria-label="לא">—</span>
                ),
            },
          ]}
        />
      </Card>

      {embedded && addButton && <div className="flex justify-end">{addButton}</div>}

      {!readOnly && formOpen && (
        <Card>
          <form ref={formRef} onSubmit={submit} noValidate aria-label="הערה חדשה">
            <h2 className={`${text.h3} mb-4`}>הערה חדשה</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="חומרה"
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                placeholder="הקלידי כאן"
              />
              <Select
                ref={kindRef}
                label="סוג"
                required
                placeholder="בחירה"
                value={kind}
                onValueChange={(v) => {
                  setKind(v as NoteKind);
                  setErrors((cur) => ({ ...cur, kind: undefined }));
                }}
                error={errors.kind}
                options={(Object.keys(KIND_LABEL) as NoteKind[]).map((k) => ({
                  value: k,
                  label: KIND_LABEL[k],
                }))}
              />
              <TextArea
                className="md:col-span-2"
                label="תיאור"
                required
                rows={3}
                placeholder="הקלידי כאן"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setErrors((cur) => ({ ...cur, description: undefined }));
                }}
                error={errors.description}
              />
              <Checkbox
                className="md:col-span-2"
                label="נראה להורה"
                checked={visibleToParent}
                onCheckedChange={(v) => setVisibleToParent(v === true)}
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={reset}>
                {embedded ? 'ביטול' : 'ניקוי'}
              </Button>
              <Button type="submit">שמירת הערה</Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
