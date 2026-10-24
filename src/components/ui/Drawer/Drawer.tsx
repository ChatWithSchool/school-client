import * as Dialog from '@radix-ui/react-dialog';
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../../styles/recipes';
import { IconButton } from '../IconButton/IconButton';

export type DrawerProps = Omit<ComponentPropsWithoutRef<typeof Dialog.Content>, 'title'> & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** The element that opens the drawer. Optional when `open` is controlled. */
  trigger?: ReactNode;
  title: string;
  description?: string;
  /** The buttons at the bottom. Put the primary one first: in RTL it is the rightmost. */
  footer?: ReactNode;
  /** Figma `Side`: only end (the left side in RTL). */
  side?: 'end';
  /** Figma `Width`: only 420. */
  width?: 420;
};

/**
 * A side panel (Radix Dialog) for feedback and notes: it opens from the end side, 420 wide, with
 * a fixed header and footer and a body that scrolls. Focus is trapped, Escape closes it.
 */
export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(function Drawer(
  {
    open,
    onOpenChange,
    trigger,
    title,
    description,
    footer,
    side: _side = 'end',
    width: _width = 420,
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink-900/40" />
        <Dialog.Content
          ref={ref}
          {...(!description && { 'aria-describedby': undefined })}
          className={cx(
            'fixed inset-y-0 end-0 z-50 flex w-drawer max-w-full flex-col bg-surface shadow-lg focus:outline-none',
            className,
          )}
          {...rest}
        >
          <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4">
            <Dialog.Title className="text-h2 text-fg">{title}</Dialog.Title>
            <Dialog.Close asChild>
              <IconButton icon="x" label="סגירה" size="S" className="-me-2" />
            </Dialog.Close>
          </div>
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-4">
            {description && (
              <Dialog.Description className="text-body text-fg-secondary">
                {description}
              </Dialog.Description>
            )}
            {children}
          </div>
          {footer && (
            <div className="flex items-center justify-end gap-2 border-t border-line px-6 py-4">
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
});

/** Closes the drawer or the modal it is in: wrap a cancel Button with it. */
export const DialogClose = Dialog.Close;
