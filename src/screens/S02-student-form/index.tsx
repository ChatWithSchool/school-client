import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  PageHeader,
  Button,
  TextField,
  TextArea,
  Select,
  DatePicker,
  Tag,
  Modal,
  useToast,
} from '../../components/ui';
import type { ModalFooter } from '../../components/ui';
import { ForbiddenState } from '../../components/StateViews';
import { usePermission } from '../../features/auth/usePermission';
import { useGetMeQuery } from '../../api/authApi'; // התאימי לנתיב שבו A07 מייבאת אותו
import { pathFor } from '../../routes/screens';
import {
  useCreateStudentMutation,
  useGetClassesQuery,
  useGetStudentQuery,
  useGetStudentTagsQuery,
  useLazyCheckStudentDuplicateQuery,
  useUpdateStudentMutation,
} from '../../api/studentsApi';
import type { CheckDuplicateParams, CheckDuplicateResult } from '../../api/studentsApi';

export interface FormData {
  firstName: string;
  lastName: string;
  nationalId: string;
  birthDate: Date | null;
  className: string;
  phone: string;
  phoneExtra: string;
  parentEmail: string;
  address: string;
  notes: string;
  tags: string[];
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  nationalId?: string;
  birthDate?: string;
  className?: string;
  phone?: string;
  phoneExtra?: string;
  parentEmail?: string;
}

