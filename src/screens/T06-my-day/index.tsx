import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { errorMessage } from '../../api/errors';
import { Alert, Button, Card, EmptyState, LessonBlock, PageHeader } from '../../components/ui';
import { ErrorState, ForbiddenState, LoadingSkeleton } from '../../components/StateViews';
import { mockToday, type TodayLesson, type TodayResponse } from './mock';

/**
 * T06 · My day (teacher). v1-lite: today's lessons, each with a link to attendance (N01).
 * Deferred from v1: change notifications, the grades action.
 * Sprint 1 runs on mock data. In sprint 4 replace `useTodayMock` with the RTK Query hook for
 * GET /me/today (it returns the same { data, isLoading, isError, error, refetch } shape).
 */
function useTodayMock() {
  const [data, setData] = useState<TodayResponse | undefined>();
  const [isError, setIsError] = useState(false);
  const load = () => {
    setIsError(false);
    setData(undefined);
    setTimeout(() => setData(mockToday), 300);
  };
  useEffect(load, []);
  return { data, isLoading: !data && !isError, isError, error: undefined as unknown, refetch: load };
}

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' });

export default function MyDayScreen() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useTodayMock();

  // re-evaluate "current lesson" and "next" once a minute
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);
  const nowMin = now.getHours() * 60 + now.getMinutes();

  // the server answers 403 when the role has no access to this screen
  if ((error as { status?: number } | undefined)?.status === 403) return <ForbiddenState />;

  const lessons = data?.lessons ?? [];
  const currentId = lessons.find((l) => toMinutes(l.startTime) <= nowMin && nowMin < toMinutes(l.endTime))?.id;
  const next = lessons.find((l) => toMinutes(l.startTime) > nowMin);

  // 'נוכחות' opens N01 with the class and lesson already selected
  const openAttendance = (lesson: TodayLesson) =>
    navigate(`/attendance?classId=${lesson.classId}&lessonId=${lesson.id}&date=${data?.date}`);

  const subtitle = data
    ? [
        formatDate(data.date),
        next ? `הבא בתור: שיעור ${next.period} · ${next.subject} · ${next.className} · ${next.startTime}` : null,
      ]
        .filter(Boolean)
        .join(' · ')
    : undefined;

  return (
    <div className="space-y-6">
      <PageHeader
        title="היום שלי (מורה)"
        subtitle={subtitle}
         />

      {isLoading && <LoadingSkeleton />}
      {isError && <ErrorState message={errorMessage(error)} onRetry={refetch} />}

      {data?.isHoliday && (
        <Alert tone="info" title={data.holidayName ?? 'יום חופשה'}>
          אין שיעורים היום.
        </Alert>
      )}

      {data && !data.isHoliday && lessons.length === 0 && <EmptyState variant="first-use" title="אין לך שיעורים היום." />}

      {data && !data.isHoliday && lessons.length > 0 && (
        <Card padding="L">
          <h2 className="text-h3 text-fg mb-4">שיעורי היום</h2>
          <ul className="divide-y divide-ink-100">
            {lessons.map((lesson) => {
              const isCurrent = lesson.id === currentId;
              return (
                <li
                  key={lesson.id}
                  aria-current={isCurrent ? 'true' : undefined}
                  className={`flex items-center gap-4 py-3 ${isCurrent ? 'bg-primary-50 rounded-md px-3' : ''}`}
                >
                  <span className="text-bodyStrong text-fg w-24 shrink-0">
                    שיעור {lesson.period} · {lesson.startTime}
                  </span>
                  <div className="flex-1">
                    <LessonBlock
                      subject={lesson.subject}
                      meta={`${lesson.className} · חדר ${lesson.room}`}
                      tone={lesson.tone}
                      state={lesson.substitute ? 'substitute' : 'normal'}
                    />
                  </div>
                  <Button variant="secondary" size="S" onClick={() => openAttendance(lesson)}>
                    נוכחות
                  </Button>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </div>
  );
}