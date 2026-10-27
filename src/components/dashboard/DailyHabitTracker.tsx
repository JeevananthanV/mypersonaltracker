import React, { useState } from 'react';
import {
  Flame,
  Check,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Zap,
  Briefcase,
  Activity,
  IndianRupee,
  Sun,
  X
} from 'lucide-react';
import { useLifeOS } from '../../context/LifeOSContext';
import { Habit } from '../../types';
import { getLiveDateString } from '../../utils/date-utils';

interface DayColumn {
  dateStr: string;
  dayLabel: string;
  dateNumber: number;
  isToday: boolean;
  dayInitial: string;
}

export const DailyHabitTracker: React.FC = () => {
  const {
    habits,
    toggleHabitToday,
    toggleHabitDate,
    addHabit,
    deleteHabit,
    triggerConfetti
  } = useLifeOS();

  const [activeFilter, setActiveFilter] = useState<'all' | 'career' | 'health' | 'finance' | 'routine'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState<'career' | 'health' | 'finance' | 'routine'>('routine');

  // Compute the past 7 days (ending today)
  const today = new Date();
  const todayDateStr = getLiveDateString(today);

  const past7Days: DayColumn[] = Array.from({ length: 7 }, (_, i) => {
    const daysAgo = 6 - i; // 6 days ago -> today
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayInitial = dayName.charAt(0);
    const dateNumber = d.getDate();
    const isToday = dateStr === todayDateStr;

    return {
      dateStr,
      dayLabel: isToday ? 'Today' : dayName,
      dateNumber,
      isToday,
      dayInitial
    };
  });

  // Filtered habits
  const filteredHabits = habits.filter(h => {
    if (activeFilter === 'all') return true;
    return h.category === activeFilter;
  });

  // Summary Metrics
  const totalHabits = habits.length;
  const completedTodayCount = habits.filter(h => h.completedToday).length;
  const todayCompletionPct = totalHabits > 0 ? Math.round((completedTodayCount / totalHabits) * 100) : 0;
  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;
  const totalStreaksSum = habits.reduce((acc, h) => acc + h.streak, 0);

  const getCategoryTheme = (category: Habit['category']) => {
    switch (category) {
      case 'career':
        return {
          label: 'Career & AI/ML',
          icon: <Briefcase className="w-3.5 h-3.5 text-indigo-400" />,
          badgeClass: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
          dotActive: 'bg-indigo-500 text-white shadow-indigo-500/40'
        };
      case 'health':
        return {
          label: 'Health & Fitness',
          icon: <Activity className="w-3.5 h-3.5 text-emerald-400" />,
          badgeClass: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
          dotActive: 'bg-emerald-500 text-white shadow-emerald-500/40'
        };
      case 'finance':
        return {
          label: 'Finance Discipline',
          icon: <IndianRupee className="w-3.5 h-3.5 text-amber-400" />,
          badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          dotActive: 'bg-amber-500 text-slate-950 font-bold shadow-amber-500/40'
        };
      case 'routine':
      default:
        return {
          label: 'Core Routine',
          icon: <Sun className="w-3.5 h-3.5 text-cyan-400" />,
          badgeClass: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
          dotActive: 'bg-cyan-500 text-slate-950 font-bold shadow-cyan-500/40'
        };
    }
  };

  const handleToggleDay = (habitId: string, dateStr: string) => {
    if (dateStr === todayDateStr) {
      toggleHabitToday(habitId);
    } else if (toggleHabitDate) {
      toggleHabitDate(habitId, dateStr);
    }
  };

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;

    if (addHabit) {
      addHabit({
        title: newHabitTitle.trim(),
        category: newHabitCategory,
        streak: 0,
        completedToday: false,
        history: {}
      });
    }

    setNewHabitTitle('');
    setIsAddModalOpen(false);
  };

  const quickPresets = [
    { title: 'LeetCode 1 Problem Daily', category: 'career' as const },
    { title: '8,000 Daily Walking Steps', category: 'health' as const },
    { title: 'Review Daily Groww & Gold Price', category: 'finance' as const },
    { title: '30 Mins Deep PyTorch Reading', category: 'career' as const }
  ];

  return (
    <section className="p-6 rounded-2xl bg-[#0E1526] border border-slate-800 space-y-6">
      {/* 1. Header with Stats & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Flame className="w-4 h-4 fill-amber-400 animate-pulse" />
            </div>
            <h2 className="text-lg font-heading font-black text-white tracking-tight">
              Daily Habit Tracker & 7-Day Streaks
            </h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              7-Day Window
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Build compounding momentum across AI/ML studies, health, and financial discipline. Click any node to log completion.
          </p>
        </div>

        {/* Quick Highlights Bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Today's Completion Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <div className="text-xs">
              <span className="text-slate-400">Today: </span>
              <span className="font-mono font-bold text-emerald-400">
                {completedTodayCount}/{totalHabits}
              </span>
              <span className="text-[10px] text-slate-500 font-mono ml-1">
                ({todayCompletionPct}%)
              </span>
            </div>
          </div>

          {/* Max Streak Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            <div className="text-xs">
              <span className="text-amber-300/80">Best Streak: </span>
              <span className="font-mono font-bold text-amber-300">
                {maxStreak} Days
              </span>
            </div>
          </div>

          {/* Add Habit Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Habit</span>
          </button>
        </div>
      </div>

      {/* 2. Category Filters & Progress Visualizer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {(['all', 'career', 'health', 'finance', 'routine'] as const).map(cat => {
            const count = cat === 'all' ? habits.length : habits.filter(h => h.category === cat).length;
            const isActive = activeFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all capitalize flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-slate-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 7-Day Completion Bar */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">Today's Pace:</span>
          <div className="w-28 sm:w-36 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, todayCompletionPct)}%` }}
            />
          </div>
          <span className="text-[11px] font-mono text-emerald-400 font-semibold">{todayCompletionPct}%</span>
        </div>
      </div>

      {/* 3. The 7-Day Habit Matrix */}
      <div className="overflow-x-auto">
        <div className="min-w-[680px]">
          {/* Day Headers Row */}
          <div className="grid grid-cols-12 gap-2 pb-3 mb-2 border-b border-slate-800/60 text-xs text-slate-400 font-medium">
            <div className="col-span-5 pl-1 flex items-center gap-1.5">
              <span>Habit & Category</span>
            </div>
            <div className="col-span-5 grid grid-cols-7 gap-1.5 text-center">
              {past7Days.map((day) => (
                <div
                  key={day.dateStr}
                  className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors ${
                    day.isToday ? 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-bold' : ''
                  }`}
                >
                  <span className="text-[10px] uppercase font-mono tracking-wider">{day.dayLabel}</span>
                  <span className={`text-[11px] font-mono ${day.isToday ? 'text-indigo-200 font-black' : 'text-slate-500'}`}>
                    {day.dateNumber}
                  </span>
                </div>
              ))}
            </div>
            <div className="col-span-2 text-right pr-2 flex items-center justify-end gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Current Streak</span>
            </div>
          </div>

          {/* Habit Rows */}
          <div className="space-y-2.5">
            {filteredHabits.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                No habits found in this category. Click "+ Add Habit" to create one!
              </div>
            ) : (
              filteredHabits.map((habit) => {
                const theme = getCategoryTheme(habit.category);
                const isStreakActive = habit.streak > 0;
                const isCompletedToday = habit.completedToday;

                return (
                  <div
                    key={habit.id}
                    className={`grid grid-cols-12 gap-2 items-center p-3 rounded-xl border transition-all ${
                      isCompletedToday
                        ? 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                        : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    {/* Habit Info (Col 1-5) */}
                    <div className="col-span-5 flex items-center gap-3 pr-2">
                      <button
                        onClick={() => toggleHabitToday(habit.id)}
                        title={isCompletedToday ? 'Mark as not completed today' : 'Mark completed today!'}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all shrink-0 cursor-pointer ${
                          isCompletedToday
                            ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                            : 'border-slate-700 bg-slate-900 hover:border-emerald-500/50 text-slate-500'
                        }`}
                      >
                        {isCompletedToday ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Circle className="w-3.5 h-3.5" />}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border font-medium ${theme.badgeClass}`}>
                            {theme.icon}
                            <span>{habit.category}</span>
                          </span>
                          {habit.streak >= 7 && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                              ⭐ 7d Master
                            </span>
                          )}
                        </div>
                        <h4 className={`text-xs sm:text-sm font-semibold truncate ${
                          isCompletedToday ? 'text-slate-200' : 'text-slate-300'
                        }`}>
                          {habit.title}
                        </h4>
                      </div>
                    </div>

                    {/* 7-Day Check Bubbles (Col 6-10) */}
                    <div className="col-span-5 grid grid-cols-7 gap-1.5">
                      {past7Days.map((day) => {
                        const isDone = day.isToday
                          ? habit.completedToday
                          : Boolean(habit.history?.[day.dateStr]);

                        return (
                          <button
                            key={day.dateStr}
                            onClick={() => handleToggleDay(habit.id, day.dateStr)}
                            title={`${day.dateStr}: ${isDone ? 'Completed' : 'Not completed'}. Click to toggle.`}
                            className={`h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer relative group ${
                              day.isToday
                                ? isDone
                                  ? 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/20'
                                  : 'bg-indigo-500/10 border-2 border-dashed border-indigo-500/40 text-slate-500 hover:border-indigo-400'
                                : isDone
                                  ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25'
                                  : 'bg-slate-900/60 border border-slate-800/80 text-slate-600 hover:border-slate-700'
                            }`}
                          >
                            {isDone ? (
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-slate-500 transition-colors" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Streak Count & Action (Col 11-12) */}
                    <div className="col-span-2 flex items-center justify-end gap-2 pr-1">
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1">
                          <Flame
                            className={`w-4 h-4 ${
                              habit.streak > 0
                                ? 'text-amber-400 fill-amber-400 animate-bounce'
                                : 'text-slate-600'
                            }`}
                          />
                          <span className={`font-mono text-sm font-black tabular-nums ${
                            habit.streak > 0 ? 'text-amber-300' : 'text-slate-500'
                          }`}>
                            {habit.streak}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">d</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {habit.streak >= 7 ? 'On Fire 🔥' : habit.streak > 0 ? 'Active' : 'Unstarted'}
                        </span>
                      </div>

                      {/* Optional Delete Habit */}
                      {deleteHabit && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete habit "${habit.title}"?`)) {
                              deleteHabit(habit.id);
                            }
                          }}
                          title="Remove habit"
                          className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* 4. Quick Motivation Footer */}
      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Zap className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong className="text-slate-200">Consistency Rule:</strong> If today isn't done yet, your streak reflects completed consecutive days ending yesterday. Tap today's node anytime before sleep!
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-slate-500 font-mono text-[11px]">
            {totalStreaksSum} total collective streak days
          </span>
        </div>
      </div>

      {/* 5. Add Habit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#0E1526] border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Create Daily Habit</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateHabit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Habit Title
                </label>
                <input
                  type="text"
                  value={newHabitTitle}
                  onChange={(e) => setNewHabitTitle(e.target.value)}
                  placeholder="e.g. 45 Mins Deep Learning paper analysis"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Life Domain / Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['career', 'health', 'finance', 'routine'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewHabitCategory(cat)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold capitalize flex items-center justify-center gap-2 transition-all ${
                        newHabitCategory === cat
                          ? 'bg-indigo-600/30 border-indigo-500 text-white'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Presets */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                  Or select a suggested quick-add:
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {quickPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setNewHabitTitle(preset.title);
                        setNewHabitCategory(preset.category);
                      }}
                      className="p-2 rounded-lg bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800/80 text-left text-xs text-slate-300 hover:text-white transition-colors flex items-center justify-between"
                    >
                      <span>{preset.title}</span>
                      <span className="text-[10px] text-slate-500 uppercase">{preset.category}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newHabitTitle.trim()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  Create Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
