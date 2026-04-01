import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Trophy, Users, ArrowRight } from 'lucide-react';

const slides = [
  {
    title: 'Master Your Day',
    description: 'Create tasks, set priorities, and organize your study plans effortlessly.',
    icon: CheckCircle,
    color: 'text-indigo-500',
    bg: 'bg-indigo-100 dark:bg-indigo-900/30',
  },
  {
    title: 'Build Streaks',
    description: 'Stay consistent, earn points, and unlock exclusive badges and rewards.',
    icon: Trophy,
    color: 'text-amber-500',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
  },
  {
    title: 'Compete Together',
    description: 'Challenge friends, climb the leaderboard, and stay motivated.',
    icon: Users,
    color: 'text-emerald-500',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
];

export function Onboarding() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-between p-6 max-w-md mx-auto relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />

      <div className="w-full pt-12 flex justify-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">TaskRival</h1>
        </div>
      </div>

      <div className="flex-1 w-full flex flex-col items-center justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center w-full"
          >
            <div className={`w-32 h-32 rounded-3xl ${slides[current].bg} flex items-center justify-center mb-10 shadow-xl shadow-slate-200/50 dark:shadow-none`}>
              {(() => {
                const Icon = slides[current].icon;
                return <Icon className={`w-16 h-16 ${slides[current].color}`} />;
              })()}
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              {slides[current].title}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-[280px]">
              {slides[current].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="w-full pb-12 flex flex-col items-center gap-8">
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-200 dark:bg-slate-800'
              }`}
            />
          ))}
        </div>

        <div className="w-full flex flex-col gap-3">
          <button
            onClick={nextSlide}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-indigo-600/20"
          >
            {current === slides.length - 1 ? 'Get Started' : 'Continue'}
            <ArrowRight className="w-5 h-5" />
          </button>
          
          {current < slides.length - 1 && (
            <button
              onClick={() => navigate('/auth')}
              className="w-full py-4 text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              Skip
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
