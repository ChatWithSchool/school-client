import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

export interface Student {
  id: string;
  name: string;
  className: string;
  parentName: string;
  parentPhone: string;
  attendance: string;
  tags: string[];
  status: 'נוכח' | 'איחור' | 'נעדר';
}

type StudentStatus = Student['status'];
type BadgeTone = 'success' | 'warning' | 'danger';

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

async function fetchStudents(): Promise<Student[]> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return MOCK_STUDENTS;
}

function usePermission(_screenId: string): { canWrite: boolean } {
  return { canWrite: true };
}

function pathFor(screenId: 'S01' | 'S02'): string {
  return screenId === 'S02' ? '/students/s02' : '/students';
}

const PAGE_SIZE = 8;

const STATUS_TONE: Record<StudentStatus, BadgeTone> = {
  נוכח: 'success',
  איחור: 'warning',
  נעדר: 'danger',
};

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

const STATUS_OPTIONS = [
  { value: 'הכל', label: 'סטטוס: הכל' },
  { value: 'נוכח', label: 'נוכח' },
  { value: 'איחור', label: 'איחור' },
  { value: 'נעדר', label: 'נעדר' },
];

export default function StudentListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') ?? '');
  const [selectedGrade, setSelectedGrade] = useState(searchParams.get('grade') ?? 'הכל');
  const [selectedClass, setSelectedClass] = useState(searchParams.get('class') ?? 'הכל');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') ?? 'הכל');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forbidden] = useState(false);

  const navigate = useNavigate();
  const { canWrite } = usePermission('S01');

  const loadStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchStudents();
      setStudents(data);
    } catch {
      setError('אירעה שגיאה בטעינת רשימת התלמידים');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const COLUMNS: TableColumn<Student>[] = [
    {
      key: 'name',
      header: 'תלמיד',
      cell: (s) => (
        <div className="inline-flex items-center justify-center gap-2">
          <Avatar name={s.name} size="M" />
          <span className="whitespace-nowrap">{s.name}</span>
        </div>
      ),
    },
    {
      key: 'class',
      header: 'כיתה',
      cell: (s) => <span className="inline-block whitespace-nowrap">{s.className}</span>,
    },
    {
      key: 'parent',
      header: 'הורה ראשי',
      cell: (s) => (
        <div className="inline-flex flex-col items-center justify-center text-center">
          <div className="whitespace-nowrap">{s.parentName}</div>
          <div className="text-fg-muted text-label whitespace-nowrap" dir="ltr">
            {s.parentPhone}
          </div>
        </div>
      ),
    },
    {
      key: 'attendance',
      header: 'נוכחות החודש',
      cell: (s) => (
        <span className="inline-block whitespace-nowrap tabular-nums" dir="ltr">
          {s.attendance}
        </span>
      ),
    },
    {
      key: 'tags',
      header: 'תגיות',
      cell: (s) => (
        <div className="inline-flex flex-wrap items-center justify-center gap-1">
          {(s.tags ?? []).map((tag: string) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'סטטוס',
      cell: (s) => (
        <div className="inline-flex items-center justify-center">
          <Badge tone={STATUS_TONE[s.status]}>{s.status}</Badge>
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-12',
      cell: (s) => {
        const items = [
          ...(canWrite
            ? [
                {
                  label: 'עריכה',
                  icon: 'pencil' as const,
                  onSelect: () => navigate(`${pathFor('S02')}?id=${s.id}`),
                },
              ]
            : []),
          { label: 'צפייה בכרטיס', icon: 'user' as const, onSelect: () => {} },
          ...(canWrite
            ? [
                {
                  label: 'הסרה',
                  icon: 'trash-2' as const,
                  tone: 'danger' as const,
                  onSelect: () => {},
                },
              ]
            : []),
        ];

        return (
          <div className="inline-flex items-center justify-center">
            <DropdownMenu label={`פעולות עבור ${s.name}`} items={items} />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    const nextParams = new URLSearchParams();
    if (search) nextParams.set('q', search);
    if (selectedGrade !== 'הכל') nextParams.set('grade', selectedGrade);
    if (selectedClass !== 'הכל') nextParams.set('class', selectedClass);
    if (selectedStatus !== 'הכל') nextParams.set('status', selectedStatus);
    setSearchParams(nextParams, { replace: true });
    setPage(1);
  }, [search, selectedGrade, selectedClass, selectedStatus, setSearchParams]);

  const filtered = students.filter((s) => {
    const q = search.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/-/g, '');
    const name = s.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/-/g, '');
    const matchSearch = name.includes(q) || s.id.includes(q);
    const matchGrade = selectedGrade === 'הכל' || s.className.startsWith(selectedGrade);
    const matchClass = selectedClass === 'הכל' || s.className === selectedClass;
    const matchStatus = selectedStatus === 'הכל' || s.status === selectedStatus;
    return matchSearch && matchGrade && matchClass && matchStatus;
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const isEmpty = students.length === 0;

  return (
    <div className="flex flex-col gap-6 p-6" dir="rtl">
      <style>{`
        .student-table-wrap th,
        .student-table-wrap td {
          text-align: center !important;
          vertical-align: middle !important;
        }
        .student-table-wrap th > div,
        .student-table-wrap th > button {
          justify-content: center !important;
          margin-inline: auto !important;
        }
      `}</style>

      <PageHeader
        title="תלמידים"
        subtitle="412 תלמידים בשנת הלימודים הנוכחית"
        actions={
          canWrite && (
            <>
              <Button variant="secondary" icon="leading" iconName="upload">
                ייבוא מקובץ
              </Button>
              <Button
                variant="primary"
                icon="leading"
                iconName="plus"
                onClick={() => navigate(pathFor('S02'))}
              >
                תלמיד חדש
              </Button>
            </>
          )
        }
      />

      {isLoading ? (
        <LoadingSkeleton rows={5} />
      ) : forbidden ? (
        <ForbiddenState />
      ) : error ? (
        <ErrorState message={error} onRetry={loadStudents} />
      ) : (
        <>
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
              label="סטטוס"
              options={STATUS_OPTIONS}
              value={selectedStatus}
              onValueChange={setSelectedStatus}
            />
          </div>

          <div className="student-table-wrap">
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
                      canWrite && (
                        <div className="flex gap-2 justify-center">
                          <Button
                            variant="primary"
                            icon="leading"
                            iconName="plus"
                            onClick={() => navigate(pathFor('S02'))}
                          >
                            תלמיד חדש
                          </Button>
                          <Button variant="secondary" icon="leading" iconName="upload">
                            ייבוא מקובץ
                          </Button>
                        </div>
                      )
                    }
                  />
                ) : (
                  <EmptyState
                    variant="no-results"
                    title="לא נמצאו תלמידים מתאימים"
                    action={
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setSearch('');
                          setSelectedGrade('הכל');
                          setSelectedClass('הכל');
                          setSelectedStatus('הכל');
                        }}
                      >
                        איפוס סינון
                      </Button>
                    }
                  />
                )
              }
            />
          </div>

          {filtered.length > 0 && (
            <div className="flex justify-between items-center" aria-label="עימוד">
              <span className="text-body text-fg-secondary">
                מציג {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} מתוך{' '}
                {filtered.length}
              </span>
              <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
            </div>
          )}
        </>
      )}
    </div>
  );
}