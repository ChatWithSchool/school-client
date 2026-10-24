import { useId } from 'react';

/**
 * The ids that connect a field to its label, hint and error. The input gets `aria-invalid` and an
 * `aria-describedby` that lists the hint, the error and any id the screen passed in.
 */
export function useField({
  id,
  hint,
  error,
  describedBy,
}: {
  id?: string;
  hint?: string;
  error?: string;
  describedBy?: string;
}) {
  const auto = useId();
  const fieldId = id ?? auto;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const ids = [describedBy, hintId, errorId].filter(Boolean).join(' ');
  return {
    fieldId,
    hintId,
    errorId,
    inputProps: {
      id: fieldId,
      'aria-invalid': error ? (true as const) : undefined,
      'aria-describedby': ids || undefined,
    },
  };
}
