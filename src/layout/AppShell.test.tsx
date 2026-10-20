import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { setupStore } from '../app/store';
import { createTestRouter } from '../routes';

function renderApp(route: string, token: string | null) {
  const store = setupStore({ auth: { token } });
  render(
    <Provider store={store}>
      <RouterProvider router={createTestRouter([route])} />
    </Provider>,
  );
}

describe('app shell', () => {
  it('sends a signed-out visitor to the login screen', async () => {
    renderApp('/students/s01', null);
    expect(await screen.findByRole('heading', { name: 'כניסה למערכת' })).toBeInTheDocument();
  });

  it('shows users and permissions inside the settings sub navigation', async () => {
    renderApp('/settings/i03', 'mock.yuval.mizrahi@school.example');
    const sub = await screen.findByRole('navigation', { name: 'תפריט משני' });
    expect(await screen.findByRole('link', { name: 'משתמשים' })).toBeInTheDocument();
    expect(sub).toHaveTextContent('תפקידים ופרטיות');
    expect(screen.getByRole('link', { name: 'הגדרות' })).toBeInTheDocument();
  });

  it('shows a teacher only the modules she may open', async () => {
    renderApp('/schedule/t06', 'mock.mor.dahan@school.example');
    await screen.findByRole('navigation', { name: 'תפריט משני' });
    expect(screen.queryByRole('link', { name: 'הגדרות' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'נוכחות' })).toBeInTheDocument();
  });

  it('shows a not-found page for an unknown address', async () => {
    renderApp('/nothing-here', 'mock.yuval.mizrahi@school.example');
    expect(await screen.findByText('העמוד לא נמצא')).toBeInTheDocument();
  });
});
