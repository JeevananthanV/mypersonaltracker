import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Plus,
  Flame,
  CheckCircle2,
  Circle,
  Heart,
  Moon,
  Scale,
  AlertCircle,
  TrendingUp,
  Dumbbell,
  Trash2,
  Calendar,
  Trophy,
  Medal,
  Star,
  ChartBar,
  CalendarDays,
  Settings,
  LogOut,
  RefreshCw,
  MessageCircle,
  Users,
  Loader2,
  Loader,
  AlertTriangle,
  Zap,
  Sparkles,
  GitBranch,
  Lock,
  Send,
  FileText,
  Folder,
  FolderOpen,
  Grid,
  Layout,
  LayoutDashboard,
  LayoutList,
  Droplets,
  Target,
  Clock
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { useLifeOS } from '../context/LifeOSContext';
import { QuickAddModal } from '../components/QuickAddModal';
import { Badge } from '../types';

export const FitnessPage: React.FC = () => {
  const {
    fitnessProfile,
    updateFitnessProfile,
    fitnessLogs,
    deleteFitnessLog,
    weeklyWorkoutsCount,
    bmi,
    triggerConfetti,
    // NEW: Badge system
    badges,
    achievements,
    earnedBadges,
    progressTracker,
    initializeBadgesAndAchievements,
    checkAndAwardBadges,
    updateAchievementProgress,
  } = useLifeOS();

  // Initialize badges and achievements when component mounts
  useEffect(() => {
    initializeBadgesAndAchievements();
  }, [initializeBadgesAndAchievements]);

  const [modalOpen, setModalOpen] = useState(false);

  // Daily fitness checklist state
  const [dailyChecklist, setDailyChecklist] = useState([
    { id: 'fc-1', label: '5-minute gentle warm-up & breathing', completed: true },
    { id: 'fc-2', label: 'Complete planned walk / light skipping session', completed: true },
    { id: 'fc-3', label: 'Cool down and full-body posture stretch', completed: false },
    { id: 'fc-4', label: 'Drink 2.5–3 Liters of water throughout day', completed: true },
    { id: 'fc-5', label: 'Record sleep hours and daily energy score', completed: true },
    { id: 'fc-6', label: 'Log today\'s entry into Fitness tracker', completed: false },
  ]);

  const toggleChecklistItem = (id: string) => {
    setDailyChecklist(prev => prev.map(item => {
      if (item.id === id) {
        const next = !item.completed;
        if (next) triggerConfetti();
        return { ...item, completed: next };
      }
      return item;
    }));
  };

  const completedChecklistCount = dailyChecklist.filter(i => i.completed).length;

  // Chart data for sleep and water trends
  const trendData = [...fitnessLogs].reverse().map(l => ({
    date: l.date.split('-').slice(1).join('/'),
    water: l.waterLiters,
    sleep: l.sleepHours,
    weight: l.weightKg
  }));

  // NEW: Badge display calculations
  const earnedBadgeNames = earnedBadges.map(b => b.name);
  const totalBadges = badges.length;
  const earnedBadgeCount = earnedBadges.length;
  const badgeProgress: Record<string, number> = {};
  
  badges.forEach(badge => {
    const earned = earnedBadges.some(e => e.id === badge.id);
    badgeProgress[badge.id] = earned ? 100 : 0;
  });

  // Achievement progress calculations
  const achievementProgress: Record<string, number> = {};
  achievements.forEach(achievement => {
    const percentage = achievement.maxProgress > 0 
      ? Math.round((achievement.currentProgress / achievement.maxProgress) * 100) 
      : 0;
    achievementProgress[achievement.id] = percentage;
  });

  // Confetti trigger for badges
  const awardBadgeConfetti = () => {
    try {
      triggerConfetti();
      // Additional confetti for badges
      setTimeout(() => {
        triggerConfetti();
      }, 100);
    } catch (e) {
      console.warn('Confetti error', e);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2.5">
            <Activity className="w-7 h-7 text-emerald-400" />
            <span>Fitness & Wellness Tracker</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Beginner-friendly movement, hydration, sleep hygiene, and body resilience designed for Jeeva.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 flex items-center space-x-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Log Workout & Health</span>
        </button>
      </div>

      {/* Profile KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Current Weight</span>
            <Scale className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {fitnessProfile.currentWeight} kg
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Height: {fitnessProfile.height} cm · Target: {fitnessProfile.targetWeight} kg
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Calculated BMI</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
              Normal
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {bmi}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Healthy body mass index range
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Weekly Target Sessions</span>
            <Dumbbell className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-300">
            {weeklyWorkoutsCount} / 3 <span className="text-xs font-normal text-slate-400">Done</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Focus on consistency over heavy intensity
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Hydration & Sleep</span>
            <Droplets className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-300">
            ~2.8L <span className="text-sm font-normal text-slate-400">· ~7.5h</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Optimal physical and cognitive recovery
          </p>
        </div>
      </div>

      {/* TODAY'S HEALTH WIDGETS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Today's Health Summary */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-rose-400" />
              <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <span>Today's Health</span>
              </h2>
            </div>
          </div>

          {/* Exercise Completion Widget */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Exercise Tasks
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {completedChecklistCount} / {dailyChecklist.length}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Completed exercise tasks divided by planned tasks
            </p>
          </div>

          {/* Daily Completion Widget */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Daily Completion
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {Math.round((completedChecklistCount / dailyChecklist.length) * 100)}%
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Completed exercise tasks ÷ planned exercise tasks × 100
            </p>
          </div>

          {/* Badge Showcase Widget */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/50">
              <h3 className="text-sm font-bold text-slate-100">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Badges & Awards
              </h3>
              <span className="text-xs text-emerald-300 font-medium">
                {earnedBadgeCount}/{totalBadges}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {earnedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="p-1.5 rounded bg-emerald-500/20 text-center"
                >
                  <span className="text-xs font-bold text-emerald-300">
                    {badge.icon}
                  </span>
                  <div className="mt-1 line-clamp-1">
                    {badge.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Widget */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-sm font-bold text-slate-100 mb-2">
              <ChartBar className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> Progress
            </h3>
            <p className="text-xs text-slate-400 mb-1">
              Active days: {progressTracker['consecutive_workout_streak'] || 0} day streak
            </p>
            <div className="h-4 bg-slate-800 rounded overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded transition-width"
                style={{ width: `${(progressTracker['workouts_this_week'] || 0) / 7 * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              {progressTracker['workouts_this_week'] || 0} of 7 planned workouts this week
            </p>
          </div>
        </div>

        {/* Right: Achievements & Goals */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          {/* Achievements Progress */}
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between"
              >
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-white">{achievement.title}</h4>
                  <p className="text-[10px] text-slate-400">{achievement.description}</p>
                </div>
                <div className="w-24 bg-slate-800 rounded-full h-2 flex">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-width"
                    style={{ width: `${achievementProgress[achievement.id] || 0}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  {achievement.currentProgress}/{achievement.maxProgress}
                </span>
              </div>
            ))}
          </div>

          {/* Goal Progress Section */}
          <div>
            <h3 className="text-sm font-bold text-slate-100 mb-3">
              <Target className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Weekly Goals
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded bg-slate-800/50">
                <span className="text-[10px] text-slate-400">Strength sessions</span>
                <span className="text-xs font-medium text-emerald-300">
                  {progressTracker['strength_sessions_completed'] || 0}/3
                </span>
              </div>
              <div className="p-2 rounded bg-slate-800/50">
                <span className="text-[10px] text-slate-400">Walking sessions</span>
                <span className="text-xs font-medium text-cyan-300">
                  {progressTracker['walking_sessions'] || 0}/5
                </span>
              </div>
            </div>
          </div>

          {/* Upcoming Reminders */}
          <div>
            <h3 className="text-sm font-bold text-slate-100 mb-3">
              <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> Reminders
            </h3>
            <p className="text-xs text-slate-400">
              Next workout reminder: Tomorrow 8 AM
            </p>
            <button
              className="w-full py-2 px-3 rounded-xl text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-all mt-2"
            >
              Manage Reminders
            </button>
          </div>
        </div>
      </div>

      {/* Trends Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <h3 className="text-sm font-bold text-slate-100 mb-1 flex items-center space-x-2">
            <Droplets className="w-4 h-4 text-cyan-400" />
            <span>Water & Sleep History</span>
          </h3>
          <p className="text-xs text-slate-400 mb-4">Daily water intake (liters) and sleep duration (hours)</p>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Line type="monotone" dataKey="water" stroke="#06b6d4" strokeWidth={2} name="Water (L)" />
                <Line type="monotone" dataKey="sleep" stroke="#818cf8" strokeWidth={2} name="Sleep (Hrs)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <h3 className="text-sm font-bold text-slate-100 mb-1 flex items-center space-x-2">
            <Scale className="w-4 h-4 text-emerald-400" />
            <span>Body Weight Trend (kg)</span>
          </h3>
          <p className="text-xs text-slate-400 mb-4">Tracking steady weight stability around 57 kg</p>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis domain={[55, 60]} stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  formatter={(val: any) => [`${val} kg`, 'Weight']}
                />
                <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Workout Logs History Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-sm font-bold text-slate-100">Workout & Daily Wellness History</h2>
          <span className="text-xs text-slate-400">{fitnessLogs.length} Sessions Logged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Workout Session</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Habits</th>
                <th className="px-4 py-3">Energy</th>
                <th className="px-4 py-3">Notes</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {fitnessLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-slate-300">{log.date}</td>
                  <td className="px-4 py-3 font-bold text-white">{log.workoutTitle}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold">
                      {log.exerciseType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{log.durationMin} mins</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {log.walking && <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 text-[10px]">Walk</span>}
                      {log.skipping && <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 text-[10px]">Skip</span>}
                      {log.stretching && <span className="px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 text-[10px]">Stretch</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`capitalize font-bold ${log.energy === 'high' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {log.energy}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 max-w-xs truncate">{log.notes || '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => deleteFitnessLog(log.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BADGES & REWARDS SECTION - NEW */}
      <div className="mt-8 glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-sm font-bold text-slate-100">
            <Trophy className="w-4 h-4 text-amber-400 shrink-0" /> Badges & Rewards
          </h2>
          <span className="text-xs text-emerald-400 font-bold">
            {earnedBadgeCount} earned
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Badge</th>
                <th className="px-4 py-3">Rarity</th>
                <th className="px-4 py-3">Progress</th>
                <th className="px-4 py-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {/* Display earned badges first */}
              {earnedBadges.map((badge) => (
                <tr key={badge.id} className="bg-emerald-500/10 hover:bg-emerald-500/20">
                  <td className="px-4 py-3 font-medium text-emerald-400">
                    <span className="text-xl">{badge.icon}</span> {badge.name}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${badge.rarity === 'legendary' ? 'text-amber-400' : badge.rarity === 'epic' ? 'text-yellow-300' : badge.rarity === 'rare' ? 'text-cyan-300' : 'text-emerald-300'}`}>
                      {badge.rarity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] text-emerald-300">100%</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-[10px]">{badge.description}</td>
                </tr>
              ))}

              {/* Display available badges not yet earned */}
              {badges.map((badge) => {
                if (!earnedBadges.some(e => e.id === badge.id)) {
                  return (
                    <tr key={badge.id} className="hover:bg-slate-800/30">
                      <td className="px-4 py-3 font-medium text-slate-400">
                        <span className="text-lg">{badge.icon}</span> {badge.name}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${badge.rarity}`}>
                          {badge.rarity}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] text-slate-400">
                          {badgeProgress[badge.id] || 0}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-[10px]">{badge.description}</td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
      </div>

      <QuickAddModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultType="fitness"
      />
    </div>
  );
};