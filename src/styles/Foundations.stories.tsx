import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '../components/Icon';
import { ICON_NAMES } from '../components/icons';

/**
 * The foundations, to compare with the Figma page 01 Foundations. The swatches read the CSS
 * variables in theme.css, so they always show the real token values.
 */
const meta: Meta = { title: 'Foundations/Tokens' };
export default meta;
type Story = StoryObj;

const SCALES: Record<string, (string | number)[]> = {
  ink: [0, 25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  primary: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  accent: [50, 100, 200, 300, 400, 500, 600, 700],
  success: [50, 100, 500, 600, 700],
  warning: [50, 100, 500, 600, 700],
  danger: [50, 100, 500, 600, 700],
  info: [50, 100, 500, 600, 700],
  chart: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'],
};

export const Colors: Story = {
  render: () => (
    <div className="space-y-6">
      {Object.entries(SCALES).map(([scale, steps]) => (
        <section key={scale}>
          <h2 className="mb-2 text-h3">{scale}</h2>
          <div className="flex flex-wrap gap-2">
            {steps.map((step) => (
              <div key={step} className="w-24 overflow-hidden rounded-md border border-line">
                <div
                  className="h-12"
                  // eslint-disable-next-line local/no-inline-style -- one swatch per token, built in a loop
                  style={{ background: `var(--${scale}-${step})` }}
                />
                <p className="num bg-surface px-2 py-1 text-caption">
                  {scale}.{step}
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
};

const TYPE = [
  ['text-display', 'display 36/44 · 700'],
  ['text-h1', 'h1 28/36 · 700'],
  ['text-h2', 'h2 22/30 · 600'],
  ['text-h3', 'h3 18/26 · 600'],
  ['text-body-lg', 'body-lg 16/24 · 400'],
  ['text-body', 'body 14/22 · 400'],
  ['text-body-strong', 'body-strong 14/22 · 600'],
  ['text-label', 'label 13/18 · 500'],
  ['text-caption', 'caption 12/18 · 400'],
  ['text-mono-num num', 'mono-num 14/22 · 500'],
] as const;

export const Typography: Story = {
  render: () => (
    <div className="space-y-3">
      {TYPE.map(([cls, name]) => (
        <div key={name} className="flex items-baseline gap-6">
          <span className="num w-48 shrink-0 text-caption text-fg-muted">{name}</span>
          <span className={cls}>Lorem ipsum dolor sit amet 1,234</span>
        </div>
      ))}
    </div>
  ),
};

const SPACE = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16];

export const SpacingRadiusShadow: Story = {
  name: 'Spacing, radius, shadow',
  render: () => (
    <div className="space-y-8">
      <section className="space-y-1">
        {SPACE.map((n) => (
          <div key={n} className="flex items-center gap-3 text-caption">
            <span className="num w-20">space-{n}</span>
            <span
              className="h-3 rounded-sm bg-primary-400"
              // eslint-disable-next-line local/no-inline-style -- one bar per spacing token, built in a loop
              style={{ width: `var(--space-${n})` }}
            />
          </div>
        ))}
      </section>
      <section className="flex flex-wrap gap-4">
        {['rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-full'].map((r) => (
          <div
            key={r}
            className={`flex h-16 w-16 items-center justify-center border border-line-strong bg-surface text-caption ${r}`}
          >
            {r.replace('rounded-', '')}
          </div>
        ))}
      </section>
      <section className="flex flex-wrap gap-6">
        {['shadow-xs', 'shadow-sm', 'shadow-md', 'shadow-lg'].map((s) => (
          <div
            key={s}
            className={`flex h-16 w-24 items-center justify-center rounded-lg bg-surface text-caption ${s}`}
          >
            {s.replace('shadow-', '')}
          </div>
        ))}
      </section>
    </div>
  ),
};

export const Icons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {ICON_NAMES.map((name) => (
        <div
          key={name}
          className="flex w-28 flex-col items-center gap-1 rounded-md border border-line bg-surface p-2 text-caption text-fg-secondary"
        >
          <Icon name={name} className="text-fg" />
          <span className="num">{name}</span>
        </div>
      ))}
    </div>
  ),
};
