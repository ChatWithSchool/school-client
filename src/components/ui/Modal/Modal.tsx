import * as Dialog from '@radix-ui/react-dialog';
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../../styles/recipes';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';

export type ModalSize = 'S' | 'M';
export type ModalFooter = 'single' | 'double';

export type ModalProps = Omit<ComponentPropsWithoutRef<typeof Dialog.Content>, 'title'> & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** The element that opens the dialog (a Button). Optional when `open` is controlled. */
  trigger?: ReactNode;
  title: string;
  /** A short sentence under the title. It describes the dialog for screen readers. */
  description?: string;
  /** Figma `Size`: S = 480, M = 640. */
  size?: ModalSize;
  /** Figma `Footer`: single = the confirm button only; double = confirm and cancel. */
  footer?: ModalFooter;
  confirmLabel?: string;
  cancelLabel?: string;
  /** danger for a delete confirmation. */
  confirmVariant?: 'primary' | 'danger';
  onConfirm?: () => void;
  /** While the action runs: the confirm button shows a spinner and blocks clicks. */
  confirmLoading?: boolean;
};

const SIZE: Record<ModalSize, string> = { S: 'max-w-modal-s', M: 'max-w-modal-m' };

/**
 * A dialog (Radix): confirmations and short forms. Focus is trapped inside, Escape and the close
 * button close it, and focus returns to the trigger.
 */
export const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal(
  {
    open,
    onOpenChange,
    trigger,
    title,
    description,
    size = 'S',
    footer = 'double',
    confirmLabel = 'אישור',
    cancelLabel = 'ביטול',
    confirmVariant = 'primary',
    onConfirm,
    confirmLoading,
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
        {/* the overlay centers the dialog and scrolls when it is taller than the screen */}
        <Dialog.Overlay className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink-900/40 p-4">
          <Dialog.Content
            ref={ref}
            // without a description Radix would warn; the body is read in order anyway
            {...(!description && { 'aria-describedby': undefined })}
            className={cx(
              'flex w-full flex-col gap-4 rounded-xl bg-surface p-6 shadow-lg focus:outline-none',
              SIZE[size],
              className,
            )}
            {...rest}
          >
            <div className="flex items-start justify-between gap-4">
              <Dialog.Title className="text-h2 text-fg">{title}</Dialog.Title>
              <Dialog.Close asChild>
                <IconButton icon="x" label="סגירה" size="S" className="-me-2" />
              </Dialog.Close>
            </div>
            {description && (
              <Dialog.Description className="text-body text-fg-secondary">
                {description}
              </Dialog.Description>
            )}
            {children}
            {/* the confirm button comes first: in RTL it is the rightmost of the group */}
            <div className="flex items-center justify-end gap-2">
              <Button variant={confirmVariant} loading={confirmLoading} onClick={onConfirm}>
                {confirmLabel}
              </Button>
              {footer === 'double' && (
                <Dialog.Close asChild>
                  <Button variant="secondary">{cancelLabel}</Button>
                </Dialog.Close>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
});
