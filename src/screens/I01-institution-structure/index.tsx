// src/screens/I01-institution-structure/index.tsx
import { useEffect, useMemo, useState } from 'react';
import { useGetMeQuery } from '../../api/authApi';
import {
  useCreateInstitutionMutation,
  useCreateInstitutionStructureMutation,
} from '../../api/institutionsApi';
import { useAppSelector } from '../../app/hooks';
import { Button, Card, Select, Stepper, TextField } from '../../components/ui';
import { canWrite, usePermission } from '../../features/auth/usePermission';

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

// TODO: לוודא מול ה-SPEC אילו שנים מוצגות (השנה הנוכחית היא תשפ"ז)
const schoolYears = [
  { value: '2026', label: 'תשפ"ו' },
  { value: '2027', label: 'תשפ"ז' },
  { value: '2028', label: 'תשפ"ח' },
];

const classOptions = Array.from({ length: 12 }, (_, index) => ({
  value: String(index + 1),
  label: String(index + 1),
}));

const DRAFT_STORAGE_KEY = 'school.institution-structure.draft';

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

type ScreenProps = {
  /** TODO: לחבר לקריאת ה-API האמיתית (mutation). ברירת מחדל: הצלחה מיידית. */
  onConfirm?: (data: InstitutionStructure) => Promise<void>;
  /** TODO: לחבר להרשאות האמיתיות של המשתמש. */
  canManage?: boolean;
};

