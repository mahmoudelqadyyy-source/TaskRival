import React, { useState } from 'react';
import { useStore, Task, Priority, Recurring } from '../store/useStore';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Circle, Plus, Trash2, Calendar, Clock, AlertCircle } from 'lucide-react';
import { format, isSameDay } from 'date-fns';

export function Tasks() {
  const tasks = useStore(state => state.tasks);
  const toggleTask = useStore(state => state.toggleTask);
  const deleteTask = useStore(state => state.deleteTask);
  const addTask = useStore(state => state.addTask);

  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Priority,
    estimatedTime: 30,
    recurring: 'none' as Recurring,
  });

  const todayTasks = tasks.filter(t => isSameDay(new Date(t.date), new Date()));
  const completedTasks = todayTasks.filter(t => t.completed);
  const pendingTasks = todayTasks.filter(t => !t.completed);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    addTask({
      ...newTask,
      date: new Date().toISOString(),
    });
    setIsAdding(false);
    setNewTask({ title: '', description: '', priority: 'medium', estimatedTime: 30, recurring: 'none' });
  };

  return (
    <div className="p-6 pb-24 min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Daily Tasks</h1>
          <p className="text-slate-500 dark:text-slate-400">{format(new Date(), 'EEEE, MMMM d')}</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
        >
          <Plus className="w-6 h-6" />
        </button>
      </header>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden"
          >
            <form onSubmit={handleAddSubmit} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-4">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">New Task</h3>
              
              <input
                type="text"
                placeholder="What needs to be done?"
                value={newTask.title}
                onChange={e => setNewTask({...newTask, title: e.target.value})}
                className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                autoFocus
              />
              
              <input
                type="text"
                placeholder="Description (optional)"
                value={newTask.description}
                onChange={e => setNewTask({...newTask, description: e.target.value})}
                className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white text-sm"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">Priority</label>
                  <select 
                    value={newTask.priority}
                    onChange={e => setNewTask({...newTask, priority: e.target.value as Priority})}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">Est. Time (min)</label>
                  <input
                    type="number"
                    value={newTask.estimatedTime}
                    onChange={e => setNewTask({...newTask, estimatedTime: parseInt(e.target.value) || 0})}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-medium shadow-md shadow-indigo-600/20">
                  Save Task
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pending Tasks */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> To Do ({pendingTasks.length})
        </h2>
        <div className="space-y-3">
          <AnimatePresence>
            {pendingTasks.map((task) => (
              <motion.div 
                key={task.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4 group"
              >
                <button 
                  onClick={() => toggleTask(task.id)}
                  className="mt-1 flex-shrink-0 text-slate-300 hover:text-indigo-500 transition-colors"
                >
                  <Circle className="w-6 h-6" />
                </button>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-900 dark:text-white truncate">{task.title}</h4>
                  {task.description && <p className="text-sm text-slate-500 truncate mt-0.5">{task.description}</p>}
                  <div className="flex items-center gap-3 mt-3 text-xs font-medium">
                    <span className={`px-2 py-1 rounded-lg ${
                      task.priority === 'high' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                      task.priority === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    }`}>
                      {task.priority}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3 h-3" /> {task.estimatedTime}m
                    </span>
                    {task.recurring !== 'none' && (
                      <span className="flex items-center gap-1 text-indigo-500">
                        <Calendar className="w-3 h-3" /> {task.recurring}
                      </span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {pendingTasks.length === 0 && !isAdding && (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed">
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-indigo-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">All caught up!</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">You've completed all your tasks for today.</p>
            </div>
          )}
        </div>
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Completed ({completedTasks.length})
          </h2>
          <div className="space-y-3 opacity-60">
            <AnimatePresence>
              {completedTasks.map((task) => (
                <motion.div 
                  key={task.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4"
                >
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className="flex-shrink-0 text-emerald-500 transition-colors"
                  >
                    <CheckCircle2 className="w-6 h-6" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-500 dark:text-slate-400 line-through truncate">{task.title}</h4>
                  </div>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
