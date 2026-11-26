import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  PageHeader,
  Tabs,
  TextField,
  Select,
  Button,
  Table,
  Badge,
  DropdownMenu,
  Modal,
  Alert,
  EmptyState,
  TextArea,
  useToast,
} from '../../components/ui';
import { LoadingSkeleton, ErrorState, ForbiddenState } from '../../components/StateViews';
import type { TableColumn } from '../../components/ui';
import type { ApiErrorBody, Invite, RoleKey } from '../../api/types';
import { errorMessage, fieldErrors } from '../../api/errors';
import { useGetMeQuery } from '../../api/authApi';
import { useAppSelector } from '../../app/hooks';
import { canWrite } from '../../features/auth/usePermission';
import {
  useCancelInviteMutation,
  useCreateInviteMutation,
  useListInvitesQuery,
  useResendInviteMutation,
  type InviteMail,
} from '../../api/invitesApi';

const ROLE_LABELS: Partial<Record<RoleKey, string>> = {
  homeroom: 'מחנך/ת',
  teacher: 'מורה מקצועי',
  parent: 'הורה',
  secretary: 'מזכירות',
};
const ROLE_OPTIONS = (['homeroom', 'teacher', 'parent'] as const).map((value) => ({
  value,
  label: ROLE_LABELS[value]!,
}));

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' });

type ApiError = { status?: number | string; data?: Partial<ApiErrorBody> };
type Action = { kind: 'resend' | 'cancel'; invite: Invite };
const ACTIONS = {
  resend: { label: 'שלח שוב', icon: 'mail' },
  cancel: { label: 'בטל הזמנה', icon: 'trash-2', tone: 'danger' },
} as const;
const KINDS = ['resend', 'cancel'] as const;

