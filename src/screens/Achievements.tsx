import { useStore } from '../store/useStore';
import { motion } from 'motion/react';
import { Award, Target, Zap, Flame, Lock, Share2 } from 'lucide-react';

export function Achievements() {
  const achievements = useStore(state => state.achievements);
  const user = useStore(state => state.user);

  if (!user) return null;

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const progress = (unlockedCount / achievements.length) * 100;

  const getIcon = (iconName: string, unlocked: boolean) => {
    const props = { className: `w-8 h-8 ${unlocked ? 'text-white' : 'text-slate-400'}` };
    switch (iconName) {
      case 'target': return <Target {...props} />;
      case 'flame': return <Flame {...props} />;
      case 'zap': return <Zap {...props} />;
      case 'award': return <Award {...props} />;
      default: return <Award {...props} />;
    }
  };

  return (
    <div className="p-6 pb-24 min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Achievements</h1>
        <p className="text-slate-500 dark:text-slate-400">Collect badges and level up.</p>
      </header>

      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-500/30 mb-8 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="flex justify-between items-end mb-4 relative z-10">
          <div>
            <div className="text-sm font-medium text-indigo-100 mb-1">Current Level</div>
            <div className="text-4xl font-bold">{user.level}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-indigo-100 mb-1">Total Points</div>
            <div className="text-2xl font-bold flex items-center gap-1 justify-end">
              <Award className="w-5 h-5 text-amber-300" /> {user.points}
            </div>
          </div>
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between text-xs font-medium text-indigo-100 mb-2">
            <span>Level {user.level}</span>
            <span>Level {user.level + 1}</span>
          </div>
          <div className="h-2 w-full bg-indigo-900/40 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '65%' }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-white rounded-full"
            />
          </div>
          <p className="text-xs text-indigo-100 mt-2 text-center">
            350 points to next level
          </p>
        </div>
      </div>

      <div className="mb-6 flex justify-between items-end">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Badges</h2>
        <span className="text-sm font-medium text-slate-500">{unlockedCount} / {achievements.length} Unlocked</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {achievements.map((achievement, i) => (
          <motion.div 
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`p-5 rounded-3xl border shadow-sm relative overflow-hidden flex flex-col items-center text-center ${
              achievement.unlocked 
                ? 'bg-white dark:bg-slate-900 border-indigo-100 dark:border-indigo-900/50' 
                : 'bg-slate-100 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-70'
            }`}
          >
            {!achievement.unlocked && (
              <div className="absolute top-3 right-3">
                <Lock className="w-4 h-4 text-slate-400" />
              </div>
            )}
            
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 shadow-inner ${
              achievement.unlocked 
                ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-orange-500/50' 
                : 'bg-slate-200 dark:bg-slate-800'
            }`}>
              {getIcon(achievement.icon, achievement.unlocked)}
            </div>
            
            <h3 className={`font-bold text-sm mb-1 ${achievement.unlocked ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
              {achievement.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-500 leading-tight">
              {achievement.description}
            </p>

            {achievement.unlocked && (
              <button className="mt-3 text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:text-indigo-700 transition-colors">
                <Share2 className="w-3 h-3" /> Share
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
