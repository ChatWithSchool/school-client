import { PageHeader, Table, type TableColumn } from '../../components/ui';

type GradeHistoryRow = {
  id: string;
  date: string;
  author: string;
  previous: number | string;
  current: number | string;
  reason: string;
};

const rows: GradeHistoryRow[] = [
  {
    id: '1',
    date: '16.10.2025 · 11:20',
    author: 'אורלי כהן',
    previous: 78,
    current: 85,
    reason: 'השלמת מבחן',
  },
  {
    id: '2',
    date: '14.10.2025 · 09:05',
    author: 'מנחם יעקובי',
    previous: 65,
    current: 72,
    reason: 'בדיקת עבודה',
  },
  {
    id: '3',
    date: '10.10.2025 · 15:40',
    author: 'רונית אהרוני',
    previous: 90,
    current: 87,
    reason: 'תיקון שגיאת חישוב',
  },
];

const columns: TableColumn<GradeHistoryRow>[] = [
  {
    key: 'date',
    header: 'תאריך',
    className: 'w-40',
    cell: (row) => <span className="text-body text-fg">{row.date}</span>,
  },
  {
    key: 'author',
    header: 'שינה',
    className: 'w-44',
    cell: (row) => <span className="text-body text-fg">{row.author}</span>,
  },
  {
    key: 'previous',
    header: 'ערך קודם',
    className: 'w-32',
    cell: (row) => <span className="text-body text-fg">{row.previous}</span>,
  },
  {
    key: 'current',
    header: 'ערך חדש',
    className: 'w-32',
    cell: (row) => <span className="text-body text-fg">{row.current}</span>,
  },
  {
    key: 'reason',
    header: 'סיבה',
    className: 'min-w-52',
    cell: (row) => <span className="text-body text-fg">{row.reason}</span>,
  },
];

export default function Screen() {
  return (
    <div className="space-y-4 p-4" dir="rtl">
      <PageHeader
        title="היסטוריית שינויי ציון"
        subtitle="תלמיד · מתמטיקה · מבחן מסכם"
        actions={
          <button type="button" className="rounded-md border border-line bg-surface px-3 py-2 text-body text-fg-secondary">
            היסטוריה
          </button>
        }
      />

      <section className="rounded-xl border border-line bg-surface p-3 shadow-xs">
        <Table
          caption="היסטוריית שינויי ציון"
          rows={rows}
          getRowId={(row) => row.id}
          columns={columns}
          className="w-full"
          wrapperClassName="overflow-x-auto"
          empty={<div className="p-4 text-center text-body text-fg-secondary">אין נתוני היסטוריה להצגה.</div>}
        />
      </section>
    </div>
  );
}