const EMPTY_FORM: FormData = {
  firstName: '',
  lastName: '',
  nationalId: '',
  birthDate: null,
  className: '',
  phone: '',
  phoneExtra: '',
  parentEmail: '',
  address: '',
  notes: '',
  tags: [],
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^0\d{1,2}-?\d{3}-?\d{4}$/;

const DUPLICATE_ID_MESSAGE = 'תלמיד עם תעודת זהות זו כבר קיים במערכת';
const DUPLICATE_EMAIL_MESSAGE = 'אימייל זה כבר רשום במערכת';

// בדיקת תעודת זהות ישראלית כולל ספרת ביקורת
function isValidIsraeliId(id: string): boolean {
  const cleaned = id.trim();
  if (!/^\d{9}$/.test(cleaned)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let digit = Number(cleaned[i]) * ((i % 2) + 1);
    if (digit > 9) digit -= 9;
    sum += digit;
  }

  return sum % 10 === 0;
}

function isValidPhone(phone: string): boolean {
  return PHONE_REGEX.test(phone.replace(/\s/g, ''));
}

function formatDateInput(date: Date | null): string {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateInput(isoDate: string): Date | null {
  if (!isoDate) return null;
  const [year, month, day] = isoDate.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

// מחלץ את הודעת השגיאה מתשובת השרת (RTK Query) או מחזיר הודעת ברירת מחדל
function getErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const data = (error as { data?: unknown }).data;
    if (typeof data === 'object' && data !== null && 'message' in data) {
      const message = (data as { message?: unknown }).message;
      if (typeof message === 'string' && message.trim()) return message;
    }
  }
  return fallback;
}

export default function StudentFormPage() {

  const permissionLevel = usePermission('students');
  const canWrite = String(permissionLevel) === 'write';
  const { isLoading: isMeLoading } = useGetMeQuery();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');
  const isEdit = Boolean(editId);

  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isDirty, setIsDirty] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [hydratedId, setHydratedId] = useState<string | null>(null);
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  // הערך העדכני של הטופס, לשימוש אחרי await (מונע תוצאת בדיקה ישנה על ערך שהשתנה)
  const latestForm = useRef(form);
  latestForm.current = form;

  const { data: student, error: studentError } = useGetStudentQuery(editId ?? '', {
    skip: !editId || !canWrite,
    refetchOnMountOrArgChange: true,
  });
  const { data: classesData } = useGetClassesQuery(undefined, { skip: !canWrite });
  const { data: tagsData } = useGetStudentTagsQuery(undefined, { skip: !canWrite });
  const [checkDuplicate] = useLazyCheckStudentDuplicateQuery();
  const [createStudent, { isLoading: isCreating }] = useCreateStudentMutation();
  const [updateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation();
  const isSubmitting = isCreating || isUpdating;

  const classOptions = useMemo(
    () => [
      { value: '', label: 'בחרו כיתה' },
      ...(classesData?.items ?? []).map((c) => ({ value: c.name, label: c.name })),
    ],
    [classesData],
  );
  const tagOptions = useMemo(() => (tagsData?.items ?? []).map((t) => t.name), [tagsData]);

  const loadError = studentError ? getErrorMessage(studentError, 'שגיאה בטעינת נתוני התלמיד') : null;

  // מילוי הטופס פעם אחת כשנתוני התלמיד מגיעים (מצב עריכה)
  useEffect(() => {
    if (!student || hydratedId === student.id) return;
    setForm({
      firstName: student.firstName,
      lastName: student.lastName,
      nationalId: student.nationalId,
      birthDate: parseDateInput(student.birthDate),
      className: student.className,
      phone: student.phone,
      phoneExtra: student.phoneExtra,
      parentEmail: student.parentEmail,
      address: student.address,
      notes: student.notes,
      tags: student.tags ?? [],
    });
    setIsDirty(false);
    setHydratedId(student.id);
  }, [student, hydratedId]);

  // אזהרה בסגירת טאב / רענון כשיש שינויים שלא נשמרו
  useEffect(() => {
    if (!isDirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  const listPath = pathFor('S01');

  // עד שהמשתמשת נטענה אי אפשר לדעת אם יש הרשאה - לא מציגים "אין הרשאה" בטעות
  if (isMeLoading) {
    return (
      <div className="flex flex-col gap-6 p-6 max-w-3xl mx-auto">
        <PageHeader
          title={isEdit ? 'עריכת תלמיד' : 'תלמיד חדש'}
          breadcrumbs={[
            { label: 'תלמידים', to: listPath },
            { label: isEdit ? 'עריכת תלמיד' : 'תלמיד חדש' },
          ]}
        />
        <p className="text-body text-muted">טוען...</p>
      </div>
    );
  }

  if (!canWrite) {
    return <ForbiddenState />;
  }

  function set<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  // בדיקת כפילות מול השרת (GET /students/check-duplicate). בעריכה מוחרג התלמיד עצמו.
  async function runDuplicateCheck(
    params: CheckDuplicateParams,
  ): Promise<CheckDuplicateResult | null> {
    try {
      return await checkDuplicate({ ...params, excludeId: editId ?? undefined }).unwrap();
    } catch {
      // כשל בבדיקה לא חוסם: השרת יחזיר 409 בשמירה אם יש כפילות
      return null;
    }
  }

  async function validateId() {
    const id = form.nationalId.trim();
    if (!id) return;
    if (!isValidIsraeliId(id)) {
      setErrors((prev) => ({ ...prev, nationalId: 'תעודת זהות אינה תקינה' }));
      return;
    }
    const result = await runDuplicateCheck({ nationalId: id });
    if (result?.nationalIdExists && latestForm.current.nationalId.trim() === id) {
      setErrors((prev) => ({ ...prev, nationalId: DUPLICATE_ID_MESSAGE }));
    }
  }

  async function validateEmail() {
    const email = form.parentEmail.trim();
    if (!email) return;
    if (!EMAIL_REGEX.test(email)) {
      setErrors((prev) => ({ ...prev, parentEmail: 'כתובת אימייל אינה תקינה' }));
      return;
    }
    const result = await runDuplicateCheck({ parentEmail: email });
    if (result?.parentEmailExists && latestForm.current.parentEmail.trim() === email) {
      setErrors((prev) => ({ ...prev, parentEmail: DUPLICATE_EMAIL_MESSAGE }));
    }
  }

  // ולידציה מקומית (פורמט ושדות חובה). בדיקת הכפילות נעשית מול השרת ב-handleSave
  function validate(): boolean {
    const e: FormErrors = {};

    if (!form.firstName.trim()) e.firstName = 'שדה חובה';
    if (!form.lastName.trim()) e.lastName = 'שדה חובה';

    if (!form.nationalId.trim()) {
      e.nationalId = 'שדה חובה';
    } else if (!isValidIsraeliId(form.nationalId)) {
      e.nationalId = 'תעודת זהות אינה תקינה';
    }

    if (!form.birthDate) {
      e.birthDate = 'שדה חובה';
    } else if (form.birthDate.getTime() > Date.now()) {
      e.birthDate = 'תאריך לידה לא יכול להיות בעתיד';
    }

    if (!form.className) e.className = 'שדה חובה';

    if (!form.phone.trim()) {
      e.phone = 'שדה חובה';
    } else if (!isValidPhone(form.phone)) {
      e.phone = 'מספר טלפון אינו תקין';
    }

    if (form.phoneExtra.trim() && !isValidPhone(form.phoneExtra)) {
      e.phoneExtra = 'מספר טלפון אינו תקין';
    }

    if (form.parentEmail.trim() && !EMAIL_REGEX.test(form.parentEmail.trim())) {
      e.parentEmail = 'כתובת אימייל אינה תקינה';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    if (isSubmitting || isCheckingDuplicates || !validate()) return;

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      nationalId: form.nationalId.trim(),
      birthDate: formatDateInput(form.birthDate),
      className: form.className,
      phone: form.phone.trim(),
      phoneExtra: form.phoneExtra.trim(),
      parentEmail: form.parentEmail.trim(),
      address: form.address.trim(),
      notes: form.notes.trim(),
      tags: form.tags,
    };

    try {
      setIsCheckingDuplicates(true);
      const duplicates = await runDuplicateCheck({
        nationalId: payload.nationalId,
        parentEmail: payload.parentEmail || undefined,
      });
      if (duplicates) {
        const e: FormErrors = {};
        if (duplicates.nationalIdExists) e.nationalId = DUPLICATE_ID_MESSAGE;
        if (duplicates.parentEmailExists) e.parentEmail = DUPLICATE_EMAIL_MESSAGE;
        if (Object.keys(e).length > 0) {
          setErrors((prev) => ({ ...prev, ...e }));
          return;
        }
      }
    } finally {
      setIsCheckingDuplicates(false);
    }

    try {
      if (isEdit && editId) {
        await updateStudent({ id: editId, body: payload }).unwrap();
      } else {
        await createStudent(payload).unwrap();
      }
      setIsDirty(false);
      toast({ message: 'נשמר בהצלחה!' });
      navigate(listPath);
    } catch (err: unknown) {
      toast({ message: getErrorMessage(err, 'אירעה שגיאה בשמירה') });
    }
  }

  function handleCancel() {
    if (isDirty) {
      setIsLeaveModalOpen(true);
      return;
    }
    navigate(listPath);
  }

  function confirmLeave() {
    setIsLeaveModalOpen(false);
    setIsDirty(false);
    navigate(listPath);
  }

  function toggleTag(tag: string) {
    set('tags', form.tags.includes(tag) ? form.tags.filter((t) => t !== tag) : [...form.tags, tag]);
  }

  const leaveFooter = {
    variant: 'double',
    confirmLabel: 'צא',
    cancelLabel: 'הישאר בעמוד',
    onConfirm: confirmLeave,
    onCancel: () => setIsLeaveModalOpen(false),
    confirm: { label: 'צא', onClick: confirmLeave },
    cancel: { label: 'הישאר בעמוד', onClick: () => setIsLeaveModalOpen(false) },
  } as unknown as ModalFooter;

  if (loadError) {
    return (
      <div className="flex flex-col gap-6 p-6 max-w-3xl mx-auto">
        <PageHeader
          title="עריכת תלמיד"
          breadcrumbs={[{ label: 'תלמידים', to: listPath }, { label: 'עריכת תלמיד' }]}
        />
        <div className="rounded-xl border border-line bg-surface p-6 flex flex-col gap-4">
          <p className="text-body text-fg">{loadError}</p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => navigate(listPath)}>
              חזרה לרשימה
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isEdit && hydratedId !== editId) {
    return (
      <div className="flex flex-col gap-6 p-6 max-w-3xl mx-auto">
        <PageHeader
          title="עריכת תלמיד"
          breadcrumbs={[{ label: 'תלמידים', to: listPath }, { label: 'עריכת תלמיד' }]}
        />
        <p className="text-body text-muted">טוען נתוני תלמיד...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl mx-auto">
      <PageHeader
        title={isEdit ? 'עריכת תלמיד' : 'תלמיד חדש'}
        breadcrumbs={[
          { label: 'תלמידים', to: listPath },
          { label: isEdit ? 'עריכת תלמיד' : 'תלמיד חדש' },
        ]}
      />

      {/* פרטים אישיים */}
      <section className="rounded-xl border border-line bg-surface p-6 flex flex-col gap-4">
        <h2 className="text-body-strong text-fg">פרטים אישיים</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            label="שם פרטי"
            required
            value={form.firstName}
            onChange={(e) => set('firstName', e.target.value)}
            error={errors.firstName}
          />
          <TextField
            label="שם משפחה"
            required
            value={form.lastName}
            onChange={(e) => set('lastName', e.target.value)}
            error={errors.lastName}
          />
          <TextField
            label="תעודת זהות"
            required
            value={form.nationalId}
            onChange={(e) => set('nationalId', e.target.value)}
            onBlur={validateId}
            error={errors.nationalId}
            inputMode="numeric"
            maxLength={9}
          />
          <DatePicker
            label="תאריך לידה"
            required
            value={form.birthDate}
            onChange={(d) => set('birthDate', d)}
            error={errors.birthDate}
          />
          <Select
            label="כיתה"
            required
            options={classOptions}
            value={form.className}
            onValueChange={(v) => set('className', v)}
            error={errors.className}
          />
        </div>
      </section>

      {/* קשר */}
      <section className="rounded-xl border border-line bg-surface p-6 flex flex-col gap-4">
        <h2 className="text-body-strong text-fg">קשר</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            label="טלפון ראשי"
            required
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            error={errors.phone}
            inputMode="tel"
          />
          <TextField
            label="טלפון נוסף"
            value={form.phoneExtra}
            onChange={(e) => set('phoneExtra', e.target.value)}
            error={errors.phoneExtra}
            inputMode="tel"
          />
          <TextField
            label="אימייל הורה"
            value={form.parentEmail}
            onChange={(e) => set('parentEmail', e.target.value)}
            onBlur={validateEmail}
            error={errors.parentEmail}
            inputMode="email"
          />
          <TextField
            label="כתובת"
            value={form.address}
            onChange={(e) => set('address', e.target.value)}
          />
        </div>
      </section>

      {/* נוסף */}
      <section className="rounded-xl border border-line bg-surface p-6 flex flex-col gap-4">
        <h2 className="text-body-strong text-fg">נוסף</h2>
        <div className="flex flex-col gap-2">
          <span className="text-label text-fg">תגיות</span>
          <div className="flex flex-wrap gap-2">
            {tagOptions.map((tag) => {
              const isSelected = form.tags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggleTag(tag)}
                  className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-full"
                >
                  <Tag
                    label={tag}
                    className={isSelected ? 'bg-primary-100 text-primary-700' : ''}
                  />
                </button>
              );
            })}
          </div>
        </div>
        <TextArea
          label="הערות כלליות"
          rows={3}
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
        />
      </section>

      {/* פעולות */}
      <div className="flex gap-3 justify-start">
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isSubmitting || isCheckingDuplicates}
        >
          שמור
        </Button>
        <Button
          variant="secondary"
          onClick={handleCancel}
          disabled={isSubmitting || isCheckingDuplicates}
        >
          בטל
        </Button>
      </div>

      <Modal
        open={isLeaveModalOpen}
        onOpenChange={setIsLeaveModalOpen}
        title="יציאה ללא שמירה"
        description="יש שינויים שלא נשמרו. האם לצאת?"
        footer={leaveFooter}
      />
    </div>
  );
}