import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { setupStore } from '../app/store';

/** Renders a component with the store and a router. Pass a token to render as a signed-in user. */
export function renderWithProviders(
  ui: ReactElement,
  opts: { route?: string; token?: string } = {},
) {
  const store = setupStore({ auth: { token: opts.token ?? null } });
  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[opts.route ?? '/']}>{ui}</MemoryRouter>
      </Provider>,
    ),
  };
}
