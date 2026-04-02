import { NavLink } from 'react-router-dom';
import { Home, CheckSquare, Trophy, Users, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';
import { translations } from '../lib/i18n';

export function BottomNav() {
  const language = useStore(state => state.language);
  const t = translations[language];

  const navItems = [
    { to: '/', icon: Home, label: t.navHome, tourClass: 'tour-dashboard' },
    { to: '/tasks', icon: CheckSquare, label: t.navTasks, tourClass: 'tour-tasks' },
    { to: '/challenges', icon: Trophy, label: t.navChallenges, tourClass: 'tour-challenges' },
    { to: '/leaderboard', icon: Users, label: t.friends, tourClass: 'tour-leaderboard' },
    { to: '/profile', icon: User, label: t.navProfile, tourClass: 'tour-profile' },
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
              item.tourClass,
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
