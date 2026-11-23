import { useEffect, useState } from 'react';
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
import {
  CLASS_OPTIONS,
  EXISTING_PARENT_EMAILS,
  EXISTING_STUDENT_IDS,
  TAG_OPTIONS,
} from '../../mocks/studentForm';
import { createStudent, getStudentById, updateStudent } from '../../api/studentsApi';

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

function usePermission(_screenId: string): { canWrite: boolean } {
  return { canWrite: true };
}

function pathFor(screenId: 'S01' | 'S02'): string {
  return screenId === 'S02' ? '/students/s02' : pathForList();
}

function pathForList(): string {
  return '/students';
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

export default function StudentFormPage() {
  const { canWrite } = usePermission('S02');
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');
  const isEdit = Boolean(editId);

  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isDirty, setIsDirty] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isLoadingStudent, setIsLoadingStudent] = useState(Boolean(editId));
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!editId || !canWrite) {
      setIsLoadingStudent(false);
      return;
    }

    let cancelled = false;
    setIsLoadingStudent(true);
    setLoadError(null);

    getStudentById(editId)
      .then((student) => {
        if (cancelled) return;
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
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setLoadError(err instanceof Error ? err.message : 'שגיאה בטעינת נתוני התלמיד');
      })
      .finally(() => {
        if (!cancelled) setIsLoadingStudent(false);
      });

    return () => {
      cancelled = true;
    };
  }, [editId, canWrite]);

  if (!canWrite) {
    return <ForbiddenState />;
  }

  function set<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validateId() {
    if (!form.nationalId) return;
    if (!isValidIsraeliId(form.nationalId)) {
      setErrors((prev) => ({ ...prev, nationalId: 'תעודת זהות אינה תקינה' }));
    } else if (EXISTING_STUDENT_IDS.includes(form.nationalId)) {
      setErrors((prev) => ({ ...prev, nationalId: 'תלמיד עם תעודת זהות זו כבר קיים במערכת' }));
    }
  }

  function validateEmail() {
    if (!form.parentEmail) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.parentEmail)) {
      setErrors((prev) => ({ ...prev, parentEmail: 'כתובת אימייל אינה תקינה' }));
    } else if (EXISTING_PARENT_EMAILS.includes(form.parentEmail)) {
      setErrors((prev) => ({ ...prev, parentEmail: 'אימייל זה כבר רשום במערכת' }));
    }
  }

  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.firstName.trim()) e.firstName = 'שדה חובה';
    if (!form.lastName.trim()) e.lastName = 'שדה חובה';
    if (!form.nationalId) {
      e.nationalId = 'שדה חובה';
    } else if (!isValidIsraeliId(form.nationalId)) {
      e.nationalId = 'תעודת זהות אינה תקינה';
    } else if (EXISTING_STUDENT_IDS.includes(form.nationalId)) {
      e.nationalId = 'תלמיד עם תעודת זהות זו כבר קיים במערכת';
    }
    if (!form.birthDate) e.birthDate = 'שדה חובה';
    if (!form.className) e.className = 'שדה חובה';
    if (!form.phone.trim()) {
      e.phone = 'שדה חובה';
    } else if (!/^0\d{1,2}-?\d{3}-?\d{4}$/.test(form.phone.replace(/\s/g, ''))) {
      e.phone = 'מספר טלפון אינו תקין';
    }
    if (form.parentEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.parentEmail)) {
      e.parentEmail = 'כתובת אימייל אינה תקינה';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    if (!validate() || isSubmitting) return;

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
      setIsSubmitting(true);
      if (isEdit && editId) {
        await updateStudent(editId, payload);
      } else {
        await createStudent(payload);
      }
      toast({ message: 'נשמר בהצלחה!' });
      setIsDirty(false);
    } catch (err: unknown) {
      toast({
        message: err instanceof Error ? err.message : 'אירעה שגיאה בשמירה',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    if (isDirty) {
      setIsLeaveModalOpen(true);
      return;
    }
    navigate(pathFor('S01'));
  }

  function confirmLeave() {
    setIsLeaveModalOpen(false);
    setIsDirty(false);
    navigate(pathFor('S01'));
  }

  function toggleTag(tag: string) {
    set('tags', form.tags.includes(tag) ? form.tags.filter((t) => t !== tag) : [...form.tags, tag]);
  }

  const listPath = pathFor('S01');

  const leaveFooter = {
    variant: 'double',
    confirmLabel: 'צא',
    cancelLabel: 'הישאר בעמוד',
    onConfirm: confirmLeave,
    onCancel: () => setIsLeaveModalOpen(false),
    confirm: { label: 'צא', onClick: confirmLeave },
    cancel: { label: 'הישאר בעמוד', onClick: () => setIsLeaveModalOpen(false) },
  } as unknown as ModalFooter;

  if (isLoadingStudent) {
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
            options={CLASS_OPTIONS}
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
            {TAG_OPTIONS.map((tag) => {
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
        <Button variant="primary" onClick={handleSave} disabled={isSubmitting}>
          שמור
        </Button>
        <Button variant="secondary" onClick={handleCancel} disabled={isSubmitting}>
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
