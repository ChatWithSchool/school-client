import { useState } from 'react';
import { useGetMeQuery } from '../../api/authApi';
import { Alert, Button, Modal, PageHeader, Select } from '../../components/ui';
import { ErrorState, ForbiddenState, LoadingSkeleton } from '../../components/StateViews';
import { canWrite, usePermission } from '../../features/auth/usePermission';

type BulkAction = 'class' | 'tag';

const LARGE_ACTION_THRESHOLD = 200;

const classOptions = [
  { value: 'class-1', label: 'י"א 1' },
  { value: 'class-2', label: 'י"א 2' },
  { value: 'class-3', label: 'י"ב 1' },
];

const tagOptions = [
  { value: 'tag-excel', label: 'מצטיין' },
  { value: 'tag-support', label: 'תגבור' },
  { value: 'tag-active', label: 'פעיל' },
];

const actionConfig = {
  class: {
    title: 'שיוך לכיתה / קבוצה',
    selectLabel: 'בחירת כיתה',
    placeholder: 'בחר כיתה...',
    options: classOptions,
    confirmLabel: 'אישור ושיוך',
    backLabel: 'חזרה לבחירת כיתה',
    emptyError: 'יש לבחור כיתה',
    describe: (count: number) => `בחר יעד לשיוך עבור ${count} התלמידים הנבחרים`,
    summary: (count: number, label: string) => `שיוך ${count} תלמידים לכיתה ${label}`,
  },
  tag: {
    title: 'הוספת תגית',
    selectLabel: 'בחירת תגית',
    placeholder: 'בחר תגית...',
    options: tagOptions,
    confirmLabel: 'אישור והוספה',
    backLabel: 'חזרה לבחירת תגית',
    emptyError: 'יש לבחור תגית',
    describe: (count: number) => `בחר תגית להוספה עבור ${count} התלמידים הנבחרים`,
    summary: (count: number, label: string) => `הוספת התגית "${label}" ל-${count} תלמידים`,
  },
} as const;

export default function Screen() {
  const level = usePermission('S10');
  const { data: me, error, isError, isLoading: isMeLoading, refetch } = useGetMeQuery();
  const [selectedCount, setSelectedCount] = useState<number>(3);
  const [isAllFilteredSelected, setIsAllFilteredSelected] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<BulkAction | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [targetError, setTargetError] = useState<string>('');
  const [resultSummary, setResultSummary] = useState<{ success: number; failed: number } | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [needsLargeActionConfirmation, setNeedsLargeActionConfirmation] = useState(false);

  const writable = canWrite(level);

  const handleSelectAllFiltered = () => {
    setIsAllFilteredSelected(true);
    setSelectedCount(120); // הדגמה לספירת כל התוצאות המסוננות
  };

  const openModal = (action: BulkAction) => {
    setSelectedTarget('');
    setTargetError('');
    setNeedsLargeActionConfirmation(false);
    setActiveModal(action);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedTarget('');
    setTargetError('');
    setNeedsLargeActionConfirmation(false);
  };

  const handleTargetChange = (value: string) => {
    setSelectedTarget(value);
    setTargetError('');
  };

  const handleBulkAction = async () => {
    if (!activeModal) return false;

    if (!selectedTarget) {
      setTargetError(actionConfig[activeModal].emptyError);
      return false;
    }

    if (selectedCount > LARGE_ACTION_THRESHOLD && !needsLargeActionConfirmation) {
      setNeedsLargeActionConfirmation(true);
      return false;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setResultSummary({ success: selectedCount, failed: 0 });
    } catch (err) {
      console.error('Bulk action failed', err);
      setResultSummary({ success: 0, failed: selectedCount });
    } finally {
      setIsLoading(false);
      closeModal();
    }
  };

  const errorStatus = (error as { status?: number } | undefined)?.status;
  if (isMeLoading) return <LoadingSkeleton />;
  if (errorStatus === 403 || (me && !level)) return <ForbiddenState />;
  if (isError) return <ErrorState message="אירעה שגיאה בטעינת ההרשאות" onRetry={refetch} />;
  if (!me || !level) return <LoadingSkeleton />;

  const renderModal = (action: BulkAction) => {
    const config = actionConfig[action];
    const targetLabel = config.options.find((o) => o.value === selectedTarget)?.label;
    const summaryAlert = targetLabel ? (
      <Alert tone="info" title="סיכום הפעולה">
        {config.summary(selectedCount, targetLabel)}
      </Alert>
    ) : null;

    return (
      <Modal
        open={activeModal === action}
        onOpenChange={(open) => !open && closeModal()}
        title={config.title}
        description={config.describe(selectedCount)}
        confirmLabel={
          !needsLargeActionConfirmation && selectedCount > LARGE_ACTION_THRESHOLD
            ? 'המשך לאישור'
            : config.confirmLabel
        }
        confirmLoading={isLoading}
        onConfirm={handleBulkAction}
      >
        {needsLargeActionConfirmation ? (
          <div className="flex flex-col gap-3">
            <Alert tone="warning" title="נדרשת בדיקה נוספת">
              הפעולה תשפיע על {selectedCount} תלמידים. יש לאשר שוב כדי להמשיך.
            </Alert>
            {summaryAlert}
            <Button variant="secondary" onClick={() => setNeedsLargeActionConfirmation(false)}>
              {config.backLabel}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 py-2">
            <Select
              label={config.selectLabel}
              placeholder={config.placeholder}
              options={[...config.options]}
              value={selectedTarget}
              onValueChange={handleTargetChange}
              error={targetError}
            />
            {summaryAlert}
          </div>
        )}
      </Modal>
    );
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="פעולות קבוצתיות"
        breadcrumbs={[{ label: 'תלמידים' }, { label: 'פעולות קבוצתיות' }]}
      />

      <div className="flex flex-col gap-4">
        <Alert tone="info" title={`נבחרו ${selectedCount} תלמידים`}>
          {isAllFilteredSelected ? (
            'נבחרו כל התוצאות המסוננות'
          ) : (
            <Button variant="ghost" onClick={handleSelectAllFiltered}>
              בחירת כל התוצאות המסוננות
            </Button>
          )}
        </Alert>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary" disabled={!writable} onClick={() => openModal('class')}>
            שיוך לכיתה / קבוצה
          </Button>
          <Button variant="secondary" disabled={!writable} onClick={() => openModal('tag')}>
            הוספת תגית
          </Button>
          {/* ייצוא נבחרים נדחה לגרסאות הבאות בהתאם למפרט v1-lite */}
          <Button variant="secondary" disabled title="ייצוא נבחרים יתווסף בגרסאות הבאות">
            ייצוא נבחרים (בקרוב)
          </Button>
        </div>
      </div>

      {/* תצוגת סיכום תוצאות הפעולה */}
      {resultSummary && (
        <Alert
          tone={
            resultSummary.failed === 0 ? 'success' : resultSummary.success > 0 ? 'warning' : 'danger'
          }
          title="סיכום ביצוע פעולה קבוצתית"
          dismissible
          onDismiss={() => setResultSummary(null)}
        >
          הפעולה הסתיימה: {resultSummary.success} תלמידים עודכנו בהצלחה, {resultSummary.failed}{' '}
          נכשלו.
        </Alert>
      )}

      {renderModal('class')}
      {renderModal('tag')}
    </div>
  );
}
