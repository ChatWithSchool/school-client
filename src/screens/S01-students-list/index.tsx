import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageHeader,
  Button,
  SearchField,
  Select,
  Table,
  Pagination,
  Avatar,
  Badge,
  Tag,
  DropdownMenu,
  EmptyState,
} from '../../components/ui';
import type { TableColumn } from '../../components/ui';
import { LoadingSkeleton, ErrorState, ForbiddenState } from '../../components/StateViews';

interface Student {
  id: string;
  name: string;
  className: string;
  parentName: string;
  parentPhone: string;
  attendance: string;
  tags: string[];
  status: 'נוכח' | 'איחור' | 'נעדר';
}

const MOCK_STUDENTS: Student[] = [
  { id: '1', name: 'נועם ביטון', className: 'ח1', parentName: 'עמית ביטון', parentPhone: '050-000-0000', attendance: '98%', tags: ['חדש'], status: 'נוכח' },
  { id: '2', name: 'יובל קליין', className: 'ח1', parentName: 'שי קליין', parentPhone: '050-000-0001', attendance: '94%', tags: [], status: 'נוכח' },
  { id: '3', name: 'עדי פרץ', className: 'ח2', parentName: 'יובל פרץ', parentPhone: '050-000-0002', attendance: '71%', tags: ['מעקב'], status: 'איחור' },
  { id: '4', name: 'תום לוי', className: 'ז1', parentName: 'רון לוי', parentPhone: '050-000-0003', attendance: '88%', tags: ['תמיכה'], status: 'נוכח' },
  { id: '5', name: 'מיה כהן', className: 'ז2', parentName: 'דנה כהן', parentPhone: '050-000-0004', attendance: '100%', tags: ['חדש'], status: 'נוכח' },
  { id: '6', name: 'אור שמש', className: 'ט1', parentName: 'גל שמש', parentPhone: '050-000-0005', attendance: '65%', tags: ['מעקב', 'תמיכה'], status: 'נעדר' },
  { id: '7', name: 'ליאור דוד', className: 'ח3', parentName: 'אבי דוד', parentPhone: '050-000-0006', attendance: '92%', tags: [], status: 'נוכח' },
  { id: '8', name: 'שירה גל', className: 'ז1', parentName: 'נועה גל', parentPhone: '050-000-0007', attendance: '85%', tags: ['חוג'], status: 'איחור' },
  { id: '9', name: 'עמית רוז', className: 'ח2', parentName: 'יעל רוז', parentPhone: '050-000-0008', attendance: '97%', tags: [], status: 'נוכח' },
  { id: '10', name: 'נדב אלון', className: 'ט1', parentName: 'מרב אלון', parentPhone: '050-000-0009', attendance: '78%', tags: ['מעקב'], status: 'נוכח' },
];

const PAGE_SIZE = 8;

const STATUS_TONE = {
  נוכח: 'success',
  איחור: 'warning',
  נעדר: 'danger',
} as const;

const GRADE_OPTIONS = [
  { value: 'הכל', label: 'שכבה: הכל' },
  { value: 'ז', label: 'שכבה ז' },
  { value: 'ח', label: 'שכבה ח' },
  { value: 'ט', label: 'שכבה ט' },
];

const CLASS_OPTIONS = [
  { value: 'הכל', label: 'כיתה: הכל' },
  { value: 'ז1', label: 'ז1' },
  { value: 'ז2', label: 'ז2' },
  { value: 'ח1', label: 'ח1' },
  { value: 'ח2', label: 'ח2' },
  { value: 'ח3', label: 'ח3' },
  { value: 'ט1', label: 'ט1' },
];

const TAG_OPTIONS = [
  { value: 'הכל', label: 'תגית: הכל' },
  { value: 'חדש', label: 'חדש' },
  { value: 'מעקב', label: 'מעקב' },
  { value: 'תמיכה', label: 'תמיכה' },
  { value: 'חוג', label: 'חוג' },
];

const STATUS_OPTIONS = [
  { value: 'הכל', label: 'סטטוס: הכל' },
  { value: 'נוכח', label: 'נוכח' },
  { value: 'איחור', label: 'איחור' },
  { value: 'נעדר', label: 'נעדר' },
];

