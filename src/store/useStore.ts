import { create } from 'zustand';
import { addDays, format, isSameDay, startOfDay } from 'date-fns';

export type Priority = 'low' | 'medium' | 'high';
export type Recurring = 'none' | 'daily' | 'weekly' | 'custom';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  estimatedTime: number; // in minutes
  completed: boolean;
  date: string; // ISO string
  recurring: Recurring;
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

interface AppState {
  user: User | null;
  tasks: Task[];
  challenges: Challenge[];
  friends: Friend[];
  achievements: Achievement[];
  
  // Actions
  login: (user: Partial<User>) => void;
  logout: () => void;
  completeOnboarding: () => void;
  addTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  joinChallenge: (id: string) => void;
  addPoints: (points: number) => void;
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

export const useStore = create<AppState>((set) => ({
  user: null,
  tasks: initialTasks,
  challenges: initialChallenges,
  friends: initialFriends,
  achievements: initialAchievements,

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

  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, { ...task, id: Math.random().toString(36).substr(2, 9), completed: false }]
  })),

  toggleTask: (id) => set((state) => {
    const newTasks = state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    const task = state.tasks.find(t => t.id === id);
    let pointsToAdd = 0;
    if (task && !task.completed) {
      pointsToAdd = 50; // 50 points per task
    } else if (task && task.completed) {
      pointsToAdd = -50;
    }
    
    return {
      tasks: newTasks,
      user: state.user ? { ...state.user, points: Math.max(0, state.user.points + pointsToAdd) } : null
    };
  }),

  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(t => t.id !== id)
  })),

  joinChallenge: (id) => set((state) => ({
    challenges: state.challenges.map(c => c.id === id ? { ...c, joined: true } : c)
  })),

  addPoints: (points) => set((state) => ({
    user: state.user ? { ...state.user, points: state.user.points + points } : null
  })),
}));
