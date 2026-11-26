import { useGetMyPermissionsQuery, type AccessLevel } from '../../api/permissionsApi';
import { errorMessage } from '../../api/errors';
import {
  EmptyState,
  ErrorState,
  ForbiddenState,
  LoadingSkeleton,
} from '../../components/StateViews';
import { badge, card, cx, text } from '../../styles/recipes';

/** A05 · ההרשאות שלי (v1-lite): תצוגת קריאה של התפקיד וטבלת ההרשאות. */

const LEVEL_LABEL: Record<AccessLevel, string> = {
  full: 'גישה מלאה',
  scoped: 'מוגבל',
  read: 'צפייה בלבד',
};

// הסימן בא תמיד עם תווית טקסט, כדי שהסטטוס לא יהיה רק בצבע
function Mark({ allowed, note }: { allowed: boolean; note?: string }) {
  return allowed ? (
    <span aria-label={note ? `מותר, ${note}` : 'מותר'}>✓{note ? ` (${note})` : ''}</span>
  ) : (
    <span aria-label="אסור">✗</span>
  );
}

export default function MyPermissionsScreen() {
  const { data, isLoading, isError, error, refetch } = useGetMyPermissionsQuery();

  // השרת עונה 403 כשאין גישה למסך
  if ((error as { status?: number } | undefined)?.status === 403) return <ForbiddenState />;

  return (
    <div className="space-y-6">
      <h1 className={text.h1}>ההרשאות שלי</h1>

      {isLoading && <LoadingSkeleton />}
      {isError && <ErrorState message={errorMessage(error)} onRetry={refetch} />}

      {data && (
        <>
          <section className={cx(card, 'space-y-1')}>
            <h2 className={text.h3}>התפקיד שלי</h2>
            <p>
              <span className={badge.primary}>{data.roleName}</span>
            </p>
          </section>

          <section className="space-y-3">
            <h2 className={text.h3}>מה מותר לי</h2>
            {data.screens.length === 0 ? (
              <EmptyState title="אין הרשאות להצגה" text="לא נמצאו מסכים שמותר לך לגשת אליהם." />
            ) : (
              <div className={cx(card, 'overflow-x-auto')}>
                <table className="w-full text-start">
                  <thead>
                    <tr>
                      <th className="p-2 text-start">מסך</th>
                      <th className="p-2 text-start">מודול</th>
                      <th className="p-2 text-start">צפייה</th>
                      <th className="p-2 text-start">עריכה</th>
                      <th className="p-2 text-start">יצירה</th>
                      <th className="p-2 text-start">מחיקה</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.screens.map((s) => {
                      const canChange = s.level !== 'read';
                      const note = s.level === 'scoped' ? LEVEL_LABEL.scoped : undefined;
                      return (
                        <tr key={s.screenId} className="border-b">
                          <td className="p-2">{s.name}</td>
                          <td className="p-2">{s.module}</td>
                          <td className="p-2">
                            <Mark allowed note={note} />
                          </td>
                          <td className="p-2">
                            <Mark allowed={canChange} note={note} />
                          </td>
                          <td className="p-2">
                            <Mark allowed={canChange} note={note} />
                          </td>
                          <td className="p-2">
                            <Mark allowed={canChange} note={note} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className={card}>
            <h2 className={text.h3}>צריכה הרשאה נוספת?</h2>
            <p className={text.muted}>יש לפנות למנהל המוסד.</p>
          </section>
        </>
      )}
    </div>
  );
}