import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../../styles/recipes';
import { Icon } from '../../Icon';
import { Skeleton } from '../Skeleton/Skeleton';

export type MetricTrend = 'none' | 'up' | 'down';
export type MetricTone = 'neutral' | 'warning';
/** Whether the change is good news: the color of the trend. */
export type MetricTrendTone = 'positive' | 'negative' | 'neutral';

export type MetricCardProps = HTMLAttributes<HTMLDivElement> & {
  label: string;
  value: ReactNode;
  /** Figma `Trend`: up and down have an arrow and a word, not a color only. */
  trend?: MetricTrend;
  /** The words of the trend ("עלייה של 2% מאתמול"). Defaults to a plain word. */
  trendText?: string;
  /**
   * The color of the trend. Defaults from the trend: up is positive (green), down is negative
   * (red). Set it when a rise is bad news, for example `trend="up" trendTone="negative"` for a
   * rising absence count.
   */
  trendTone?: MetricTrendTone;
  /** warning: a metric that needs attention (a warm background). */
  tone?: MetricTone;
  /** Figma `State: loading`: skeletons instead of the value and the trend. */
  loading?: boolean;
};

const TREND: Record<MetricTrend, { text: string; tone: MetricTrendTone }> = {
  none: { text: 'ללא שינוי', tone: 'neutral' },
  up: { text: 'עלייה', tone: 'positive' },
  down: { text: 'ירידה', tone: 'negative' },
};

const TREND_COLOR: Record<MetricTrendTone, string> = {
  positive: 'text-success-700',
  negative: 'text-danger-700',
  neutral: 'text-fg-muted',
};

/** A number on a dashboard (screens X03, S08, N06): a label, the value and its trend. */
export const MetricCard = forwardRef<HTMLDivElement, MetricCardProps>(function MetricCard(
  {
    label,
    value,
    trend = 'none',
    trendText,
    trendTone,
    tone = 'neutral',
    loading = false,
    className,
    ...rest
  },
  ref,
) {
  const warning = tone === 'warning';
  const t = TREND[trend];
  return (
    <div
      ref={ref}
      aria-busy={loading || undefined}
      className={cx(
        'flex flex-col items-start gap-2 rounded-lg border p-4 shadow-xs',
        warning ? 'border-warning-100 bg-warning-50' : 'border-line bg-surface',
        className,
      )}
      {...rest}
    >
      <p className="text-label text-fg-secondary">{label}</p>
      {loading ? (
        <>
          <span className="sr-only">טוען</span>
          <Skeleton shape="block" className="h-7 w-24" />
          <Skeleton shape="line" className="w-36" />
        </>
      ) : (
        <>
          <p className={cx('num text-h1', warning ? 'text-warning-700' : 'text-fg')}>{value}</p>
          <p
            className={cx('flex items-center gap-1 text-caption', TREND_COLOR[trendTone ?? t.tone])}
          >
            {trend !== 'none' && (
              <Icon name={trend === 'up' ? 'arrow-up' : 'arrow-down'} size={14} />
            )}
            {trendText ?? t.text}
          </p>
        </>
      )}
    </div>
  );
});
