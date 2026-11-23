import { useMemo, useState } from 'react';
import { useGetMeQuery } from '../../api/authApi';
import {
  useCreateInstitutionMutation,
  useCreateInstitutionStructureMutation,
} from '../../api/institutionsApi';
import { useAppSelector } from '../../app/hooks';
import { ErrorState, ForbiddenState, LoadingSkeleton } from '../../components/StateViews';
import { Button, Card, Select, Stepper, TextField } from '../../components/ui';
import { canWrite, usePermission } from '../../features/auth/usePermission';
import { getSchoolYearOptions } from './schoolYears';

const steps = ['מבנה', 'אישור'];

const institutionTypes = [
  { value: 'elementary', label: 'בית ספר יסודי' },
  { value: 'middle', label: 'חטיבת ביניים' },
  { value: 'high', label: 'תיכון' },
  { value: 'combined', label: 'בית ספר משולב' },
];

const gradeLevels = [
  { value: 'kindergarten', label: 'גן' },
  { value: 'elementary', label: 'יסודי' },
  { value: 'middle', label: 'חטיבת ביניים' },
  { value: 'high', label: 'תיכון' },
];

const classOptions = Array.from({ length: 12 }, (_, index) => ({
  value: String(index + 1),
  label: String(index + 1),
}));

const classNamesByCount = (count: number) => {
  const safeCount = Math.max(1, Math.min(count, 12));
  const letters = 'אבגדהוזחטיכלמנסעפצקרשת';

  return Array.from({ length: safeCount }, (_, index) => letters[index] ?? String(index + 1));
};

export type InstitutionStructure = {
  schoolName: string;
  institutionType: string;
  levels: string[];
  classesPerLevel: number;
  year: string;
};

type Step = 'form' | 'confirm';
type Status = 'idle' | 'submitting' | 'error' | 'success';
type PreviewRow = { level: string; classes: string[] };

