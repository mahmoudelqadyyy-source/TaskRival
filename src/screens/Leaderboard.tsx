import { useState } from 'react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Flame, UserPlus, Search, Crown } from 'lucide-react';
import { translations } from '../lib/i18n';

export function Leaderboard() {
  const user = useStore(state => state.user);
  const friends = useStore(state => state.friends);
  const language = useStore(state => state.language);
  const [filter, setFilter] = useState<'points' | 'streak'>('points');
  const [search, setSearch] = useState('');

  const t = translations[language];

  if (!user) return null;

  const allUsers = [
    { ...user, isMe: true },
    ...friends.map(f => ({ ...f, isMe: false }))
  ];

  const sortedUsers = [...allUsers].sort((a, b) => b[filter] - a[filter]);

  return (
    <div className="p-6 pb-24 min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t.leaderboard}</h1>
        <p className="text-slate-500 dark:text-slate-400">{t.leaderboardDesc}</p>
      </header>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
          <input
            type="text"
            placeholder={t.findFriends}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-slate-900 dark:text-white shadow-sm ${language === 'ar' ? 'pr-9 pl-4' : 'pl-9 pr-4'}`}
          />
        </div>
        <button className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center shadow-sm transition-all active:scale-95">
          <UserPlus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-2xl mb-8">
        <button
          onClick={() => setFilter('points')}
          className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${
            filter === 'points' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          {t.totalPointsTab}
        </button>
        <button
          onClick={() => setFilter('streak')}
          className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${
            filter === 'streak' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          {t.currentStreakTab}
        </button>
      </div>

      <div className="space-y-4 relative">
        <AnimatePresence>
          {sortedUsers
            .filter(u => u.name.toLowerCase().includes(search.toLowerCase()))
            .map((u, index) => (
            <motion.div 
              key={u.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={`flex items-center gap-4 p-4 rounded-3xl border shadow-sm ${
                u.isMe 
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800/50' 
                  : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'
              }`}
            >
              <div className={`w-8 font-bold text-center ${
                index === 0 ? 'text-amber-500 text-xl' :
                index === 1 ? 'text-slate-400 text-lg' :
                index === 2 ? 'text-amber-700 dark:text-amber-600 text-lg' :
                'text-slate-400 text-sm'
              }`}>
                {index === 0 ? <Crown className="w-6 h-6 mx-auto" /> : `#${index + 1}`}
              </div>
              
              <div className="relative">
                <img src={u.avatar} alt={u.name} className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" />
                {u.isMe && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 dark:text-white truncate flex items-center gap-2">
                  {u.name} {u.isMe && <span className="text-[10px] bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 px-2 py-0.5 rounded-full">{t.you}</span>}
                </h4>
                <div className="flex items-center gap-3 text-xs font-medium text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-emerald-500" /> {u.points}
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-500" /> {u.streak}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