export default function Screen({
  onConfirm,
  canManage,
}: ScreenProps) {
  const token = useAppSelector((state) => state.auth.token);
  const { data: me } = useGetMeQuery(undefined, { skip: !token });
  const level = usePermission('I01');
  const permissionLevel = me?.permissions?.I01 ?? level;
  const [createInstitution, { isLoading: creatingInstitution }] = useCreateInstitutionMutation();
  const [createStructure, { isLoading: creatingStructure }] = useCreateInstitutionStructureMutation();
  const effectiveCanManage = canManage ?? (token ? canWrite(permissionLevel) : true);
  const [step, setStep] = useState<Step>('form');
  const [status, setStatus] = useState<Status>('idle');
  const [schoolName, setSchoolName] = useState('');
  const [institutionType, setInstitutionType] = useState('');
  const [levels, setLevels] = useState<string[]>([]);
  const [classesPerLevel, setClassesPerLevel] = useState('2');
  const [year, setYear] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!raw) return;

      const draft = JSON.parse(raw) as Partial<InstitutionStructure>;
      if (typeof draft.schoolName === 'string') setSchoolName(draft.schoolName);
      if (typeof draft.institutionType === 'string') setInstitutionType(draft.institutionType);
      if (Array.isArray(draft.levels)) setLevels(draft.levels);
      if (typeof draft.classesPerLevel === 'number') setClassesPerLevel(String(draft.classesPerLevel));
      if (typeof draft.year === 'string') setYear(draft.year);
    } catch {
      // Ignore invalid draft data and start from a blank form.
    }
  }, []);

  useEffect(() => {
    if (!effectiveCanManage) return;

    const draft: InstitutionStructure = {
      schoolName: schoolName.trim(),
      institutionType,
      levels,
      classesPerLevel: Number(classesPerLevel) || 0,
      year,
    };

    try {
      window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // storage may be unavailable, but the form still works.
    }
  }, [classesPerLevel, effectiveCanManage, institutionType, levels, schoolName, year]);

  const errors = useMemo(
    () => ({
      schoolName: schoolName.trim() ? '' : 'שדה חובה',
      institutionType: institutionType ? '' : 'שדה חובה',
      levels: levels.length ? '' : 'שדה חובה',
      year: year ? '' : 'שדה חובה',
    }),
    [institutionType, levels.length, schoolName, year],
  );

  const preview = useMemo(() => {
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
      const payload: InstitutionStructure = {
        schoolName: schoolName.trim(),
        institutionType,
        levels,
        classesPerLevel: Number(classesPerLevel),
        year,
      };

      const created = await (onConfirm
        ? onConfirm(payload)
        : createInstitution({
            name: payload.schoolName,
            type: payload.institutionType,
            year: payload.year,
          })
            .unwrap()
            .then(async ({ id }) => {
              await createStructure({
                institutionId: id,
                body: {
                  levels: payload.levels,
                  classesPerLevel: payload.classesPerLevel,
                  year: payload.year,
                },
              }).unwrap();
            }));

      if (created !== undefined) {
        await Promise.resolve(created);
      }

      setStatus('success');
      try {
        window.localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {
        // ignore cleanup failures
      }
    } catch {
      setStatus('error');
    }
  };

  const handleSaveAndExit = () => {
    try {
      window.localStorage.setItem(
        DRAFT_STORAGE_KEY,
        JSON.stringify({
          schoolName: schoolName.trim(),
          institutionType,
          levels,
          classesPerLevel: Number(classesPerLevel) || 0,
          year,
        }),
      );
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2000);
    } catch {
      setDraftSaved(false);
    }
  };

  const isConfirm = step === 'confirm';
  const isSubmitting = status === 'submitting';

  return (
    <div className="w-full max-w-7xl">
      <Card className="overflow-hidden border border-line bg-surface p-0 shadow-sm">
        <div className="border-b border-line bg-subtle px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <Stepper steps={steps} current={isConfirm ? 2 : 1} className="flex-1" />
          </div>
        </div>

        {!effectiveCanManage ? (
          <div className="px-6 py-10" role="alert">
            <h1 className="mb-2 text-3xl font-bold leading-none text-fg">אין הרשאה</h1>
            <p className="text-body text-fg-secondary">
              אין לך הרשאה להקים מוסד. יש לפנות למנהל המערכת.
            </p>
          </div>
        ) : (
          <>
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
                        error={
                          submitted && errors.institutionType ? errors.institutionType : undefined
                        }
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

                  {draftSaved ? (
                    <p role="status" className="mb-4 text-body text-fg-secondary">
                      הטיוטה נשמרה והאפשרות תמשיך מאוחר יותר.
                    </p>
                  ) : null}

                  <section>
                    <h2 className="mb-3 text-xl font-bold text-fg">תצוגה מקדימה</h2>

                    <div className="overflow-hidden rounded-xl border border-line bg-page">
                      <div className="grid grid-cols-5 border-b border-line bg-subtle text-body-strong text-fg-secondary">
                        <div className="col-span-2 px-4 py-3">שכבה</div>
                        <div className="col-span-3 px-4 py-3">כיתות</div>
                      </div>

                      {preview.length ? (
                        preview.map(({ level, classes }) => (
                          <div
                            key={level}
                            className="grid grid-cols-5 border-b border-line last:border-b-0"
                          >
                            <div className="col-span-2 px-4 py-3 text-body text-fg">{level}</div>
                            <div className="col-span-3 px-4 py-3 text-body text-fg">
                              {classes.join(', ')}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-6 text-body text-fg-secondary">
                          יש לבחור שכבה אחת לפחות כדי לראות את תצוגת הכיתות.
                        </div>
                      )}
                    </div>
                  </section>
                </>
              ) : (
                <>
                  <h1 className="mb-5 text-3xl font-bold leading-none text-fg">
                    אשף הקמת מוסד: אישור
                  </h1>

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
                            <dt className="text-body-strong text-fg-secondary">
                              כיתות בכל שכבה
                            </dt>
                            <dd className="text-body text-fg">{classesPerLevel}</dd>
                          </div>
                        </dl>
                      </Card>

                      <section aria-label="סיכום שכבות וכיתות">
                        <div className="overflow-hidden rounded-xl border border-line bg-page">
                          <div className="grid grid-cols-5 border-b border-line bg-subtle text-body-strong text-fg-secondary">
                            <div className="col-span-2 px-4 py-3">שכבה</div>
                            <div className="col-span-3 px-4 py-3">כיתות</div>
                          </div>
                          {preview.map(({ level, classes }) => (
                            <div
                              key={level}
                              className="grid grid-cols-5 border-b border-line last:border-b-0"
                            >
                              <div className="col-span-2 px-4 py-3 text-body text-fg">{level}</div>
                              <div className="col-span-3 px-4 py-3 text-body text-fg">
                                {classes.join(', ')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>

                      {status === 'error' ? (
                        <p role="alert" className="mt-4 text-body text-fg">
                          אירעה שגיאה בשמירה. נסו שוב.
                        </p>
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
                <div className="ms-auto flex items-center gap-3">
                  <Button variant="secondary" size="M" onClick={handleSaveAndExit}>
                    שמור וצא
                  </Button>
                  <Button size="M" onClick={handleContinue}>
                    המשך
                  </Button>
                </div>
              ) : status !== 'success' ? (
                <Button
                  size="M"
                  onClick={handleConfirm}
                  disabled={isSubmitting || creatingInstitution || creatingStructure}
                >
                  {isSubmitting || creatingInstitution || creatingStructure ? 'שומר...' : 'אישור'}
                </Button>
              ) : null}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}