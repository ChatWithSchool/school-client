import {
  EmptyState,
  ErrorState,
  ForbiddenState,
  LoadingSkeleton,
  NotFoundState,
} from '../../components/StateViews';
import { card, text } from '../../styles/recipes';

/** X02 · The shared screen states. Copy the components you need into your screen. */
export default function SystemStates() {
  return (
    <div className="space-y-6">
      <h1 className={text.h1}>מצבי מערכת משותפים</h1>
      <p className={text.muted}>כל טבלה, רשימה וטופס חייבים מצב טעינה, מצב ריק ומצב שגיאה.</p>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <section className={card}>
          <h2 className={`${text.h3} mb-4`}>טעינה</h2>
          <LoadingSkeleton />
        </section>
        <section className={card}>
          <h2 className={`${text.h3} mb-4`}>מצב ריק</h2>
          <EmptyState title="עוד לא נוספו תלמידים" text="אפשר להוסיף תלמיד אחד או לייבא קובץ." />
        </section>
        <section className={card}>
          <h2 className={`${text.h3} mb-4`}>שגיאה</h2>
          <ErrorState message="לא הצלחנו לטעון את הנתונים." onRetry={() => undefined} />
        </section>
        <section className={card}>
          <h2 className={`${text.h3} mb-4`}>אין הרשאה</h2>
          <ForbiddenState />
        </section>
        <section className={card}>
          <h2 className={`${text.h3} mb-4`}>לא נמצא</h2>
          <NotFoundState />
        </section>
      </div>
    </div>
  );
}
