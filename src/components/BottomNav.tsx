import { NavLink } from 'react-router-dom';
import { Home, CheckSquare, Trophy, Users, User } from 'lucide-react';
import { cn } from '../lib/utils';

export function BottomNav() {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { to: '/challenges', icon: Trophy, label: 'Challenges' },
    { to: '/leaderboard', icon: Users, label: 'Friends' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe pt-2 px-6 flex justify-between items-center z-50">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200",
              isActive 
                ? "text-indigo-600 dark:text-indigo-400" 
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            )
          }
        >
          {({ isActive }) => (
            <>
              <item.icon className={cn("w-6 h-6", isActive && "fill-indigo-100 dark:fill-indigo-900/30")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
}
