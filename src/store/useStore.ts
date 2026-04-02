import { create } from 'zustand';
import { addDays, format, isSameDay, startOfDay } from 'date-fns';
import { auth, db, isFirebaseConfigured } from '../firebase';
import { doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';

export type Priority = 'low' | 'medium' | 'high';
export type Recurring = 'none' | 'daily' | 'weekly' | 'custom';
export type Language = 'en' | 'ar';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  estimatedTime: number; // in minutes
  completed: boolean;
  date: string; // ISO string
  recurring: Recurring;
  subtasks?: { id: string; title: string; completed: boolean }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  points: number;
  streak: number;
  level: number;
  goal: string;
  avatar: string;
  onboarded: boolean;
}

export interface Challenge {
  id: string;
  name: string;
  days: number;
  progress: number;
  reward: number;
  joined: boolean;
}

export interface TeamChallenge {
  id: string;
  name: string;
  description: string;
  target: number;
  progress: number;
  reward: number;
  participants: string[]; // friend IDs or 'me'
  joined: boolean;
}

export interface Friend {
  id: string;
  name: string;
  points: number;
  streak: number;
  completionRate: number;
  avatar: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  icon: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'social' | 'system' | 'reminder';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

interface AppState {
  user: User | null;
  tasks: Task[];
  challenges: Challenge[];
  teamChallenges: TeamChallenge[];
  friends: Friend[];
  achievements: Achievement[];
  notifications: AppNotification[];
  language: Language;
  
  // Actions
  login: (user: Partial<User>) => void;
  logout: () => void;
  completeOnboarding: () => void;
  setLanguage: (lang: Language) => void;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  joinChallenge: (id: string) => void;
  joinTeamChallenge: (id: string) => void;
  addPoints: (points: number) => void;
  spendPoints: (points: number) => boolean;
  breakdownTaskAI: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateAvatar: (avatar: string) => void;
  purchasedItems: string[];
  activeItems: string[];
  buyItem: (id: string, cost: number) => boolean;
  toggleItemActive: (id: string) => void;
}

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Read 20 pages of a book',
    description: 'Atomic Habits',
    priority: 'medium',
    estimatedTime: 30,
    completed: false,
    date: new Date().toISOString(),
    recurring: 'daily',
  },
  {
    id: '2',
    title: 'Study for Math Exam',
    description: 'Chapter 4 & 5',
    priority: 'high',
    estimatedTime: 120,
    completed: true,
    date: new Date().toISOString(),
    recurring: 'none',
  },
  {
    id: '3',
    title: 'Workout',
    description: 'Upper body strength',
    priority: 'medium',
    estimatedTime: 45,
    completed: false,
    date: new Date().toISOString(),
    recurring: 'daily',
  }
];

const initialChallenges: Challenge[] = [
  { id: 'c1', name: '7-Day Reading Sprint', days: 7, progress: 2, reward: 500, joined: true },
  { id: 'c2', name: '14-Day Code Camp', days: 14, progress: 0, reward: 1200, joined: false },
  { id: 'c3', name: '30-Day Fitness Challenge', days: 30, progress: 12, reward: 3000, joined: true },
];

const initialTeamChallenges: TeamChallenge[] = [
  { id: 'tc1', name: '100 Hours Focus', description: 'Collectively focus for 100 hours this week', target: 100, progress: 42, reward: 1500, participants: ['f1', 'f2'], joined: false },
  { id: 'tc2', name: 'Task Terminators', description: 'Complete 500 tasks together', target: 500, progress: 312, reward: 2000, participants: ['f1', 'f3', 'me'], joined: true },
];

const initialFriends: Friend[] = [
  { id: 'f1', name: 'Alex Chen', points: 4200, streak: 12, completionRate: 85, avatar: 'https://i.pravatar.cc/150?u=alex' },
  { id: 'f2', name: 'Sarah Miller', points: 3850, streak: 8, completionRate: 78, avatar: 'https://i.pravatar.cc/150?u=sarah' },
  { id: 'f3', name: 'Jordan Lee', points: 5100, streak: 21, completionRate: 92, avatar: 'https://i.pravatar.cc/150?u=jordan' },
];

