import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../../styles/recipes';
import { Icon } from '../../Icon';
import { focusRing } from '../internal/styles';

export type TagProps = HTMLAttributes<HTMLSpanElement> & {
  /** The text of the tag (a filter, a chosen value). */
  label: string;
  /** Figma `Removable: on`: an x button at the end. On by default when `onRemove` is given. */
  removable?: boolean;
  onRemove?: () => void;
};

/** A tag for an active filter or a chosen value. The x button is named "הסרת <label>". */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { label, removable, onRemove, className, ...rest },
  ref,
) {
  const canRemove = removable ?? Boolean(onRemove);
  return (
    <span
      ref={ref}
      className={cx(
        'inline-flex h-6 items-center gap-1 whitespace-nowrap rounded-full bg-subtle text-label text-fg hover:bg-ink-200',
        canRemove ? 'pe-1 ps-2' : 'px-2',
        className,
      )}
      {...rest}
    >
      {label}
      {canRemove && (
        <button
          type="button"
          aria-label={`הסרת ${label}`}
          onClick={onRemove}
          className={cx(
            'flex h-4 w-4 items-center justify-center rounded-full text-fg-secondary hover:bg-ink-300 hover:text-fg',
            focusRing,
          )}
        >
          <Icon name="x" size={14} />
        </button>
      )}
    </span>
  );
});