export default function InvitesScreen() {
  const token = useAppSelector((state) => state.auth.token);
  const { data: me, isLoading: isPermissionLoading } = useGetMeQuery(undefined, {
    skip: !token,
  });
  const level = me?.permissions.A07;
  const canAccess = canWrite(level);
  const toast = useToast();
  const [, setParams] = useSearchParams();
  const { data, isFetching, error, refetch } = useListInvitesQuery(
    { status: 'pending' },
    { skip: !canAccess },
  );
  const [createInvite, createState] = useCreateInviteMutation();
  const [resend, resendState] = useResendInviteMutation();
  const [cancel, cancelState] = useCancelInviteMutation();

  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dupError, setDupError] = useState<string | null>(null);
  const [action, setAction] = useState<Action | null>(null);
  const [mailLog, setMailLog] = useState<InviteMail[]>([]);

  const addToLog = (mail?: InviteMail) => mail && setMailLog((prev) => [mail, ...prev]);
  const goToTab = (tab: string) => setParams({ tab }, { replace: true });
  // the form buttons "שלח שוב" / "בטל הזמנה" act on the pending invite of the typed email
  const typed = data?.items.find((i) => i.email === email.trim().toLowerCase());

  const runAction = async () => {
    if (!action) return;
    const { kind, invite } = action;
    try {
      if (kind === 'resend') addToLog((await resend(invite.id).unwrap()).mail);
      else await cancel(invite.id).unwrap();
      setDupError(null);
      toast({ tone: 'success', message: kind === 'resend' ? 'ההזמנה נשלחה שוב' : 'ההזמנה בוטלה' });
    } catch (e) {
      toast({ tone: 'danger', message: errorMessage(e) });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDupError(null);
    const local: Record<string, string> = {};
    if (!email.trim()) local.email = 'יש להזין אימייל';
    if (!role) local.role = 'יש לבחור תפקיד';
    setErrors(local);
    if (Object.keys(local).length) return;
    try {
      const res = await createInvite({
        email: email.trim(),
        role: role as RoleKey,
        message: message.trim() || undefined,
      }).unwrap();
      addToLog(res.mail);
      toast({ tone: 'success', message: `ההזמנה נשלחה ל-${email.trim()}` });
      setEmail('');
      setRole('');
      setMessage('');
      goToTab('pending');
    } catch (err) {
      if ((err as ApiError).status === 409) setDupError(errorMessage(err));
      else if (Object.keys(fieldErrors(err)).length) setErrors(fieldErrors(err));
      else toast({ tone: 'danger', message: errorMessage(err) });
    }
  };

  const columns: TableColumn<Invite>[] = [
    { key: 'email', header: 'אימייל', cell: (r) => r.email },
    {
      key: 'role',
      header: 'תפקיד',
      cell: (r) => (
        <Badge tone={r.role === 'parent' ? 'neutral' : 'primary'}>
          {ROLE_LABELS[r.role] ?? r.role}
        </Badge>
      ),
    },
    { key: 'sentAt', header: 'נשלחה ב', cell: (r) => fmtDate(r.createdAt), numeric: true },
    {
      key: 'expiresAt',
      header: 'פגה ב',
      numeric: true,
      cell: (r) =>
        new Date(r.expiresAt).getTime() < Date.now() ? (
          <span className="text-danger-700 font-semibold">פגה</span>
        ) : (
          fmtDate(r.expiresAt)
        ),
    },
    {
      key: 'actions',
      header: 'פעולות',
      className: 'w-12',
      cell: (r) => (
        <DropdownMenu
          label={`פעולות עבור ${r.email}`}
          items={KINDS.map((kind) => ({
            ...ACTIONS[kind],
            onSelect: () => setAction({ kind, invite: r }),
          }))}
        />
      ),
    },
  ];

  const newTabContent = (
    <form className="space-y-6 w-full" onSubmit={handleSubmit} noValidate>
      <div className="bg-surface rounded-xl border border-line p-8 shadow-sm">
        <h2 className="text-h2 text-fg mb-8">הזמנה חדשה</h2>

        {dupError && (
          <Alert tone="danger" className="mb-6" dismissible onDismiss={() => setDupError(null)}>
            {dupError} אפשר לשלוח אותה שוב או לבטל אותה בכפתורים שלמטה.
          </Alert>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField
              label="אימייל *"
              placeholder="הקלידו כאן"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            <Select
              label="תפקיד *"
              placeholder="בחירה"
              options={ROLE_OPTIONS}
              value={role}
              onValueChange={setRole}
              error={errors.role}
            />
          </div>
          {/* TODO(A08): classes / children picker, sent as classIds / studentIds */}
          <TextField label="לכיתות / ילדים" placeholder="הקלידו כאן" />
          <TextArea
            label="הודעה אישית"
            placeholder="הקלידו כאן"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button type="submit" variant="primary" loading={createState.isLoading}>
          שלח הזמנה
        </Button>
        {KINDS.map((kind) => (
          <Button
            key={kind}
            type="button"
            variant="secondary"
            disabled={!typed}
            onClick={() => typed && setAction({ kind, invite: typed })}
          >
            {ACTIONS[kind].label}
          </Button>
        ))}
      </div>
    </form>
  );

  const code = (error as ApiError | undefined)?.data?.error?.code ?? (error as ApiError)?.status;
  const pendingTabContent = (
    <div className="space-y-8 w-full">
      <div className="bg-surface rounded-xl border border-line shadow-sm w-full">
        <div className="p-6 pb-0">
          <h2 className="text-h2 text-fg text-start">הזמנות ממתינות</h2>
        </div>
        {error && !isFetching ? (
          <div className="p-6">
            <ErrorState
              message={`אירעה שגיאה בטעינת ההזמנות. (קוד תקלה: ${code})`}
              onRetry={refetch}
            />
          </div>
        ) : (
          <Table
            caption="הזמנות ממתינות"
            columns={columns}
            rows={data?.items}
            loading={isFetching && (!data || Boolean(error))}
            getRowId={(r) => r.id}
            empty={
              <EmptyState
                variant="first-use"
                title="אין הזמנות ממתינות."
                text="הזמנות שנשלחו ועדיין לא נענו יופיעו כאן."
                action={<Button onClick={() => goToTab('new')}>הזמנה חדשה</Button>}
              />
            }
          />
        )}
      </div>

      <div className="bg-surface rounded-xl border border-line shadow-sm w-full p-6">
        <h2 className="text-h2 text-fg text-start mb-1">יומן ההזמנות</h2>
        <p className="text-body text-fg-secondary mb-4">בגרסה 1 לא נשלח מייל אמיתי.</p>
        <ul className="space-y-4" aria-label="יומן ההזמנות">
          {mailLog.map((m) => (
            <li key={m.sentAt + m.to} className="rounded-lg border border-line p-4 text-body">
              <div className="text-body-strong text-fg">אל: {m.to}</div>
              <div className="text-fg">נושא: {m.subject}</div>
              <pre className="mt-2 whitespace-pre-wrap font-sans text-fg-secondary">{m.body}</pre>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  if (isPermissionLoading) return <LoadingSkeleton />;
  if (code === 'FORBIDDEN' || code === 403) return <ForbiddenState />;
  if (!me || !canAccess) return <ForbiddenState />;

  return (
    <div className="flex flex-col bg-subtle p-8 space-y-8">
      <PageHeader title="הזמנת משתמשים והזמנות ממתינות" />

      <Tabs
        label="לשוניות הזמנות"
        defaultValue="pending"
        items={[
          { value: 'new', label: 'הזמנה חדשה', content: newTabContent },
          { value: 'pending', label: 'ממתינות', content: pendingTabContent },
        ]}
      />

      <Modal
        open={action !== null}
        onOpenChange={(open) => !open && setAction(null)}
        title={action?.kind === 'resend' ? 'שליחה חוזרת' : 'ביטול הזמנה'}
        description={
          action?.kind === 'resend'
            ? `לשלוח שוב את ההזמנה ל-${action.invite.email}? יישלח קישור חדש, והקודם ייפסל.`
            : `האם לבטל את ההזמנה ל-${action?.invite.email}? הקישור ייפסל מיד.`
        }
        confirmLabel={ACTIONS[action?.kind ?? 'cancel'].label}
        confirmVariant={action?.kind === 'resend' ? 'primary' : 'danger'}
        confirmLoading={resendState.isLoading || cancelState.isLoading}
        onConfirm={runAction}
      />
    </div>
  );
}
