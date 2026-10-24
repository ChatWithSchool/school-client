import { DirectionProvider } from '@radix-ui/react-direction';
import { useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ToastProvider } from './components/ui';
import { createAppRouter } from './routes';

export default function App() {
  const router = useMemo(() => createAppRouter(), []);
  // the Radix primitives in components/ui read the direction from here (arrow keys, sides);
  // ToastProvider gives useToast to every screen
  return (
    <DirectionProvider dir="rtl">
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </DirectionProvider>
  );
}
