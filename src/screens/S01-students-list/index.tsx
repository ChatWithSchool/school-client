import { useMemo, useState } from 'react';
import { Badge, Button, PageHeader, Pagination, SearchField, Select, Table } from '../../components/ui';
import { Icon } from '../../components/Icon';
import { cx } from '../../styles/recipes';

type StudentRow = {
  id: string;
  name: string;
  className: string;
  parent: string;
  status: 'פעיל' | 'במעקב' | 'לא פעיל';
  tags: string[];
};

const ROWS: StudentRow[] = [
  { id: 'stu-1', name: 'נוי לוי', className: 'ז1', parent: 'שירה לוי', status: 'פעיל', tags: ['מעקב'] },
  { id: 'stu-2', name: 'יובל כהן', className: 'ח2', parent: 'אוהד כהן', status: 'במעקב', tags: ['תגבור'] },
  { id: 'stu-3', name: 'אור דהן', className: 'ח1', parent: 'ליאת דהן', status: 'פעיל', tags: [] },
  { id: 'stu-4', name: 'נועה פרץ', className: 'ט1', parent: 'רועי פרץ', status: 'לא פעיל', tags: ['הערה'] },
  { id: 'stu-5', name: 'ליאור שמיר', className: 'ז2', parent: 'דנה שמיר', status: 'פעיל', tags: [] },
  { id: 'stu-6', name: 'מיה ברק', className: 'ח3', parent: 'רמי ברק', status: 'במעקב', tags: ['שיחה'] },
];

const CLASS_OPTIONS = [
  { value: 'all', label: 'כל הכיתות' },
  { value: 'ז1', label: 'ז1' },
  { value: 'ז2', label: 'ז2' },
  { value: 'ח1', label: 'ח1' },
  { value: 'ח2', label: 'ח2' },
  { value: 'ח3', label: 'ח3' },
  { value: 'ט1', label: 'ט1' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'כל הסטטוסים' },
  { value: 'active', label: 'פעיל' },
  { value: 'monitoring', label: 'במעקב' },
  { value: 'inactive', label: 'לא פעיל' },
];

const TAG_OPTIONS = [
  { value: 'all', label: 'כל התגיות' },
  { value: 'מעקב', label: 'מעקב' },
  { value: 'תגבור', label: 'תגבור' },
  { value: 'הערה', label: 'הערה' },
  { value: 'שיחה', label: 'שיחה' },
];

const toneByStatus = {
  פעיל: 'success',
  במעקב: 'warning',
  'לא פעיל': 'neutral',
} as const;

