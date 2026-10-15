import React, { useState } from 'react';
import {
  CheckCircle2,
  Flame,
  Moon,
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
  Dumbbell,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  IndianRupee,
  BrainCircuit,
  Award
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
import { getLiveDateString, getLiveFormattedDate } from '../utils/date-utils';

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
    triggerConfetti
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
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* 1. TODAY'S SUMMARY ROW (Matching Reference Exact Layout) */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center space-x-2.5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Today's Summary
            </h2>
            <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200/80 text-[11px] font-medium text-slate-600">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>
                {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
          <span className="text-emerald-600 text-xs font-semibold flex items-center space-x-1 self-start sm:self-auto">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>On Track</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Card 1: Exercises Completed */}
          <div
            onClick={() => setActiveTab('fitness')}
            className="card-white card-white-hover p-4 cursor-pointer relative flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {weeklyWorkoutsCount} / 3
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                Workouts completed
              </p>
            </div>
            <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, (weeklyWorkoutsCount / 3) * 100)}%` }}
              />
            </div>
          </div>

          {/* Card 2: Safe Daily Spend */}
          <div
            onClick={() => setActiveTab('finance')}
            className="card-white card-white-hover p-4 cursor-pointer relative flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mb-3">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                ₹{todaySpent}
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                Daily spend (of ₹{safeDailySpendCap})
              </p>
            </div>
            <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, (todaySpent / safeDailySpendCap) * 100)}%` }}
              />
            </div>
          </div>

          {/* Card 3: AI/ML Practice */}
          <div
            onClick={() => setActiveTab('career')}
            className="card-white card-white-hover p-4 cursor-pointer relative flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center mb-3">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {skills.reduce((acc, s) => acc + s.practiceHours, 0)} hrs
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                AI/ML practice logged
              </p>
            </div>
            <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, skills.reduce((acc, s) => acc + s.practiceHours, 0) * 10)}%` }}
              />
            </div>
          </div>

          {/* Card 4: 3 Loans Due */}
          <div
            onClick={() => setActiveTab('finance')}
            className="card-white card-white-hover p-4 cursor-pointer relative flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-3">
              <IndianRupee className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                ₹{(outstandingPrincipal / 100000).toFixed(2)} L
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                3 Loans total balance
              </p>
            </div>
            <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all"
                style={{ width: `${firstLakhProgress}%` }}
              />
            </div>
          </div>

          {/* Card 5: Hydration Goal */}
          <div
            onClick={() => setActiveTab('fitness')}
            className="card-white card-white-hover p-4 cursor-pointer relative flex flex-col justify-between col-span-2 sm:col-span-1"
          >
            <div className="w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-600 flex items-center justify-center mb-3">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                2.5 L
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                Water goal (57kg target)
              </p>
            </div>
            <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-500 h-full rounded-full w-3/4 transition-all" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN 2-COLUMN SPLIT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card A: Weekly Workout / Habit Planner */}
          <div className="card-white p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Weekly Workout & Execution Planner
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('review')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1 transition-colors"
              >
                <span>View full plan</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 7 Day Schedule Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {/* Mon */}
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2">
                <div>
                  <p className="text-[11px] font-bold text-slate-700">Mon</p>
                  <p className="text-[10px] text-slate-400">12 Oct</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-900 truncate">Strength</p>
                  <p className="text-[10px] text-slate-500">20 min</p>
                </div>
                <div className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-bold">
                  <span>✓ 100%</span>
                </div>
              </div>

              {/* Tue (Today) */}
              <div className="p-3 rounded-xl bg-blue-50/70 border-2 border-blue-500/50 space-y-2 relative shadow-sm">
                <span className="absolute -top-1.5 right-2 px-1 rounded bg-blue-600 text-[8px] font-bold text-white uppercase">
                  Today
                </span>
                <div>
                  <p className="text-[11px] font-bold text-blue-900">Tue</p>
                  <p className="text-[10px] text-blue-600 font-medium">13 Oct</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-900 truncate">AI Practice</p>
                  <p className="text-[10px] text-slate-500">25 min</p>
                </div>
                <div className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[9px] font-bold">
                  <span>○ 50%</span>
                </div>
              </div>

              {/* Wed */}
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2">
                <div>
                  <p className="text-[11px] font-bold text-slate-700">Wed</p>
                  <p className="text-[10px] text-slate-400">14 Oct</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-900 truncate">Walk + Core</p>
                  <p className="text-[10px] text-slate-500">20 min</p>
                </div>
                <div className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-medium">
                  <span>○ Pending</span>
                </div>
              </div>

              {/* Thu */}
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2">
                <div>
                  <p className="text-[11px] font-bold text-slate-700">Thu</p>
                  <p className="text-[10px] text-slate-400">15 Oct</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-900 truncate">Ethiroli Dev</p>
                  <p className="text-[10px] text-slate-500">30 min</p>
                </div>
                <div className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-medium">
                  <span>○ Pending</span>
                </div>
              </div>

              {/* Fri */}
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2">
                <div>
                  <p className="text-[11px] font-bold text-slate-700">Fri</p>
                  <p className="text-[10px] text-slate-400">16 Oct</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-900 truncate">Strength</p>
                  <p className="text-[10px] text-slate-500">20 min</p>
                </div>
                <div className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-medium">
                  <span>○ Pending</span>
                </div>
              </div>

              {/* Sat */}
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2">
                <div>
                  <p className="text-[11px] font-bold text-slate-700">Sat</p>
                  <p className="text-[10px] text-slate-400">17 Oct</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-900 truncate">ML Project</p>
                  <p className="text-[10px] text-slate-500">45 min</p>
                </div>
                <div className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-medium">
                  <span>○ Pending</span>
                </div>
              </div>

              {/* Sun */}
              <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 space-y-2">
                <div>
                  <p className="text-[11px] font-bold text-amber-900">Sun</p>
                  <p className="text-[10px] text-amber-600">18 Oct</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-900 truncate">Review & Sync</p>
                  <p className="text-[10px] text-slate-500">Weekly Habit</p>
                </div>
                <div className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[9px] font-semibold">
                  <span>📅 Habit</span>
                </div>
              </div>
            </div>

            {/* DUAL SECTION: Bar Chart + Weekly Completion Donut */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 pt-3 border-t border-slate-100">
              {/* Bar Chart (8 cols) */}
              <div className="sm:col-span-8 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Weekly Movement Minutes</span>
                  <div className="flex items-center space-x-3 text-[10px]">
                    <span className="flex items-center space-x-1 text-slate-400">
                      <span className="w-2 h-2 rounded bg-blue-200" />
                      <span>Planned</span>
                    </span>
                    <span className="flex items-center space-x-1 text-slate-700 font-medium">
                      <span className="w-2 h-2 rounded bg-blue-600" />
                      <span>Completed</span>
                    </span>
                  </div>
                </div>

                <div className="h-36 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyMovementData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                      <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0F172A',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '11px'
                        }}
                      />
                      <Bar dataKey="planned" fill="#BFDBFE" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="completed" fill="#2563EB" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Completion Donut Indicator (4 cols) */}
              <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <span className="text-xs font-bold text-slate-700 mb-2">Weekly Completion</span>
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-200"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#2563EB]"
                      strokeDasharray="65, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-slate-900">65%</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-2">
                  {weeklyWorkoutsCount} / 3 workouts done
                </p>
                <p className="text-[10px] text-slate-400">
                  (Safe spend on track)
                </p>
              </div>
            </div>
          </div>

          {/* Card B & C: Dual Split Cards (Health Metrics & Recent Activity) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Health Metrics */}
            <div className="card-white p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <h3 className="text-sm font-bold text-slate-900">Health & Fitness</h3>
                </div>
                <button
                  onClick={() => setActiveTab('fitness')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                >
                  <span>View details</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-medium">Weight</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">{fitnessProfile.currentWeight} kg</p>
                  <span className="text-[9px] text-emerald-600 font-semibold">Target 58-60kg</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-medium">Height</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">{fitnessProfile.height} cm</p>
                  <span className="text-[9px] text-blue-600 font-semibold">BMI 22.3</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-medium">Workouts</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">{weeklyWorkoutsCount} / 3</p>
                  <span className="text-[9px] text-emerald-600 font-semibold">Consistent</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-1">
                <div>
                  <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                    <span>Energy</span> <span className="font-bold text-slate-800">4 / 5</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full w-4/5" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                    <span>Mood</span> <span className="font-bold text-slate-800">5 / 5</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full w-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                    <span>Hydration</span> <span className="font-bold text-slate-800">2.5 L</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full rounded-full w-3/4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card-white p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
                </div>
                <button
                  onClick={() => setActiveTab('finance')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                >
                  <span>View all</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      3 Separate Loans System Active
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Loan 1 (₹1L) · Loan 2 (₹1L) · Loan 3 (₹40k)
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <BrainCircuit className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      PyTorch & Machine Learning Practice
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Roadmap module in progress
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Flame className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      Safe Daily Spend Gauge: ₹600/day
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Leak Detective active on expenses
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 1: Current Goals (Matching Reference Right Sidebar) */}
          <div className="card-white p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Current Goals</h3>
              </div>
              <button
                onClick={() => setActiveTab('finance')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <span>View all</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Goal Item 1 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">Weekly Exercise Sessions</span>
                <span className="font-bold text-emerald-600">{weeklyWorkoutsCount} / 3 (this week)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (weeklyWorkoutsCount / 3) * 100)}%` }}
                />
              </div>
            </div>

            {/* Goal Item 2 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">Safe Daily Spend Cap</span>
                <span className="font-bold text-blue-600">₹{todaySpent} / ₹600 (today)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (todaySpent / safeDailySpendCap) * 100)}%` }}
                />
              </div>
            </div>

            {/* Goal Item 3: Loan 1 Drop Rule */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">Loan 1 Payoff (Save ₹2k EMI)</span>
                <span className="font-bold text-indigo-600">{firstLakhProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all"
                  style={{ width: `${firstLakhProgress}%` }}
                />
              </div>
            </div>

            {/* Goal Item 4: Hydration */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">Hydration (57kg target)</span>
                <span className="font-bold text-cyan-600">2.5 L (daily)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full w-4/5" />
              </div>
            </div>
          </div>

          {/* Card 2: Upcoming Reminders (Interactive Toggle Switches) */}
          <div className="card-white p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Upcoming Reminders</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Daily Alert</span>
            </div>

            <div className="space-y-3">
              {reminders.map((rem) => (
                <div key={rem.id} className="flex items-center justify-between py-1">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-slate-800">{rem.label}</p>
                    <p className="text-[10px] text-slate-400">{rem.time}</p>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => toggleReminder(rem.id)}
                    className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 ${
                      rem.active ? 'bg-blue-600 justify-end' : 'bg-slate-200 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Weekly Insights (Matching Reference Lightbulb Card) */}
          <div className="card-white p-5 space-y-3.5 bg-gradient-to-b from-amber-50/40 via-white to-white border-amber-200/50">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                <Lightbulb className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Weekly Strategic Insights</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              You are maintaining clean real-time financial tracking with 3 separate loan balances.
            </p>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-start space-x-2 text-slate-700">
                <span className="text-blue-600 font-bold">🎯</span>
                <span><strong>Loan Strategy:</strong> Pay extra into Loan 1 first to drop ₹2,000 monthly commitment.</span>
              </div>
              <div className="flex items-start space-x-2 text-slate-700">
                <span className="text-emerald-600 font-bold">💸</span>
                <span><strong>Leak Detective:</strong> Stay under ₹600/day safe limit to protect month-end savings.</span>
              </div>
              <div className="flex items-start space-x-2 text-slate-700">
                <span className="text-purple-600 font-bold">🏃‍♂️</span>
                <span><strong>Health & Weight:</strong> 3 workouts/week ensures lean muscle gain from 57kg.</span>
              </div>
            </div>
          </div>
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
