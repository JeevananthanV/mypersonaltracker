import React, { useState } from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import {
  Scale,
  Plus,
  Trash2,
  TrendingUp,
  ArrowLeft,
  Target,
  Sparkles,
  Award,
  Calendar
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { getLiveDateString } from '../utils/date-utils';

export const WeightTrackerPage: React.FC = () => {
  const {
    fitnessProfile,
    updateFitnessProfile,
    fitnessLogs,
    addFitnessLog,
    deleteFitnessLog,
    bmi,
    navigateToTab,
    triggerConfetti
  } = useLifeOS();

  const currentWeight = fitnessProfile.currentWeight || 57;
  const targetWeight = fitnessProfile.targetWeight || 60;
  const initialWeight = 55; // Base starting weight

  const [newWeight, setNewWeight] = useState<number>(currentWeight);
  const [logDate, setLogDate] = useState<string>(getLiveDateString());
  const [logNotes, setLogNotes] = useState<string>('Daily morning check-in');

  const progressPct = Math.min(
    100,
    Math.max(0, ((currentWeight - initialWeight) / (targetWeight - initialWeight)) * 100)
  );

  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWeight <= 0) return;

    // Update profile
    updateFitnessProfile({
      currentWeight: Number(newWeight)
    });

    // Add fitness log entry
    addFitnessLog({
      date: logDate,
      weightKg: Number(newWeight),
      notes: logNotes.trim() || undefined
    });

    triggerConfetti();
  };

  // Chart data from fitness logs
  const weightTrendData = fitnessLogs
    .filter(l => l.weightKg !== undefined && l.weightKg > 0)
    .map(l => ({
      date: l.date.split('-').slice(1).join('/'),
      weight: l.weightKg
    }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0C1F1E] via-[#081717] to-[#071214] border border-teal-500/40 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigateToTab('fitness', 'workout')}
              className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center gap-1 active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Fitness OS</span>
            </button>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30 font-mono">
              Body Composition Monitor
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Scale className="w-6 h-6 text-teal-400" />
            Weight & BMI Tracking Terminal
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Targeting healthy lean mass gain from <strong className="text-white">57 kg</strong> to <strong className="text-teal-400">60 kg</strong> (+3 kg lean target). Monitor consistency, daily weigh-ins, and BMI milestones.
          </p>
        </div>

        {/* Metrics Strip */}
        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Current</span>
            <div className="text-2xl font-black text-white font-mono">{currentWeight} kg</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-teal-500/30 text-center">
            <span className="text-[10px] text-teal-400 uppercase tracking-wider block font-bold">Target</span>
            <div className="text-2xl font-black text-teal-400 font-mono">{targetWeight} kg</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-indigo-500/30 text-center">
            <span className="text-[10px] text-indigo-400 uppercase tracking-wider block font-bold">BMI</span>
            <div className="text-2xl font-black text-indigo-300 font-mono">{bmi.toFixed(1)}</div>
          </div>
        </div>
      </div>

      {/* Target Progress Bar */}
      <div className="p-5 rounded-2xl bg-[#0E1526] border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Target className="w-4 h-4 text-teal-400" />
            Roadmap to 60 kg Lean Mass
          </span>
          <span className="font-mono text-teal-300 font-bold">
            {targetWeight - currentWeight > 0 ? `${(targetWeight - currentWeight).toFixed(1)} kg remaining` : 'Target Achieved!'}
          </span>
        </div>

        <div className="w-full bg-slate-800/80 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
          <div
            className="bg-gradient-to-r from-teal-500 via-emerald-400 to-indigo-500 h-full rounded-full transition-all duration-700"
            style={{ width: `${Math.max(5, progressPct)}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] text-slate-400 font-mono">
          <span>Starting: 55 kg</span>
          <span className="text-white font-bold">Current: {currentWeight} kg</span>
          <span className="text-teal-400 font-bold">Goal: 60 kg</span>
        </div>
      </div>

      {/* Log New Weight Form */}
      <div className="p-5 rounded-2xl bg-[#0E1526] border border-slate-800 shadow-xl space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Plus className="w-4 h-4 text-teal-400" />
          <span>Log Weight Check-in</span>
        </h3>

        <form onSubmit={handleSaveWeight} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Weight (kg) *</label>
            <input
              type="number"
              required
              step="0.1"
              min="30"
              max="150"
              value={newWeight}
              onChange={(e) => setNewWeight(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Date</label>
            <input
              type="date"
              value={logDate}
              onChange={(e) => setLogDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white font-mono focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="space-y-1 sm:col-span-1">
            <label className="text-xs font-semibold text-slate-400">Notes / State</label>
            <input
              type="text"
              placeholder="Post workout, morning empty stomach..."
              value={logNotes}
              onChange={(e) => setLogNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 transition shadow-md shadow-teal-500/20 active:scale-95 flex items-center justify-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Weigh-In</span>
            </button>
          </div>
        </form>
      </div>

      {/* Trend Chart & History Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div className="p-5 rounded-2xl bg-[#0C1222]/90 border border-slate-800 shadow-xl space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-teal-400" />
            Weight Trend Progress
          </h4>

          <div className="h-56 w-full">
            {weightTrendData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                Record weigh-ins to plot your weight trajectory.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="date" stroke="#64748B" fontSize={11} />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#64748B" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B101D', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="weight" stroke="#14B8A6" strokeWidth={2.5} dot={{ r: 4, fill: '#14B8A6' }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* History Table */}
        <div className="p-5 rounded-2xl bg-[#0C1222]/90 border border-slate-800 shadow-xl space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            Recent Weight Entries
          </h4>

          <div className="max-h-56 overflow-y-auto pr-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#090D18] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 sticky top-0">
                <tr>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Weight</th>
                  <th className="px-3 py-2">Notes</th>
                  <th className="px-3 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {fitnessLogs.filter(l => l.weightKg).map(l => (
                  <tr key={l.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-3 py-2 text-slate-400 font-mono">{l.date}</td>
                    <td className="px-3 py-2 font-mono font-bold text-teal-300">{l.weightKg} kg</td>
                    <td className="px-3 py-2 text-slate-400 truncate max-w-[120px]">{l.notes || '—'}</td>
                    <td className="px-3 py-2 text-right">
                      <button
                        onClick={() => deleteFitnessLog(l.id)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
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
      </div>
    </div>
  );
};
