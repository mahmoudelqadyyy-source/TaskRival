import { useStore } from '../store/useStore';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, Flame, Trophy, Plus, Play, ChevronRight, Languages, Camera, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isSameDay } from 'date-fns';
import { NotificationCenter } from '../components/NotificationCenter';
import { translations } from '../lib/i18n';

export function Dashboard() {
  const user = useStore(state => state.user);
  const tasks = useStore(state => state.tasks);
  const friends = useStore(state => state.friends);
  const activeItems = useStore(state => state.activeItems);
  const toggleTask = useStore(state => state.toggleTask);
  const language = useStore(state => state.language);
  const setLanguage = useStore(state => state.setLanguage);
  const updateAvatar = useStore(state => state.updateAvatar);
  const navigate = useNavigate();

  const t = translations[language];

  const todayTasks = tasks.filter(t => isSameDay(new Date(t.date), new Date()));
  const completedTasks = todayTasks.filter(t => t.completed);
  const progress = todayTasks.length > 0 ? (completedTasks.length / todayTasks.length) * 100 : 0;

  // Sort friends by points for mini leaderboard
  const topFriends = [...friends].sort((a, b) => b.points - a.points).slice(0, 3);

  if (!user) return null;

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 pb-24 min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t.hello}, {user.name.split(' ')[0]}!</h1>
          <p className="text-slate-500 dark:text-slate-400">{t.readyToCrush}</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleLanguage}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Toggle Language"
          >
            <Languages className="w-6 h-6" />
          </button>
          <NotificationCenter />
          <div className="relative group cursor-pointer">
            <label className="cursor-pointer block w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-100 dark:border-indigo-900/50 shadow-sm relative">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover group-hover:opacity-75 transition-opacity" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </label>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-5 text-white shadow-lg shadow-indigo-500/30 relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-300" />
              <span className="font-medium opacity-90">{t.streak}</span>
            </div>
            {activeItems.includes('i2') && (
              <Shield className="w-4 h-4 text-blue-200" title="Streak Freeze Active" />
            )}
          </div>
          <div className="text-3xl font-bold">{user.streak} <span className="text-lg font-medium opacity-80">{t.days}</span></div>
        </motion.div>

        <motion.div 
          onClick={() => navigate('/store')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors group tour-store"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-emerald-500" />
              <span className="font-medium text-slate-500 dark:text-slate-400">{t.points}</span>
            </div>
            <ChevronRight className={`w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors ${language === 'ar' ? 'rotate-180' : ''}`} />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{user.points}</div>
        </motion.div>
      </div>

      {/* Progress Ring & Today's Summary */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-900 rounded-3xl p-6 mb-8 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-6"
      >
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="8" fill="none" />
            <circle 
              cx="50" cy="50" r="40" 
              className="stroke-indigo-500 transition-all duration-1000 ease-out" 
              strokeWidth="8" 
              fill="none" 
              strokeLinecap="round"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (251.2 * progress) / 100}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-slate-900 dark:text-white">{Math.round(progress)}%</span>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{t.todaysProgress}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {completedTasks.length} {t.of} {todayTasks.length} {t.tasksCompleted}
          </p>
          <div className="mt-3 flex gap-2">
            <button onClick={() => navigate('/tasks')} className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 transition-colors">
              <Plus className="w-5 h-5" />
            </button>
            <button className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-100 transition-colors">
              <Play className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Today's Tasks Preview */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.upNext}</h2>
          <button onClick={() => navigate('/tasks')} className="text-indigo-600 dark:text-indigo-400 text-sm font-medium flex items-center gap-1">
            {t.seeAll} <ChevronRight className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
          </button>
        </div>
        <div className="space-y-3">
          {todayTasks.filter(t => !t.completed).slice(0, 3).map((task, i) => (
            <motion.div 
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4"
            >
              <button 
                onClick={() => toggleTask(task.id)}
                className="flex-shrink-0 text-slate-300 hover:text-indigo-500 transition-colors"
              >
                <Circle className="w-6 h-6" />
              </button>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900 dark:text-white truncate">{task.title}</h4>
                <p className="text-xs text-slate-500 truncate">{task.description}</p>
              </div>
              <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                task.priority === 'high' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                task.priority === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              }`}>
                {task.priority}
              </div>
            </motion.div>
          ))}
          {todayTasks.filter(t => !t.completed).length === 0 && (
            <div className="text-center py-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 border-dashed">
              <p className="text-slate-500 dark:text-slate-400">{t.allCaughtUp}</p>
            </div>
          )}
        </div>
      </div>

      {/* Mini Leaderboard */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.leaderboard}</h2>
          <button onClick={() => navigate('/leaderboard')} className="text-indigo-600 dark:text-indigo-400 text-sm font-medium flex items-center gap-1">
            {t.viewAll} <ChevronRight className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
          </button>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
          {topFriends.map((friend, index) => (
            <div key={friend.id} className="flex items-center gap-4">
              <div className="w-6 font-bold text-slate-400 text-center">{index + 1}</div>
              <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 dark:text-white">{friend.name}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Flame className="w-3 h-3 text-amber-500" /> {friend.streak} {t.dayStreak}
                </div>
              </div>
              <div className="font-bold text-indigo-600 dark:text-indigo-400">{friend.points}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
