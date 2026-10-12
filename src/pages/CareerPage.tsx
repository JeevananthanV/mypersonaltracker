import React, { useState } from 'react';
import {
  BrainCircuit,
  Sparkles,
  ExternalLink,
  Plus,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  AlertTriangle,
  Code2,
  Globe,
  Flame,
  BarChart2
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useLifeOS } from '../context/LifeOSContext';
import { QuickAddModal } from '../components/QuickAddModal';
import { SkillStatus } from '../types';

export const CareerPage: React.FC = () => {
  const {
    careerOverview,
    updateCareerOverview,
    skills,
    logPracticeHours,
    updateSkill
  } = useLifeOS();

  const [modalOpen, setModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [editingOverview, setEditingOverview] = useState(false);
  const [tempOverview, setTempOverview] = useState(careerOverview);

  const totalPracticeHours = skills.reduce((acc, s) => acc + s.practiceHours, 0);
  const totalTargetHours = skills.reduce((acc, s) => acc + s.targetHours, 0);
  const completedSkillsCount = skills.filter(s => s.status === 'completed').length;

  const chartData = skills.map(s => ({
    name: s.title.split(' ')[0],
    fullName: s.title,
    hours: s.practiceHours,
    target: s.targetHours
  }));

  const filteredSkills = skills.filter(s => {
    if (filterCategory === 'all') return true;
    return s.category === filterCategory;
  });

  const categories = ['all', 'Core Language', 'Data & Stats', 'Machine Learning', 'Deep Learning', 'MLOps & Deployment', 'Portfolio'];

  const handleSaveOverview = () => {
    updateCareerOverview(tempOverview);
    setEditingOverview(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2.5">
            <BrainCircuit className="w-7 h-7 text-cyan-400" />
            <span>AI/ML Career Center</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Accelerating your transition to a high-impact AI/ML Engineer with rigorous practice and real-world deployment.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 flex items-center space-x-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Log Practice Session</span>
        </button>
      </div>

      {/* Career Overview Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/20 relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold text-xs uppercase tracking-wider">
              2026 Profile
            </span>
            <h2 className="text-base font-bold text-slate-100">Jeeva · AI/ML Engineer in Progress</h2>
          </div>
          <button
            onClick={() => setEditingOverview(!editingOverview)}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            {editingOverview ? 'Cancel' : 'Edit Profile Notes'}
          </button>
        </div>

        {editingOverview ? (
          <div className="mt-4 space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Current Module Focus</label>
              <input
                type="text"
                value={tempOverview.currentModule}
                onChange={e => setTempOverview({ ...tempOverview, currentModule: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Current Flagship Project</label>
              <input
                type="text"
                value={tempOverview.currentProject}
                onChange={e => setTempOverview({ ...tempOverview, currentProject: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Biggest Blocker</label>
              <input
                type="text"
                value={tempOverview.biggestBlocker}
                onChange={e => setTempOverview({ ...tempOverview, biggestBlocker: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Next Practical Milestone</label>
              <input
                type="text"
                value={tempOverview.nextMilestone}
                onChange={e => setTempOverview({ ...tempOverview, nextMilestone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100"
              />
            </div>
            <button
              onClick={handleSaveOverview}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold"
            >
              Save Profile Changes
            </button>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block mb-1">Current Module</span>
              <span className="text-sm font-bold text-white block">{careerOverview.currentModule}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block mb-1">Current Flagship Project</span>
              <span className="text-sm font-bold text-cyan-300 block">{careerOverview.currentProject}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block mb-1">Next Practical Milestone</span>
              <span className="text-xs font-semibold text-emerald-300 block leading-tight">{careerOverview.nextMilestone}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block mb-1">Biggest Blocker & Mitigation</span>
              <span className="text-xs text-amber-300/90 block leading-tight">{careerOverview.biggestBlocker}</span>
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-4">
            <a
              href={careerOverview.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 text-slate-400 hover:text-white transition-colors"
            >
              <Code2 className="w-4 h-4" />
              <span>GitHub / Repos</span>
            </a>
            <a
              href={careerOverview.portfolioUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 text-slate-400 hover:text-white transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>Live Portfolio</span>
            </a>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <span>Overall Roadmap:</span>
            <span className="font-bold text-white">{completedSkillsCount} of {skills.length} Completed</span>
          </div>
        </div>
      </div>

      {/* Practice Hours Chart & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <BarChart2 className="w-4 h-4 text-cyan-400" />
                <span>Practice Hours Logged vs Targets</span>
              </h3>
              <p className="text-xs text-slate-400">Total {totalPracticeHours} / {totalTargetHours} focused hours across curriculum</p>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-cyan-400">{Math.round((totalPracticeHours / totalTargetHours) * 100)}%</span>
              <span className="text-xs text-slate-400 block">Roadmap Target</span>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} interval={0} angle={-25} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  formatter={(val: any, name: any) => [`${val} hrs`, name === 'hours' ? 'Logged' : 'Target']}
                  labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName || ''}
                />
                <Bar dataKey="hours" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Logged" />
                <Bar dataKey="target" fill="#1e293b" radius={[4, 4, 0, 0]} name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Key Skills to Improve */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2 mb-3">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Priority Skills to Hone</span>
            </h3>
            <div className="space-y-2.5">
              {careerOverview.skillsToImprove.map((skillText, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                  <div className="flex items-center space-x-2 text-cyan-300 font-semibold mb-1">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span>Focus Area #{idx + 1}</span>
                  </div>
                  <p className="text-slate-300 leading-snug pl-7">{skillText}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
            <span className="font-bold">Engineer Tip:</span> Pair every ML algorithm with a small interactive Streamlit or FastAPI demo in your repo.
          </div>
        </div>
      </div>

      {/* Curriculum Modules Roadmap */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-100">Curriculum & Modules Roadmap</h2>
            <p className="text-xs text-slate-400">Click any card to add practice hours or update status</p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                  filterCategory === cat
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map(s => {
            const progress = Math.min(100, Math.round((s.practiceHours / s.targetHours) * 100));
            return (
              <div
                key={s.id}
                className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                      {s.category}
                    </span>
                    <button
                      onClick={() => {
                        const next: SkillStatus = s.status === 'completed' ? 'in_progress' : s.status === 'in_progress' ? 'completed' : 'in_progress';
                        updateSkill(s.id, { status: next });
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                        s.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : s.status === 'in_progress'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {s.status.replace('_', ' ')}
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100">{s.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{s.notes || 'Core practical module'}</p>

                  {s.resourceName && (
                    <div className="mt-3 flex items-center space-x-1.5 text-xs text-cyan-400">
                      <BookOpen className="w-3.5 h-3.5" />
                      {s.resourceUrl ? (
                        <a href={s.resourceUrl} target="_blank" rel="noreferrer" className="hover:underline flex items-center space-x-1">
                          <span>{s.resourceName}</span>
                          <ExternalLink className="w-3 h-3 ml-0.5" />
                        </a>
                      ) : (
                        <span>{s.resourceName}</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-400">Practice: {s.practiceHours}h / {s.targetHours}h</span>
                    <span className="font-bold text-cyan-300">{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        s.status === 'completed' ? 'bg-emerald-500' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Quick Add Practice Hours */}
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => logPracticeHours(s.id, 0.5)}
                      className="flex-1 py-1 text-[11px] font-semibold rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                    >
                      +30m
                    </button>
                    <button
                      onClick={() => logPracticeHours(s.id, 1)}
                      className="flex-1 py-1 text-[11px] font-semibold rounded bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800"
                    >
                      +1h
                    </button>
                    <button
                      onClick={() => logPracticeHours(s.id, 2)}
                      className="flex-1 py-1 text-[11px] font-semibold rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                    >
                      +2h
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <QuickAddModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultType="learning"
      />
    </div>
  );
};
