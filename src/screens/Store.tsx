import { useState } from 'react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Star, Shield, Zap, CheckCircle2, Award, Circle } from 'lucide-react';
import { translations } from '../lib/i18n';

const storeItems = [
  { id: 'i1', name: 'Neon Nights Theme', type: 'theme', cost: 500, icon: Zap, color: 'text-fuchsia-500', bg: 'bg-fuchsia-100 dark:bg-fuchsia-900/30' },
  { id: 'i2', name: 'Streak Freeze', type: 'powerup', cost: 200, icon: Shield, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  { id: 'i3', name: 'Ninja Avatar', type: 'avatar', cost: 1000, icon: Star, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  { id: 'i4', name: 'Double Points (24h)', type: 'powerup', cost: 800, icon: Award, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
];

export function Store() {
  const user = useStore(state => state.user);
  const buyItem = useStore(state => state.buyItem);
  const purchasedItems = useStore(state => state.purchasedItems);
  const activeItems = useStore(state => state.activeItems);
  const toggleItemActive = useStore(state => state.toggleItemActive);
  const language = useStore(state => state.language);
  const [showToast, setShowToast] = useState(false);

  const t = translations[language];

  if (!user) return null;

  const handleBuy = (id: string, cost: number) => {
    if (purchasedItems.includes(id)) return;
    
    if (buyItem(id, cost)) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } else {
      alert(t.notEnoughPoints);
    }
  };

  return (
    <div className="p-6 pb-24 min-h-screen bg-slate-50 dark:bg-slate-950 relative">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t.storeTitle}</h1>
          <p className="text-slate-500 dark:text-slate-400">{t.storeDesc}</p>
        </div>
        <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 px-4 py-2 rounded-2xl">
          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          <span className="font-bold text-amber-700 dark:text-amber-400">{user.points}</span>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4">
        {storeItems.map((item, i) => {
          const isPurchased = purchasedItems.includes(item.id);
          const isActive = activeItems.includes(item.id);
          const canAfford = user.points >= item.cost;

          return (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`p-5 rounded-3xl border shadow-sm relative overflow-hidden flex flex-col items-center text-center ${
                isPurchased 
                  ? 'bg-slate-100 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800' 
                  : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'
              }`}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 ${item.bg}`}>
                <item.icon className={`w-8 h-8 ${item.color}`} />
              </div>
              
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1 leading-tight">
                {item.name}
              </h3>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-4">
                {item.type}
              </p>

              <button 
                onClick={() => isPurchased ? toggleItemActive(item.id) : handleBuy(item.id, item.cost)}
                disabled={!canAfford && !isPurchased}
                className={`w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1 transition-all ${
                  isActive
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : isPurchased 
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/50' 
                      : canAfford
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 active:scale-95'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isPurchased ? (
                  isActive ? <><CheckCircle2 className="w-4 h-4" /> {t.active}</> : <><Circle className="w-4 h-4" /> {t.activate}</>
                ) : (
                  <><Star className="w-4 h-4" /> {item.cost}</>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50"
          >
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            <span className="font-medium">{t.purchaseSuccess}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
