import * as RadixTabs from '@radix-ui/react-tabs';
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { useInRouterContext, useSearchParams } from 'react-router-dom';
import { cx } from '../../../styles/recipes';
import { focusRing } from '../internal/styles';

export type TabItem = {
  value: string;
  label: string;
  disabled?: boolean;
  /**
   * The panel of the tab. Rendered only while the tab is active. Without it the screen renders the
   * content itself, and the tab has no `aria-controls` (there is no panel to point at).
   */
  content?: ReactNode;
};

export type TabsProps = Omit<
  ComponentPropsWithoutRef<typeof RadixTabs.Root>,
  'children' | 'dir' | 'orientation'
> & {
  /** Figma `Count: 2-6`. The first tab is at the start (on the right in RTL). */
  items: TabItem[];
  /** Names the tab list for screen readers. */
  label: string;
  /**
   * Inside a route the active tab is kept in `?tab=` (so a reload or a shared link opens the same
   * tab). Pass false to keep it in memory only.
   */
  syncUrl?: boolean;
  /**
   * The query parameter that holds the active tab. Defaults to `tab`; give each tab set on the
   * same screen its own name.
   */
  param?: string;
  /** Figma `Style`: only underline exists. */
  variant?: 'underline';
};

/** The default query parameter that holds the active tab. */
export const TAB_PARAM = 'tab';

const firstEnabled = (items: TabItem[]) => items.find((t) => !t.disabled)?.value;

/** The Radix tabs with the underline look. The arrow keys move between tabs (mirrored in RTL). */
const TabsView = forwardRef<HTMLDivElement, Omit<TabsProps, 'syncUrl' | 'param'>>(function TabsView(
  { items, label, variant: _variant = 'underline', className, ...rest },
  ref,
) {
  return (
    <RadixTabs.Root ref={ref} className={className} {...rest}>
      <RadixTabs.List aria-label={label} className="flex border-b border-line">
        {items.map((t) => (
          <RadixTabs.Trigger
            key={t.value}
            value={t.value}
            disabled={t.disabled}
            // Radix points every tab at its panel; a tab without content has none
            {...(t.content === undefined && { 'aria-controls': undefined })}
            className={cx(
              '-mb-px flex h-10 items-center border-b-2 border-transparent px-4 text-body-strong',
              focusRing,
              'text-fg-secondary hover:bg-subtle hover:text-fg',
              'data-[state=active]:border-primary-600 data-[state=active]:text-primary-600 data-[state=active]:hover:bg-transparent',
              'disabled:cursor-not-allowed disabled:text-ink-400 disabled:hover:bg-transparent',
            )}
          >
            {t.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {items.map(
        (t) =>
          t.content !== undefined && (
            <RadixTabs.Content key={t.value} value={t.value} className={cx('pt-6', focusRing)}>
              {t.content}
            </RadixTabs.Content>
          ),
      )}
    </RadixTabs.Root>
  );
});

/**
 * The tabs with the active value in `?tab=` (or `param`). An unknown or disabled value falls back.
 * The URL is replaced, not pushed: switching tabs does not fill the browser history.
 */
const UrlTabs = forwardRef<HTMLDivElement, Omit<TabsProps, 'syncUrl'>>(function UrlTabs(
  { items, defaultValue, onValueChange, param = TAB_PARAM, ...rest },
  ref,
) {
  const [params, setParams] = useSearchParams();
  const fromUrl = params.get(param);
  const valid = items.some((t) => t.value === fromUrl && !t.disabled);
  const value = valid ? fromUrl! : (defaultValue ?? firstEnabled(items));
  return (
    <TabsView
      ref={ref}
      items={items}
      value={value}
      onValueChange={(v) => {
        setParams(
          (prev) => {
            const next = new URLSearchParams(prev);
            next.set(param, v);
            return next;
          },
          { replace: true },
        );
        onValueChange?.(v);
      }}
      {...rest}
    />
  );
});

/**
 * Underline tabs (Radix). In a route the active tab is in `?tab=`; a controlled `value` or
 * `syncUrl={false}` keeps it out of the URL.
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { syncUrl = true, param, ...props },
  ref,
) {
  const inRouter = useInRouterContext();
  if (syncUrl && inRouter && props.value === undefined)
    return <UrlTabs ref={ref} param={param} {...props} />;
  return (
    <TabsView
      ref={ref}
      {...props}
      defaultValue={
        props.value === undefined ? (props.defaultValue ?? firstEnabled(props.items)) : undefined
      }
    />
  );
});
