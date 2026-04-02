import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'motion/react';
import { Circle, Clock, Calendar, CheckSquare, Wand2, Trash2, GripVertical } from 'lucide-react';
import { Task } from '../store/useStore';

interface SortableTaskItemProps {
  task: Task;
  t: any;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  breakdownTaskAI: (id: string) => void;
  loadingAI: string | null;
  setLoadingAI: (id: string | null) => void;
}

export function SortableTaskItem({ 
  task, 
  t, 
  toggleTask, 
  deleteTask, 
  toggleSubtask, 
  breakdownTaskAI, 
  loadingAI, 
  setLoadingAI 
}: SortableTaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? { zIndex: 10 } : {}),
  };

  return (
    <motion.div 
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`bg-white dark:bg-slate-900 p-4 rounded-2xl border ${
        isDragging ? 'border-indigo-500 shadow-lg shadow-indigo-500/20' : 'border-slate-200 dark:border-slate-800 shadow-sm'
      } flex items-start gap-3 group relative overflow-hidden`}
    >
      {/* Priority Indicator Line */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
        task.priority === 'high' ? 'bg-rose-500' :
        task.priority === 'medium' ? 'bg-amber-500' :
        'bg-emerald-500'
      }`} />

      <button 
        {...attributes} 
        {...listeners}
        className="mt-1 flex-shrink-0 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing transition-colors ml-1"
      >
        <GripVertical className="w-5 h-5" />
      </button>

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
  );
}
