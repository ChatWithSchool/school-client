import * as Popover from '@radix-ui/react-popover';
import * as RadixSelect from '@radix-ui/react-select';
import { forwardRef, useId, useState } from 'react';
import { cx } from '../../../styles/recipes';
import { Icon } from '../../Icon';
import { Checkbox } from '../Checkbox/Checkbox';
import { FieldLabel, FieldMessage } from '../internal/FieldParts';
import { fieldBox, focusRing } from '../internal/styles';
import { useField } from '../internal/useField';
import { Tag } from '../Tag/Tag';

export type SelectOption = { value: string; label: string; disabled?: boolean };

type CommonProps = {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  hint?: string;
  /** The error message. It also sets `aria-invalid`. */
  error?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
  /** Only M (40) exists. */
  size?: 'M';
  /** Figma `State: open`: open from the start (stories). */
  defaultOpen?: boolean;
};

/** Figma `Multi: off`: one value (Radix Select). */
export type SingleSelectProps = CommonProps & {
  multi?: false;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

/**
 * Figma `Multi: on`: several values, chosen with check boxes; the trigger shows them as tags.
 * `required` is announced (`aria-required`) but not checked by the browser: the values travel in
 * hidden inputs, so the screen validates that at least one is chosen.
 */
export type MultiSelectProps = CommonProps & {
  multi: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

export type SelectProps = SingleSelectProps | MultiSelectProps;

/** The trigger box: the field look, with the open state as the focus look. */
const trigger = (error?: string, disabled?: boolean) =>
  cx(
    fieldBox.base,
    'h-10 text-start',
    focusRing,
    disabled
      ? fieldBox.disabled
      : error
        ? cx(fieldBox.error, 'data-[state=open]:ring-4 data-[state=open]:ring-danger-500/20')
        : cx(
            fieldBox.normal,
            'data-[state=open]:border-primary-500 data-[state=open]:ring-4 data-[state=open]:ring-primary-500/20',
          ),
  );

const panel = 'z-50 rounded-md border border-line bg-surface py-1 shadow-md';

/**
 * A choice from a list, with its label, hint and error. One value: the Radix Select (arrow keys,
 * typing a letter, Enter). Several values (`multi`): a popover with a check box per option.
 */
export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(props, ref) {
  const { label, hint, error, required, id, className } = props;
  const f = useField({ id, hint, error });
  const labelId = useId();
  return (
    <div className={className}>
      <FieldLabel id={labelId} htmlFor={f.fieldId} required={required}>
        {label}
      </FieldLabel>
      {props.multi ? (
        <MultiSelect ref={ref} {...props} fieldProps={f.inputProps} labelId={labelId} />
      ) : (
        <SingleSelect ref={ref} {...props} fieldProps={f.inputProps} />
      )}
      <FieldMessage hintId={f.hintId} hint={hint} errorId={f.errorId} error={error} />
    </div>
  );
});

type FieldProps = ReturnType<typeof useField>['inputProps'];

const SingleSelect = forwardRef<HTMLButtonElement, SingleSelectProps & { fieldProps: FieldProps }>(
  function SingleSelect(
    {
      options,
      placeholder = 'בחרו אפשרות',
      error,
      disabled,
      required,
      name,
      value,
      defaultValue,
      onValueChange,
      defaultOpen,
      fieldProps,
    },
    ref,
  ) {
    return (
      <RadixSelect.Root
        defaultOpen={defaultOpen}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
        required={required}
        name={name}
      >
        <RadixSelect.Trigger
          ref={ref}
          {...fieldProps}
          className={cx(trigger(error, disabled), 'data-[placeholder]:text-fg-muted')}
        >
          <span className="min-w-0 flex-1 truncate">
            <RadixSelect.Value placeholder={placeholder} />
          </span>
          <RadixSelect.Icon className="text-fg-secondary">
            <Icon name="chevron-down" size={16} />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            sideOffset={4}
            className={panel}
            // the list is as wide as the field (a size measured at run time, not a token)
            style={{ width: 'var(--radix-select-trigger-width)' }}
          >
            <RadixSelect.Viewport>
              {options.map((o) => (
                <RadixSelect.Item
                  key={o.value}
                  value={o.value}
                  disabled={o.disabled}
                  // the highlight is the focus sign; no focus ring on top of it
                  className={cx(
                    'flex h-9 cursor-pointer select-none items-center gap-2 px-3 text-body text-fg outline-none focus-visible:ring-0',
                    'data-[highlighted]:bg-subtle data-[disabled]:cursor-not-allowed data-[disabled]:text-ink-400',
                  )}
                >
                  <span className="flex w-4 shrink-0 justify-center">
                    <RadixSelect.ItemIndicator>
                      <Icon name="check" size={16} className="text-primary-600" />
                    </RadixSelect.ItemIndicator>
                  </span>
                  <RadixSelect.ItemText>{o.label}</RadixSelect.ItemText>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    );
  },
);

const MultiSelect = forwardRef<
  HTMLButtonElement,
  MultiSelectProps & { fieldProps: FieldProps; labelId: string }
>(function MultiSelect(
  {
    label,
    options,
    placeholder = 'בחרו אפשרויות',
    error,
    disabled,
    required,
    name,
    value,
    defaultValue,
    onValueChange,
    defaultOpen,
    fieldProps,
    labelId,
  },
  ref,
) {
  const [own, setOwn] = useState<string[]>(defaultValue ?? []);
  const selected = value ?? own;
  const set = (next: string[]) => {
    setOwn(next);
    onValueChange?.(next);
  };
  const chosen = options.filter((o) => selected.includes(o.value));
  return (
    <Popover.Root defaultOpen={defaultOpen}>
      {/* a combobox with a dialog popup (Radix sets aria-haspopup, aria-expanded, aria-controls) */}
      <Popover.Trigger
        ref={ref}
        role="combobox"
        disabled={disabled}
        {...fieldProps}
        aria-required={required || undefined}
        aria-labelledby={`${labelId} ${fieldProps.id}`}
        className={trigger(error, disabled)}
      >
        <span className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
          {chosen.length ? (
            // tags without an x: a button inside the trigger button would not be reachable
            chosen.map((o) => <Tag key={o.value} label={o.label} />)
          ) : (
            <span className="truncate text-fg-muted">{placeholder}</span>
          )}
        </span>
        <Icon name="chevron-down" size={16} className="text-fg-secondary" />
      </Popover.Trigger>
      {/* a disabled field is not sent with the form, as with a native one */}
      {name &&
        !disabled &&
        selected.map((v) => <input key={v} type="hidden" name={name} value={v} />)}
      <Popover.Portal>
        <Popover.Content
          sideOffset={4}
          align="start"
          aria-labelledby={labelId}
          className={panel}
          style={{ width: 'var(--radix-popover-trigger-width)' }}
        >
          <div role="group" aria-label={label}>
            {options.map((o) => (
              <div key={o.value} className="flex h-9 items-center px-3 hover:bg-subtle">
                <Checkbox
                  label={o.label}
                  disabled={o.disabled}
                  checked={selected.includes(o.value)}
                  onCheckedChange={(on) =>
                    set(
                      on === true ? [...selected, o.value] : selected.filter((v) => v !== o.value),
                    )
                  }
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
});
