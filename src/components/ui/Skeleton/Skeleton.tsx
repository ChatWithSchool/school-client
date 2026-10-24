import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../../styles/recipes';

export type SkeletonShape = 'line' | 'block' | 'table-row' | 'card';

export type SkeletonProps = HTMLAttributes<HTMLDivElement> & { shape?: SkeletonShape };

const pulse = 'animate-pulse bg-subtle';

/**
 * A gray placeholder while content loads (state: animated; it stops under reduced motion). It is
 * hidden from screen readers: the loading area around it says "טוען" once (see LoadingSkeleton).
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { shape = 'line', className, ...rest },
  ref,
) {
  if (shape === 'table-row') {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cx(
          'flex h-12 items-center gap-6 border-b border-line bg-surface px-3',
          className,
        )}
        {...rest}
      >
        <div className={cx(pulse, 'h-3 w-32 rounded-full')} />
        <div className={cx(pulse, 'h-3 w-20 rounded-full')} />
        <div className={cx(pulse, 'h-3 w-40 rounded-full')} />
        <div className={cx(pulse, 'h-3 w-16 rounded-full')} />
      </div>
    );
  }
  if (shape === 'card') {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cx('space-y-3 rounded-lg border border-line bg-surface p-4', className)}
        {...rest}
      >
        <div className={cx(pulse, 'h-28 rounded-md')} />
        <div className={cx(pulse, 'h-3 w-2/3 rounded-full')} />
        <div className={cx(pulse, 'h-3 w-1/2 rounded-full')} />
      </div>
    );
  }
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cx(pulse, shape === 'block' ? 'h-24 rounded-md' : 'h-3 rounded-full', className)}
      {...rest}
    />
  );
});
