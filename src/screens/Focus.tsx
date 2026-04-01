import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, X, Users, Coffee, Flame, Heart, MessageCircle } from 'lucide-react';
import { useStore } from '../store/useStore';

export function Focus() {
  const navigate = useNavigate();
  const addPoints = useStore(state => state.addPoints);
  const friends = useStore(state => state.friends);
  
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState<'focus' | 'break'>('focus');
  const [feed, setFeed] = useState<{id: string, text: string, time: Date}[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (sessionType === 'focus') {
        addPoints(100); // Reward for completing a focus session
        setSessionType('break');
        setTimeLeft(5 * 60); // 5 minute break
        setFeed(f => [{id: Date.now().toString(), text: 'You completed a focus session! +100 pts', time: new Date()}, ...f].slice(0, 5));
      } else {
        setSessionType('focus');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, sessionType, addPoints]);

  // Simulate friends joining/cheering
  useEffect(() => {
    if (!isActive) return;
    const timer = setInterval(() => {
      if (Math.random() > 0.7) {
        const friend = friends[Math.floor(Math.random() * friends.length)];
        const actions = ['joined the room', 'sent a cheer! 🔥', 'is on a 3-day streak!'];
        const action = actions[Math.floor(Math.random() * actions.length)];
        setFeed(f => [{id: Date.now().toString(), text: `${friend.name} ${action}`, time: new Date()}, ...f].slice(0, 5));
      }
    }, 15000);
    return () => clearInterval(timer);
  }, [isActive, friends]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const handleCheer = () => {
    setFeed(f => [{id: Date.now().toString(), text: 'You sent a cheer to the room! 👏', time: new Date()}, ...f].slice(0, 5));
  };
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = sessionType === 'focus' 
    ? ((25 * 60 - timeLeft) / (25 * 60)) * 100 
    : ((5 * 60 - timeLeft) / (5 * 60)) * 100;

  // Mock active friends in the room
  const activeFriends = friends.slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col relative overflow-hidden">
      {/* Immersive Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-slate-950 to-emerald-900/20 z-0" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] z-0 pointer-events-none" />

      <header className="relative z-10 p-6 flex justify-between items-center">
        <button 
          onClick={() => navigate('/')}
          className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">
          <Users className="w-4 h-4 text-indigo-300" />
          <span className="text-sm font-medium">Co-op Room</span>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-72 h-72 flex items-center justify-center mb-12"
        >
          {/* Progress Ring */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" className="stroke-white/10" strokeWidth="2" fill="none" />
            <circle 
              cx="50" cy="50" r="48" 
              className={`transition-all duration-1000 ease-linear ${sessionType === 'focus' ? 'stroke-indigo-500' : 'stroke-emerald-500'}`}
              strokeWidth="4" 
              fill="none" 
              strokeLinecap="round"
              strokeDasharray="301.59"
              strokeDashoffset={301.59 - (301.59 * progress) / 100}
            />
          </svg>

          <div className="text-center">
            <div className="text-6xl font-bold tracking-tighter mb-2 font-mono">
              {formatTime(timeLeft)}
            </div>
            <div className={`text-sm font-medium uppercase tracking-widest flex items-center justify-center gap-2 ${sessionType === 'focus' ? 'text-indigo-400' : 'text-emerald-400'}`}>
              {sessionType === 'focus' ? (
                <><Flame className="w-4 h-4" /> Deep Focus</>
              ) : (
                <><Coffee className="w-4 h-4" /> Short Break</>
              )}
            </div>
          </div>
        </motion.div>

        <div className="flex items-center gap-6 mb-16">
          <button 
            onClick={toggleTimer}
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
              isActive 
                ? 'bg-white/10 text-white hover:bg-white/20' 
                : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/30'
            }`}
          >
            {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
          </button>
        </div>

        {/* Multiplayer Section */}
        <div className="w-full max-w-sm grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-md">
            <h3 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">Room</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src="https://i.pravatar.cc/150?u=me" alt="You" className="w-8 h-8 rounded-full border-2 border-indigo-500" />
                    <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-slate-900" />
                  </div>
                  <span className="font-medium text-sm">You</span>
                </div>
              </div>
              
              {activeFriends.map(friend => (
                <div key={friend.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={friend.avatar} alt={friend.name} className="w-8 h-8 rounded-full border-2 border-slate-700" />
                      <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-slate-900" />
                    </div>
                    <span className="font-medium text-slate-300 text-sm">{friend.name}</span>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={handleCheer}
              className="mt-6 w-full py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Heart className="w-4 h-4" /> Send Cheer
            </button>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-md flex flex-col">
            <h3 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider flex items-center gap-2">
              <MessageCircle className="w-4 h-4" /> Live Feed
            </h3>
            <div className="flex-1 overflow-hidden relative">
              <div className="absolute inset-0 flex flex-col justify-end space-y-2">
                <AnimatePresence>
                  {feed.map(item => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="text-xs bg-white/10 p-2 rounded-lg text-slate-300"
                    >
                      {item.text}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {feed.length === 0 && (
                  <p className="text-xs text-slate-500 text-center pb-2">Waiting for activity...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
