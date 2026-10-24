import { forwardRef, type InputHTMLAttributes } from 'react';
import { cx } from '../../../styles/recipes';
import { Icon, type IconName } from '../../Icon';
import { FieldLabel, FieldMessage } from '../internal/FieldParts';
import { fieldBox, fieldInput } from '../internal/styles';
import { useField } from '../internal/useField';

/** Figma `Prefix/Suffix`: an icon or a short text inside the field (none = leave it out). */
export type FieldAdornment = { icon: IconName } | { text: string };

export type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> & {
  /** Figma `Label: on`: every field has a visible label. */
  label: string;
  /** Only M (40) exists. */
  size?: 'M';
  /** At the start of the field (the right side in RTL). */
  prefix?: FieldAdornment;
  /** At the end of the field (the left side in RTL). */
  suffix?: FieldAdornment;
  hint?: string;
  /** The error message. It also sets `aria-invalid`. */
  error?: string;
};

function Adornment({ value }: { value: FieldAdornment }) {
  return 'icon' in value ? (
    <Icon name={value.icon} size={16} className="text-fg-muted" />
  ) : (
    <span className="shrink-0 text-body text-fg-secondary">{value.text}</span>
  );
}

/**
 * A text input with its label, hint and error, linked with ids. States: hover, focus, filled,
 * error, disabled and read-only (`readOnly`).
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
    label,
    size: _size = 'M',
    prefix,
    suffix,
    hint,
    error,
    id,
    className,
    disabled,
    readOnly,
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
      <div
        className={cx(
          fieldBox.base,
          'h-10',
          disabled
            ? fieldBox.disabled
            : readOnly
              ? fieldBox.readOnly
              : error
                ? fieldBox.error
                : fieldBox.normal,
        )}
      >
        {prefix && <Adornment value={prefix} />}
        <input
          ref={ref}
          className={cx(fieldInput, 'h-full')}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          {...f.inputProps}
          {...rest}
        />
        {suffix && <Adornment value={suffix} />}
      </div>
      <FieldMessage hintId={f.hintId} hint={hint} errorId={f.errorId} error={error} />
    </div>
  );
});
