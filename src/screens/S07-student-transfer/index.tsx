import { useMemo, useState } from 'react';
import { Alert, Button, Card, DatePicker, Select, TextArea } from '../../components/ui';
import { ErrorState, LoadingSkeleton } from '../../components/StateViews';

const CLASS_OPTIONS = [
  { value: 'z1', label: 'ז׳ 1' },
  { value: 'z2', label: 'ז׳ 2' },
  { value: 'a1', label: 'א׳ 1' },
  { value: 'a2', label: 'א׳ 2' },
  { value: 'b1', label: 'ב׳ 1' },
  { value: 'b2', label: 'ב׳ 2' },
];

const INITIAL_HISTORY = [
  {
    id: 'h1',
    from: 'ז׳ 1',
    to: 'א׳ 1',
    effectiveDate: '2026-09-01',
    reason: 'העברה בעקבות התאמת כיתה',
    createdBy: 'מורן כהן',
  },
  {
    id: 'h2',
    from: 'א׳ 1',
    to: 'ב׳ 2',
    effectiveDate: '2025-09-01',
    reason: 'העברה מיסודית',
    createdBy: 'רעות לוי',
  },
];

const STUDENT = {
  name: 'יניב דוד',
  currentClass: 'ז׳ 1',
  classId: 'z1',
};

function formatDateValue(date: Date | null) {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export default function Screen() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedClass, setSelectedClass] = useState(CLASS_OPTIONS[2]?.value ?? '');
  const [effectiveDate, setEffectiveDate] = useState<Date | null>(new Date('2026-09-01'));
  const [reason, setReason] = useState('');
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const selectedClassLabel = useMemo(
    () => CLASS_OPTIONS.find((item) => item.value === selectedClass)?.label ?? 'לא נבחרה',
    [selectedClass],
  );

  const canSubmit =
    !!selectedClass &&
    selectedClass !== STUDENT.classId &&
    !!effectiveDate &&
    !isLoading &&
    !isError;

  const handleSubmit = () => {
    if (!canSubmit) {
      setSubmitError('יש לבחור כיתה חדשה ותאריך תחילה תקף.');
      return;
    }

    const nextEntry = {
      id: `h${Date.now()}`,
      from: STUDENT.currentClass,
      to: selectedClassLabel,
      effectiveDate: formatDateValue(effectiveDate),
      reason: reason || 'ללא סיבה',
      createdBy: 'אני',
    };

    setHistory((prev) => [nextEntry, ...prev]);
    setIsSubmitted(true);
    setSubmitError(null);
  };

  if (isLoading) return <LoadingSkeleton rows={6} />;
  if (isError) return <ErrorState message="לא ניתן לטעון את נתוני ההעברה. נסו שוב." onRetry={() => setIsError(false)} />;

  return (
    <div dir="rtl" className="mx-auto w-full max-w-6xl space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-caption text-fg-secondary">תלמידים וקבוצות</p>
          <h1 className="text-h2 text-fg">העברת תלמיד בין כיתות</h1>
        </div>
        <Button variant="secondary" size="S" type="button">
          צפייה בהיסטוריה
        </Button>
      </div>

      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-body-strong text-fg">{STUDENT.name}</p>
          </div>
          <span className="rounded-full bg-primary-50 px-2.5 py-1 text-label text-primary-700">
            {STUDENT.currentClass}
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-1">
            <label className="block text-label text-fg-secondary">כיתה נוכחית</label>
            <div className="flex h-10 items-center rounded-md border border-line bg-subtle px-3 text-body text-fg">
              {STUDENT.currentClass}
            </div>
          </div>

          <Select
            label="כיתה חדשה"
            required
            placeholder="בחרו כיתה"
            options={CLASS_OPTIONS.filter((item) => item.value !== STUDENT.classId)}
            value={selectedClass}
            onValueChange={(value) => {
              setSelectedClass(value);
              setSubmitError(null);
            }}
            className="min-w-0"
          />

          <DatePicker
            label="תאריך תחולה"
            required
            value={effectiveDate}
            onChange={(value) => {
              setEffectiveDate(value);
              setSubmitError(null);
            }}
            className="min-w-0"
          />

          <div className="md:col-span-2 xl:col-span-1">
            <TextArea
              label="סיבה"
              rows={3}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="הסיבה למעבר (אופציונלי)"
              className="h-full"
            />
          </div>
        </div>

        <div className="mt-5">
          <Alert tone="info" title="מה יקרה לנוכחות ולציונים עד היום?" className="border-info-200 bg-info-50">
            <p className="text-body text-info-700">
              נוכחות וציונים קיימים יישארו שייכים לכיתה הנוכחית עד לתאריך התחולה. החל מהתאריך
              שנבחר, התלמיד ייחשב לכיתה החדשה בלבד.
            </p>
          </Alert>
        </div>

        {submitError && (
          <p className="mt-4 text-caption text-danger-700" role="alert">
            {submitError}
          </p>
        )}

        {isSubmitted && (
          <div className="mt-4 rounded-lg border border-success-200 bg-success-50 p-3 text-body text-success-700" aria-live="polite">
            <strong>העברה נקלטה.</strong> כיתה חדשה: {selectedClassLabel}. התלמיד מופיע בכיתה החדשה
            בלבד מ-{formatDateValue(effectiveDate)}.
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-line pt-5">
          <Button variant="secondary" type="button">
            ביטול
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={!canSubmit}>
            אשר העברה
          </Button>
        </div>
      </Card>

      <Card className="p-0">
        <div className="border-b border-line px-6 py-4">
          <h2 className="text-h3 text-fg">היסטוריית העברות</h2>
        </div>

        {history.length === 0 ? (
          <div className="p-6 text-body text-fg-secondary">אין היסטוריית העברות להצגה.</div>
        ) : (
          <div className="overflow-hidden">
            <table className="w-full border-collapse text-body">
              <thead className="bg-subtle">
                <tr>
                  <th className="px-4 py-3 text-start text-label text-fg-secondary">כיתה</th>
                  <th className="px-4 py-3 text-start text-label text-fg-secondary">מתאריך</th>
                  <th className="px-4 py-3 text-start text-label text-fg-secondary">סיבה</th>
                  <th className="px-4 py-3 text-start text-label text-fg-secondary">בידי</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry) => (
                  <tr key={entry.id} className="border-t border-line">
                    <td className="px-4 py-3 text-fg">
                      <span className="text-body-strong">{entry.from}</span>
                      <span className="mx-2 text-fg-secondary">→</span>
                      <span className="text-body-strong">{entry.to}</span>
                    </td>
                    <td className="px-4 py-3 text-fg">{entry.effectiveDate}</td>
                    <td className="px-4 py-3 text-fg">{entry.reason}</td>
                    <td className="px-4 py-3 text-fg-secondary">{entry.createdBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
