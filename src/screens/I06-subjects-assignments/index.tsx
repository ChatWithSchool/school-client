import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { errorMessage } from '../../api/errors';
import {
  useCreateSubjectMutation,
  useGetTeachingAssignmentsQuery,
  useListSubjectsQuery,
  useUpdateTeachingAssignmentMutation,
  type Subject,
} from '../../api/subjectsAssignmentsApi';
import { ErrorState } from '../../components/StateViews';
import {
  Button,
  PageHeader,
  Select,
  Table,
  Tabs,
  TextField,
  useToast,
  type TableColumn,
} from '../../components/ui';

const gradeOptions = ['ז', 'ח', 'ט', 'י', 'יא', 'יב'];
const noTeacherValue = 'none';
const noClasses: { id: string; name: string; grade: string }[] = [];
const noSubjects: Subject[] = [];

function SubjectList({ subjects, loading }: { subjects: Subject[] | undefined; loading: boolean }) {
  const toast = useToast();
  const [createSubject, createState] = useCreateSubjectMutation();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [grades, setGrades] = useState<string[]>([]);

  const columns: TableColumn<Subject>[] = [
    { key: 'name', header: 'שם המקצוע', cell: (subject) => subject.name },
    { key: 'code', header: 'קוד', cell: (subject) => subject.code, numeric: true },
    { key: 'grades', header: 'שכבות', cell: (subject) => subject.grades.join(', ') },
    { key: 'actions', header: 'פעולות', cell: () => '—' },
  ];

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await createSubject({ name: name.trim(), code: code.trim(), grades }).unwrap();
      setName('');
      setCode('');
      setGrades([]);
      toast({ tone: 'success', message: 'המקצוע נוסף בהצלחה' });
    } catch (error) {
      toast({ tone: 'danger', message: errorMessage(error) });
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={submit}
        className="grid gap-4 rounded-xl border border-line bg-surface p-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end"
      >
        <TextField
          label="שם המקצוע"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          minLength={2}
          maxLength={80}
        />
        <TextField
          label="קוד"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          required
          minLength={2}
          maxLength={12}
        />
        <Select
          label="שכבות"
          multi
          value={grades}
          onValueChange={setGrades}
          options={gradeOptions.map((grade) => ({ value: grade, label: grade }))}
          placeholder="בחרו שכבות"
          required
        />
        <Button type="submit" loading={createState.isLoading} disabled={!name.trim() || !code.trim() || !grades.length}>
          הוספת מקצוע
        </Button>
      </form>

      <Table
        caption="רשימת המקצועות"
        columns={columns}
        rows={subjects}
        getRowId={(subject) => subject.id}
        loading={loading}
        empty={<span>עדיין לא הוגדרו מקצועות.</span>}
      />
    </div>
  );
}

function AssignmentForm({
  data,
  loading,
}: {
  data:
    | {
        classes: { id: string; name: string; grade: string }[];
        teachers: { id: string; firstName: string; lastName: string }[];
        assignments: { classId: string; subjectId: string; teacherId: string }[];
      }
    | undefined;
  loading: boolean;
}) {
  const toast = useToast();
  const [grade, setGrade] = useState('all');
  const [classId, setClassId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [saveAssignment, saveState] = useUpdateTeachingAssignmentMutation();
  const subjectsQuery = useListSubjectsQuery();

  const classes = data?.classes ?? noClasses;
  const subjects = subjectsQuery.data?.items ?? noSubjects;
  const visibleClasses = grade === 'all' ? classes : classes.filter((item) => item.grade === grade);
  const selectedAssignment = data?.assignments.find(
    (assignment) => assignment.classId === classId && assignment.subjectId === subjectId,
  );
  const layerOptions = useMemo(
    () => [...new Set(classes.map((item) => item.grade))],
    [classes],
  );

  useEffect(() => {
    if (!visibleClasses.some((item) => item.id === classId)) setClassId(visibleClasses[0]?.id ?? '');
  }, [classId, visibleClasses]);

  useEffect(() => {
    if (!subjects.some((item) => item.id === subjectId)) setSubjectId(subjects[0]?.id ?? '');
  }, [subjectId, subjects]);

  const changeAssignment = async (teacherValue: string) => {
    if (!classId || !subjectId) return;
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

  if (subjectsQuery.isError) {
    return <ErrorState message={errorMessage(subjectsQuery.error)} onRetry={subjectsQuery.refetch} />;
  }
  if (loading || subjectsQuery.isLoading) return <div role="status">טוען נתונים…</div>;
  if (!classes.length || !subjects.length) {
    return <p className="rounded-lg border border-line bg-surface p-5 text-body text-fg-secondary">כדי לשייך מורה, צריך להגדיר תחילה כיתות ומקצועות.</p>;
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
            ...layerOptions.map((item) => ({ value: item, label: item })),
          ]}
        />
        <Select
          label="כיתה"
          value={classId}
          onValueChange={setClassId}
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
            ...(data?.teachers ?? []).map((teacher) => ({
              value: teacher.id,
              label: `${teacher.firstName} ${teacher.lastName}`,
            })),
          ]}
          disabled={saveState.isLoading}
        />
        {!selectedAssignment && (
          <p className="mt-2 text-body text-warning-700">עדיין לא משויך מורה למקצוע בכיתה שנבחרה.</p>
        )}
      </section>
    </div>
  );
}

export default function Screen() {
  const subjects = useListSubjectsQuery();
  const assignments = useGetTeachingAssignmentsQuery();

  return (
    <div className="min-h-full bg-page p-6">
      <div className="mx-auto max-w-7xl rounded-xl bg-page p-5">
        <PageHeader title="מקצועות ושיוכי הוראה" className="mb-5" />

        {(subjects.isError || assignments.isError) && (
          <div className="mb-4">
            <ErrorState
              message={errorMessage(subjects.error ?? assignments.error)}
              onRetry={() => {
                void subjects.refetch();
                void assignments.refetch();
              }}
            />
          </div>
        )}

        <Tabs
          label="לשוניות מקצועות ושיוך הוראה"
          defaultValue="assignments"
          className="w-full"
          items={[
            {
              value: 'subjects',
              label: 'מקצועות',
              content: subjects.isError ? null : (
                <SubjectList subjects={subjects.data?.items} loading={subjects.isLoading} />
              ),
            },
            {
              value: 'assignments',
              label: 'שיוך הוראה',
              content: assignments.isError ? null : (
                <AssignmentForm
                  data={assignments.data}
                  loading={assignments.isLoading}
                />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
