import React, { useState } from 'react';
import {
  Activity,
  Plus,
  Flame,
  CheckCircle2,
  Circle,
  Heart,
  Droplets,
  Moon,
  Scale,
  AlertCircle,
  TrendingUp,
  Dumbbell,
  Trash2,
  Calendar
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { useLifeOS } from '../context/LifeOSContext';
import { QuickAddModal } from '../components/QuickAddModal';

export const FitnessPage: React.FC = () => {
  const {
    fitnessProfile,
    updateFitnessProfile,
    fitnessLogs,
    deleteFitnessLog,
    weeklyWorkoutsCount,
    bmi,
    triggerConfetti
  } = useLifeOS();

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

      {/* Safety Notice & Beginner Weekly Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Beginner Weekly Workout Plan */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Dumbbell className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-slate-100">Beginner Weekly Workout Schedule</h2>
            </div>
            <span className="text-xs text-slate-400">Low impact · High consistency</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">Monday</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">15–20 mins</span>
              </div>
              <h3 className="text-sm font-semibold text-white">Walking + Mobility</h3>
              <p className="text-xs text-slate-400 leading-snug">
                Comfortable outdoor or treadmill walk with gentle shoulder and spinal stretching.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400">Wednesday</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">15–20 mins</span>
              </div>
              <h3 className="text-sm font-semibold text-white">Light Skipping / Walking</h3>
              <p className="text-xs text-slate-400 leading-snug">
                Short intervals (30s light skip, 45s rest). Walking is always an approved alternative.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400">Friday</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">20 mins</span>
              </div>
              <h3 className="text-sm font-semibold text-white">Full-Body Movement</h3>
              <p className="text-xs text-slate-400 leading-snug">
                Gentle bodyweight squats, wall pushups, and cat-cow stretches. Stop if fatigued.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Other Days</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">Recovery</span>
              </div>
              <h3 className="text-sm font-semibold text-slate-200">Rest & Hydration</h3>
              <p className="text-xs text-slate-400 leading-snug">
                Gentle recovery stroll or complete rest based on your energy and sleep.
              </p>
            </div>
          </div>

          {/* Coach Safety Tip */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-300 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Coach Safety & Health Guidance</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Since you mentioned shaking during heavy resistance lifting in the past, prioritize bodyweight and joint mobility over heavy dumbbells. If unexplained shaking occurs with dizziness or weakness, seek medical advice.
            </p>
          </div>
        </div>

        {/* Right: Daily Checklist */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <Heart className="w-5 h-5 text-rose-400" />
                <span>Today's Fitness Checklist</span>
              </h2>
              <span className="text-xs text-emerald-400 font-bold">
                {completedChecklistCount} / {dailyChecklist.length}
              </span>
            </div>

            <div className="space-y-2.5 mt-4">
              {dailyChecklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800/80 cursor-pointer text-xs transition-colors"
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                  <span className={item.completed ? 'line-through text-slate-500 font-medium' : 'text-slate-200'}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Hydration goal: 2.5L+</span>
            <span>Sleep goal: 7.5h+</span>
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

      <QuickAddModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultType="fitness"
      />
    </div>
  );
};
