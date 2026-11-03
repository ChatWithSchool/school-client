import { useMemo, useState } from 'react';
import { Button, Card, Select, Stepper, TextField } from '../../components/ui';

const steps = ['מבנה', 'צוות', 'תלמידים', 'מקצועות', 'סיום'];

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

const schoolYears = [
  { value: '2026', label: 'תשפ"ו' },
  { value: '2027', label: 'תשפ"ז' },
  { value: '2028', label: 'תשפ"ח' },
];

const classOptions = Array.from({ length: 12 }, (_, index) => ({
  value: String(index + 1),
  label: String(index + 1),
}));

export default function Screen() {
  const [schoolName, setSchoolName] = useState('');
  const [institutionType, setInstitutionType] = useState('');
  const [levels, setLevels] = useState<string[]>([]);
  const [classesPerLevel, setClassesPerLevel] = useState('2');
  const [year, setYear] = useState('');
  const [submitted, setSubmitted] = useState(false);

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
      const classNames = Array.from({ length: count }, (_, index) =>
        String.fromCharCode(0x05d0 + index),
      );

      return { level, classes: classNames };
    });
  }, [classesPerLevel, levels]);

  const handleContinue = () => {
    setSubmitted(true);

    if (Object.values(errors).some(Boolean)) {
      return;
    }
  };

  return (
    <div className="w-full max-w-7xl">
      <Card className="overflow-hidden border border-line bg-surface p-0 shadow-sm">
        <div className="border-b border-line bg-subtle px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <Stepper steps={steps} current={1} className="flex-1" />
          </div>
        </div>

        <div className="px-6 pb-6 pt-5">
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
                    <div className="col-span-3 px-4 py-3 text-body text-fg">{classes.join(', ')}</div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-6 text-body text-fg-secondary">
                  יש לבחור שכבה אחת לפחות כדי לראות את תצוגת הכיתות.
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-line bg-subtle px-6 py-4">
          <Button variant="secondary" size="M">
            חזרה
          </Button>

          <div className="flex items-center gap-3">
            <Button variant="secondary" size="M">
              שמור וצא
            </Button>
            <Button size="M" onClick={handleContinue}>
              המשך
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
