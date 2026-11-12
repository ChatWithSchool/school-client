import { useState } from 'react';
import {
  useListAvailableTeachersQuery,
  useListUncoveredLessonsQuery,
  type AvailableTeacher,
} from '../../api/substitutesApi';
import { errorMessage } from '../../api/errors';
import { Badge, Button, Card, PageHeader, Select, Table } from '../../components/ui';
import type { TableColumn } from '../../components/ui';
import {
  EmptyState,
  ErrorState,
  ForbiddenState,
  LoadingSkeleton,
} from '../../components/StateViews';
import { canWrite, usePermission } from '../../features/auth/usePermission';

const DAY_OPTIONS = [
  { value: 'all', label: 'הכול' },
  { value: 'sun', label: 'ראשון' },
  { value: 'mon', label: 'שני' },
  { value: 'tue', label: 'שלישי' },
  { value: 'wed', label: 'רביעי' },
  { value: 'thu', label: 'חמישי' },
];

const SLOT_OPTIONS = [
  { value: 'all', label: 'הכול' },
  { value: '1', label: 'שיעור 1 (08:00)' },
  { value: '2', label: 'שיעור 2 (08:50)' },
  { value: '3', label: 'שיעור 3 (09:50)' },
  { value: '4', label: 'שיעור 4 (10:40)' },
];

export default function Screen() {
  const level = usePermission('T03');
  const [day, setDay] = useState('all');
  const [slot, setSlot] = useState('all');
  const [assignedIds, setAssignedIds] = useState<string[]>([]);

  const teachersQuery = useListAvailableTeachersQuery({ date: day, slot });
  const uncoveredQuery = useListUncoveredLessonsQuery();

  const status = (teachersQuery.error as { status?: number } | undefined)?.status;
  if (status === 403 || (level === undefined && teachersQuery.isError)) return <ForbiddenState />;

  const teachers = teachersQuery.data?.items ?? [];
  const uncovered = uncoveredQuery.data?.items ?? [];

  const columns: TableColumn<AvailableTeacher>[] = [
    { key: 'name', header: 'שם', cell: (t) => t.name },
    { key: 'subjects', header: 'מקצועות', cell: (t) => t.subjects },
    { key: 'hours', header: 'שעות באותו יום', numeric: true, cell: (t) => t.hoursThatDay },
    {
      key: 'action',
      header: 'פעולה',
      cell: (t) =>
        canWrite(level) ? (
          <Button
            disabled={assignedIds.includes(t.id)}
            onClick={() => setAssignedIds([...assignedIds, t.id])}
          >
            {assignedIds.includes(t.id) ? 'שובץ' : 'שבץ'}
          </Button>
        ) : null,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="ממלא מקום ומורים זמינים" />

      <section aria-label="סינון" className="flex gap-4">
        <Select label="יום" options={DAY_OPTIONS} value={day} onValueChange={setDay} />
        <Select label="שעה" options={SLOT_OPTIONS} value={slot} onValueChange={setSlot} />
      </section>

      <Card>
        <section aria-label="מורים זמינים" className="flex flex-col gap-3">
          <h2 className="text-h3">מורים זמינים</h2>
          {teachersQuery.isLoading && <LoadingSkeleton />}
          {teachersQuery.isError && (
            <ErrorState message={errorMessage(teachersQuery.error)} onRetry={teachersQuery.refetch} />
          )}
          {teachersQuery.data && teachers.length === 0 && (
            <EmptyState title="אין מורים פנויים" text="בשעה שנבחרה כל המורים משובצים." />
          )}
          {teachers.length > 0 && (
            <Table
              caption="מורים זמינים"
              columns={columns}
              rows={teachers}
              getRowId={(t) => t.id}
            />
          )}
        </section>
      </Card>

      <Card>
        <section aria-label="שיעורים ללא מורה" className="flex flex-col gap-3">
          <h2 className="text-h3">שיעורים ללא מורה</h2>
          {uncoveredQuery.isLoading && <LoadingSkeleton rows={2} />}
          {uncoveredQuery.isError && (
            <ErrorState
              message={errorMessage(uncoveredQuery.error)}
              onRetry={uncoveredQuery.refetch}
            />
          )}
          {uncoveredQuery.data && uncovered.length === 0 && (
            <EmptyState title="אין שיעורים ללא מורה" />
          )}
          {uncovered.map((l) => (
            <div key={l.id} className="flex items-center justify-between border-b border-line py-2">
              <span>
                שיעור {l.lessonNumber} · {l.subject}
              </span>
              <span className="flex items-center gap-3">
                {l.className}
                <Badge tone="danger">מורה נעדר</Badge>
              </span>
            </div>
          ))}
        </section>
      </Card>
    </div>
  );
}