export default function Screen() {
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredRows = useMemo(() => {
    const q = search.trim();
    return ROWS.filter((row) => {
      const matchesQuery =
        q.length === 0 ||
        row.name.includes(q) ||
        row.parent.includes(q) ||
        row.className.includes(q);
      const matchesClass = classFilter === 'all' || row.className === classFilter;
      const statusMatch =
        statusFilter === 'all' ||
        (statusFilter === 'active' && row.status === 'פעיל') ||
        (statusFilter === 'monitoring' && row.status === 'במעקב') ||
        (statusFilter === 'inactive' && row.status === 'לא פעיל');
      const matchesTag =
        tagFilter === 'all' || row.tags.some((tag) => tag === tagFilter);
      return matchesQuery && matchesClass && statusMatch && matchesTag;
    });
  }, [classFilter, search, statusFilter, tagFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / 3));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filteredRows.slice((currentPage - 1) * 3, currentPage * 3);

  const columns = [
    { key: 'name', header: 'שם', cell: (row: StudentRow) => row.name },
    { key: 'className', header: 'כיתה', cell: (row: StudentRow) => row.className },
    { key: 'parent', header: 'הורה ראשי', cell: (row: StudentRow) => row.parent },
    {
      key: 'tags',
      header: 'תגיות',
      cell: (row: StudentRow) => (
        <div className="flex flex-wrap gap-1">
          {row.tags.length ? (
            row.tags.map((tag) => (
              <Badge key={tag} tone="neutral" size="S">
                {tag}
              </Badge>
            ))
          ) : (
            <span className="text-fg-muted">—</span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'סטטוס',
      cell: (row: StudentRow) => (
        <Badge tone={toneByStatus[row.status]} size="S">
          {row.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-5" dir="rtl">
      <PageHeader
        title="תלמידים"
        subtitle="412 תלמידים במערכת"
        actions={
          <>
            <Button
              variant="primary"
              icon="leading"
              iconName="plus"
              onClick={() => undefined}
              aria-label="תלמיד חדש"
            >
              תלמיד חדש
            </Button>
            <Button
              variant="primary"
              icon="leading"
              iconName="upload"
              onClick={() => undefined}
              aria-label="ייבוא מקובץ"
            >
              ייבוא מקובץ
            </Button>
          </>
        }
      />

      <div className="rounded-xl border border-line bg-surface p-4 shadow-xs">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="min-w-[260px] flex-1">
            <SearchField
              label="חיפוש תלמיד"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="חיפוש לפי שם, ת.ז. או הורה"
              className="w-full"
            />
          </div>

          <div className="w-32">
            <Select
              label="שכבה"
              options={CLASS_OPTIONS}
              value={classFilter}
              onValueChange={(next) => {
                setClassFilter(next);
                setPage(1);
              }}
            />
          </div>

          <div className="w-32">
            <Select
              label="סטטוס"
              options={STATUS_OPTIONS}
              value={statusFilter}
              onValueChange={(next) => {
                setStatusFilter(next);
                setPage(1);
              }}
            />
          </div>

          <div className="w-32">
            <Select
              label="תגית"
              options={TAG_OPTIONS}
              value={tagFilter}
              onValueChange={(next) => {
                setTagFilter(next);
                setPage(1);
              }}
            />
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-body text-fg-secondary">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-50 text-primary-700">
              <Icon name="filter" size={16} />
            </span>
            <span>מסננים</span>
          </div>
          <button
            type="button"
            className={cx(
              'inline-flex items-center gap-2 rounded-md px-2 py-1 text-body text-fg-secondary hover:bg-subtle',
            )}
            onClick={() => {
              setSearch('');
              setClassFilter('all');
              setStatusFilter('all');
              setTagFilter('all');
              setPage(1);
            }}
          >
            <Icon name="undo-2" size={16} />
            איפוס
          </button>
        </div>

        <Table
          caption="רשימת תלמידים"
          columns={columns}
          rows={pageRows}
          getRowId={(row) => row.id}
          density="comfortable"
          selectable
          selectedIds={selectedIds}
          onSelectedChange={setSelectedIds}
          rowLabel={(row) => `בחירת ${row.name}`}
          empty={
            <div className="space-y-2 text-center">
              <p className="text-body-strong text-fg">לא נמצאו תלמידים מתאימים</p>
              <p className="text-body text-fg-secondary">נסו לעדכן את הסינון או להוסיף תלמיד חדש.</p>
            </div>
          }
        />

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button type="button" className="h-8 w-8 rounded-md border border-line bg-surface text-body text-fg">
              3
            </button>
            <button type="button" className="h-8 w-8 rounded-md border border-line bg-surface text-body text-fg">
              2
            </button>
            <button type="button" className="h-8 w-8 rounded-md bg-primary-600 text-body-strong text-white">
              1
            </button>
          </div>
          <div className="text-body text-fg-secondary">מציג 1 עד 3 מתוך {filteredRows.length} תלמידים</div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
          <div className="flex items-center gap-2">
            <Pagination page={currentPage} pageCount={totalPages} onPageChange={setPage} />
          </div>
          <div className="text-body text-fg-secondary">תצוגה: 25 / 50 / 100</div>
        </div>
      </div>
    </div>
  );
}
