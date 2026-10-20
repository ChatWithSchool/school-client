/**
 * Class recipes: the project does not use a component library, so every screen builds its UI from
 * these Tailwind strings. They come from the design guide. Add a new recipe here (in a PR) instead of
 * inventing a style in a screen.
 */
export const cx = (...parts: (string | false | null | undefined)[]): string =>
  parts.filter(Boolean).join(' ');

const btnBase =
  'inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-body-strong ' +
  'focus-visible:ring-4 focus-visible:ring-primary-500/35 disabled:cursor-not-allowed disabled:bg-ink-200 disabled:text-ink-500';

export const btn = {
  primary: cx(btnBase, 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800'),
  secondary: cx(
    btnBase,
    'border border-line bg-surface text-fg hover:border-line-strong hover:bg-subtle disabled:border-0',
  ),
  ghost: cx(btnBase, 'bg-transparent text-primary-700 hover:bg-primary-50'),
  danger: cx(btnBase, 'bg-danger-600 text-white hover:bg-danger-700'),
};

export const field = {
  label: 'mb-1 block text-label text-fg-secondary',
  input:
    'h-10 w-full rounded-md border border-line bg-surface px-3 text-body text-fg placeholder:text-fg-muted ' +
    'hover:border-line-strong focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/20 ' +
    'aria-[invalid=true]:border-danger-600',
  textarea:
    'min-h-24 w-full rounded-md border border-line bg-surface p-3 text-body text-fg placeholder:text-fg-muted ' +
    'hover:border-line-strong focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/20',
  error: 'mt-1 text-caption text-danger-700',
  help: 'mt-1 text-caption text-fg-secondary',
};

export const card = 'rounded-lg border border-line bg-surface p-6 shadow-xs';

export const table = {
  wrap: 'overflow-x-auto rounded-lg border border-line bg-surface',
  table: 'w-full border-collapse text-body',
  th: 'bg-subtle px-3 py-2 text-start text-label text-fg-secondary',
  td: 'border-b border-line px-3 py-3 text-body text-fg',
  rowHover: 'hover:bg-primary-50',
};

export const badge = {
  neutral:
    'inline-flex items-center rounded-full bg-subtle px-2.5 py-0.5 text-label text-fg-secondary',
  primary:
    'inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-label text-primary-700',
  success:
    'inline-flex items-center rounded-full bg-success-50 px-2.5 py-0.5 text-label text-success-700',
  warning:
    'inline-flex items-center rounded-full bg-warning-50 px-2.5 py-0.5 text-label text-warning-700',
  danger:
    'inline-flex items-center rounded-full bg-danger-50 px-2.5 py-0.5 text-label text-danger-700',
  info: 'inline-flex items-center rounded-full bg-info-50 px-2.5 py-0.5 text-label text-info-700',
};

export const alert = {
  info: 'rounded-lg border border-info-100 bg-info-50 px-4 py-3 text-body text-info-700',
  success:
    'rounded-lg border border-success-100 bg-success-50 px-4 py-3 text-body text-success-700',
  warning:
    'rounded-lg border border-warning-100 bg-warning-50 px-4 py-3 text-body text-warning-700',
  danger: 'rounded-lg border border-danger-100 bg-danger-50 px-4 py-3 text-body text-danger-700',
};

export const text = {
  h1: 'text-h1 text-fg',
  h2: 'text-h2 text-fg',
  h3: 'text-h3 text-fg',
  muted: 'text-body text-fg-secondary',
};
