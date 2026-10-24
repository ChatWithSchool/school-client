import { createContext } from 'react';

export type ToastTone = 'success' | 'danger' | 'info';

export type ToastOptions = {
  message: string;
  tone?: ToastTone;
  /** Figma `Action: undo`: a "ביטול" button that calls this and closes the toast. */
  onUndo?: () => void;
};

/** Shows a toast. Set by ToastProvider; read with useToast. */
export const ToastContext = createContext<((options: ToastOptions) => void) | null>(null);
