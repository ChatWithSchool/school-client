import { Suspense, lazy } from 'react';
import { createBrowserRouter, createMemoryRouter, type RouteObject } from 'react-router-dom';
import { ForbiddenState, LoadingSkeleton, NotFoundState } from '../components/StateViews';
import { RequireAuth } from '../features/auth/RequireAuth';
import { AppShell } from '../layout/AppShell';
import { SCREENS, type ScreenDef } from './screens';

const ReferenceAnnouncements = lazy(() => import('../screens/_reference-announcements'));

function element(Component: ScreenDef['Component']) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <Component />
    </Suspense>
  );
}

/**
 * Routes come from the generated screen registry (routes/screens.ts):
 * public screens (login, join, password reset) are outside the shell, everything else is inside
 * the shell and requires a signed-in user.
 */
export const routes: RouteObject[] = [
  ...SCREENS.filter((s) => s.public).map((s) => ({ path: s.path, element: element(s.Component) })),
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppShell />,
        children: [
          ...SCREENS.filter((s) => !s.public).map((s) => ({
            path: s.path,
            element: element(s.Component),
          })),
          {
            path: '/reference/announcements',
            element: (
              <Suspense fallback={<LoadingSkeleton />}>
                <ReferenceAnnouncements />
              </Suspense>
            ),
          },
          { path: '/forbidden', element: <ForbiddenState /> },
          { path: '*', element: <NotFoundState /> },
        ],
      },
    ],
  },
];

export const createAppRouter = () => createBrowserRouter(routes);
export const createTestRouter = (initialEntries: string[]) =>
  createMemoryRouter(routes, { initialEntries });
