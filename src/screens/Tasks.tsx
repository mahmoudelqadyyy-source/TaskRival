import React, { useState } from 'react';
import { useStore, Task, Priority, Recurring } from '../store/useStore';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Circle, Plus, Trash2, Calendar, Clock, AlertCircle, Wand2, CheckSquare } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { translations } from '../lib/i18n';

export function Tasks() {
  const tasks = useStore(state => state.tasks);
  const toggleTask = useStore(state => state.toggleTask);
  const deleteTask = useStore(state => state.deleteTask);
  const addTask = useStore(state => state.addTask);
  const breakdownTaskAI = useStore(state => state.breakdownTaskAI);
  const toggleSubtask = useStore(state => state.toggleSubtask);
  const language = useStore(state => state.language);

  const t = translations[language];

  const [isAdding, setIsAdding] = useState(false);
  const [loadingAI, setLoadingAI] = useState<string | null>(null);
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t.tasksTitle}</h1>
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
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">{t.newTask}</h3>
              
              <input
                type="text"
                placeholder={t.whatNeedsToBeDone}
                value={newTask.title}
                onChange={e => setNewTask({...newTask, title: e.target.value})}
                className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                autoFocus
              />
              
              <input
                type="text"
                placeholder={t.descriptionOpt}
                value={newTask.description}
                onChange={e => setNewTask({...newTask, description: e.target.value})}
                className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white text-sm"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">{t.priority}</label>
                  <select 
                    value={newTask.priority}
                    onChange={e => setNewTask({...newTask, priority: e.target.value as Priority})}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white text-sm"
                  >
                    <option value="low">{t.low}</option>
                    <option value="medium">{t.medium}</option>
                    <option value="high">{t.high}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">{t.estimatedTime}</label>
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
                  {t.cancel}
                </button>
                <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-medium shadow-md shadow-indigo-600/20">
                  {t.saveTask}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pending Tasks */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {t.toDo} ({pendingTasks.length})
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
                      {task.priority === 'high' ? t.high : task.priority === 'medium' ? t.medium : t.low}
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
                  
                  {/* Subtasks */}
                  {task.subtasks && task.subtasks.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {task.subtasks.map(subtask => (
                        <div key={subtask.id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                          <button 
                            onClick={() => toggleSubtask(task.id, subtask.id)}
                            className={`flex-shrink-0 transition-colors ${subtask.completed ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-500'}`}
                          >
                            {subtask.completed ? <CheckSquare className="w-5 h-5" /> : <div className="w-5 h-5 border-2 border-current rounded" />}
                          </button>
                          <span className={`text-sm flex-1 ${subtask.completed ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-300'}`}>
                            {subtask.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  {!task.subtasks && (
                    <button 
                      onClick={() => {
                        setLoadingAI(task.id);
                        setTimeout(() => {
                          breakdownTaskAI(task.id);
                          setLoadingAI(null);
                        }, 1500);
                      }}
                      disabled={loadingAI === task.id}
                      className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-all disabled:opacity-50"
                      title="AI Breakdown"
                    >
                      <Wand2 className={`w-4 h-4 ${loadingAI === task.id ? 'animate-spin' : ''}`} />
                    </button>
                  )}
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {pendingTasks.length === 0 && !isAdding && (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed">
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-indigo-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{t.allCaughtUpNotif}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{t.allCaughtUp}</p>
            </div>
          )}
        </div>
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {t.completed} ({completedTasks.length})
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
                    {task.subtasks && task.subtasks.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {task.subtasks.map(subtask => (
                          <div key={subtask.id} className="flex items-center gap-2 text-xs">
                            <CheckSquare className="w-3 h-3 text-emerald-500" />
                            <span className="text-slate-400 line-through">{subtask.title}</span>
                          </div>
                        ))}
                      </div>
                    )}
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
