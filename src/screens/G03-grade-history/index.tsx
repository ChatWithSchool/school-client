import { apiSlice } from '../../api/apiSlice';
import { PageHeader, Table, type TableColumn } from '../../components/ui';
import { ErrorState, LoadingSkeleton } from '../../components/StateViews';
import type { GradeChange } from '../../api/types';

const GRADE_ID = 'grd-asm-1-stu-17';

const gradeHistoryApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getGradeHistory: build.query<{ items: GradeChange[] }, string>({
      query: (gradeId) => `/grades/${gradeId}/history`,
    }),
  }),
  overrideExisting: false,
});

const { useGetGradeHistoryQuery } = gradeHistoryApi;

const columns: TableColumn<GradeChange>[] = [
  {
    key: 'createdAt',
    header: 'תאריך ושעה',
    className: 'w-44',
    cell: (row) => {
      const d = new Date(row.createdAt);
      const date = d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const time = d.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
      return <span className="text-body text-fg">{`${date} · ${time}`}</span>;
    },
  },
  {
    key: 'changedBy',
    header: 'מי שינה',
    className: 'w-44',
    cell: (row) => <span className="text-body text-fg">{row.changedByName}</span>,
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
  const { data, isLoading, isError, refetch } = useGetGradeHistoryQuery(GRADE_ID);

  return (
    <div className="space-y-4 p-4" dir="rtl">
      <PageHeader
        title="היסטוריית שינויי ציון"
        subtitle="תלמיד · מתמטיקה · מבחן מסכם"
      />

      <section className="rounded-xl border border-line bg-surface p-3 shadow-xs">
        {isLoading && <LoadingSkeleton rows={4} />}
        {isError && (
          <ErrorState message="לא ניתן לטעון את ההיסטוריה." onRetry={refetch} />
        )}
        {!isLoading && !isError && (
          <Table
            caption="היסטוריית שינויי ציון"
            rows={data?.items ?? []}
            getRowId={(row) => row.id}
            columns={columns}
            className="w-full"
            wrapperClassName="overflow-x-auto"
            empty={
              <div className="p-4 text-center text-body text-fg-secondary">
                אין נתוני היסטוריה להצגה.
              </div>
            }
          />
        )}
      </section>
    </div>
  );
}