const initialAchievements: Achievement[] = [
  { id: 'a1', name: 'First Step', description: 'Completed your first task', unlocked: true, icon: 'target' },
  { id: 'a2', name: 'On Fire', description: 'Reached a 3-day streak', unlocked: true, icon: 'flame' },
  { id: 'a3', name: 'Unstoppable', description: 'Reached a 7-day streak', unlocked: false, icon: 'zap' },
  { id: 'a4', name: 'Task Master', description: 'Completed 100 tasks', unlocked: false, icon: 'award' },
];

const initialNotifications: AppNotification[] = [
  { id: 'n1', title: 'Alex Chen is on fire! 🔥', message: 'Alex just hit a 12-day streak. Send a high five!', type: 'social', read: false, createdAt: new Date().toISOString() },
  { id: 'n2', title: 'Team Challenge Update', message: 'Your team is 80% done with "Task Terminators". Keep it up!', type: 'system', read: false, createdAt: new Date(Date.now() - 3600000).toISOString(), actionUrl: '/challenges' },
  { id: 'n3', title: 'Daily Reminder', message: 'You have 2 tasks left for today. You can do it!', type: 'reminder', read: true, createdAt: new Date(Date.now() - 86400000).toISOString(), actionUrl: '/tasks' },
];

export const useStore = create<AppState>((set, get) => ({
  user: null,
  tasks: initialTasks,
  challenges: initialChallenges,
  teamChallenges: initialTeamChallenges,
  friends: initialFriends,
  achievements: initialAchievements,
  notifications: initialNotifications,
  language: 'en',

  login: (userData) => set((state) => ({
    user: {
      id: 'u1',
      name: userData.name || 'User',
      email: userData.email || 'user@example.com',
      points: 1250,
      streak: 4,
      level: 3,
      goal: userData.goal || 'Daily organization',
      avatar: 'https://i.pravatar.cc/150?u=me',
      onboarded: true,
      ...userData,
    } as User
  })),

  logout: () => set({ user: null }),

  completeOnboarding: () => set((state) => ({
    user: state.user ? { ...state.user, onboarded: true } : null
  })),

  setLanguage: (lang) => set({ language: lang }),

  setTasks: (tasks) => set({ tasks }),

  addTask: (task) => {
    const newTask = { ...task, id: Math.random().toString(36).substr(2, 9), completed: false };
    set((state) => ({
      tasks: [...state.tasks, newTask]
    }));
    
    if (isFirebaseConfigured && auth.currentUser) {
      setDoc(doc(db, 'users', auth.currentUser.uid, 'tasks', newTask.id), newTask).catch(console.error);
    }
  },

  toggleTask: (id) => {
    let updatedTask: Task | undefined;
    
    set((state) => {
      const newTasks = state.tasks.map(t => {
        if (t.id === id) {
          updatedTask = { ...t, completed: !t.completed };
          return updatedTask;
        }
        return t;
      });
      
      const task = state.tasks.find(t => t.id === id);
      let pointsToAdd = 0;
      
      // Check if task is being completed
      if (task && !task.completed) {
        const isDoublePoints = state.activeItems.includes('i4');
        pointsToAdd = isDoublePoints ? 100 : 50; // 50 points per task, 100 if double points active
        
        // Add a smart notification for completing a task
        setTimeout(() => {
          get().addNotification({
            title: 'Task Completed! 🎉',
            message: `You earned ${pointsToAdd} points for completing "${task.title}". Keep the momentum going!`,
            type: 'system',
            actionUrl: '/store'
          });
        }, 1000);
      } else if (task && task.completed) {
        const isDoublePoints = state.activeItems.includes('i4');
        pointsToAdd = isDoublePoints ? -100 : -50;
      }
      
      return {
        tasks: newTasks,
        user: state.user ? { ...state.user, points: Math.max(0, state.user.points + pointsToAdd) } : null
      };
    });
    
    if (updatedTask && isFirebaseConfigured && auth.currentUser) {
      updateDoc(doc(db, 'users', auth.currentUser.uid, 'tasks', id), { completed: updatedTask.completed }).catch(console.error);
    }
  },

  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter(t => t.id !== id)
    }));
    
    if (isFirebaseConfigured && auth.currentUser) {
      deleteDoc(doc(db, 'users', auth.currentUser.uid, 'tasks', id)).catch(console.error);
    }
  },

  joinChallenge: (id) => set((state) => ({
    challenges: state.challenges.map(c => c.id === id ? { ...c, joined: true } : c)
  })),

  joinTeamChallenge: (id) => set((state) => {
    const challenge = state.teamChallenges.find(c => c.id === id);
    if (challenge && !challenge.joined) {
      setTimeout(() => {
        get().addNotification({
          title: 'Welcome to the Team! 🤝',
          message: `You joined "${challenge.name}". Let's achieve this together!`,
          type: 'social',
          actionUrl: '/challenges'
        });
      }, 500);
    }
    return {
      teamChallenges: state.teamChallenges.map(c => c.id === id ? { ...c, joined: true, participants: [...c.participants, 'me'] } : c)
    };
  }),

  addPoints: (points) => set((state) => ({
    user: state.user ? { ...state.user, points: state.user.points + points } : null
  })),

  spendPoints: (points) => {
    let success = false;
    set((state) => {
      if (state.user && state.user.points >= points) {
        success = true;
        return { user: { ...state.user, points: state.user.points - points } };
      }
      return state;
    });
    return success;
  },

  breakdownTaskAI: (id) => set((state) => {
    const task = state.tasks.find(t => t.id === id);
    if (!task) return state;
    
    // Simulated AI breakdown
    const subtasks = [
      { id: Math.random().toString(36).substr(2, 9), title: 'Research & gather materials', completed: false },
      { id: Math.random().toString(36).substr(2, 9), title: 'Complete first half', completed: false },
      { id: Math.random().toString(36).substr(2, 9), title: 'Review and finalize', completed: false }
    ];
    
    return {
      tasks: state.tasks.map(t => t.id === id ? { ...t, subtasks } : t)
    };
  }),

  toggleSubtask: (taskId, subtaskId) => set((state) => {
    return {
      tasks: state.tasks.map(t => {
        if (t.id === taskId && t.subtasks) {
          const updatedSubtasks = t.subtasks.map(st => 
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          const allDone = updatedSubtasks.every(st => st.completed);
          
          // If all subtasks are done, mark main task as done and add points
          if (allDone && !t.completed) {
            setTimeout(() => get().toggleTask(taskId), 300);
          } else if (!allDone) {
            const toggledSubtask = updatedSubtasks.find(st => st.id === subtaskId);
            const completedCount = updatedSubtasks.filter(st => st.completed).length;
            if (toggledSubtask?.completed && completedCount === 1) {
              setTimeout(() => {
                get().addNotification({
                  title: 'Great Start! 🚀',
                  message: `You completed the first step of "${t.title}". Keep it up!`,
                  type: 'reminder',
                  actionUrl: '/tasks'
                });
              }, 1000);
            }
          }
          
          return { ...t, subtasks: updatedSubtasks };
        }
        return t;
      })
    };
  }),

  addNotification: (notification) => set((state) => ({
    notifications: [
      {
        ...notification,
        id: Math.random().toString(36).substr(2, 9),
        read: false,
        createdAt: new Date().toISOString()
      },
      ...state.notifications
    ]
  })),

  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    )
  })),

  markAllNotificationsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),

  updateAvatar: (avatar) => set((state) => ({
    user: state.user ? { ...state.user, avatar } : null
  })),

  purchasedItems: [],
  activeItems: [],

  buyItem: (id, cost) => {
    let success = false;
    set((state) => {
      if (state.user && state.user.points >= cost && !state.purchasedItems.includes(id)) {
        success = true;
        return { 
          user: { ...state.user, points: state.user.points - cost },
          purchasedItems: [...state.purchasedItems, id]
        };
      }
      return state;
    });
    return success;
  },

  toggleItemActive: (id) => set((state) => {
    const isActive = state.activeItems.includes(id);
    let newActiveItems = state.activeItems;
    
    if (isActive) {
      newActiveItems = state.activeItems.filter(i => i !== id);
    } else {
      newActiveItems = [...state.activeItems, id];
    }

    // Special effects
    let newUser = state.user;
    if (id === 'i3') { // Ninja Avatar
      if (!isActive) {
        newUser = newUser ? { ...newUser, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ninja' } : null;
      } else {
        newUser = newUser ? { ...newUser, avatar: 'https://i.pravatar.cc/150?u=me' } : null; // Revert to default
      }
    }

    return {
      activeItems: newActiveItems,
      user: newUser
    };
  }),
}));
