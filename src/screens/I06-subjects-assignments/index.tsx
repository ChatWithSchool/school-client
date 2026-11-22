import { useEffect, useMemo, useState } from 'react';
import { errorMessage } from '../../api/errors';
import {
  useGetTeachingAssignmentsQuery,
  useListClassesQuery,
  useListSubjectsQuery,
  useListTeachersQuery,
  useUpdateTeachingAssignmentMutation,
  type Subject,
  type TeachingAssignment,
  type TeachingClass,
  type TeachingTeacher,
} from '../../api/subjectsAssignmentsApi';
import {
  ErrorState,
  ForbiddenState,
  LoadingSkeleton,
} from '../../components/StateViews';
import {
  PageHeader,
  Select,
  Table,
  Tabs,
  useToast,
  type TableColumn,
} from '../../components/ui';
import { canWrite, usePermission } from '../../features/auth/usePermission';

const noTeacherValue = 'none';

function SubjectList({
  subjects,
  loading,
}: {
  subjects: Subject[];
  loading: boolean;
}) {
  const columns: TableColumn<Subject>[] = [
    { key: 'name', header: 'שם המקצוע', cell: (subject) => subject.name },
    { key: 'code', header: 'קוד', cell: (subject) => subject.code, numeric: true },
    { key: 'grades', header: 'שכבות', cell: (subject) => subject.grades.join(', ') },
  ];

  return (
    <Table
      caption="רשימת המקצועות"
      columns={columns}
      rows={subjects}
      getRowId={(subject) => subject.id}
      loading={loading}
      empty={<span>עדיין לא הוגדרו מקצועות.</span>}
    />
  );
}

