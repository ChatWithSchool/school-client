import { useGetMeQuery } from '../../api/authApi';
import { useGetGradeHistoryQuery } from '../../api/gradesApi';
import { Avatar, Card, PageHeader, Table, type TableColumn } from '../../components/ui';
import {
  EmptyState,
  ErrorState,
  ForbiddenState,
  LoadingSkeleton,
} from '../../components/StateViews';
import { usePermission } from '../../features/auth/usePermission';
import type { GradeChange } from '../../api/types';

const GRADE_ID = 'grd-asm-1-stu-17';

/** 16.10 11:20 */
function formatChangeDate(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const columns: TableColumn<GradeChange>[] = [
  {
    key: 'createdAt',
    header: 'תאריך ושעה',
    className: 'w-44',
    cell: (row) => <span className="text-body text-fg">{formatChangeDate(row.createdAt)}</span>,
  },
  {
    key: 'changedBy',
    header: 'מי שינה',
    className: 'w-44',
    cell: (row) => (
      <span className="flex items-center gap-2.5">
        <span className="text-body-strong text-fg">{row.changedByName}</span>
        <Avatar size="M" name={row.changedByName} />
      </span>
    ),
  },
  {
    key: 'oldScore',
    header: 'ערך קודם',
    className: 'w-32',
    cell: (row) => <span className="text-body text-fg">{row.oldScore ?? '—'}</span>,
  },
  {
    key: 'newScore',
    header: 'ערך חדש',
    className: 'w-32',
    cell: (row) => <span className="text-body text-fg">{row.newScore ?? '—'}</span>,
  },
  {
    key: 'reason',
    header: 'סיבה',
    className: 'min-w-52',
    cell: (row) => <span className="text-body text-fg">{row.reason ?? '—'}</span>,
  },
];

export default function Screen() {
  const level = usePermission('G03');
  const { isLoading: meLoading } = useGetMeQuery();
  const forbidden = !meLoading && !level;
  const { data, isLoading, isError, error, refetch } = useGetGradeHistoryQuery(GRADE_ID, {
    skip: meLoading || forbidden,
  });
  const loading = meLoading || isLoading;

  if (forbidden || (error as { status?: number } | undefined)?.status === 403)
    return <ForbiddenState />;

  return (
    <div className="space-y-4 p-4">
      <PageHeader
        title="היסטוריית שינויי ציון"
        breadcrumbs={[{ label: 'ציונים', to: '/grades' }, { label: 'היסטוריית שינויי ציון' }]}
      />

      <Card title="שינויים">
        {loading && <LoadingSkeleton rows={4} />}
        {isError && <ErrorState message="לא ניתן לטעון את ההיסטוריה." onRetry={refetch} />}
        {!loading && !isError && (
          <Table
            caption="היסטוריית שינויי ציון"
            rows={data?.items ?? []}
            getRowId={(row) => row.id}
            columns={columns}
            className="w-full"
            wrapperClassName="overflow-x-auto"
            empty={<EmptyState title="אין נתוני היסטוריה להצגה." />}
          />
        )}
      </Card>
    </div>
  );
}
