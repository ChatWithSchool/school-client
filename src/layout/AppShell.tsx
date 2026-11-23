import { Link, Outlet, matchPath, useLocation } from 'react-router-dom';
import { useGetMeQuery } from '../api/authApi';
import { useAppDispatch } from '../app/hooks';
import { Icon } from '../components/Icon';
import { LoadingSkeleton } from '../components/StateViews';
import { SidebarItem, TopBar } from '../components/ui';
import { logout } from '../features/auth/authSlice';
import { SCREENS, pathFor } from '../routes/screens';
import { cx } from '../styles/recipes';
import { SUBACTIVE, familyOf, sidebarKeyOf, visibleSidebar, visibleSubnav } from './nav';

/**
 * The application frame (spec screen X01): sidebar on the right, top bar, sub navigation and the
 * content. Navigation items follow the user's permissions.
 */
export function AppShell() {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const { data: me, isLoading } = useGetMeQuery();
  const current = SCREENS.find((s) => matchPath({ path: s.path, end: true }, pathname));
  const permissions = me?.permissions ?? {};
  const sidebar = visibleSidebar(permissions);
  const activeKey = current ? sidebarKeyOf(current.id) : null;
  const family = current ? familyOf(current.id) : null;
  const sub = visibleSubnav(family, permissions);
  const activeSub = current ? (SUBACTIVE[current.id] ?? current.id) : '';

  return (
    <div className="flex min-h-screen bg-page">
      <aside
        className="flex w-64 shrink-0 flex-col gap-1 border-s border-line bg-surface p-4"
        aria-label="תפריט ראשי"
      >
        <div className="mb-4 flex items-center gap-3 px-2 py-1">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-600 text-white">
            <Icon name="check" size={18} />
          </span>
          <span className="text-h3 text-fg">ניהול פדגוגי</span>
        </div>
        <nav className="flex flex-col gap-1">
          {sidebar.map((item) => (
            <SidebarItem
              key={item.key}
              to={pathFor(item.entry)}
              icon={item.icon}
              label={item.label}
              active={activeKey === item.key}
            />
          ))}
        </nav>
        <div className="mt-auto rounded-lg bg-subtle p-2">
          <Link to={pathFor('A06')} className="flex items-center gap-3 rounded-md p-1">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-label text-primary-700">
              {me?.user.firstName?.[0] ?? '?'}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-body-strong">
                {me ? `${me.user.firstName} ${me.user.lastName}` : '…'}
              </span>
              <button
                type="button"
                className="text-caption text-fg-secondary underline"
                onClick={() => dispatch(logout())}
              >
                התנתקות
              </button>
            </span>
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          title={
            current ? (
              <p className="text-body text-fg-secondary">
                {current.module} · <span className="text-body-strong text-fg">{current.name}</span>
              </p>
            ) : null
          }
          search={
            <Link
              to={pathFor('S09')}
              className="flex h-10 w-72 items-center gap-2 rounded-md border border-line bg-page px-3 text-body text-fg-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/35"
            >
              <Icon name="search" size={16} />
              חיפוש תלמיד, מורה או כיתה
            </Link>
          }
          actions={
            <>
              <Link
                to={pathFor('N04')}
                aria-label="התראות"
                className="flex h-10 w-10 items-center justify-center rounded-md text-fg-secondary hover:bg-subtle focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/35"
              >
                <Icon name="bell" />
              </Link>
              <Link
                to={pathFor('A05')}
                aria-label="החשבון שלי"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-label text-primary-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/35"
              >
                {me?.user.firstName?.[0] ?? '?'}
              </Link>
            </>
          }
        />
        {sub.length > 0 && (
          // px-6, as the TopBar above, so the two rows line up
          <nav className="flex gap-1 border-b border-line bg-surface px-6" aria-label="תפריט משני">
            {sub.map((s) => (
              <Link
                key={s.screen}
                to={pathFor(s.screen)}
                className={cx(
                  'px-3.5 py-3 text-body focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/35',
                  activeSub === s.screen
                    ? 'border-b-3 border-primary-600 text-body-strong text-primary-700'
                    : 'text-fg-secondary hover:text-fg',
                )}
              >
                {s.label}
              </Link>
            ))}
          </nav>
        )}
        <main className="flex-1 p-8">{isLoading ? <LoadingSkeleton /> : <Outlet />}</main>
      </div>
    </div>
  );
}
