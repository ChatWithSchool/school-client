import React, { useState, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, TextField, Alert, EmptyState } from '../../components/ui';
import { Icon } from '../../components/Icon';
import { LoadingSkeleton, ErrorState } from '../../components/StateViews';
import { useAcceptInviteMutation, useGetInvitePreviewQuery } from '../../api/joinInviteApi';
import type { ApiErrorBody, RoleKey } from '../../api/types';
import { errorMessage } from '../../api/errors';
import { useAppDispatch } from '../../app/hooks';
import { setCredentials } from '../../features/auth/authSlice';
import { pathFor } from '../../routes/screens';
import { missingInPassword } from './password';

const ROLE_LABELS: Record<RoleKey, string> = {
  management: 'הנהלה',
  coordinator: 'רכז/ת',
  secretary: 'מזכירות',
  homeroom: 'מחנך/ת',
  teacher: 'מורה מקצועי',
  parent: 'הורה',
  student: 'תלמיד/ה',
};

type ApiError = { status?: number | string; data?: Partial<ApiErrorBody> };

/** The card with the logo, as in Figma. Every state of the screen is shown inside it. */
function Card({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-page text-start" dir="rtl">
      <div className="w-full max-w-lg p-8 bg-surface rounded-xl shadow-md border border-line">
        {/* לוגו (כמו במסך הכניסה) */}
        <div className="flex items-center justify-end gap-3 mb-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white">
            <Icon name="check" size={22} />
          </span>
          <span className="text-h2 text-fg">ניהול פדגוגי</span>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function JoinInviteScreen() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { token = '' } = useParams();
  const { data: invite, isFetching, error: loadError, refetch } = useGetInvitePreviewQuery(token);
  const [accept, acceptState] = useAcceptInviteMutation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError('נא למלא את כל שדות החובה.');
      return;
    }

    const missing = missingInPassword(formData.password);
    if (missing.length) {
      setError(`הסיסמה חלשה מדי. חסר בה: ${missing.join(', ')}.`);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('הסיסמאות אינן תואמות.');
      return;
    }

    try {
      const { confirmPassword: _, phone, ...rest } = formData;
      const res = await accept({ token, body: { ...rest, phone: phone || undefined } }).unwrap();
      // joining signs in, then goes to the home screen of the role
      dispatch(setCredentials({ token: res.token }));
      navigate(pathFor(res.landing), { replace: true });
    } catch (err) {
      setError(errorMessage(err));
      // the link may have expired or been used meanwhile: load it again to show that
      if ((err as ApiError).status === 409) refetch();
    }
  };

  const failed = loadError as ApiError | undefined;
  let state: ReactNode = null;
  if (isFetching && !invite) state = <LoadingSkeleton rows={6} />;
  else if (failed && failed.status !== 404)
    state = (
      <ErrorState
        message={`שגיאה בטעינת ההזמנה. (קוד תקלה: ${failed.data?.error?.code ?? failed.status})`}
        onRetry={refetch}
      />
    );
  // an expired, used or unknown link: a screen of its own that asks for a new invite
  else if (invite?.status !== 'valid')
    state = (
      <EmptyState
        variant="error"
        title={invite?.status === 'used' ? 'כבר נעשה שימוש בקישור ההזמנה' : 'קישור ההזמנה פג תוקף'}
        text="קישור הזמנה תקף לזמן מוגבל ולשימוש אחד. פני למנהל/ת המוסד ובקשי שישלחו לך הזמנה חדשה."
        action={<Button onClick={() => navigate('/login')}>מעבר לכניסה</Button>}
      />
    );
  if (state || !invite) return <Card>{state}</Card>;

  return (
    <Card>
      <h1 className="text-h1 text-fg mb-6">הצטרפות בהזמנה (הגדרת חשבון)</h1>

      {/* תיבת פרטי ההזמנה (לקריאה בלבד) */}
      <div className="bg-info-50 p-4 rounded-lg mb-6 text-body text-info-700 flex flex-col gap-2 text-start">
        <p className="text-body-strong">{invite.institutionName}</p>
        <p>תפקיד: {ROLE_LABELS[invite.role] ?? invite.role}</p>
        <p>אימייל: {invite.email}</p>
      </div>

      {error && (
        <div className="mb-4">
          <Alert tone="danger">{error}</Alert>
        </div>
      )}

      {/* "*" is in the label as in Figma (the `required` prop would add a second, red one) */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <TextField
          label="שם פרטי *"
          name="firstName"
          placeholder="הקלידו כאן"
          value={formData.firstName}
          onChange={handleChange}
          aria-required
        />
        <TextField
          label="שם משפחה *"
          name="lastName"
          placeholder="הקלידו כאן"
          value={formData.lastName}
          onChange={handleChange}
          aria-required
        />
        <TextField
          label="טלפון"
          name="phone"
          type="tel"
          placeholder="הקלידו כאן"
          value={formData.phone}
          onChange={handleChange}
        />
        <TextField
          label="סיסמה עם מד חוזק *"
          name="password"
          type="password"
          placeholder="הקלידו כאן"
          value={formData.password}
          onChange={handleChange}
          aria-required
        />
        <TextField
          label="אימות סיסמה *"
          name="confirmPassword"
          type="password"
          placeholder="הקלידו כאן"
          value={formData.confirmPassword}
          onChange={handleChange}
          aria-required
        />

        {/* אזור הפעולות */}
        <div className="mt-2 flex flex-col gap-3">
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            loading={acceptState.isLoading}
          >
            יצירת חשבון
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() => navigate('/login')}
          >
            יש לי כבר חשבון
          </Button>
        </div>
      </form>
    </Card>
  );
}