function LevelsTable({ rows }: { rows: PreviewRow[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-page">
      <div className="grid grid-cols-5 border-b border-line bg-subtle text-body-strong text-fg-secondary">
        <div className="col-span-2 px-4 py-3">שכבה</div>
        <div className="col-span-3 px-4 py-3">כיתות</div>
      </div>

      {rows.length ? (
        rows.map(({ level, classes }) => (
          <div key={level} className="grid grid-cols-5 border-b border-line last:border-b-0">
            <div className="col-span-2 px-4 py-3 text-body text-fg">{level}</div>
            <div className="col-span-3 px-4 py-3 text-body text-fg">{classes.join(', ')}</div>
          </div>
        ))
      ) : (
        <div className="px-4 py-6 text-body text-fg-secondary">
          יש לבחור שכבה אחת לפחות כדי לראות את תצוגת הכיתות.
        </div>
      )}
    </div>
  );
}

export default function Screen() {
  const canManage = canWrite(usePermission('I01'));
  // usePermission מחזיר undefined גם בזמן הטעינה וגם כשאין הרשאה. הבקשה ל-me משותפת (RTK Query) ואינה נשלחת פעמיים.
  const token = useAppSelector((state) => state.auth.token);
  const { isLoading: loadingPermissions } = useGetMeQuery(undefined, { skip: !token });

  const [createInstitution] = useCreateInstitutionMutation();
  const [createStructure] = useCreateInstitutionStructureMutation();

  const schoolYears = useMemo(() => getSchoolYearOptions(), []);

  const [step, setStep] = useState<Step>('form');
  const [status, setStatus] = useState<Status>('idle');
  const [schoolName, setSchoolName] = useState('');
  const [institutionType, setInstitutionType] = useState('');
  const [levels, setLevels] = useState<string[]>([]);
  const [classesPerLevel, setClassesPerLevel] = useState('2');
  const [year, setYear] = useState(schoolYears[0].value);
  const [submitted, setSubmitted] = useState(false);

  // נשמר כדי שבניסיון חוזר אחרי כישלון חלקי לא ייווצר מוסד שני
  const [createdInstitutionId, setCreatedInstitutionId] = useState<string | null>(null);

  const errors = useMemo(
    () => ({
      schoolName: schoolName.trim() ? '' : 'שדה חובה',
      institutionType: institutionType ? '' : 'שדה חובה',
      levels: levels.length ? '' : 'שדה חובה',
      year: year ? '' : 'שדה חובה',
    }),
    [institutionType, levels.length, schoolName, year],
  );

  const preview = useMemo<PreviewRow[]>(() => {
    const count = Number(classesPerLevel) || 0;

    if (!levels.length || !count) {
      return [];
    }

    return levels.map((value) => {
      const level = gradeLevels.find((item) => item.value === value)?.label ?? value;
      return { level, classes: classNamesByCount(count) };
    });
  }, [classesPerLevel, levels]);

  const institutionTypeLabel =
    institutionTypes.find((item) => item.value === institutionType)?.label ?? '';
  const yearLabel = schoolYears.find((item) => item.value === year)?.label ?? '';

  if (loadingPermissions) {
    return <LoadingSkeleton />;
  }

  if (!canManage) {
    return <ForbiddenState />;
  }

  const handleContinue = () => {
    setSubmitted(true);

    if (Object.values(errors).some(Boolean)) {
      return;
    }

    setStep('confirm');
  };

  const handleBack = () => {
    setStatus('idle');
    setStep('form');
  };

  const handleConfirm = async () => {
    setStatus('submitting');

    try {
      let institutionId = createdInstitutionId;

      if (institutionId === null) {
        const created = await createInstitution({
          name: schoolName.trim(),
          type: institutionType,
          year,
        }).unwrap();
        institutionId = created.id;
        setCreatedInstitutionId(institutionId);
      }

      await createStructure({
        institutionId,
        body: { levels, classesPerLevel: Number(classesPerLevel), year },
      }).unwrap();

      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const isConfirm = step === 'confirm';
  const isSubmitting = status === 'submitting';

  return (
    <div className="w-full max-w-7xl">
      <Card className="overflow-hidden border border-line bg-surface p-0 shadow-sm">
        <div className="border-b border-line bg-subtle px-6 py-4">
          <Stepper steps={steps} current={isConfirm ? 2 : 1} className="flex-1" />
        </div>

        <div className="px-6 pb-6 pt-5">
          {!isConfirm ? (
            <>
              <h1 className="mb-5 text-3xl font-bold leading-none text-fg">
                אשף הקמת מוסד: מבנה בית הספר
              </h1>

              <Card padding="M" className="mb-6 bg-page">
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField
                    label="שם המוסד"
                    required
                    value={schoolName}
                    onChange={(event) => setSchoolName(event.target.value)}
                    placeholder="הקלידו כאן"
                    error={submitted && errors.schoolName ? errors.schoolName : undefined}
                  />

                  <Select
                    label="סוג מוסד"
                    required
                    options={institutionTypes}
                    value={institutionType}
                    onValueChange={setInstitutionType}
                    placeholder="בחרו סוג מוסד"
                    error={submitted && errors.institutionType ? errors.institutionType : undefined}
                  />

                  <div className="md:col-span-2">
                    <Select
                      label="שכבות לימוד"
                      multi
                      required
                      options={gradeLevels}
                      value={levels}
                      onValueChange={setLevels}
                      placeholder="בחרו שכבות"
                      error={submitted && errors.levels ? errors.levels : undefined}
                    />
                  </div>

                  <Select
                    label="מספר כיתות בכל שכבה"
                    options={classOptions}
                    value={classesPerLevel}
                    onValueChange={setClassesPerLevel}
                    placeholder="בחרו כמות"
                  />

                  <Select
                    label="שנת לימודים נוכחית"
                    required
                    options={schoolYears}
                    value={year}
                    onValueChange={setYear}
                    placeholder="בחרו שנת לימודים"
                    error={submitted && errors.year ? errors.year : undefined}
                  />
                </div>
              </Card>

              <section>
                <h2 className="mb-3 text-xl font-bold text-fg">תצוגה מקדימה</h2>
                <LevelsTable rows={preview} />
              </section>
            </>
          ) : (
            <>
              <h1 className="mb-5 text-3xl font-bold leading-none text-fg">אשף הקמת מוסד: אישור</h1>

              {status === 'success' ? (
                <div role="status" className="text-body text-fg">
                  המוסד נוצר בהצלחה.
                </div>
              ) : (
                <>
                  <Card padding="M" className="mb-6 bg-page">
                    <dl className="grid gap-3 md:grid-cols-2">
                      <div>
                        <dt className="text-body-strong text-fg-secondary">שם המוסד</dt>
                        <dd className="text-body text-fg">{schoolName.trim()}</dd>
                      </div>
                      <div>
                        <dt className="text-body-strong text-fg-secondary">סוג מוסד</dt>
                        <dd className="text-body text-fg">{institutionTypeLabel}</dd>
                      </div>
                      <div>
                        <dt className="text-body-strong text-fg-secondary">שנת לימודים</dt>
                        <dd className="text-body text-fg">{yearLabel}</dd>
                      </div>
                      <div>
                        <dt className="text-body-strong text-fg-secondary">כיתות בכל שכבה</dt>
                        <dd className="text-body text-fg">{classesPerLevel}</dd>
                      </div>
                    </dl>
                  </Card>

                  <section aria-label="סיכום שכבות וכיתות">
                    <LevelsTable rows={preview} />
                  </section>

                  {status === 'error' ? (
                    <div className="mt-4">
                      <ErrorState message="אירעה שגיאה בשמירה. נסו שוב." />
                    </div>
                  ) : null}
                </>
              )}
            </>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-line bg-subtle px-6 py-4">
          {isConfirm && status !== 'success' ? (
            <Button variant="secondary" size="M" onClick={handleBack} disabled={isSubmitting}>
              חזרה
            </Button>
          ) : (
            <span />
          )}

          {!isConfirm ? (
            <Button size="M" onClick={handleContinue}>
              המשך
            </Button>
          ) : status !== 'success' ? (
            <Button size="M" onClick={handleConfirm} disabled={isSubmitting}>
              {isSubmitting ? 'שומר...' : 'אישור'}
            </Button>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
