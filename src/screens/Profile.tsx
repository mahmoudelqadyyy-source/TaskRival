import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Settings, LogOut, Bell, Moon, Sun, ChevronRight, Trophy, Flame, Users, Award } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Profile() {
  const user = useStore(state => state.user);
  const logout = useStore(state => state.logout);
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="p-6 pb-24 min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile</h1>
        <button className="w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm">
          <Settings className="w-5 h-5" />
        </button>
      </header>

      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl mb-4 relative">
          <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-indigo-500 border-2 border-white dark:border-slate-800 rounded-full flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">{user.level}</span>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{user.name}</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium">{user.email}</p>
        <div className="mt-3 px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-bold">
          {user.goal}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-500 flex items-center justify-center mb-2">
            <Flame className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{user.streak}</div>
          <div className="text-xs font-medium text-slate-500">Day Streak</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 flex items-center justify-center mb-2">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{user.points}</div>
          <div className="text-xs font-medium text-slate-500">Total Points</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden mb-8">
        <button onClick={() => navigate('/achievements')} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <span className="font-semibold text-slate-900 dark:text-white">Achievements</span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </button>
        <button onClick={() => navigate('/leaderboard')} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="font-semibold text-slate-900 dark:text-white">Friends</span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </button>
        <div className="w-full flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <span className="font-semibold text-slate-900 dark:text-white">Notifications</span>
          </div>
          <button 
            onClick={() => setNotifications(!notifications)}
            className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notifications ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
        <div className="w-full flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center">
              {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <span className="font-semibold text-slate-900 dark:text-white">Dark Mode</span>
          </div>
          <button 
            onClick={() => setIsDark(!isDark)}
            className={`w-12 h-6 rounded-full transition-colors relative ${isDark ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isDark ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
      </div>

      <button 
        onClick={handleLogout}
        className="w-full py-4 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
      >
        <LogOut className="w-5 h-5" />
        Log Out
      </button>
    </div>
  );
}
