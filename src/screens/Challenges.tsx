import { useStore } from '../store/useStore';
import { motion } from 'motion/react';
import { Trophy, Clock, Star, CheckCircle } from 'lucide-react';

export function Challenges() {
  const challenges = useStore(state => state.challenges);
  const joinChallenge = useStore(state => state.joinChallenge);

  return (
    <div className="p-6 pb-24 min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Challenges</h1>
        <p className="text-slate-500 dark:text-slate-400">Push your limits and earn big rewards.</p>
      </header>

      <div className="space-y-6">
        {challenges.map((challenge, i) => (
          <motion.div 
            key={challenge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-3xl p-6 border shadow-sm relative overflow-hidden ${
              challenge.joined 
                ? 'bg-white dark:bg-slate-900 border-indigo-100 dark:border-indigo-900/50' 
                : 'bg-slate-100 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'
            }`}
          >
            {challenge.joined && (
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
            )}
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  challenge.days === 7 ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                  challenge.days === 14 ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' :
                  'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                }`}>
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">{challenge.name}</h3>
                  <div className="flex items-center gap-1 text-xs font-medium text-slate-500 mt-1">
                    <Clock className="w-3 h-3" /> {challenge.days} Days
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-xl text-sm font-bold">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                {challenge.reward}
              </div>
            </div>

            {challenge.joined ? (
              <div className="relative z-10">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Progress</span>
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{challenge.progress} / {challenge.days} days</span>
                </div>
                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(challenge.progress / challenge.days) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-indigo-500 rounded-full"
                  />
                </div>
              </div>
            ) : (
              <button 
                onClick={() => joinChallenge(challenge.id)}
                className="w-full py-3 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all active:scale-95 shadow-md shadow-indigo-600/20 relative z-10"
              >
                Join Challenge
              </button>
            )}

            {challenge.progress === challenge.days && (
              <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                <CheckCircle className="w-12 h-12 text-emerald-500 mb-2" />
                <h4 className="font-bold text-xl text-slate-900 dark:text-white">Completed!</h4>
                <p className="text-sm text-slate-500 font-medium">+{challenge.reward} points earned</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
