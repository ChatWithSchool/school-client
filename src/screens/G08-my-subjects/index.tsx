import { useNavigate } from 'react-router-dom';
import { errorMessage } from '../../api/errors';
import { useGetMyTeachingQuery, type TeachingCard } from '../../api/teachingApi';
import { ErrorState, ForbiddenState, LoadingSkeleton } from '../../components/StateViews';
import { Button, EmptyState, MetricCard, PageHeader } from '../../components/ui';
import { canWrite, usePermission } from '../../features/auth/usePermission';
import { pathFor } from '../../routes/screens';

/** The empty line under each number: the cards keep the height of the Figma frame. */
const NO_TREND = ' ';

/** G08 · My subjects: one block per class and subject the teacher teaches, with shortcuts. */
export default function MySubjects() {
  const level = usePermission('G08');
  const { data, isLoading, isError, error, refetch } = useGetMyTeachingQuery();

  if ((error as { status?: number } | undefined)?.status === 403) return <ForbiddenState />;

  return (
    <div className="space-y-8">
      <PageHeader title="המקצועות שלי (מורה)" />

      {isLoading && <LoadingSkeleton />}
      {isError && <ErrorState message={errorMessage(error)} onRetry={refetch} />}
      {data && data.items.length === 0 && (
        <EmptyState title="עוד לא שויכת לכיתה" text="פני להנהלה." />
      )}
      {data &&
        level &&
        data.items.map((card) => (
          <TeachingBlock key={`${card.classId}-${card.subjectId}`} card={card} />
        ))}
    </div>
  );
}

function TeachingBlock({ card }: { card: TeachingCard }) {
  const navigate = useNavigate();
  const grades = usePermission('G01');
  const assessments = usePermission('G04');
  const stats = usePermission('G05');
  const name = [card.className, card.subjectName].filter(Boolean).join(' · ') || card.classId;
  // the shortcuts open the screen with the class and subject already chosen
  const go = (screen: string) =>
    navigate(
      `${pathFor(screen)}?${new URLSearchParams({ classId: card.classId, subjectId: card.subjectId })}`,
    );

  return (
    <section aria-label={name} className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <MetricCard label="שם כיתה ומקצוע" value={name} trendText={NO_TREND} />
        <MetricCard label="מבחנים פתוחים" value={card.openAssessments} trendText={NO_TREND} />
        <MetricCard
          label="תלמידים ללא ציון"
          value={card.studentsWithoutGrade}
          trendText={NO_TREND}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {canWrite(grades) && <Button onClick={() => go('G01')}>הזנת ציונים</Button>}
        {canWrite(assessments) && (
          <Button variant="secondary" onClick={() => go('G04')}>
            מבחן חדש
          </Button>
        )}
        {stats && (
          <Button variant="secondary" onClick={() => go('G05')}>
            סטטיסטיקות
          </Button>
        )}
      </div>
    </section>
  );
}
