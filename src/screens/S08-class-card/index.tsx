import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  PageHeader,
  Button,
  MetricCard,
  Table,
  Avatar,
  Tag,
  EmptyState,
} from '../../components/ui';
import type { TableColumn } from '../../components/ui';
import { LoadingSkeleton, ErrorState, ForbiddenState } from '../../components/StateViews';

interface ClassStudent {
  id: string;
  name: string;
  attendanceRate: string;
  gradeAverage: number;
  tags: string[];
  hasAlert?: boolean;
}

interface ClassOverview {
  id: string;
  name: string;
  homeroomTeacher: string;
  studentCount: number;
  monthlyAttendance: string;
  classAverage: string;
  alertsCount: number;
  students: ClassStudent[];
}

const MOCK_CLASSES: Record<string, ClassOverview> = {
  'h1': {
    id: 'h1',
    name: 'כיתה ח1',
    homeroomTeacher: 'אבי דוד',
    studentCount: 4,
    monthlyAttendance: '92%',
    classAverage: '87.5',
    alertsCount: 1,
    students: [
      { id: '1', name: 'נועם ביטון', attendanceRate: '98%', gradeAverage: 92, tags: ['מצטיין'] },
      { id: '2', name: 'יובל קליין', attendanceRate: '94%', gradeAverage: 88, tags: [] },
      { id: '3', name: 'עדי פרץ', attendanceRate: '76%', gradeAverage: 79, tags: ['מעקב'], hasAlert: true },
      { id: '4', name: 'ליאור דוד', attendanceRate: '99%', gradeAverage: 91, tags: ['חדש'] },
    ],
  },
  'z1': {
    id: 'z1',
    name: 'כיתה ז1',
    homeroomTeacher: 'דנה כהן',
    studentCount: 2,
    monthlyAttendance: '95%',
    classAverage: '89.0',
    alertsCount: 0,
    students: [
      { id: '5', name: 'תום לוי', attendanceRate: '94%', gradeAverage: 86, tags: ['תמיכה'] },
      { id: '6', name: 'שירה גל', attendanceRate: '96%', gradeAverage: 92, tags: [] },
    ],
  },
};

async function fetchClassOverview(classId: string): Promise<ClassOverview> {
  await new Promise((resolve) => setTimeout(resolve, 450));
  return MOCK_CLASSES[classId] ?? MOCK_CLASSES['h1'];
}

export default function ClassCardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const classId = searchParams.get('classId') ?? 'h1';

  const [overview, setOverview] = useState<ClassOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forbidden] = useState(false);

  const loadOverview = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchClassOverview(classId);
      setOverview(data);
    } catch {
      setError('אירעה שגיאה בטעינת נתוני הכיתה');
    } finally {
      setIsLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const handleSelectClass = (nextId: string) => {
    setSearchParams({ classId: nextId }, { replace: true });
  };

  const columns: TableColumn<ClassStudent>[] = [
    {
      key: 'name',
      header: 'שם',
      cell: (student) => (
        <button
          type="button"
          className="inline-flex items-center gap-2 font-medium text-fg-primary hover:underline cursor-pointer"
          onClick={() => navigate(`/students?studentId=${student.id}`)}
        >
          <Avatar name={student.name} size="S" />
          <span>{student.name}</span>
        </button>
      ),
    },
    {
      key: 'attendance',
      header: 'נוכחות',
      cell: (student) => (
        <span className="tabular-nums" dir="ltr">
          {student.attendanceRate}
        </span>
      ),
    },
    {
      key: 'average',
      header: 'ממוצע',
      cell: (student) => (
        <span className="tabular-nums" dir="ltr">
          {student.gradeAverage}
        </span>
      ),
    },
    {
      key: 'tags',
      header: 'תגיות',
      cell: (student) => (
        <div className="inline-flex flex-wrap gap-1 justify-center">
          {student.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6" dir="rtl">
      {isLoading ? (
        <LoadingSkeleton rows={5} />
      ) : forbidden ? (
        <ForbiddenState />
      ) : error ? (
        <ErrorState message={error} onRetry={loadOverview} />
      ) : !overview ? (
        <EmptyState variant="first-use" title="אין נתונים להצגה עבור כיתה זו" />
      ) : (
        <>
          <PageHeader
            title={overview.name}
            subtitle={`מחנך/ת: ${overview.homeroomTeacher} · ${overview.studentCount} תלמידים`}
            actions={
              <div className="flex flex-wrap gap-2" aria-label="פעולות כיתה">
                <Button
                  variant="secondary"
                  size="S"
                  onClick={() => handleSelectClass(overview.id === 'h1' ? 'z1' : 'h1')}
                >
                  החלף כיתה ({overview.id === 'h1' ? 'ז1' : 'ח1'})
                </Button>
                <Button
                  variant="secondary"
                  size="S"
                  onClick={() => navigate(`/attendance?classId=${overview.id}`)}
                >
                  סימון נוכחות
                </Button>
                <Button
                  variant="secondary"
                  size="S"
                  onClick={() => navigate(`/grades?classId=${overview.id}`)}
                >
                  הזנת ציונים
                </Button>
                <Button
                  variant="primary"
                  size="S"
                  onClick={() => navigate(`/timetable?classId=${overview.id}`)}
                >
                  מערכת שעות הכיתה
                </Button>
              </div>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              label="נוכחות החודש"
              value={overview.monthlyAttendance}
            />
            <MetricCard
              label="ממוצע ציונים"
              value={overview.classAverage}
            />
            <MetricCard
              label="תלמידים עם התראה"
              value={String(overview.alertsCount)}
            />
          </div>

          <section className="flex flex-col gap-3">
            <h2 className="text-h2 font-semibold text-fg-primary">תלמידי הכיתה</h2>
            <Table
              caption={`תלמידי ${overview.name}`}
              columns={columns}
              rows={overview.students}
              getRowId={(student) => student.id}
              empty={<EmptyState variant="first-use" title="אין תלמידים רשומים בכיתה זו" />}
            />
          </section>
        </>
      )}
    </div>
  );
}