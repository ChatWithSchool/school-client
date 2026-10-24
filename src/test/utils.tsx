import { DirectionProvider } from '@radix-ui/react-direction';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { setupStore } from '../app/store';
import { ToastProvider, TooltipProvider } from '../components/ui';

/**
 * Renders a component with the providers of App.tsx (RTL direction, toasts, tooltips), the store
 * and a router. Pass a token to render as a signed-in user.
 */
export function renderWithProviders(
  ui: ReactElement,
  opts: { route?: string; token?: string } = {},
) {
  const store = setupStore({ auth: { token: opts.token ?? null } });
  return {
    store,
    ...render(
      <DirectionProvider dir="rtl">
        <ToastProvider>
          <TooltipProvider>
            <Provider store={store}>
              <MemoryRouter initialEntries={[opts.route ?? '/']}>{ui}</MemoryRouter>
            </Provider>
          </TooltipProvider>
        </ToastProvider>
      </DirectionProvider>,
    ),
  };
}
