import { useState } from 'react';
import { Button, Modal, Select, Alert } from '../../components/ui';

export default function Screen() {
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
    } catch (error) {
      console.error('Bulk action failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6" dir="rtl">
      {/* כותרת המסך והניווט */}
      <div className="flex flex-col gap-1">
        <div className="text-xs text-fg-secondary">תלמידים &gt; פעולות קבוצתיות</div>
        <h1 className="text-h1 text-fg font-bold">פעולות קבוצתיות</h1>
      </div>

      {/* סרגל בחירה ופעולות תואם פיגמה */}
      <div className="flex flex-col gap-4 rounded-xl bg-surface p-6 shadow-sm border border-border">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4">
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-fg text-lg">נבחרו {selectedCount} תלמידים</span>
            <button className="text-sm text-primary hover:underline text-start cursor-pointer">
              בחירת כל התוצאות המסוננות
            </button>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
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

      {/* הצגת סיכום תוצאות באמצעות רכיב Alert האמיתי */}
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

      {/* מודל שיוך לכיתה / קבוצה */}
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

      {/* מודל הוספת תגית */}
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