function AssignmentForm({
  classes,
  subjects,
  teachers,
  assignments,
  loading,
  writable,
  classId,
  onClassChange,
}: {
  classes: TeachingClass[];
  subjects: Subject[];
  teachers: TeachingTeacher[];
  assignments: TeachingAssignment[];
  loading: boolean;
  writable: boolean;
  classId: string;
  onClassChange: (classId: string) => void;
}) {
  const toast = useToast();
  const [grade, setGrade] = useState('all');
  const [subjectId, setSubjectId] = useState('');
  const [saveAssignment, saveState] = useUpdateTeachingAssignmentMutation();

  const visibleClasses = grade === 'all'
    ? classes
    : classes.filter((item) => item.grade === grade);
  const selectedAssignment = assignments.find(
    (assignment) => assignment.classId === classId && assignment.subjectId === subjectId,
  );
  const gradeOptionsList = useMemo(
    () => [...new Set(classes.map((item) => item.grade))],
    [classes],
  );

  useEffect(() => {
    if (!visibleClasses.some((item) => item.id === classId))
      onClassChange(visibleClasses[0]?.id ?? '');
  }, [classId, onClassChange, visibleClasses]);

  useEffect(() => {
    if (!subjects.some((item) => item.id === subjectId))
      setSubjectId(subjects[0]?.id ?? '');
  }, [subjectId, subjects]);

  const changeAssignment = async (teacherValue: string) => {
    if (!classId || !subjectId || !writable) return;
    try {
      await saveAssignment({
        classId,
        subjectId,
        teacherId: teacherValue === noTeacherValue ? null : teacherValue,
      }).unwrap();
      toast({ tone: 'success', message: 'שיוך ההוראה נשמר' });
    } catch (error) {
      toast({ tone: 'danger', message: errorMessage(error) });
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (!classes.length || !subjects.length) {
    return (
      <p className="rounded-lg border border-line bg-surface p-5 text-body text-fg-secondary">
        כדי לשייך מורה, צריך להגדיר תחילה כיתות ומקצועות.
      </p>
    );
  }

  return (
    <div className="max-w-3xl space-y-5">
      <div className="grid gap-4 rounded-xl border border-line bg-surface p-4 sm:grid-cols-2 lg:grid-cols-3">
        <Select
          label="שכבה"
          value={grade}
          onValueChange={setGrade}
          options={[
            { value: 'all', label: 'הכל' },
            ...gradeOptionsList.map((item) => ({ value: item, label: item })),
          ]}
        />
        <Select
          label="כיתה"
          value={classId}
          onValueChange={onClassChange}
          options={visibleClasses.map((item) => ({ value: item.id, label: item.name }))}
          disabled={!visibleClasses.length}
        />
        <Select
          label="מקצוע"
          value={subjectId}
          onValueChange={setSubjectId}
          options={subjects.map((item) => ({ value: item.id, label: item.name }))}
        />
      </div>

      <section className="rounded-xl border border-line bg-surface p-5">
        <h2 className="mb-4 text-h3 text-fg">שיוך מורה לכיתה</h2>
        <Select
          label="מורה"
          value={selectedAssignment?.teacherId ?? noTeacherValue}
          onValueChange={(value) => void changeAssignment(value)}
          options={[
            { value: noTeacherValue, label: 'ללא שיוך' },
            ...teachers.map((teacher) => ({
              value: teacher.id,
              label: `${teacher.firstName} ${teacher.lastName}`,
            })),
          ]}
          disabled={!writable || saveState.isLoading}
        />
        {!selectedAssignment && (
          <p className="mt-2 text-body text-warning-700">
            עדיין לא משויך מורה למקצוע בכיתה שנבחרה.
          </p>
        )}
      </section>
    </div>
  );
}

export default function Screen() {
  const level = usePermission('I06');
  const subjects = useListSubjectsQuery();
  const classes = useListClassesQuery();
  const staff = useListTeachersQuery();
  const [classId, setClassId] = useState('');

  useEffect(() => {
    if (!classId && classes.data?.items.length)
      setClassId(classes.data.items[0].id);
  }, [classId, classes.data]);

  const assignments = useGetTeachingAssignmentsQuery(classId, { skip: !classId });
  const forbidden =
    (subjects.error as { status?: number } | undefined)?.status === 403 ||
    (classes.error as { status?: number } | undefined)?.status === 403 ||
    (staff.error as { status?: number } | undefined)?.status === 403 ||
    (assignments.error as { status?: number } | undefined)?.status === 403;

  if (forbidden) return <ForbiddenState />;

  const error = subjects.error ?? classes.error ?? staff.error ?? assignments.error;
  if (subjects.isError || classes.isError || staff.isError || assignments.isError) {
    return (
      <div className="min-h-full bg-page p-6">
        <ErrorState
          message={errorMessage(error)}
          onRetry={() => {
            void subjects.refetch();
            void classes.refetch();
            void staff.refetch();
            void assignments.refetch();
          }}
        />
      </div>
    );
  }

  const loading =
    subjects.isLoading ||
    classes.isLoading ||
    staff.isLoading ||
    Boolean(classId && assignments.isLoading);

  return (
    <div className="min-h-full bg-page p-6">
      <div className="mx-auto max-w-7xl rounded-xl bg-page p-5">
        <PageHeader title="מקצועות ושיוכי הוראה" className="mb-5" />

        {loading ? (
          <LoadingSkeleton />
        ) : (
          <Tabs
            label="לשוניות מקצועות ושיוך הוראה"
            defaultValue="assignments"
            className="w-full"
            items={[
              {
                value: 'subjects',
                label: 'מקצועות',
                content: (
                  <SubjectList
                    subjects={subjects.data?.items ?? []}
                    loading={subjects.isLoading}
                  />
                ),
              },
              {
                value: 'assignments',
                label: 'שיוך הוראה',
                content: (
                  <AssignmentForm
                    classes={classes.data?.items ?? []}
                    subjects={subjects.data?.items ?? []}
                    teachers={staff.data?.items ?? []}
                    assignments={assignments.data?.items ?? []}
                    loading={Boolean(classId && assignments.isLoading)}
                    writable={canWrite(level)}
                    classId={classId}
                    onClassChange={setClassId}
                  />
                ),
              },
            ]}
          />
        )}
      </div>
    </div>
  );
}
