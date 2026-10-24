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
        // the target is 24×24 (WCAG 2.5.8); -mx-1 lays it over the gap and the padding, so the
        // tag keeps its size and the visible circle stays 16
        <button
          type="button"
          aria-label={`הסרת ${label}`}
          onClick={onRemove}
          className={cx(
            'group -mx-1 flex h-6 w-6 items-center justify-center rounded-full text-fg-secondary',
            focusRing,
          )}
        >
          <span className="flex h-4 w-4 items-center justify-center rounded-full group-hover:bg-ink-300 group-hover:text-fg">
            <Icon name="x" size={14} />
          </span>
        </button>
      )}
    </span>
  );
});
