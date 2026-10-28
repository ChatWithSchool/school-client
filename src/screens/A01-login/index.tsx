import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../api/authApi';
import { errorMessage, fieldErrors } from '../../api/errors';
import { useAppDispatch } from '../../app/hooks';
import { Icon } from '../../components/Icon';
import { setCredentials } from '../../features/auth/authSlice';
import { pathFor } from '../../routes/screens';
import { alert, btn, card, cx, field, text } from '../../styles/recipes';

/** A01 · Login. Built as part of the project infrastructure: use it as an example of a screen with a form. */
export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const fields = fieldErrors(error);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ token: res.token }));
      navigate(pathFor(res.landing), { replace: true });
    } catch {
      /* the error is shown below from the mutation state */
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-page p-6">
      <form onSubmit={onSubmit} className={cx(card, 'w-full max-w-sm space-y-5')} noValidate>
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white">
            <Icon name="check" size={22} />
          </span>
          <span className={text.h2}>ניהול פדגוגי</span>
        </div>
        <div>
          <h1 className={text.h1}>כניסה למערכת</h1>
          <p className={text.muted}>הזינו את פרטי החשבון כדי להמשיך</p>
        </div>

        {error && !Object.keys(fields).length && (
          <p role="alert" className={alert.danger}>
            {errorMessage(error)}
          </p>
        )}

        <div>
          <label htmlFor="email" className={field.label}>
            אימייל
          </label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            className={field.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(fields.email)}
            dir="ltr"
          />
          {fields.email && <p className={field.error}>{fields.email}</p>}
        </div>
        <div>
          <label htmlFor="password" className={field.label}>
            סיסמה
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className={field.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={Boolean(fields.password)}
            dir="ltr"
          />
          {fields.password && <p className={field.error}>{fields.password}</p>}
        </div>

        <button type="submit" className={cx(btn.primary, 'w-full')} disabled={isLoading}>
          {isLoading ? 'מתחבר…' : 'כניסה'}
        </button>
        <Link to={pathFor('A03')} className="block text-center text-body-strong text-primary-600">
          שכחתי סיסמה
        </Link>
      </form>
    </div>
  );
}






