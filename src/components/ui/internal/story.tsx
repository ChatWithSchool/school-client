import type { ReactNode } from 'react';

/**
 * Layout helpers for the stories, so each story reads like the Figma component set: one row per
 * variant, one labeled cell per state. Not exported from components/ui.
 */
export function Stack({ children }: { children: ReactNode }) {
  return <div className="space-y-8">{children}</div>;
}

export function Row({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="num text-start text-label text-fg-secondary">{title}</h3>
      <div className="flex flex-wrap items-start gap-6">{children}</div>
    </section>
  );
}

/** The states the addon can force: they match the States column of figma-components.csv. */
export type DemoState = 'hover' | 'pressed' | 'focus';

/**
 * One labeled cell. `state` forces a pseudo state (hover, :active, focus) on the cell's content
 * with storybook-addon-pseudo-states; the story sets `parameters: pseudoStates`.
 */
export function Demo({
  label,
  state,
  children,
}: {
  label: string;
  state?: DemoState;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-2">
      <span className="num text-caption text-fg-muted">{label}</span>
      <div data-demo-state={state}>{children}</div>
    </div>
  );
}
