import React, { useState } from 'react';
import {
  CheckCircle2,
  Flame,
  Droplets,
  Calendar,
  ArrowUpRight,
  TrendingUp,
  Target,
  Bell,
  Lightbulb,
  Heart,
  Activity,
  Plus,
  BrainCircuit,
  Layers,
  Coins,
  Wallet,
  Sparkles,
  Zap
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { useLifeOS } from '../context/LifeOSContext';
import { QuickAddModal } from '../components/QuickAddModal';
import { getLiveDateString } from '../utils/date-utils';
import { Card3D } from '../components/ui/Card3D';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { ScrollReveal } from '../components/ui/ScrollReveal';

export const DashboardPage: React.FC = () => {
  const {
    salary,
    outstandingPrincipal,
    loanAccounts,
    firstLakhProgress,
    skills,
    tasks,
    fitnessProfile,
    weeklyWorkoutsCount,
    transactions,
    setActiveTab,
    triggerConfetti,
    totalPortfolioValue,
    totalInvestmentReturnsPct,
    basicNeeds,
    totalBasicNeedsBudget,
    totalBasicNeedsPaid
  } = useLifeOS();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalDefault, setModalDefault] = useState<'expense' | 'loan' | 'task' | 'fitness' | 'learning' | 'idea'>('expense');

  // Reminders toggle state
  const [reminders, setReminders] = useState([
    { id: 'rem-1', label: 'Log daily expenses & leaks', time: 'Today · 10:00 PM', active: true },
    { id: 'rem-2', label: 'AI/ML PyTorch practice session', time: 'Tomorrow · 7:00 AM', active: true },
    { id: 'rem-3', label: 'Log daily health & workout', time: 'Every day · 9:00 PM', active: false },
    { id: 'rem-4', label: 'Sunday strategic weekly review', time: 'Sun · 8:00 PM', active: false },
  ]);

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  // Safe daily spend calculations
  const safeDailySpendCap = 600; // ₹600 safe daily spend limit
  const todayStr = getLiveDateString();
  const todayTransactions = transactions.filter(t => t.date === todayStr && t.type === 'expense');
  const todaySpent = todayTransactions.reduce((acc, t) => acc + t.amount, 0);

  // Weekly movement / activity chart data
  const weeklyMovementData = [
    { day: 'Mon', planned: 20, completed: 20 },
    { day: 'Tue', planned: 20, completed: 15 },
    { day: 'Wed', planned: 15, completed: 15 },
    { day: 'Thu', planned: 10, completed: 0 },
    { day: 'Fri', planned: 20, completed: 0 },
    { day: 'Sat', planned: 20, completed: 0 },
    { day: 'Sun', planned: 0, completed: 0 },
  ];

  const openQuickAdd = (type: 'expense' | 'loan' | 'task' | 'fitness' | 'learning' | 'idea') => {
    setModalDefault(type);
    setModalOpen(true);
  };

  return (
    <div className="space-y-7 pb-14 perspective-1000">
      {/* 1. TODAY'S SUMMARY HEADER & 3D INTERACTIVE CARDS */}
      <section className="space-y-4">
        <ScrollReveal animation="fade-up" delay={0}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
                  <Zap className="w-5 h-5 text-amber-300" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center space-x-2.5">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Command Dashboard
                  </h2>
                  <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] font-semibold text-slate-300 shadow-inner">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>
                      {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  3D Telemetry, live automated tracking & strategic momentum
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 self-start sm:self-auto">
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold flex items-center space-x-1.5 shadow-sm">
                <TrendingUp className="w-4 h-4" />
                <span>Status: Optimal Pace</span>
              </span>
              <button
                onClick={() => openQuickAdd('expense')}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-indigo-600/30 transition-transform active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Log Record</span>
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* 6 Quick KPI 3D Tilt Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* Card 1: Exercises Completed */}
          <ScrollReveal animation="fade-up" delay={50}>
            <Card3D
              glowColor="emerald"
              onClick={() => setActiveTab('fitness')}
              className="h-full"
            >
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl h-full flex flex-col justify-between hover:border-emerald-500/40 transition-colors group">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    WEEKLY
                  </span>
                </div>
                <div>
                  <div className="text-2xl font-black text-white tracking-tight flex items-baseline space-x-1">
                    <AnimatedCounter value={weeklyWorkoutsCount} />
                    <span className="text-slate-400 text-base font-bold">/ 3</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium truncate mt-1">
                    Workouts Done
                  </p>
                </div>
                <div className="mt-3 w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    style={{ width: `${Math.min(100, (weeklyWorkoutsCount / 3) * 100)}%` }}
                  />
                </div>
              </div>
            </Card3D>
          </ScrollReveal>

          {/* Card 2: Safe Daily Spend */}
          <ScrollReveal animation="fade-up" delay={100}>
            <Card3D
              glowColor="amber"
              onClick={() => setActiveTab('finance')}
              className="h-full"
            >
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl h-full flex flex-col justify-between hover:border-amber-500/40 transition-colors group">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                    <Flame className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-extrabold text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                    TODAY
                  </span>
                </div>
                <div>
                  <div className="text-2xl font-black text-white tracking-tight">
                    <AnimatedCounter value={todaySpent} prefix="₹" />
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium truncate mt-1">
                    Daily Spend (of ₹{safeDailySpendCap})
                  </p>
                </div>
                <div className="mt-3 w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      todaySpent > safeDailySpendCap
                        ? 'bg-gradient-to-r from-rose-500 to-red-600 shadow-[0_0_8px_rgba(244,63,94,0.5)]'
                        : 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                    }`}
                    style={{ width: `${Math.min(100, (todaySpent / safeDailySpendCap) * 100)}%` }}
                  />
                </div>
              </div>
            </Card3D>
          </ScrollReveal>

          {/* Card 3: AI/ML Practice */}
          <ScrollReveal animation="fade-up" delay={150}>
            <Card3D
              glowColor="indigo"
              onClick={() => setActiveTab('career')}
              className="h-full"
            >
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl h-full flex flex-col justify-between hover:border-blue-500/40 transition-colors group">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                    <BrainCircuit className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-extrabold text-blue-400 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                    AI/ML
                  </span>
                </div>
                <div>
                  <div className="text-2xl font-black text-white tracking-tight flex items-baseline space-x-1">
                    <AnimatedCounter value={skills.reduce((acc, s) => acc + s.practiceHours, 0)} />
                    <span className="text-slate-400 text-base font-bold">hrs</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium truncate mt-1">
                    Practice Logged
                  </p>
                </div>
                <div className="mt-3 w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                    style={{ width: `${Math.min(100, skills.reduce((acc, s) => acc + s.practiceHours, 0) * 10)}%` }}
                  />
                </div>
              </div>
            </Card3D>
          </ScrollReveal>

          {/* Card 4: 3 Loans Due */}
          <ScrollReveal animation="fade-up" delay={200}>
            <Card3D
              glowColor="rose"
              onClick={() => setActiveTab('loans')}
              className="h-full"
            >
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl h-full flex flex-col justify-between hover:border-rose-500/40 transition-colors group">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-extrabold text-rose-400 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20">
                    DEBT
                  </span>
                </div>
                <div>
                  <div className="text-2xl font-black text-white tracking-tight flex items-baseline space-x-1">
                    <AnimatedCounter value={outstandingPrincipal / 100000} prefix="₹" decimals={2} />
                    <span className="text-slate-400 text-base font-bold">L</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium truncate mt-1">
                    3 Loans (Drop L1)
                  </p>
                </div>
                <div className="mt-3 w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-rose-500 to-emerald-400 h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
                    style={{ width: `${firstLakhProgress}%` }}
                  />
                </div>
              </div>
            </Card3D>
          </ScrollReveal>

          {/* Card 5: Hydration Goal */}
          <ScrollReveal animation="fade-up" delay={250}>
            <Card3D
              glowColor="cyan"
              onClick={() => setActiveTab('fitness')}
              className="h-full"
            >
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl h-full flex flex-col justify-between hover:border-cyan-500/40 transition-colors group">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-extrabold text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                    VITAL
                  </span>
                </div>
                <div>
                  <div className="text-2xl font-black text-white tracking-tight flex items-baseline space-x-1">
                    <AnimatedCounter value={2.5} decimals={1} />
                    <span className="text-slate-400 text-base font-bold">L</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium truncate mt-1">
                    Water Goal (57kg)
                  </p>
                </div>
                <div className="mt-3 w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-400 h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(6,182,212,0.5)]"
                    style={{ width: '75%' }}
                  />
                </div>
              </div>
            </Card3D>
          </ScrollReveal>

          {/* Card 6: Wealth & Investments */}
          <ScrollReveal animation="fade-up" delay={300}>
            <Card3D
              glowColor="amber"
              onClick={() => setActiveTab('investments')}
              className="h-full"
            >
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl h-full flex flex-col justify-between hover:border-yellow-500/40 transition-colors group">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                    <Coins className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    +{totalInvestmentReturnsPct.toFixed(1)}%
                  </span>
                </div>
                <div>
                  <div className="text-2xl font-black text-white tracking-tight">
                    <AnimatedCounter value={Math.round(totalPortfolioValue)} prefix="₹" />
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium truncate mt-1">
                    Wealth Portfolio
                  </p>
                </div>
                <div className="mt-3 w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-400 h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(234,179,8,0.5)]"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </Card3D>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. MAIN 2-COLUMN SPLIT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* LEFT COLUMN (8 COLS) */}
        <div className="lg:col-span-8 space-y-7">
          {/* Card A: Weekly Workout / Habit Planner (ScrollTriggered & 3D Depth) */}
          <ScrollReveal animation="fade-up" delay={200}>
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-2xl shadow-2xl relative overflow-hidden group hover:border-slate-700/80 transition-all duration-300">
              {/* Subtle ambient light gradient in background */}
              <div className="absolute -top-24 -left-24 w-60 h-60 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-60 h-60 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between mb-5 relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-inner">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      Weekly Workout & Execution Planner
                    </h3>
                    <p className="text-xs text-slate-400">
                      Cadence tracking across daily movement, ML learning & habits
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('review')}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1.5 transition-colors px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20"
                >
                  <span>Full Plan</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 7 Day Schedule Cards with 3D Hover Lift */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 relative z-10">
                {/* Mon */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 hover:-translate-y-1 transition-all duration-200 space-y-2">
                  <div>
                    <p className="text-[11px] font-bold text-slate-300">Mon</p>
                    <p className="text-[10px] text-slate-500">12 Oct</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white truncate">Strength</p>
                    <p className="text-[10px] text-slate-400">20 min</p>
                  </div>
                  <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    <span>✓ 100%</span>
                  </div>
                </div>

                {/* Tue (Today) - Animated glowing border */}
                <div className="p-3.5 rounded-2xl bg-indigo-950/40 border-2 border-indigo-500/60 shadow-[0_0_20px_rgba(99,102,241,0.25)] hover:-translate-y-1 transition-all duration-200 space-y-2 relative">
                  <span className="absolute -top-2 right-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-[8px] font-black text-white uppercase tracking-wider shadow-sm">
                    TODAY
                  </span>
                  <div>
                    <p className="text-[11px] font-bold text-indigo-300">Tue</p>
                    <p className="text-[10px] text-indigo-400/80 font-medium">13 Oct</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white truncate">AI Practice</p>
                    <p className="text-[10px] text-slate-400">25 min</p>
                  </div>
                  <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold">
                    <span>○ 50%</span>
                  </div>
                </div>

                {/* Wed */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 hover:-translate-y-1 transition-all duration-200 space-y-2">
                  <div>
                    <p className="text-[11px] font-bold text-slate-300">Wed</p>
                    <p className="text-[10px] text-slate-500">14 Oct</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white truncate">Walk + Core</p>
                    <p className="text-[10px] text-slate-400">20 min</p>
                  </div>
                  <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 text-[10px] font-medium">
                    <span>○ Pending</span>
                  </div>
                </div>

                {/* Thu */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 hover:-translate-y-1 transition-all duration-200 space-y-2">
                  <div>
                    <p className="text-[11px] font-bold text-slate-300">Thu</p>
                    <p className="text-[10px] text-slate-500">15 Oct</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white truncate">Ethiroli Dev</p>
                    <p className="text-[10px] text-slate-400">30 min</p>
                  </div>
                  <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 text-[10px] font-medium">
                    <span>○ Pending</span>
                  </div>
                </div>

                {/* Fri */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 hover:-translate-y-1 transition-all duration-200 space-y-2">
                  <div>
                    <p className="text-[11px] font-bold text-slate-300">Fri</p>
                    <p className="text-[10px] text-slate-500">16 Oct</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white truncate">Strength</p>
                    <p className="text-[10px] text-slate-400">20 min</p>
                  </div>
                  <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 text-[10px] font-medium">
                    <span>○ Pending</span>
                  </div>
                </div>

                {/* Sat */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 hover:-translate-y-1 transition-all duration-200 space-y-2">
                  <div>
                    <p className="text-[11px] font-bold text-slate-300">Sat</p>
                    <p className="text-[10px] text-slate-500">17 Oct</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white truncate">ML Project</p>
                    <p className="text-[10px] text-slate-400">45 min</p>
                  </div>
                  <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 text-[10px] font-medium">
                    <span>○ Pending</span>
                  </div>
                </div>

                {/* Sun */}
                <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 hover:border-amber-400/50 hover:-translate-y-1 transition-all duration-200 space-y-2">
                  <div>
                    <p className="text-[11px] font-bold text-amber-300">Sun</p>
                    <p className="text-[10px] text-amber-400/70">18 Oct</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white truncate">Review & Sync</p>
                    <p className="text-[10px] text-slate-400">Weekly Habit</p>
                  </div>
                  <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-semibold">
                    <span>📅 Habit</span>
                  </div>
                </div>
              </div>

              {/* DUAL SECTION: Bar Chart + Weekly Completion Donut */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-6 mt-6 border-t border-slate-800/80 relative z-10">
                {/* Bar Chart (8 cols) */}
                <div className="sm:col-span-8 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">
                      Weekly Movement Minutes
                    </span>
                    <div className="flex items-center space-x-4 text-[11px]">
                      <span className="flex items-center space-x-1.5 text-slate-400">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-400/30 border border-blue-400/50" />
                        <span>Planned</span>
                      </span>
                      <span className="flex items-center space-x-1.5 text-slate-200 font-semibold">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.6)]" />
                        <span>Completed</span>
                      </span>
                    </div>
                  </div>

                  <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyMovementData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                        <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0F172A',
                            border: '1px solid #334155',
                            borderRadius: '12px',
                            color: '#fff',
                            fontSize: '11px',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                          }}
                        />
                        <Bar dataKey="planned" fill="#334155" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="completed" fill="#6366F1" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Completion Donut Indicator (4 cols) with 3D Depth */}
                <div className="sm:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center relative overflow-hidden group hover:border-slate-700 transition-colors">
                  <span className="text-xs font-bold text-slate-300 mb-2">Weekly Completion</span>
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-800"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-indigo-500 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                        strokeDasharray="65, 100"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-white tracking-tight">
                        <AnimatedCounter value={65} suffix="%" />
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-300 font-semibold mt-2">
                    {weeklyWorkoutsCount} / 3 workouts done
                  </p>
                  <p className="text-[10px] text-emerald-400 font-medium">
                    (Safe spend on track)
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Card B & C: Dual Split Cards (Health Metrics & Recent Activity) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Health Metrics */}
            <ScrollReveal animation="fade-up" delay={250}>
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-2xl shadow-xl space-y-4 hover:border-slate-700/80 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                      <Heart className="w-4 h-4 fill-rose-500/30 text-rose-400" />
                    </div>
                    <h3 className="text-sm font-bold text-white">Health & Fitness</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('fitness')}
                    className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center space-x-1 transition-colors"
                  >
                    <span>Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center">
                    <p className="text-[10px] text-slate-400 font-medium">Weight</p>
                    <p className="text-base font-black text-white mt-0.5">{fitnessProfile.currentWeight} kg</p>
                    <span className="text-[9px] text-emerald-400 font-bold">Goal 60kg</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center">
                    <p className="text-[10px] text-slate-400 font-medium">Height</p>
                    <p className="text-base font-black text-white mt-0.5">{fitnessProfile.height} cm</p>
                    <span className="text-[9px] text-blue-400 font-bold">BMI 22.3</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center">
                    <p className="text-[10px] text-slate-400 font-medium">Workouts</p>
                    <p className="text-base font-black text-white mt-0.5">{weeklyWorkoutsCount} / 3</p>
                    <span className="text-[9px] text-emerald-400 font-bold">Consistent</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-800/70">
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>Energy</span> <span className="font-bold text-white">4 / 5</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full w-4/5 shadow-[0_0_6px_rgba(59,130,246,0.5)]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>Mood</span> <span className="font-bold text-white">5 / 5</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full w-full shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>Hydration</span> <span className="font-bold text-white">2.5 L</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-400 h-full rounded-full w-3/4 shadow-[0_0_6px_rgba(6,182,212,0.5)]" />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Recent Activity */}
            <ScrollReveal animation="fade-up" delay={300}>
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-2xl shadow-xl space-y-4 hover:border-slate-700/80 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                      <Activity className="w-4 h-4 text-blue-400" />
                    </div>
                    <h3 className="text-sm font-bold text-white">Recent Activity & Feeds</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('finance')}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1 transition-colors"
                  >
                    <span>View all</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div
                    onClick={() => setActiveTab('loans')}
                    className="flex items-center space-x-3 p-2.5 rounded-2xl bg-slate-950/40 hover:bg-slate-800/50 border border-slate-800/60 hover:border-slate-700 transition-all cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Wallet className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                        Monthly Basic Needs: ₹{totalBasicNeedsPaid.toLocaleString('en-IN')} / ₹{totalBasicNeedsBudget.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        4-Phase Pay Cycle active • Living requirements on track
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveTab('investments')}
                    className="flex items-center space-x-3 p-2.5 rounded-2xl bg-slate-950/40 hover:bg-slate-800/50 border border-slate-800/60 hover:border-slate-700 transition-all cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Coins className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                        Wealth Portfolio: ₹{Math.round(totalPortfolioValue).toLocaleString('en-IN')}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Digi Gold, GRT Gold/Silver Shett & Groww Stocks
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveTab('loans')}
                    className="flex items-center space-x-3 p-2.5 rounded-2xl bg-slate-950/40 hover:bg-slate-800/50 border border-slate-800/60 hover:border-slate-700 transition-all cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                        3 Separate Loans System Active
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Loan 1 (₹1L) · Loan 2 (₹1L) · Loan 3 (₹40k)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* RIGHT COLUMN (4 COLS) */}
        <div className="lg:col-span-4 space-y-7">
          {/* Card 1: Current Goals */}
          <ScrollReveal animation="fade-left" delay={200}>
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-2xl shadow-xl space-y-5 hover:border-slate-700/80 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Target className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Current Strategic Goals</h3>
                </div>
                <button
                  onClick={() => setActiveTab('finance')}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 transition-colors"
                >
                  <span>View all</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Goal Item 1 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Weekly Exercise Sessions</span>
                  <span className="font-bold text-emerald-400">{weeklyWorkoutsCount} / 3 done</span>
                </div>
                <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    style={{ width: `${Math.min(100, (weeklyWorkoutsCount / 3) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Goal Item 2 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Safe Daily Spend Cap</span>
                  <span className="font-bold text-blue-400">₹{todaySpent} / ₹600 (today)</span>
                </div>
                <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                    style={{ width: `${Math.min(100, (todaySpent / safeDailySpendCap) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Goal Item 3: Loan 1 Drop Rule */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Loan 1 Payoff (Save ₹2k EMI)</span>
                  <span className="font-bold text-rose-400">{firstLakhProgress}%</span>
                </div>
                <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-rose-500 to-indigo-500 h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
                    style={{ width: `${firstLakhProgress}%` }}
                  />
                </div>
              </div>

              {/* Goal Item 4: Hydration */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Hydration (57kg target)</span>
                  <span className="font-bold text-cyan-400">2.5 L daily</span>
                </div>
                <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-400 h-full rounded-full w-3/4 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: Upcoming Reminders (Interactive Toggle Switches) */}
          <ScrollReveal animation="fade-left" delay={300}>
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-2xl shadow-xl space-y-4 hover:border-slate-700/80 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
                    <Bell className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Strategic Reminders</h3>
                </div>
                <span className="text-[10px] text-violet-400 font-bold px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20">
                  REAL-TIME
                </span>
              </div>

              <div className="space-y-3">
                {reminders.map((rem) => (
                  <div key={rem.id} className="flex items-center justify-between py-1.5 px-3 rounded-2xl bg-slate-950/40 border border-slate-800/60 hover:border-slate-700 transition-colors">
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-slate-200">{rem.label}</p>
                      <p className="text-[10px] text-slate-400">{rem.time}</p>
                    </div>

                    {/* Toggle Switch */}
                    <button
                      onClick={() => toggleReminder(rem.id)}
                      className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none ${
                        rem.active
                          ? 'bg-gradient-to-r from-indigo-500 to-violet-600 justify-end shadow-[0_0_10px_rgba(99,102,241,0.5)]'
                          : 'bg-slate-800 justify-start'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Card 3: Weekly Insights (Matching Reference Lightbulb Card with Cyber Luxe) */}
          <ScrollReveal animation="fade-left" delay={400}>
            <div className="p-6 rounded-3xl bg-gradient-to-b from-amber-500/10 via-slate-900/90 to-slate-900/90 border border-amber-500/30 backdrop-blur-2xl shadow-xl space-y-4 relative overflow-hidden group">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 flex items-center justify-center shadow-inner">
                  <Lightbulb className="w-4 h-4 fill-amber-400 text-amber-300" />
                </div>
                <h3 className="text-sm font-bold text-amber-200">Strategic Intelligence</h3>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                You are maintaining clean real-time financial tracking with 3 separate loan balances.
              </p>

              <div className="space-y-2.5 pt-1 text-xs">
                <div className="flex items-start space-x-2.5 text-slate-300 p-2 rounded-xl bg-slate-950/40 border border-slate-800/60">
                  <span className="text-amber-400 font-bold shrink-0">🎯</span>
                  <span><strong className="text-white">Loan Strategy:</strong> Pay extra into Loan 1 first to drop ₹2,000 monthly commitment.</span>
                </div>
                <div className="flex items-start space-x-2.5 text-slate-300 p-2 rounded-xl bg-slate-950/40 border border-slate-800/60">
                  <span className="text-emerald-400 font-bold shrink-0">💸</span>
                  <span><strong className="text-white">Leak Detective:</strong> Stay under ₹600/day safe limit to protect month-end savings.</span>
                </div>
                <div className="flex items-start space-x-2.5 text-slate-300 p-2 rounded-xl bg-slate-950/40 border border-slate-800/60">
                  <span className="text-violet-400 font-bold shrink-0">🏃‍♂️</span>
                  <span><strong className="text-white">Health & Weight:</strong> 3 workouts/week ensures lean muscle gain from 57kg.</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Quick Add Modal */}
      {modalOpen && (
        <QuickAddModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          defaultType={modalDefault}
        />
      )}
    </div>
  );
};
