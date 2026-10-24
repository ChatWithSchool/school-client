import { useContext } from 'react';
import { ToastContext } from '../internal/toastContext';

export type { ToastOptions, ToastTone } from '../internal/toastContext';

/**
 * Shows a toast after a save: `const toast = useToast(); toast({ tone: 'success', message })`.
 * Needs the ToastProvider (mounted once in App.tsx).
 */
export function useToast() {
  const show = useContext(ToastContext);
  if (!show) throw new Error('useToast must be used inside <ToastProvider>');
  return show;
}
