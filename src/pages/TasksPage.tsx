import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Flame,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  Star,
  Target,
  Sun,
  Moon,
  Calendar
} from 'lucide-react';
import { useLifeOS } from '../context/LifeOSContext';
import { QuickAddModal } from '../components/QuickAddModal';
import { TaskArea, PriorityLevel } from '../types';

export const TasksPage: React.FC = () => {
  const {
    tasks,
    toggleTask,
    deleteTask,
    toggleTopThree,
    habits,
    toggleHabitToday
  } = useLifeOS();

  const [modalOpen, setModalOpen] = useState(false);
  const [filterView, setFilterView] = useState<'today' | 'this_week' | 'all' | 'completed'>('today');
  const [filterArea, setFilterArea] = useState<string>('all');

  const todayStr = new Date().toISOString().split('T')[0];

  const topThree = tasks.filter(t => t.isTopThree);

  // Filter tasks based on view & area
  const filteredTasks = tasks.filter(t => {
    // Area filter
    if (filterArea !== 'all' && t.area !== filterArea) return false;

    // View filter
    if (filterView === 'today') {
      return t.dueDate === todayStr || t.status === 'in_progress';
    } else if (filterView === 'this_week') {
      return true;
    } else if (filterView === 'completed') {
      return t.status === 'completed';
    }
    return true;
  });

  const completedTodayCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2.5">
            <CheckSquare className="w-7 h-7 text-indigo-400" />
            <span>Tasks & Daily Habits</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Focus on your top 3 daily priorities, execute work tasks, and maintain non-negotiable routines.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 flex items-center space-x-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* FEATURED: Today's Top 3 Priorities */}
      <div className="glass-panel p-6 rounded-3xl border border-indigo-500/25 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/30">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-slate-100">☀️ Today's Top 3 Priorities</h2>
          </div>
          <span className="text-xs text-indigo-300 font-semibold">
            {topThree.filter(t => t.status === 'completed').length} of {topThree.length} Completed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4">
          {topThree.map((t, idx) => (
            <div
              key={t.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                t.status === 'completed'
                  ? 'bg-slate-950/70 border-slate-800/60 opacity-60'
                  : 'bg-slate-900/90 border-slate-800 hover:border-indigo-500/50 shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold text-[10px]">
                    Priority #{idx + 1}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                    {t.area}
                  </span>
                </div>
                <h3 className={`text-sm font-bold ${t.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                  {t.title}
                </h3>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px] flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>~{t.estimatedMinutes}m</span>
                </span>
                <button
                  onClick={() => toggleTask(t.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors ${
                    t.status === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                  }`}
                >
                  {t.status === 'completed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                  <span>{t.status === 'completed' ? 'Done' : 'Mark Done'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Habits Streaks Grid */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-slate-100">Daily Habit Execution Streaks</h2>
          </div>
          <span className="text-xs text-slate-400">Click card to mark complete today</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {habits.map((h) => (
            <div
              key={h.id}
              onClick={() => toggleHabitToday(h.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                h.completedToday
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold text-slate-200 line-clamp-2">
                  {h.title}
                </span>
                {h.completedToday ? (
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 ml-1" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-500 shrink-0 ml-1" />
                )}
              </div>
              <div className="mt-3 flex items-center space-x-1.5 text-xs">
                <Flame className={`w-4 h-4 ${h.completedToday ? 'text-amber-400 fill-amber-400' : 'text-slate-500'}`} />
                <span className="font-bold text-slate-100">{h.streak} Day Streak</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Filters & Task List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          {/* View Filter */}
          <div className="flex space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setFilterView('today')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterView === 'today' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setFilterView('this_week')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterView === 'this_week' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              This Week ({tasks.length})
            </button>
            <button
              onClick={() => setFilterView('completed')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterView === 'completed' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Completed ({tasks.filter(t => t.status === 'completed').length})
            </button>
          </div>

          {/* Area Filter */}
          <div className="flex items-center space-x-1 text-xs">
            {['all', 'Work', 'Learning', 'Finance', 'Personal'].map(area => (
              <button
                key={area}
                onClick={() => setFilterArea(area)}
                className={`px-2.5 py-1 rounded-lg capitalize text-xs ${
                  filterArea === area ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        {/* Task Cards List */}
        <div className="space-y-2.5">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs rounded-2xl glass-panel">
              No tasks found in this view.
            </div>
          ) : (
            filteredTasks.map((t) => (
              <div
                key={t.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                  t.status === 'completed'
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                    : 'glass-panel border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0 pr-3">
                  <button
                    onClick={() => toggleTask(t.id)}
                    className="text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
                  >
                    {t.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                  <div className="min-w-0">
                    <span className={`text-xs sm:text-sm font-semibold truncate block ${t.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                      {t.title}
                    </span>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-medium">
                        {t.area}
                      </span>
                      <span>Due: {t.dueDate}</span>
                      <span>~{t.estimatedMinutes}m</span>
                      <span className={`capitalize font-semibold ${t.priority === 'high' ? 'text-rose-400' : 'text-amber-400'}`}>
                        {t.priority}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    onClick={() => toggleTopThree(t.id)}
                    title={t.isTopThree ? 'Remove from Top 3' : 'Mark as Top 3 Priority'}
                    className={`p-1.5 rounded-lg transition-colors ${
                      t.isTopThree ? 'text-amber-400 bg-amber-500/10' : 'text-slate-500 hover:text-amber-400'
                    }`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                  <button
                    onClick={() => deleteTask(t.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <QuickAddModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultType="task"
      />
    </div>
  );
};
