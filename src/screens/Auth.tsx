import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Mail, Lock, User, ArrowRight, Github, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { auth, db, isFirebaseConfigured } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [goal, setGoal] = useState('Daily organization');
  const [error, setError] = useState('');
  
  const login = useStore(state => state.login);
  const navigate = useNavigate();

  const handleFirebaseUser = async (firebaseUser: any, additionalData?: any) => {
    if (!isFirebaseConfigured) return;
    
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userRef);
    
    let userData;
    if (!userSnap.exists()) {
      userData = {
        name: additionalData?.name || firebaseUser.displayName || 'User',
        email: firebaseUser.email,
        userId: firebaseUser.uid,
        goal: additionalData?.goal || 'Daily organization',
        createdAt: new Date().toISOString()
      };
      await setDoc(userRef, userData);
    } else {
      userData = userSnap.data();
    }
    
    login({ 
      name: userData.name, 
      email: userData.email, 
      goal: userData.goal,
      id: firebaseUser.uid 
    });
    navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!isFirebaseConfigured) {
      // Fallback for demo mode
      login({ name: isLogin ? 'Demo User' : name, email, goal });
      navigate('/');
      return;
    }
    
    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await handleFirebaseUser(userCredential.user);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await handleFirebaseUser(userCredential.user, { name, goal });
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    
    if (!isFirebaseConfigured) {
      // Fallback for demo mode
      login({ name: 'Google User', email: 'google@example.com', goal: 'Daily organization' });
      navigate('/');
      return;
    }
    
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      await handleFirebaseUser(userCredential.user);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const goals = ['Studying', 'Daily organization', 'Habit building', 'Competitive challenges'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center p-6 max-w-md mx-auto relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm mx-auto z-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {isLogin ? 'Enter your details to access your tasks.' : 'Start your journey to better productivity.'}
          </p>
        </div>

        {!isFirebaseConfigured && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800 dark:text-amber-300">
              <p className="font-semibold mb-1">Demo Mode Active</p>
              <p>Firebase is not configured. You can still test the app, but data won't be saved to the cloud. Add your Firebase config to the .env file to enable real authentication.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400 shadow-sm"
                required
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400 shadow-sm"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400 shadow-sm"
              required
            />
          </div>

          {!isLogin && (
            <div className="space-y-3 pt-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 px-1">Primary Goal</label>
              <div className="grid grid-cols-2 gap-3">
                {goals.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGoal(g)}
                    className={`p-3 rounded-xl text-sm font-medium transition-all ${
                      goal === g 
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border-2 border-indigo-500/50' 
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-800 shadow-sm'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 mt-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-indigo-600/20"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-8 flex items-center gap-4">
          <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
          <span className="text-sm text-slate-400 font-medium">OR</span>
          <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full py-4 mt-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all shadow-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <p className="mt-8 text-center text-slate-500 dark:text-slate-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
