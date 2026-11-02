import React, { useState } from 'react';
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
  useToast,
} from '../../components/ui';
import { ErrorState, ForbiddenState } from '../../components/StateViews';
import type { TableColumn } from '../../components/ui';

type Invite = {
  id: string;
  email: string;
  role: string;
  sentAt: string;
  expiresAt: string;
  sentAtDate: Date;
};

const ROLE_LABELS: Record<string, string> = {
  teacher: 'מחנך/ת',
  professional: 'מורה מקצועי',
  parent: 'הורה',
};

const ROLE_TONE: Record<string, 'primary' | 'accent' | 'neutral'> = {
  teacher: 'primary',
  professional: 'primary',
  parent: 'neutral',
};

function isExpired(sentAtDate: Date) {
  const diff = (Date.now() - sentAtDate.getTime()) / (1000 * 60 * 60 * 24);
  return diff > 7;
}

const PENDING_COLUMNS: TableColumn<Invite>[] = [
  { key: 'email', header: 'אימייל', cell: (r) => r.email },
  {
    key: 'role',
    header: 'תפקיד',
    cell: (r) => <Badge tone={ROLE_TONE[r.role] ?? 'neutral'}>{ROLE_LABELS[r.role] ?? r.role}</Badge>,
  },
  { key: 'sentAt', header: 'נשלחה ב', cell: (r) => r.sentAt, numeric: true },
  {
    key: 'expiresAt',
    header: 'פגה ב',
    cell: (r) =>
      isExpired(r.sentAtDate) ? (
        <span className="text-danger-700 font-semibold">פגה</span>
      ) : (
        r.expiresAt
      ),
    numeric: true,
  },
  {
    key: 'actions',
    header: 'פעולות',
    className: 'w-12',
    cell: (r) => <ActionsMenu invite={r} />,
  },
];

function ActionsMenu({ invite }: { invite: Invite }) {
  const toast = useToast();
  const [cancelOpen, setCancelOpen] = useState(false);

  return (
    <>
      <DropdownMenu
        label={`פעולות עבור ${invite.email}`}
        items={[
          {
            label: 'שלח שוב',
            icon: 'mail',
            onSelect: () => {
              // TODO: POST /invites/{id}/resend
              toast({ tone: 'success', message: 'ההזמנה נשלחה שוב' });
            },
          },
          {
            label: 'בטל הזמנה',
            icon: 'trash-2',
            tone: 'danger',
            onSelect: () => setCancelOpen(true),
          },
        ]}
      />
      <Modal
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="ביטול הזמנה"
        description={`האם לבטל את ההזמנה ל-${invite.email}? הקישור יפסל מיד.`}
        confirmLabel="בטל הזמנה"
        confirmVariant="danger"
        onConfirm={() => {
          // TODO: DELETE /invites/{invite.id}
          toast({ tone: 'success', message: 'ההזמנה בוטלה' });
        }}
      />
    </>
  );
}

export default function InvitesScreen() {
  const toast = useToast();
  const [dupError, setDupError] = useState(false);
  const [error, setError] = useState(false);
  const [forbidden] = useState(false);

  // TODO: replace with real API data (GET /invites?status=pending)
  const now = new Date();
  const daysAgo = (n: number) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000);
  const fmt = (d: Date) => `${d.getDate().toString().padStart(2,'0')}.${(d.getMonth()+1).toString().padStart(2,'0')}`;

  const pendingRows: Invite[] = [
    { id: '1', email: 'flor.perez@school.example', role: 'teacher', sentAt: fmt(daysAgo(2)), expiresAt: fmt(new Date(daysAgo(2).getTime() + 7*24*60*60*1000)), sentAtDate: daysAgo(2) },
    { id: '2', email: 'yael.fridman@school.example', role: 'professional', sentAt: fmt(daysAgo(1)), expiresAt: fmt(new Date(daysAgo(1).getTime() + 7*24*60*60*1000)), sentAtDate: daysAgo(1) },
    { id: '3', email: 'noam.hadad@school.example', role: 'teacher', sentAt: fmt(daysAgo(8)), expiresAt: fmt(new Date(daysAgo(8).getTime() + 7*24*60*60*1000)), sentAtDate: daysAgo(8) },
    { id: '4', email: 'gali.levi@school.example', role: 'parent', sentAt: fmt(daysAgo(10)), expiresAt: fmt(new Date(daysAgo(10).getTime() + 7*24*60*60*1000)), sentAtDate: daysAgo(10) },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDupError(false);
    // TODO: POST /invites — on 409 setDupError(true), on success toast
    toast({ tone: 'success', message: 'ההזמנה נשלחה' });
  };

  const newTabContent = (
    <form className="space-y-6 w-full" onSubmit={handleSubmit}>
      <div className="bg-surface rounded-xl border border-line p-8 shadow-sm">
        <h2 className="text-h2 text-fg mb-8">הזמנה חדשה</h2>

        {dupError && (
          <Alert tone="danger" className="mb-6" dismissible onDismiss={() => setDupError(false)}>
            כתובת האימייל כבר קיימת בהזמנה פעילה.
          </Alert>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField label="אימייל *" placeholder="הקלידו כאן" type="email" />
            <Select
              label="תפקיד *"
              placeholder="בחירה"
              options={[
                { value: 'teacher', label: 'מחנך/ת' },
                { value: 'professional', label: 'מורה מקצועי' },
                { value: 'parent', label: 'הורה' },
              ]}
            />
          </div>
          <TextField label="לכיתות / ילדים" placeholder="הקלידו כאן" />
          <TextField label="הודעה אישית" placeholder="הקלידו כאן" />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button type="submit" variant="primary">שלח הזמנה</Button>
        <Button type="button" variant="secondary">שלח שוב</Button>
        <Button type="button" variant="secondary">בטל הזמנה</Button>
      </div>
    </form>
  );

  const pendingTabContent = (
    <div className="bg-surface rounded-xl border border-line shadow-sm w-full">
      <div className="p-6 pb-0">
        <h2 className="text-h2 text-fg text-start">הזמנות ממתינות</h2>
      </div>
      <Table
        caption="הזמנות ממתינות"
        columns={PENDING_COLUMNS}
        rows={pendingRows}
        getRowId={(r) => r.id}
        empty={<span className="text-body text-fg-secondary">אין הזמנות ממתינות.</span>}
      />
    </div>
  );

  if (forbidden) return <ForbiddenState />;
  if (error) return <ErrorState message="אירעה שגיאה בטעינת ההזמנות" onRetry={() => setError(false)} />;

  return (
    <div className="flex flex-col min-h-screen bg-subtle p-8 space-y-8" dir="rtl">
      <PageHeader title="הזמנת משתמשים והזמנות ממתינות" />

      <Tabs
        label="לשוניות הזמנות"
        defaultValue="pending"
        items={[
          { value: 'pending', label: 'ממתינות', content: pendingTabContent },
          { value: 'new', label: 'הזמנה חדשה', content: newTabContent },
        ]}
      />
    </div>
  );
}
