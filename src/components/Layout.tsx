import { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { BottomNav } from './BottomNav';
import { Tour } from './Tour';

export function Layout() {
  const user = useStore((state) => state.user);
  const addNotification = useStore((state) => state.addNotification);
  const language = useStore((state) => state.language);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (!user) return;

    // Simulate a smart notification arriving after 30 seconds
    const timer = setTimeout(() => {
      addNotification({
        title: 'Smart Suggestion 💡',
        message: 'You usually complete tasks around this time. Want to start a 25-min focus session?',
        type: 'system',
        actionUrl: '/focus'
      });
    }, 30000);

    return () => clearTimeout(timer);
  }, [user, addNotification]);

  if (!user) {
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 pb-20">
      <Tour />
      <main className="max-w-md mx-auto w-full min-h-screen relative shadow-2xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 overflow-x-hidden">
        <Outlet />
        <BottomNav />
      </main>
    </div>
  );
}
