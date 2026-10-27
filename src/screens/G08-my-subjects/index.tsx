import { useNavigate } from 'react-router-dom';
import type { TeachingCard } from '../../api/mySubjectsApi';
import { useListMyTeachingQuery } from '../../api/mySubjectsApi';
import { EmptyState, ErrorState, ForbiddenState, LoadingSkeleton } from '../../components/StateViews';
import { usePermission } from '../../features/auth/usePermission';
import { card, cx, text, btn } from '../../styles/recipes';
import { SUBJECTS, CLASSES } from '../../mocks/shared';

function subjectName(subjectId: string) {
  return SUBJECTS.find((s) => s.id === subjectId)?.name ?? subjectId;
}

function className(classId: string) {
  return CLASSES.find((c) => c.id === classId)?.name ?? classId;
}

function SubjectCard({ item }: { item: TeachingCard }) {
  const navigate = useNavigate();
  const hasUrgent = item.openAssessments > 0 || item.studentsWithoutGrade > 0;

  return (
    <div className={cx(card, hasUrgent ? 'ring-2 ring-warning-500' : '')}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className={text.h3}>
            {className(item.classId)} · {subjectName(item.subjectId)}
          </h2>
          <div className={cx(text.muted, 'mt-1 flex gap-4')}>
            <span>מבחנים פתוחים: {item.openAssessments}</span>
            <span>תלמידים ללא ציון: {item.studentsWithoutGrade}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className={btn.primary}
          onClick={() => navigate(`/grades/entry?classId=${item.classId}&subjectId=${item.subjectId}`)}
        >
          הזנת ציונים
        </button>
        <button
          type="button"
          className={btn.secondary}
          onClick={() => navigate(`/assessments/new?classId=${item.classId}&subjectId=${item.subjectId}`)}
        >
          מבחן חדש
        </button>
        <button
          type="button"
          className={btn.secondary}
          onClick={() => navigate(`/grades/stats?classId=${item.classId}&subjectId=${item.subjectId}`)}
        >
          סטטיסטיקות
        </button>
      </div>
    </div>
  );
}

export default function Screen() {
  const level = usePermission('G08');
  const { data, isLoading, isError, error, refetch } = useListMyTeachingQuery();

  if ((error as { status?: number } | undefined)?.status === 403) return <ForbiddenState />;
  if (isLoading) return <LoadingSkeleton />;
  if (isError) return <ErrorState message="שגיאה בטעינת המקצועות" onRetry={refetch} />;

  if (data && data.items.length === 0)
    return <EmptyState title="אין מקצועות" text="עוד לא שויכת לכיתה. פני להנהלה." />;

  return (
    <div className="space-y-4">
      <h1 className={text.h1}>המקצועות שלי</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {data?.items.map((item) => (
          <SubjectCard key={`${item.classId}-${item.subjectId}`} item={item} />
        ))}
      </div>
    </div>
  );
}
