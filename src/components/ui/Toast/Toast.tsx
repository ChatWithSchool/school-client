import * as RadixToast from '@radix-ui/react-toast';
import {
  forwardRef,
  useCallback,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import { cx } from '../../../styles/recipes';
import { Icon, type IconName } from '../../Icon';
import { ToastContext, type ToastOptions, type ToastTone } from '../internal/toastContext';
import { focusRing } from '../internal/styles';

export type ToastProps = Omit<ComponentPropsWithoutRef<typeof RadixToast.Root>, 'type'> & {
  tone?: ToastTone;
  message: string;
  /** Figma `Action`: none, or undo (a "ביטול" button). */
  action?: 'none' | 'undo';
  onUndo?: () => void;
};

/** The sign and the word of each tone (the word is the icon's name, so color is not alone). */
const TONE: Record<ToastTone, { icon: IconName; color: string; word: string }> = {
  success: { icon: 'circle-check', color: 'text-success-500', word: 'הצלחה' },
  danger: { icon: 'circle-alert', color: 'text-danger-500', word: 'שגיאה' },
  info: { icon: 'info', color: 'text-info-500', word: 'מידע' },
};

/**
 * One toast (Radix). A danger toast is announced at once (foreground); the others wait for the
 * screen reader to finish (background). It enters and leaves with a short animation.
 */
export const Toast = forwardRef<HTMLLIElement, ToastProps>(function Toast(
  { tone = 'success', message, action = 'none', onUndo, className, ...rest },
  ref,
) {
  const t = TONE[tone];
  return (
    <RadixToast.Root
      ref={ref}
      type={tone === 'danger' ? 'foreground' : 'background'}
      className={cx(
        'flex w-toast max-w-full items-center gap-3 rounded-lg bg-ink-800 px-4 py-3 shadow-md',
        'data-[state=closed]:animate-toast-out data-[state=open]:animate-toast-in',
        className,
      )}
      {...rest}
    >
      <Icon name={t.icon} label={t.word} className={t.color} />
      <RadixToast.Description className="min-w-0 flex-1 text-body text-white">
        {message}
      </RadixToast.Description>
      {action === 'undo' && (
        <RadixToast.Action
          altText="ביטול הפעולה"
          onClick={onUndo}
          className={cx('rounded-sm text-body-strong text-primary-300 hover:underline', focusRing)}
        >
          ביטול
        </RadixToast.Action>
      )}
    </RadixToast.Root>
  );
});

type Shown = ToastOptions & { id: number; open: boolean };

/** A little longer than the toast-out animation. */
const EXIT_MS = 300;

/**
 * Mounts the toast area (bottom, at the end side) and gives useToast to the app. Toasts close by
 * themselves after 5 seconds, or with a swipe or Escape (F8 moves focus to them).
 */
export function ToastProvider({
  children,
  duration = 5000,
}: {
  children: ReactNode;
  duration?: number;
}) {
  const [toasts, setToasts] = useState<Shown[]>([]);
  const nextId = useRef(0);

  const show = useCallback((options: ToastOptions) => {
    const id = ++nextId.current;
    setToasts((list) => [...list, { ...options, id, open: true }]);
  }, []);

  const close = (id: number) => {
    setToasts((list) => list.map((t) => (t.id === id ? { ...t, open: false } : t)));
    // Radix plays the exit animation of a closed toast; drop it from the list after that
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), EXIT_MS);
  };

  return (
    <ToastContext.Provider value={show}>
      <RadixToast.Provider duration={duration} label="הודעות" swipeDirection="down">
        {children}
        {toasts.map((t) => (
          <Toast
            key={t.id}
            tone={t.tone}
            message={t.message}
            action={t.onUndo ? 'undo' : 'none'}
            onUndo={t.onUndo}
            open={t.open}
            onOpenChange={(open) => !open && close(t.id)}
          />
        ))}
        <RadixToast.Viewport className="fixed bottom-0 end-0 z-50 flex max-w-full flex-col gap-2 p-6 outline-none" />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
}
