import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './app/store';
import './index.css';

async function start() {
  // Default to mock mode during local development so the app works even when no .env file exists.
  const useMocks =
    import.meta.env.VITE_USE_MOCKS === 'true' ||
    (import.meta.env.DEV && import.meta.env.VITE_USE_MOCKS === undefined);

  if (useMocks) {
    const { worker } = await import('./mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
  }
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>,
  );
}

void start();
