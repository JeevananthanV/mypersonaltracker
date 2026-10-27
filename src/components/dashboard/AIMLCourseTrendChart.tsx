import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import {
  BrainCircuit,
  TrendingUp,
  Target,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  Zap,
  BookOpen,
  ArrowUpRight,
  BarChart3,
  Flame,
  Calendar
} from 'lucide-react';
import { useLifeOS } from '../../context/LifeOSContext';
import { SkillModule } from '../../types';

type MetricView = 'modules' | 'hours' | 'percentage';

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
  dataKey: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  metricView: MetricView;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, metricView }) => {
  if (!active || !payload || !payload.length) return null;

  const estVal = payload.find(p => p.dataKey === 'estimated')?.value;
  const actVal = payload.find(p => p.dataKey === 'actual')?.value;
  const milestone = (payload[0] as any)?.payload?.milestoneTitle;
  const isFuture = (payload[0] as any)?.payload?.isFuture;

  let unit = 'Modules';
  if (metricView === 'hours') unit = 'Hours';
  if (metricView === 'percentage') unit = '%';

  const diff = actVal !== undefined && estVal !== undefined && !isFuture ? actVal - estVal : null;

  return (
    <div className="rounded-xl bg-slate-900/95 p-3.5 shadow-2xl border border-slate-700/80 backdrop-blur-md text-xs space-y-2 min-w-[200px]">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="font-semibold text-white flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
          {label}
        </span>
        {isFuture ? (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
            Projected
          </span>
        ) : (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
            Recorded
          </span>
        )}
      </div>

      {milestone && (
        <div className="text-[11px] font-medium text-indigo-300 bg-indigo-950/40 px-2 py-1 rounded border border-indigo-900/40">
          🎯 {milestone}
        </div>
      )}

      <div className="space-y-1.5 pt-0.5">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block" />
            Estimated Plan:
          </span>
          <span className="font-mono font-bold text-indigo-300">
            {estVal !== undefined ? (metricView === 'percentage' ? `${estVal}%` : `${estVal} ${unit}`) : '—'}
          </span>
        </div>

        {actVal !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
              Actual Progress:
            </span>
            <span className="font-mono font-bold text-emerald-300">
              {metricView === 'percentage' ? `${actVal}%` : `${actVal} ${unit}`}
            </span>
          </div>
        )}

        {diff !== null && (
          <div className="mt-1 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Pace vs Target:</span>
            <span className={`font-mono font-bold ${diff >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {diff > 0 ? `+${diff.toFixed(1)} ahead` : diff === 0 ? 'Exact on track' : `${diff.toFixed(1)} behind`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export const AIMLCourseTrendChart: React.FC = () => {
  const { skills, updateSkill, navigateToTab, triggerConfetti } = useLifeOS();
  const [metricView, setMetricView] = useState<MetricView>('modules');
  const [showProjection, setShowProjection] = useState<boolean>(true);
  const [activeModuleFilter, setActiveModuleFilter] = useState<'all' | 'completed' | 'in_progress'>('all');

  // Compute stats from active skills
  const totalModules = skills.length || 8;
  const completedModules = skills.filter(s => s.status === 'completed').length;
  const inProgressModules = skills.filter(s => s.status === 'in_progress').length;

  const totalPracticeHours = skills.reduce((sum, s) => sum + (s.practiceHours || 0), 0);
  const totalTargetHours = skills.reduce((sum, s) => sum + (s.targetHours || 35), 0);

  // Compute fractional actual modules completed (completed + partial progress of in-progress)
  const fractionalActualCompleted = useMemo(() => {
    let count = completedModules;
    skills.forEach(s => {
      if (s.status === 'in_progress' && s.targetHours > 0) {
        count += Math.min(0.9, (s.practiceHours || 0) / s.targetHours);
      }
    });
    return Math.round(count * 10) / 10;
  }, [completedModules, skills]);

  const completionPercentage = totalTargetHours > 0
    ? Math.round((totalPracticeHours / totalTargetHours) * 100)
    : Math.round((completedModules / totalModules) * 100);

  // Current milestone baseline index (representing the present moment: Month 4 / Oct 2026)
  const currentTimelineIndex = 7; // "Oct 31"

  // Build the time-series comparison dataset
  const chartData = useMemo(() => {
    // 12 timeline steps: Jul 2026 to Dec 2026
    const baseSchedule = [
      { date: 'Jul 15', label: 'W2 Jul', estMod: 0.5, estHrs: 15, milestone: 'Python OOP Basics' },
      { date: 'Jul 31', label: 'W4 Jul', estMod: 1.0, estHrs: 40, milestone: 'Module 1 Python Finished' },
      { date: 'Aug 15', label: 'W2 Aug', estMod: 1.5, estHrs: 55, milestone: 'NumPy Vectorization' },
      { date: 'Aug 31', label: 'W4 Aug', estMod: 2.0, estHrs: 75, milestone: 'Module 2 Pandas Mastered' },
      { date: 'Sep 15', label: 'W2 Sep', estMod: 2.6, estHrs: 95, milestone: 'Probability & Matrices' },
      { date: 'Sep 30', label: 'W4 Sep', estMod: 3.5, estHrs: 125, milestone: 'Stats & EDA Visuals' },
      { date: 'Oct 15', label: 'W2 Oct', estMod: 4.2, estHrs: 150, milestone: 'Scikit-Learn Classifiers' },
      { date: 'Oct 31', label: 'Today', estMod: 5.0, estHrs: 180, milestone: 'Current: Classical ML & PyTorch' },
      { date: 'Nov 15', label: 'W2 Nov', estMod: 5.8, estHrs: 210, milestone: 'Deep Learning & CNNs' },
      { date: 'Nov 30', label: 'W4 Nov', estMod: 6.7, estHrs: 245, milestone: 'Transformers & FastAPI' },
      { date: 'Dec 15', label: 'W2 Dec', estMod: 7.4, estHrs: 270, milestone: 'Docker MLOps Inference' },
      { date: 'Dec 31', label: 'Target', estMod: 8.0, estHrs: 295, milestone: 'Capstone Portfolio Deployed' }
    ];

    // Compute actual historical progression scaling up to current live state
    return baseSchedule.map((point, index) => {
      const isPastOrCurrent = index <= currentTimelineIndex;
      const isFuture = index > currentTimelineIndex;

      // Scaling factor to realistically distribute actual progress up to current live values
      const progressRatio = currentTimelineIndex > 0 ? index / currentTimelineIndex : 1;
      
      let actualMod: number | null = null;
      let actualHrs: number | null = null;
      let actualPct: number | null = null;
      let projectedMod: number | null = null;
      let projectedHrs: number | null = null;

      if (isPastOrCurrent) {
        // Curve actual values to match current state at index 7
        actualMod = Math.round((fractionalActualCompleted * Math.pow(progressRatio, 1.05)) * 10) / 10;
        // At current index, exactly lock to live calculated values
        if (index === currentTimelineIndex) {
          actualMod = fractionalActualCompleted;
          actualHrs = totalPracticeHours;
        } else {
          actualHrs = Math.round(totalPracticeHours * Math.pow(progressRatio, 1.1));
        }
        actualPct = Math.round(((actualMod || 0) / totalModules) * 100);
      }

      // If showing projection into future points
      if (showProjection && isFuture) {
        const futureRatio = (index - currentTimelineIndex) / (baseSchedule.length - 1 - currentTimelineIndex);
        // Project from current actual toward 8.0 modules
        projectedMod = Math.round((fractionalActualCompleted + (totalModules - fractionalActualCompleted) * futureRatio) * 10) / 10;
        projectedHrs = Math.round(totalPracticeHours + (totalTargetHours - totalPracticeHours) * futureRatio);
      }

      const estimatedPct = Math.round((point.estMod / totalModules) * 100);

      // Select values according to current metric view
      let estimated = point.estMod;
      let actual = actualMod;
      let projected = projectedMod;

      if (metricView === 'hours') {
        estimated = point.estHrs;
        actual = actualHrs;
        projected = projectedHrs;
      } else if (metricView === 'percentage') {
        estimated = estimatedPct;
        actual = actualPct;
        projected = projectedMod !== null ? Math.round((projectedMod / totalModules) * 100) : null;
      }

      return {
        date: point.date,
        label: point.label,
        milestoneTitle: point.milestone,
        estimated,
        actual: isPastOrCurrent ? actual : null,
        projected: showProjection ? (index >= currentTimelineIndex ? (actual ?? projected) : null) : null,
        isFuture,
        isToday: index === currentTimelineIndex
      };
    });
  }, [fractionalActualCompleted, totalPracticeHours, totalTargetHours, totalModules, showProjection, metricView]);

  // Determine current pace status
  const currentEstimated = chartData[currentTimelineIndex]?.estimated || 5;
  const currentActual = chartData[currentTimelineIndex]?.actual || fractionalActualCompleted;
  const paceDifference = Math.round((currentActual - currentEstimated) * 10) / 10;

  const getPaceBadge = () => {
    if (paceDifference > 0.5) {
      return {
        label: `+${paceDifference} Modules Ahead`,
        desc: 'Velocity is outstanding! You are trending ahead of your Dec 2026 target.',
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
      };
    } else if (paceDifference >= -0.3) {
      return {
        label: 'On Scheduled Track',
        desc: 'Steady weekly cadence matching the estimated syllabus milestones.',
        color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
      };
    } else {
      return {
        label: `${Math.abs(paceDifference)} Modules Behind`,
        desc: 'Target sprint recommended: allocate +3 hrs this weekend to catch up.',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
      };
    }
  };

  const paceInfo = getPaceBadge();

  // Quick module toggle helper
  const handleToggleModule = (module: SkillModule) => {
    const nextStatus = module.status === 'completed'
      ? 'in_progress'
      : module.status === 'in_progress'
      ? 'completed'
      : 'in_progress';

    const updates: Partial<SkillModule> = {
      status: nextStatus,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    if (nextStatus === 'completed') {
      updates.practiceHours = module.targetHours;
      triggerConfetti();
    }

    updateSkill(module.id, updates);
  };

  const filteredSkills = skills.filter(s => {
    if (activeModuleFilter === 'completed') return s.status === 'completed';
    if (activeModuleFilter === 'in_progress') return s.status === 'in_progress';
    return true;
  });

  return (
    <section className="p-6 rounded-2xl bg-[#0E1526] border border-slate-800 space-y-6">
      {/* 1. Header & Quick Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 text-indigo-400">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-heading font-black text-white tracking-tight flex items-center gap-2">
                AI/ML Course Completion Trend
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  Estimated vs Actual
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Dynamic Recharts progression tracker monitoring syllabus milestones against real logged practice hours
              </p>
            </div>
          </div>
        </div>

        {/* View Switchers & Navigation */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Selector Pills */}
          <div className="p-1 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setMetricView('modules')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                metricView === 'modules'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Modules (Count)
            </button>
            <button
              onClick={() => setMetricView('hours')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                metricView === 'hours'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Hours (Target vs Logged)
            </button>
            <button
              onClick={() => setMetricView('percentage')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                metricView === 'percentage'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pace %
            </button>
          </div>

          <button
            onClick={() => navigateToTab('career')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-indigo-600/30 text-indigo-300 hover:text-white border border-slate-700/60 text-xs font-semibold transition-colors"
          >
            <span>Career Hub</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Key Summary KPI Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Completed Modules */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/90">
          <div className="text-[11px] text-slate-400 flex items-center justify-between mb-1">
            <span>Modules Completed</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-xl font-black text-white">
              {completedModules}
            </span>
            <span className="text-xs text-slate-400">/ {totalModules} total</span>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold ml-auto">
              {inProgressModules} active
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (completedModules / totalModules) * 100)}%` }}
            />
          </div>
        </div>

        {/* Practice Hours */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/90">
          <div className="text-[11px] text-slate-400 flex items-center justify-between mb-1">
            <span>Study Hours Logged</span>
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-xl font-black text-indigo-300">
              {totalPracticeHours}
            </span>
            <span className="text-xs text-slate-400">/ {totalTargetHours} hrs</span>
            <span className="text-[10px] font-mono text-indigo-400 font-semibold ml-auto">
              {completionPercentage}%
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, completionPercentage)}%` }}
            />
          </div>
        </div>

        {/* Schedule Variance & Pace */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/90">
          <div className="text-[11px] text-slate-400 flex items-center justify-between mb-1">
            <span>Velocity Status</span>
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md border ${paceInfo.color}`}>
              {paceInfo.label}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 truncate">
            {paceInfo.desc}
          </div>
        </div>

        {/* Target Graduation */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/90">
          <div className="text-[11px] text-slate-400 flex items-center justify-between mb-1">
            <span>Final Milestone</span>
            <Target className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-sm font-bold text-amber-300">Dec 31, 2026</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 flex items-center justify-between">
            <span>AI Capstone Deployment</span>
            <span className="text-emerald-400 font-medium">8 Modules</span>
          </div>
        </div>
      </div>

      {/* 3. The Visual Recharts Trend Component */}
      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {metricView === 'modules' && 'Cumulative Modules: Planned Syllabus vs Actual Completion'}
              {metricView === 'hours' && 'Cumulative Study Hours: Planned Target vs Actual Hours Logged'}
              {metricView === 'percentage' && 'Curriculum Pace %: Scheduled Progress vs Actual'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3 h-0.5 bg-indigo-400 inline-block border-b-2 border-dashed border-indigo-400" />
              <span>Estimated (Baseline)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3 h-2 rounded bg-emerald-500 inline-block" />
              <span>Actual (Recorded)</span>
            </div>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-white select-none">
              <input
                type="checkbox"
                checked={showProjection}
                onChange={e => setShowProjection(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0"
              />
              <span>Forecast</span>
            </label>
          </div>
        </div>

        {/* Recharts Area & Line visualization */}
        <div className="h-[280px] sm:h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
              <defs>
                {/* Gradient for Actual Completed */}
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                {/* Gradient for Estimated Baseline */}
                <linearGradient id="estimatedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                {/* Gradient for Projected */}
                <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />

              <XAxis
                dataKey="label"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickLine={{ stroke: '#334155' }}
              />

              <YAxis
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickLine={{ stroke: '#334155' }}
                domain={[0, metricView === 'percentage' ? 100 : metricView === 'hours' ? 300 : 8]}
              />

              <Tooltip content={<CustomTooltip metricView={metricView} />} />

              {/* Reference Line for Current Date */}
              <ReferenceLine
                x="Today"
                stroke="#38bdf8"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: 'Current Sprint',
                  fill: '#38bdf8',
                  fontSize: 10,
                  position: 'top'
                }}
              />

              {/* Estimated / Baseline Planned Area */}
              <Area
                type="monotone"
                dataKey="estimated"
                name="Estimated Target"
                stroke="#6366f1"
                strokeWidth={2}
                strokeDasharray="4 3"
                fillOpacity={1}
                fill="url(#estimatedGradient)"
              />

              {/* Actual Recorded Area */}
              <Area
                type="monotone"
                dataKey="actual"
                name="Actual Recorded"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#actualGradient)"
                dot={{ r: 4, fill: '#10b981', stroke: '#064e3b', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#34d399', stroke: '#fff', strokeWidth: 2 }}
              />

              {/* Forecast Line */}
              {showProjection && (
                <Line
                  type="monotone"
                  dataKey="projected"
                  name="Projected Forecast"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  dot={{ r: 3, fill: '#38bdf8' }}
                  connectNulls={true}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-800/80 gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              Pace Calculation: Currently {fractionalActualCompleted} of 8 modules unlocked with {totalPracticeHours} cumulative practice hours.
            </span>
          </div>
          <span className="font-mono text-slate-400 text-[10px]">
            Updated live from Life OS State
          </span>
        </div>
      </div>

      {/* 4. Interactive Course Roadmap Checklist & Fast Toggles */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Roadmap Modules Breakdown
            </h3>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setActiveModuleFilter('all')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                activeModuleFilter === 'all'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({skills.length})
            </button>
            <button
              onClick={() => setActiveModuleFilter('completed')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                activeModuleFilter === 'completed'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Completed ({completedModules})
            </button>
            <button
              onClick={() => setActiveModuleFilter('in_progress')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                activeModuleFilter === 'in_progress'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Active ({inProgressModules})
            </button>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {filteredSkills.map((module, idx) => {
            const isCompleted = module.status === 'completed';
            const isInProgress = module.status === 'in_progress';
            const hoursLogged = module.practiceHours || 0;
            const targetHrs = module.targetHours || 35;
            const modulePct = targetHrs > 0 ? Math.min(100, Math.round((hoursLogged / targetHrs) * 100)) : 0;

            return (
              <div
                key={module.id}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  isCompleted
                    ? 'bg-emerald-950/15 border-emerald-500/30'
                    : isInProgress
                    ? 'bg-slate-950/70 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.05)]'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                      M{idx + 1}
                    </span>
                    <h4 className={`text-xs font-semibold truncate ${isCompleted ? 'text-emerald-200' : 'text-white'}`}>
                      {module.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                    <span className="font-mono">
                      {isCompleted ? `${targetHrs}/${targetHrs} hrs` : `${hoursLogged}/${targetHrs} hrs (${modulePct}%)`}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-400 truncate">{module.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleModule(module)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 ${
                      isCompleted
                        ? 'bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white border border-emerald-500/30'
                        : isInProgress
                        ? 'bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600 hover:text-white border border-cyan-500/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                    title="Click to toggle status (updates chart live)"
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Done</span>
                      </>
                    ) : isInProgress ? (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        <span>Active</span>
                      </>
                    ) : (
                      <span>Queue</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