export default function StudentListPage() {
  const params = new URLSearchParams(window.location.search);
  const [search, setSearch] = useState(params.get('q') ?? '');
  const [selectedGrade, setSelectedGrade] = useState(params.get('grade') ?? 'הכל');
  const [selectedClass, setSelectedClass] = useState(params.get('class') ?? 'הכל');
  const [selectedTag, setSelectedTag] = useState(params.get('tag') ?? 'הכל');
  const [selectedStatus, setSelectedStatus] = useState(params.get('status') ?? 'הכל');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forbidden] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const COLUMNS: TableColumn<Student>[] = [
    {
      key: 'name',
      header: 'תלמיד',
      cell: (s) => (
        <div className="flex items-center gap-2">
          <Avatar name={s.name} size="M" />
          <span>{s.name}</span>
        </div>
      ),
    },
    { key: 'class', header: 'כיתה', cell: (s) => s.className },
    {
      key: 'parent',
      header: 'הורה ראשי',
      cell: (s) => (
        <div>
          <div>{s.parentName}</div>
          <div className="text-fg-muted text-label">{s.parentPhone}</div>
        </div>
      ),
    },
    { key: 'attendance', header: 'נוכחות החודש', cell: (s) => s.attendance, numeric: true },
    {
      key: 'tags',
      header: 'תגיות',
      cell: (s) => (
        <div className="flex flex-wrap gap-1">
          {s.tags.map((tag) => <Tag key={tag} label={tag} />)}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'סטטוס',
      cell: (s) => <Badge tone={STATUS_TONE[s.status]}>{s.status}</Badge>,
    },
    {
      key: 'actions',
      header: '',
      className: 'w-12',
      cell: (s) => (
        <DropdownMenu
          label={`פעולות עבור ${s.name}`}
          items={[
            { label: 'עריכה', icon: 'pencil', onSelect: () => navigate(`/students/s02?id=${s.id}`) },
            { label: 'צפייה בכרטיס', icon: 'user', onSelect: () => {} },
            { label: 'הסרה', icon: 'trash-2', tone: 'danger', onSelect: () => {} },
          ]}
        />
      ),
    },
  ];

  useEffect(() => {
    const p = new URLSearchParams();
    if (search) p.set('q', search);
    if (selectedClass !== 'הכל') p.set('class', selectedClass);
    if (selectedStatus !== 'הכל') p.set('status', selectedStatus);
    window.history.replaceState(null, '', p.toString() ? `?${p}` : window.location.pathname);
    setPage(1);
  }, [search, selectedGrade, selectedClass, selectedTag, selectedStatus]);

  const filtered = MOCK_STUDENTS.filter((s) => {
    const q = search.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/-/g, '');
    const name = s.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/-/g, '');
    const matchSearch = name.includes(q) || s.id.includes(q);
    const matchGrade = selectedGrade === 'הכל' || s.className.startsWith(selectedGrade);
    const matchClass = selectedClass === 'הכל' || s.className === selectedClass;
    const matchTag = selectedTag === 'הכל' || s.tags.includes(selectedTag);
    const matchStatus = selectedStatus === 'הכל' || s.status === selectedStatus;
    return matchSearch && matchGrade && matchClass && matchTag && matchStatus;
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const isEmpty = MOCK_STUDENTS.length === 0;

  return (
    <div className="flex flex-col gap-6 p-6" dir="rtl">
      <PageHeader
        title="תלמידים"
        subtitle={`412 תלמידים בשנת הלימודים הנוכחית`}
        actions={
          <>
            <Button variant="secondary" icon="leading" iconName="upload">
              ייבוא מקובץ
            </Button>
            <Button variant="primary" icon="leading" iconName="plus" onClick={() => navigate('/students/s02')}>
              תלמיד חדש
            </Button>
          </>
        }
      />

      {isLoading ? (
        <LoadingSkeleton rows={5} />
      ) : forbidden ? (
        <ForbiddenState />
      ) : error ? (
        <ErrorState message={error} onRetry={() => { setError(null); setIsLoading(true); setTimeout(() => setIsLoading(false), 600); }} />
      ) : (
        <>
      {/* סינון */}
      <div className="flex flex-wrap gap-3 items-end" role="search">
        <SearchField
          label="חיפוש תלמיד"
          placeholder="חיפוש שם או תעודת זהות..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-60"
        />
        <Select
          label="שכבה"
          options={GRADE_OPTIONS}
          value={selectedGrade}
          onValueChange={setSelectedGrade}
        />
        <Select
          label="כיתה"
          options={CLASS_OPTIONS}
          value={selectedClass}
          onValueChange={setSelectedClass}
        />
        <Select
          label="תגית"
          options={TAG_OPTIONS}
          value={selectedTag}
          onValueChange={setSelectedTag}
        />
        <Select
          label="סטטוס"
          options={STATUS_OPTIONS}
          value={selectedStatus}
          onValueChange={setSelectedStatus}
        />
      </div>

      {/* טבלה */}
      <Table
        caption="רשימת תלמידים"
        columns={COLUMNS}
        rows={pageRows}
        getRowId={(s) => s.id}
        selectable
        selectedIds={selectedIds}
        onSelectedChange={setSelectedIds}
        rowLabel={(s) => `בחירת ${s.name}`}
        empty={
          isEmpty ? (
            <EmptyState
              variant="first-use"
              title="עוד לא נוספו תלמידים"
              action={
                <div className="flex gap-2 justify-center">
                  <Button variant="primary" icon="leading" iconName="plus">תלמיד חדש</Button>
                  <Button variant="secondary" icon="leading" iconName="upload">ייבוא מקובץ</Button>
                </div>
              }
            />
          ) : (
            <EmptyState
              variant="no-results"
              title="לא נמצאו תלמידים מתאימים"
              action={
                <Button variant="ghost" onClick={() => { setSearch(''); setSelectedGrade('הכל'); setSelectedClass('הכל'); setSelectedTag('הכל'); setSelectedStatus('הכל'); }}>
                  איפוס סינון
                </Button>
              }
            />
          )
        }
      />

      {/* עימוד */}
      {filtered.length > 0 && (
        <div className="flex justify-between items-center" aria-label="עימוד">
          <span className="text-body text-fg-secondary">
            מציג {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} מתוך {filtered.length}
          </span>
          <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
        </div>
      )}
        </>
      )}
    </div>
  );
}
