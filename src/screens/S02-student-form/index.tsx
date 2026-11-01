import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  PageHeader,
  Button,
  TextField,
  TextArea,
  Select,
  DatePicker,
  Tag,
} from '../../components/ui';

interface FormData {
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

const CLASS_OPTIONS = [
  { value: '', label: 'בחרו כיתה' },
  { value: 'ז1', label: 'ז1' },
  { value: 'ז2', label: 'ז2' },
  { value: 'ח1', label: 'ח1' },
  { value: 'ח2', label: 'ח2' },
  { value: 'ח3', label: 'ח3' },
  { value: 'ט1', label: 'ט1' },
];

const TAG_OPTIONS = ['חדש', 'מעקב', 'תמיכה', 'חוג'];

// בדיקת תעודת זהות ישראלית
function isValidIsraeliId(id: string): boolean {
  return /^\d{9}$/.test(id);
}

// נתוני דמה לבדיקת כפילות
const EXISTING_IDS = ['123456782', '987654321'];
const EXISTING_EMAILS = ['amit.biton@example.com'];

// נתוני דמה לעריכה — אותם תלמידים כמו ב-S01
const MOCK_STUDENTS_MAP: Record<string, FormData> = {
  '1': { firstName: 'נועם', lastName: 'ביטון', nationalId: '123456782', birthDate: new Date(2012, 0, 1), className: 'ח1', phone: '050-000-0000', phoneExtra: '', parentEmail: 'amit.biton@example.com', address: '', notes: '', tags: ['חדש'] },
  '2': { firstName: 'יובל', lastName: 'קליין', nationalId: '234567891', birthDate: new Date(2012, 3, 5), className: 'ח1', phone: '050-000-0001', phoneExtra: '', parentEmail: '', address: '', notes: '', tags: [] },
  '3': { firstName: 'עדי', lastName: 'פרץ', nationalId: '345678912', birthDate: new Date(2011, 6, 12), className: 'ח2', phone: '050-000-0002', phoneExtra: '', parentEmail: '', address: '', notes: '', tags: ['מעקב'] },
};

export default function StudentFormPage() {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');
  const isEdit = !!editId;

  const EMPTY_FORM: FormData = {
    firstName: '', lastName: '', nationalId: '', birthDate: null,
    className: '', phone: '', phoneExtra: '', parentEmail: '',
    address: '', notes: '', tags: [],
  };

  const [form, setForm] = useState<FormData>(() =>
    editId && MOCK_STUDENTS_MAP[editId] ? MOCK_STUDENTS_MAP[editId] : EMPTY_FORM
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [isDirty, setIsDirty] = useState(false);
  const navigate = useNavigate();

  function set(field: keyof FormData, value: FormData[keyof FormData]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validateId() {
    if (!form.nationalId) return;
    if (!isValidIsraeliId(form.nationalId)) {
      setErrors((prev) => ({ ...prev, nationalId: 'תעודת זהות אינה תקינה' }));
    } else if (EXISTING_IDS.includes(form.nationalId)) {
      setErrors((prev) => ({ ...prev, nationalId: 'תלמיד עם תעודת זהות זו כבר קיים במערכת' }));
    }
  }

  function validateEmail() {
    if (!form.parentEmail) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.parentEmail)) {
      setErrors((prev) => ({ ...prev, parentEmail: 'כתובת אימייל אינה תקינה' }));
    } else if (EXISTING_EMAILS.includes(form.parentEmail)) {
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
    } else if (EXISTING_IDS.includes(form.nationalId)) {
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

  function handleSave() {
    if (!validate()) return;
    alert('נשמר בהצלחה!');
    setIsDirty(false);
  }

  function handleCancel() {
    if (isDirty && !confirm('יש שינויים שלא נשמרו. האם לצאת?')) return;
    navigate('/students/s01');
  }

  function toggleTag(tag: string) {
    set(
      'tags',
      form.tags.includes(tag) ? form.tags.filter((t) => t !== tag) : [...form.tags, tag],
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl mx-auto" dir="rtl">
      <PageHeader
        title={isEdit ? 'עריכת תלמיד' : 'תלמיד חדש'}
        breadcrumbs={[
          { label: 'תלמידים', href: '/students/s01' },
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
            {TAG_OPTIONS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-full"
              >
                <Tag
                  label={tag}
                  className={form.tags.includes(tag) ? 'bg-primary-100 text-primary-700' : ''}
                />
              </button>
            ))}
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
        <Button variant="primary" onClick={handleSave}>
          שמור
        </Button>
        <Button variant="secondary" onClick={handleCancel}>
          בטל
        </Button>
      </div>
    </div>
  );
}
