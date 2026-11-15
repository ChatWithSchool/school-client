import { useState } from 'react';
import { Alert, Button, Modal, PageHeader, Select } from '../../components/ui';
import { ErrorState, ForbiddenState, LoadingSkeleton } from '../../components/StateViews';

type ScreenState = 'loading' | 'error' | 'forbidden' | 'ok';

export default function Screen() {
  const [screenState] = useState<ScreenState>('ok');
  const [selectedCount] = useState<number>(3);
  const [activeModal, setActiveModal] = useState<'class' | 'tag' | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [resultSummary, setResultSummary] = useState<{ success: number; failed: number } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const classOptions = [
    { value: 'class-1', label: 'י"א 1' },
    { value: 'class-2', label: 'י"א 2' },
  ];

  const tagOptions = [
    { value: 'tag-excel', label: 'מצטיין' },
    { value: 'tag-support', label: 'תגבור' },
  ];

  const handleBulkAction = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setResultSummary({ success: selectedCount, failed: 0 });
      setActiveModal(null);
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
        subtitle="תלמידים › פעולות קבוצתיות"
      />

      <div className="rounded-lg border border-line bg-surface p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-body-strong text-fg">נבחרו {selectedCount} תלמידים</span>
            <button className="text-start text-body text-primary-600 hover:underline">
              בחירת כל התוצאות המסוננות
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary" onClick={() => setActiveModal('class')}>
              שיוך לכיתה / קבוצה
            </Button>
            <Button variant="secondary" onClick={() => setActiveModal('tag')}>
              הוספת תגית
            </Button>
            <Button variant="secondary" disabled>
              ייצוא נבחרים
            </Button>
          </div>
        </div>
      </div>

      {resultSummary && (
        <Alert
          tone="success"
          title="תוצאות הפעולה הקבוצתית"
          dismissible
          onDismiss={() => setResultSummary(null)}
        >
          הפעולה הושלמה בהצלחה: {resultSummary.success} תלמידים עודכנו, {resultSummary.failed} נכשלו.
        </Alert>
      )}

      <Modal
        open={activeModal === 'class'}
        onOpenChange={(open) => !open && setActiveModal(null)}
        title="שיוך לכיתה / קבוצה"
        description="בחר כיתה או קבוצה אליה יש לשייך את התלמידים הנבחרים"
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

      <Modal
        open={activeModal === 'tag'}
        onOpenChange={(open) => !open && setActiveModal(null)}
        title="הוספת תגית"
        description="בחר תגית להוספה עבור התלמידים הנבחרים"
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
