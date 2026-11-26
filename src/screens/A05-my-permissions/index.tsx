import { useGetMyPermissionsQuery, type AccessLevel } from '../../api/permissionsApi';
import { errorMessage } from '../../api/errors';
import { Table } from '../../components/ui';
import { EmptyState, ErrorState, ForbiddenState } from '../../components/StateViews';
import { badge, card, cx, text } from '../../styles/recipes';

/** A05 · ההרשאות שלי (v1-lite): תצוגת קריאה של התפקיד וטבלת ההרשאות. */

const SCOPED_LABEL = 'מוגבל';

// הסימן בא תמיד עם תווית טקסט, כדי שהסטטוס לא יהיה רק בצבע
function Mark({ allowed, level }: { allowed: boolean; level: AccessLevel }) {
  if (!allowed) return <span aria-label="אסור">✗</span>;
  const note = level === 'scoped' ? SCOPED_LABEL : undefined;
  return <span aria-label={note ? `מותר, ${note}` : 'מותר'}>✓{note ? ` (${note})` : ''}</span>;
}

export default function MyPermissionsScreen() {
  const { data, isLoading, isError, error, refetch } = useGetMyPermissionsQuery();

  // השרת עונה 403 כשאין גישה למסך
  if ((error as { status?: number } | undefined)?.status === 403) return <ForbiddenState />;

  return (
    <div className="space-y-6">
      <h1 className={text.h1}>ההרשאות שלי</h1>

      {isError && <ErrorState message={errorMessage(error)} onRetry={refetch} />}

      {data && (
        <section className={cx(card, 'space-y-1')}>
          <h2 className={text.h3}>התפקיד שלי</h2>
          <p>
            <span className={badge.primary}>{data.roleName}</span>
          </p>
        </section>
      )}

      {!isError && (
        <section className="space-y-3">
          <h2 className={text.h3}>מה מותר לי</h2>
          <Table
            caption="טבלת ההרשאות שלי לפי מסך"
            rows={data?.screens}
            loading={isLoading}
            getRowId={(s) => s.screenId}
            empty={
              <EmptyState title="אין הרשאות להצגה" text="לא נמצאו מסכים שמותר לך לגשת אליהם." />
            }
            columns={[
              { key: 'name', header: 'מסך', cell: (s) => s.name },
              { key: 'module', header: 'מודול', cell: (s) => s.module },
              { key: 'view', header: 'צפייה', cell: (s) => <Mark allowed level={s.level} /> },
              {
                key: 'edit',
                header: 'עריכה',
                cell: (s) => <Mark allowed={s.level !== 'read'} level={s.level} />,
              },
              {
                key: 'create',
                header: 'יצירה',
                cell: (s) => <Mark allowed={s.level !== 'read'} level={s.level} />,
              },
              {
                key: 'delete',
                header: 'מחיקה',
                cell: (s) => <Mark allowed={s.level !== 'read'} level={s.level} />,
              },
            ]}
          />
        </section>
      )}

      <section className={card}>
        <h2 className={text.h3}>צריכה הרשאה נוספת?</h2>
        <p className={text.muted}>יש לפנות למנהל המוסד.</p>
      </section>
    </div>
  );
}