/**
 * Class fragments shared by the components in components/ui. Internal: screens use the components,
 * not these strings.
 */

/** The one focus ring of the project (design guide: 4px, primary.500 with transparency). */
export const focusRing =
  'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/35';

/** The focus ring of a delete action (design guide: the danger button). */
export const focusRingDanger =
  'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-danger-500/35';

/** The focus ring of a field box: the box shows it while the input inside has focus. */
export const fieldBox = {
  base: 'flex w-full items-center gap-2 rounded-md border bg-surface px-3 text-body text-fg',
  normal:
    'border-line hover:border-line-strong focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-500/20',
  error:
    'border-danger-600 focus-within:border-danger-600 focus-within:ring-4 focus-within:ring-danger-500/20',
  disabled: 'cursor-not-allowed border-line bg-subtle text-fg-muted',
  readOnly: 'border-line bg-page',
};

/** The input inside a field box: no border and no ring of its own. */
export const fieldInput =
  'min-w-0 flex-1 bg-transparent text-body text-fg placeholder:text-fg-muted focus:outline-none focus-visible:ring-0 disabled:cursor-not-allowed';
