import { useDirection } from '@radix-ui/react-direction';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../../../styles/recipes';

export type TooltipPlacement = 'top' | 'bottom' | 'start' | 'end';

export type TooltipProps = Omit<
  ComponentPropsWithoutRef<typeof RadixTooltip.Content>,
  'children' | 'content' | 'side'
> & {
  /** The help text. It also describes the trigger for screen readers. */
  content: string;
  /** Figma `Placement`. start is on the right in RTL. */
  placement?: TooltipPlacement;
  /** The element it explains: one element that forwards its ref (an IconButton). */
  children: ReactElement;
  /** Figma `State: visible`: open from the start (stories, onboarding). */
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

/**
 * Shares the open delay between all tooltips: once one is open, moving to the next opens it at
 * once. Mounted once at the root (App.tsx, the Storybook preview and the test helpers); a Tooltip
 * needs it above.
 */
export function TooltipProvider({ children }: { children: ReactNode }) {
  return <RadixTooltip.Provider delayDuration={300}>{children}</RadixTooltip.Provider>;
}

/**
 * A short help text for an icon (Radix). It opens on hover and on keyboard focus and closes with
 * Escape. It explains; it never holds the only name of a button (IconButton has `label`).
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(
  {
    content,
    placement = 'top',
    children,
    defaultOpen,
    open,
    onOpenChange,
    sideOffset = 6,
    className,
    ...rest
  },
  ref,
) {
  const dir = useDirection();
  // Radix sides are physical: map start/end by the direction
  const side =
    placement === 'start'
      ? dir === 'rtl'
        ? 'right'
        : 'left'
      : placement === 'end'
        ? dir === 'rtl'
          ? 'left'
          : 'right'
        : placement;
  return (
    <RadixTooltip.Root defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            ref={ref}
            side={side}
            sideOffset={sideOffset}
            className={cx(
              'z-50 rounded-sm bg-ink-900 px-2 py-1 text-caption text-white shadow-sm',
              className,
            )}
            {...rest}
          >
            {content}
            <RadixTooltip.Arrow className="fill-ink-900" width={10} height={6} />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
});
