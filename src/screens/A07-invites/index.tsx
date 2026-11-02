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
import type { TableColumn } from '../../components/ui';

type Invite = {
  id: string;
  email: string;
  role: string;
  sentAt: string;
  expiresAt: string;
};

const ROLE_LABELS: Record<string, string> = {
  teacher: 'מורה',
  parent: 'הורה',
  staff: 'צוות',
};

const PENDING_COLUMNS: TableColumn<Invite>[] = [
  { key: 'email', header: 'אימייל', cell: (r) => r.email },
  {
    key: 'role',
    header: 'תפקיד',
    cell: (r) => <Badge tone="neutral">{ROLE_LABELS[r.role] ?? r.role}</Badge>,
  },
  { key: 'sentAt', header: 'נשלחה ב', cell: (r) => r.sentAt, numeric: true },
  { key: 'expiresAt', header: 'פגה ב', cell: (r) => r.expiresAt, numeric: true },
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

  // TODO: replace with real API data (GET /invites?status=pending)
  const pendingRows: Invite[] = [];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDupError(false);
    // TODO: POST /invites — on 409 setDupError(true), on success toast
    toast({ tone: 'success', message: 'ההזמנה נשלחה' });
  };

  const newTabContent = (
    <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm max-w-4xl">
      <h2 className="text-xl font-semibold text-gray-900 mb-8">הזמנה חדשה</h2>

      {dupError && (
        <Alert tone="danger" className="mb-6" dismissible onDismiss={() => setDupError(false)}>
          כתובת האימייל כבר קיימת בהזמנה פעילה.
        </Alert>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* שורה 1: אימייל ותפקיד (לפי סדר ה-SPEC) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField label="אימייל *" placeholder="הקלידו כאן" type="email" required />
          <Select
            label="תפקיד *"
            placeholder="בחירה"
            options={[
              { value: 'teacher', label: 'מורה' },
              { value: 'parent', label: 'הורה' },
              { value: 'staff', label: 'צוות' },
            ]}
          />
        </div>

        <TextField label="לכיתות / ילדים" placeholder="הקלידו כאן" />
        <TextField label="הודעה אישית" placeholder="הקלידו כאן" />

        <div className="pt-4">
          <Button type="submit" variant="primary">
            שלח הזמנה
          </Button>
        </div>
      </form>
    </div>
  );

  const pendingTabContent = (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm max-w-5xl">
      <Table
        caption="הזמנות ממתינות"
        columns={PENDING_COLUMNS}
        rows={pendingRows}
        getRowId={(r) => r.id}
        empty={<span className="text-sm text-gray-500">אין הזמנות ממתינות.</span>}
      />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 p-8 space-y-8" dir="rtl">
      <PageHeader title="הזמנת משתמשים והזמנות ממתינות" />

      <Tabs
        label="לשוניות הזמנות"
        defaultValue="pending"
        items={[
          { value: 'pending', label: 'ממתינות', content: pendingTabContent },
          { value: 'new', label: 'הזמנה חדשה', content: newTabContent },
          { value: 'answered', label: 'נענו', disabled: true },
        ]}
      />
    </div>
  );
}
