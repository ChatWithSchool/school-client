import { useState, type FormEvent } from 'react';
import { ForbiddenState } from '../../components/StateViews';
import {
  Avatar,
  Badge,
  Button,
  Card,
  EmptyState,
  Modal,
  PageHeader,
  Select,
  TextField,
  useToast,
} from '../../components/ui';
import { canWrite, usePermission } from '../../features/auth/usePermission';

// Sprint 1: mock data kept in the screen. POST/DELETE /students/{id}/guardians are connected
// in sprint 4.
type Guardian = {
  id: string;
  name: string;
  email: string;
  relation: string;
  hasAccount: boolean;
};

const STUDENT_NAME = 'נועה לוי';
const RELATIONS = ['אמא', 'אבא', 'אפוטרופוס', 'אחר'].map((r) => ({ value: r, label: r }));
/** Emails that already have a parent account. Any other email gets an invitation. */
const EXISTING_ACCOUNTS: Record<string, string> = {
  'amit.biton@school.example': 'עמית ביטון',
};

const INITIAL_GUARDIANS: Guardian[] = [
  {
    id: 'g1',
    name: 'רונית לוי',
    email: 'ronit.levi@example.com',
    relation: 'אמא',
    hasAccount: true,
  },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormErrors = { email?: string; relation?: string };

export default function Screen() {
  const level = usePermission('A08');
  const toast = useToast();
  const editable = canWrite(level);

  const [guardians, setGuardians] = useState<Guardian[]>(INITIAL_GUARDIANS);
  const [email, setEmail] = useState('');
  const [relation, setRelation] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [removing, setRemoving] = useState<Guardian | null>(null);

  if (!level) return <ForbiddenState />;

  function resetForm() {
    setEmail('');
    setRelation('');
    setErrors({});
  }

  function link(e: FormEvent) {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    const errs: FormErrors = {};
    if (!clean) errs.email = 'חובה למלא אימייל';
    else if (!EMAIL_RE.test(clean)) errs.email = 'כתובת האימייל אינה תקינה';
    else if (guardians.some((g) => g.email.toLowerCase() === clean))
      errs.email = 'הורה עם האימייל הזה כבר מקושר לתלמיד';
    if (!relation) errs.relation = 'חובה לבחור קרבה';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const existingName = EXISTING_ACCOUNTS[clean];
    setGuardians([
      ...guardians,
      {
        id: `g${Date.now()}`,
        name: existingName ?? clean,
        email: clean,
        relation,
        hasAccount: Boolean(existingName),
      },
    ]);
    toast({
      tone: 'success',
      message: existingName ? 'ההורה קושר לתלמיד' : 'נשלחה הזמנה להורה',
    });
    resetForm();
  }

  function remove() {
    if (!removing) return;
    setGuardians(guardians.filter((g) => g.id !== removing.id));
    toast({ tone: 'success', message: 'הקישור הוסר' });
    setRemoving(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="קישור הורים" subtitle={STUDENT_NAME} />

      <section aria-labelledby="linked-title" className="space-y-3">
        <h2 id="linked-title" className="text-h3 text-fg">
          הורים מקושרים
        </h2>
        {guardians.length === 0 ? (
          <EmptyState title="אין הורים מקושרים" text="קשרו הורה לתלמיד באמצעות הטופס שלמטה." />
        ) : (
          <ul className="space-y-3">
            {guardians.map((g) => (
              <li key={g.id}>
                <Card padding="M" className="flex items-center gap-4">
                  <Avatar name={g.name} />
                  <div className="min-w-0 flex-1">
                    <p className="text-body-strong text-fg">{g.name}</p>
                    <p className="text-body text-fg-secondary">{g.email}</p>
                  </div>
                  <Badge tone="neutral">{g.relation}</Badge>
                  {g.hasAccount ? (
                    <Badge tone="success">מקושר</Badge>
                  ) : (
                    <Badge tone="info">ממתין להזמנה</Badge>
                  )}
                  {editable && (
                    <Button variant="secondary" size="S" onClick={() => setRemoving(g)}>
                      הסרת קישור
                    </Button>
                  )}
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      {editable && (
        <form onSubmit={link} noValidate className="max-w-xl space-y-4">
          <h2 className="text-h3 text-fg">קישור הורה חדש</h2>
          <TextField
            label="אימייל ההורה"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            hint="להורה שאין לו חשבון תישלח הזמנה."
          />
          <Select
            label="קרבה"
            required
            options={RELATIONS}
            value={relation}
            onValueChange={setRelation}
            error={errors.relation}
          />
          <div className="flex items-center gap-2">
            <Button type="submit">קשר</Button>
            <Button variant="secondary" onClick={resetForm}>
              בטל
            </Button>
          </div>
        </form>
      )}

      <Modal
        open={removing !== null}
        onOpenChange={(open) => {
          if (!open) setRemoving(null);
        }}
        title="הסרת קישור"
        description={
          removing
            ? `הסרת הקישור תבטל מיידית את הגישה של ${removing.name} לנתוני ${STUDENT_NAME}.`
            : undefined
        }
        confirmLabel="הסר קישור"
        confirmVariant="danger"
        onConfirm={remove}
      />
    </div>
  );
}
