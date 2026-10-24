import type { ReactNode } from 'react';
import { Icon } from '../../Icon';

/** The label above a field. A required field shows a red star (the input itself has `required`). */
export function FieldLabel({
  htmlFor,
  id,
  required,
  children,
}: {
  htmlFor?: string;
  id?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} id={id} className="mb-1 block text-label text-fg-secondary">
      {children}
      {required && (
        <span aria-hidden="true" className="ms-0.5 text-danger-600">
          *
        </span>
      )}
    </label>
  );
}

/** The hint or the error under a field. The error has an icon and a color, not a color only. */
export function FieldMessage({
  hintId,
  hint,
  errorId,
  error,
}: {
  hintId?: string;
  hint?: string;
  errorId?: string;
  error?: string;
}) {
  return (
    <>
      {hint && (
        <p id={hintId} className="mt-1 text-caption text-fg-secondary">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1 flex items-center gap-1 text-caption text-danger-700">
          <Icon name="circle-alert" size={14} />
          {error}
        </p>
      )}
    </>
  );
}
