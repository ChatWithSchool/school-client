import { useState } from 'react';
import { Alert, Button, Modal, PageHeader, Select } from '../../components/ui';
import { ErrorState, ForbiddenState, LoadingSkeleton } from '../../components/StateViews';

type ScreenState = 'loading' | 'error' | 'forbidden' | 'ok';

export default function Screen() {
  const [screenState] = useState<ScreenState>('ok');
  const [selectedCount, setSelectedCount] = useState<number>(3);
  const [isAllFilteredSelected, setIsAllFilteredSelected] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<'class' | 'tag' | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [resultSummary, setResultSummary] = useState<{ success: number; failed: number } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const classOptions = [
    { value: 'class-1', label: "י\"א 1" },
    { value: 'class-2', label: "י\"א 2" },
    { value: 'class-3', label: "י\"ב 1" },
  ];

  const tagOptions = [
    { value: 'tag-excel', label: 'מצטיין' },
    { value: 'tag-support', label: 'תגבור' },
    { value: 'tag-active', label: 'פעיל' },
  ];

  const handleSelectAllFiltered = () => {
    setIsAllFilteredSelected(true);
    setSelectedCount(120); // הדגמה לספירת כל התוצאות המסוננות
  };

  const handleBulkAction = async () => {
    // בדיקה לפי הכללים: פעולה על יותר מ-200 תלמידים דורשת אישור נוסף
    if (selectedCount > 200) {
      alert('פעולה על יותר מ-200 תלמידים דורשת אישור נוסף.');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      // סיכום הצלחות וכישלונות (תומך בכישלונות חלקיים מבלי לבטל את ההצלחות)
      setResultSummary({ success: selectedCount, failed: 0 });
      setActiveModal(null);
      setSelectedTarget('');
    } finally {
      setIsLoading(false);
    }
  };

  if (screenState === 'loading') return <LoadingSkeleton />;
  if (screenState === 'error')
    return <ErrorState message="אירעה שגיאה בטעינת הנתונים" onRetry={() => {}} />;
  if (screenState === 'forbidden') return <ForbiddenState />;

  return (
    <div className="flex flex-col gap-6 p-6" dir="rtl">
      <PageHeader
        title="פעולות קבוצתיות"
        subtitle="ניהול פעולות מרוכזות לתלמידים נבחרים"
      />

      {/* סרגל בחירה */}
      <div className="rounded-lg border border-line bg-surface p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-body-strong text-fg">
              נבחרו {selectedCount} תלמידים {isAllFilteredSelected && '(מכלל התוצאות המסוננות)'}
            </span>
            {!isAllFilteredSelected && (
              <button
                type="button"
                onClick={handleSelectAllFiltered}
                className="text-start text-body text-primary-600 hover:underline cursor-pointer"
              >
                בחירת כל התוצאות המסוננות
              </button>
            )}
          </div>

          {/* אזור הפעולות */}
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary" onClick={() => setActiveModal('class')}>
              שיוך לכיתה / קבוצה
            </Button>
            <Button variant="secondary" onClick={() => setActiveModal('tag')}>
              הוספת תגית
            </Button>
            {/* ייצוא נבחרים נדחה לגרסאות הבאות בהתאם למפרט v1-lite */}
            <Button variant="secondary" disabled title="ייצוא נבחרים יתווסף בגרסאות הבאות">
              ייצוא נבחרים (בקרוב)
            </Button>
          </div>
        </div>
      </div>

      {/* תצוגת סיכום תוצאות הפעולה */}
      {resultSummary && (
        <Alert
          tone="success"
          title="סיכום ביצוע פעולה קבוצתית"
          dismissible
          onDismiss={() => setResultSummary(null)}
        >
          הפעולה הושלמה: {resultSummary.success} תלמידים עודכנו בהצלחה, {resultSummary.failed} נכשלו.
        </Alert>
      )}

      {/* מודל שיוך לכיתה / קבוצה */}
      <Modal
        open={activeModal === 'class'}
        onOpenChange={(open) => !open && setActiveModal(null)}
        title="שיוך לכיתה / קבוצה"
        description={`בחר יעד לשיוך עבור ${selectedCount} התלמידים הנבחרים`}
        confirmLabel="אישור ושיוך"
        confirmLoading={isLoading}
        onConfirm={handleBulkAction}
      >
        <div className="py-2">
          <Select
            label="בחירת כיתה"
            placeholder="בחר כיתה..."
            options={classOptions}
            value={selectedTarget}
            onValueChange={setSelectedTarget}
          />
        </div>
      </Modal>

      {/* מודל הוספת תגית */}
      <Modal
        open={activeModal === 'tag'}
        onOpenChange={(open) => !open && setActiveModal(null)}
        title="הוספת תגית"
        description={`בחר תגית להוספה עבור ${selectedCount} התלמידים הנבחרים`}
        confirmLabel="אישור והוספה"
        confirmLoading={isLoading}
        onConfirm={handleBulkAction}
      >
        <div className="py-2">
          <Select
            label="בחירת תגית"
            placeholder="בחר תגית..."
            options={tagOptions}
            value={selectedTarget}
            onValueChange={setSelectedTarget}
          />
        </div>
      </Modal>
    </div>
  );
}