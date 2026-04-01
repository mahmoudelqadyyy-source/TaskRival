import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { BottomNav } from './BottomNav';

export function Layout() {
  const user = useStore((state) => state.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 pb-20">
      <main className="max-w-md mx-auto w-full min-h-screen relative shadow-2xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 overflow-x-hidden">
        <Outlet />
        <BottomNav />
      </main>
    </div>
  );
}
