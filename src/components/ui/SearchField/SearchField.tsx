import {
  forwardRef,
  useId,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
} from 'react';
import { cx } from '../../../styles/recipes';
import { Icon } from '../../Icon';
import { fieldInput } from '../internal/styles';

export type SearchScope = 'local' | 'global';

export type SearchResult = { id: string; label: string };

export type SearchFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'role' | 'aria-label' | 'results'
> & {
  /** Names the field for screen readers (the field has no visible label). */
  label: string;
  /** local: inside a screen (a white box); global: in the top bar (a page-colored box). */
  scope?: SearchScope;
  /** Only M (40) exists. */
  size?: 'M';
  /**
   * The suggestions for the typed text. Undefined: no list (a plain filter field). An empty array:
   * the list says "לא נמצאו תוצאות".
   */
  results?: SearchResult[];
  /** Called with the picked result. Uncontrolled, the field then shows the result's label. */
  onResultSelect?: (result: SearchResult) => void;
};

const SCOPE: Record<SearchScope, string> = {
  local: 'border-line bg-surface hover:border-line-strong',
  global: 'border-transparent bg-page hover:border-line',
};

/**
 * A search field. With `results` it is a combobox: the arrow keys move in the list, Enter picks,
 * Escape closes. Without them it is a plain search input for filtering a list.
 */
export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
  {
    label,
    scope = 'local',
    size: _size = 'M',
    results,
    onResultSelect,
    value,
    defaultValue,
    onChange,
    onKeyDown,
    onBlur,
    onFocus,
    placeholder = 'חיפוש',
    className,
    disabled,
    ...rest
  },
  ref,
) {
  const listId = useId();
  const [ownText, setOwnText] = useState(String(defaultValue ?? ''));
  const text = value !== undefined ? String(value) : ownText;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const hasList = results !== undefined;
  const showList = hasList && open && text.trim() !== '';
  const items = results ?? [];

  const pick = (r: SearchResult) => {
    // controlled, the screen sets the text in onResultSelect
    if (value === undefined) setOwnText(r.label);
    onResultSelect?.(r);
    setOpen(false);
    setActive(-1);
  };

  const keys = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (!hasList || e.defaultPrevented) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
      if (!items.length) return;
      const step = e.key === 'ArrowDown' ? 1 : -1;
      setActive((i) => (i + step + items.length) % items.length);
    } else if (e.key === 'Enter' && showList && active >= 0 && items[active]) {
      e.preventDefault();
      pick(items[active]);
    } else if (e.key === 'Escape' && showList) {
      e.preventDefault();
      setOpen(false);
      setActive(-1);
    }
  };

  return (
    <div className={cx('relative', className)}>
      <div
        className={cx(
          'flex h-10 w-full items-center gap-2 rounded-md border px-3',
          'focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-500/20',
          disabled ? 'cursor-not-allowed border-line bg-subtle text-fg-muted' : SCOPE[scope],
        )}
      >
        <Icon name="search" size={16} className="text-fg-muted" />
        <input
          ref={ref}
          type="search"
          aria-label={label}
          placeholder={placeholder}
          disabled={disabled}
          // always controlled here: uncontrolled mode keeps the text in its own state
          value={text}
          className={cx(fieldInput, 'h-full')}
          {...(hasList && {
            role: 'combobox',
            'aria-autocomplete': 'list' as const,
            'aria-expanded': showList,
            // only while the list exists: aria-controls must point at a rendered element
            'aria-controls': showList && items.length ? listId : undefined,
            'aria-activedescendant': showList && active >= 0 ? `${listId}-${active}` : undefined,
          })}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setOwnText(e.target.value);
            setOpen(true);
            setActive(-1);
            onChange?.(e);
          }}
          onFocus={(e) => {
            setOpen(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setOpen(false);
            onBlur?.(e);
          }}
          onKeyDown={keys}
          {...rest}
        />
      </div>
      {showList && (
        <div className="absolute inset-x-0 top-full z-20 mt-1 rounded-md border border-line bg-surface py-1 shadow-md">
          {items.length ? (
            <ul id={listId} role="listbox" aria-label={label}>
              {items.map((r, i) => (
                <li
                  key={r.id}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === active}
                  // mousedown, so the input does not lose focus (and close the list) first
                  onMouseDown={(e) => {
                    e.preventDefault();
                    pick(r);
                  }}
                  onMouseEnter={() => setActive(i)}
                  className={cx(
                    'flex h-9 cursor-pointer items-center px-3 text-body text-fg',
                    i === active && 'bg-primary-50',
                  )}
                >
                  {r.label}
                </li>
              ))}
            </ul>
          ) : (
            // the live region below announces it
            <p aria-hidden="true" className="p-3 text-body text-fg-muted">
              לא נמצאו תוצאות
            </p>
          )}
        </div>
      )}
      {hasList && (
        // always mounted, so a screen reader hears the text when it changes
        <p role="status" className="sr-only">
          {showList && !items.length ? 'לא נמצאו תוצאות' : ''}
        </p>
      )}
    </div>
  );
});
