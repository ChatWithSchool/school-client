import { useState, type FormEvent, type ReactNode } from 'react';
import {
  useGetStudentGuardiansQuery,
  useLinkGuardianMutation,
  useUnlinkGuardianMutation,
  type GuardianDto,
} from '../../api/guardiansApi';
import { errorMessage, fieldErrors } from '../../api/errors';
import { ErrorState, ForbiddenState, LoadingSkeleton } from '../../components/StateViews';
import {
  Alert,
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

// The linked parents load from the student card (GET /students/{id}); link and unlink are
// POST and DELETE /students/{id}/guardians.
// TODO: take the student id from the student card (S03) or from A07 once the screens are connected.
const STUDENT_ID = 'stu-1';

const RELATIONS = ['אמא', 'אבא', 'אפוטרופוס', 'אחר'].map((r) => ({ value: r, label: r }));
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** A parent who was only invited has no real account yet (a temporary userId in the mock). */
const INVITE_PREFIX = 'invite-';
const isInvited = (g: GuardianDto) => !g.userId || g.userId.startsWith(INVITE_PREFIX);
const keyOf = (g: GuardianDto) => g.userId ?? g.email ?? g.name;

export default function Screen() {
  const level = usePermission('A08');
  const toast = useToast();
  const editable = canWrite(level);

  const { data, isLoading, isError, refetch } = useGetStudentGuardiansQuery(STUDENT_ID);
  const [linkGuardian, { isLoading: linking, error: linkError, reset: resetLink }] =
    useLinkGuardianMutation();
  const [unlinkGuardian] = useUnlinkGuardianMutation();

  const [email, setEmail] = useState('');
  const [relation, setRelation] = useState('');
  const [emailError, setEmailError] = useState<string>();
  const [removing, setRemoving] = useState<GuardianDto | null>(null);
  const [removeFailed, setRemoveFailed] = useState(false);

  const guardians = data?.guardians ?? [];
  const serverFields = fieldErrors(linkError);

  if (!level) return <ForbiddenState />;

  function resetForm() {
    setEmail('');
    setRelation('');
    setEmailError(undefined);
    resetLink();
  }

  async function link(e: FormEvent) {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!clean) {
      setEmailError('חובה למלא אימייל');
      return;
    }
    if (!EMAIL_RE.test(clean)) {
      setEmailError('כתובת האימייל אינה תקינה');
      return;
    }
    if (guardians.some((g) => g.email?.toLowerCase() === clean)) {
      setEmailError('ההורה עם האימייל הזה כבר מקושר לתלמיד');
      return;
    }
    setEmailError(undefined);
    try {
      const res = await linkGuardian({
        studentId: STUDENT_ID,
        email: clean,
        relation: relation || undefined,
      }).unwrap();
      toast({
        tone: 'success',
        message: res.id.startsWith(INVITE_PREFIX) ? 'נשלחה הזמנה להורה' : 'ההורה קושר לתלמיד',
      });
      resetForm();
    } catch {
      /* shown below from linkError */
    }
  }

  async function remove() {
    if (!removing) return;
    setRemoveFailed(false);
    try {
      await unlinkGuardian({ studentId: STUDENT_ID, guardianId: removing.userId ?? '' }).unwrap();
      toast({ tone: 'success', message: 'הקישור הוסר' });
    } catch {
      setRemoveFailed(true);
    }
    setRemoving(null);
  }

  const studentName = data ? `${data.firstName} ${data.lastName}` : undefined;

  let list: ReactNode;
  if (isLoading) {
    list = <LoadingSkeleton rows={4} />;
  } else if (isError || !data) {
    list = (
      <ErrorState
        message="לא הצלחנו לטעון את ההורים המקושרים. נסו שוב."
        onRetry={() => void refetch()}
      />
    );
  } else if (guardians.length === 0) {
    list = <EmptyState title="אין הורים מקושרים" text="קשרו הורה לתלמיד באמצעות הטופס שלמטה." />;
  } else {
    list = (
      <Card padding="M">
        <ul className="divide-y divide-line">
          {guardians.map((g) => (
            <li key={keyOf(g)} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
              <Avatar name={g.name} />
              <div className="min-w-0 flex-1">
                <p className="text-body-strong text-fg">{g.name}</p>
                <p className="text-body text-fg-secondary">{g.email}</p>
              </div>
              <p className="text-body text-fg-secondary">נוכחות, ציונים</p>
              {g.relation && <Badge tone="neutral">{g.relation}</Badge>}
              {isInvited(g) ? (
                <Badge tone="info">ממתין להזמנה</Badge>
              ) : (
                <Badge tone="success">מקושר</Badge>
              )}
              {editable && (
                <Button variant="secondary" size="S" onClick={() => setRemoving(g)}>
                  הסרת קישור
                </Button>
              )}
            </li>
          ))}
        </ul>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="קישור הורה לתלמיד" subtitle={studentName} />

      <section aria-labelledby="linked-title" className="space-y-3">
        <h2 id="linked-title" className="text-h3 text-fg">
          הורים מקושרים
        </h2>
        {removeFailed && (
          <Alert tone="danger" title="ההסרה נכשלה">
            לא הצלחנו להסיר את הקישור. נסו שוב.
          </Alert>
        )}
        {list}
      </section>

      {editable && (
        <Card padding="M">
          <form onSubmit={(e) => void link(e)} noValidate className="max-w-xl space-y-4">
            <h2 className="text-h3 text-fg">קישור הורה חדש</h2>
            {linkError && !Object.keys(serverFields).length && (
              <ErrorState message={errorMessage(linkError)} />
            )}
            <Select
              label="קרבה"
              options={RELATIONS}
              value={relation}
              onValueChange={setRelation}
              error={serverFields.relation}
            />
            <TextField
              label="אימייל ההורה"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError ?? serverFields.email}
              hint="להורה שאין לו חשבון תישלח הזמנה."
            />
            <div className="flex items-center gap-2">
              <Button type="submit" disabled={linking}>
                קשר
              </Button>
              <Button variant="secondary" onClick={resetForm}>
                בטל
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Modal
        open={removing !== null}
        onOpenChange={(open) => {
          if (!open) setRemoving(null);
        }}
        title="הסרת קישור"
        description={
          removing
            ? `הסרת הקישור תבטל מיידית את הגישה של ${removing.name} לנתוני ${studentName ?? 'התלמיד'}.`
            : undefined
        }
        confirmLabel="הסר קישור"
        confirmVariant="danger"
        onConfirm={() => void remove()}
      />
    </div>
  );
}
