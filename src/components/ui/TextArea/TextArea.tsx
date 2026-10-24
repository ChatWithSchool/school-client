import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cx } from '../../../styles/recipes';
import { FieldLabel, FieldMessage } from '../internal/FieldParts';
import { fieldBox } from '../internal/styles';
import { useField } from '../internal/useField';

export type TextAreaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'rows'> & {
  label: string;
  /** Figma `Rows`: the visible height in lines. */
  rows?: 3 | 5;
  hint?: string;
  error?: string;
};

/** A multi-line text field (feedback, notes), with its label, hint and error. */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  {
    label,
    rows = 3,
    hint,
    error,
    id,
    className,
    disabled,
    required,
    'aria-describedby': describedBy,
    ...rest
  },
  ref,
) {
  const f = useField({ id, hint, error, describedBy });
  return (
    <div className={className}>
      <FieldLabel htmlFor={f.fieldId} required={required}>
        {label}
      </FieldLabel>
      <textarea
        ref={ref}
        rows={rows}
        disabled={disabled}
        required={required}
        className={cx(
          fieldBox.base,
          // a textarea is its own box: focus-within also matches the focused element itself
          'resize-y py-3 placeholder:text-fg-muted focus:outline-none',
          disabled ? fieldBox.disabled : error ? fieldBox.error : fieldBox.normal,
        )}
        {...f.inputProps}
        {...rest}
      />
      <FieldMessage hintId={f.hintId} hint={hint} errorId={f.errorId} error={error} />
    </div>
  );
});
