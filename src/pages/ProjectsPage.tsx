import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  ExternalLink,
  Code2,
  CheckCircle2,
  Clock,
  Sparkles,
  Trash2,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useLifeOS } from '../context/LifeOSContext';
import { Project, ProjectStatus, ProjectType } from '../types';

export const ProjectsPage: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject } = useLifeOS();

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);

  // New project state
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ProjectType>('Portfolio');
  const [status, setStatus] = useState<ProjectStatus>('In Progress');
  const [description, setDescription] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [techStack, setTechStack] = useState('React, TypeScript, Python');
  const [repoUrl, setRepoUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [progressPercent, setProgressPercent] = useState('50');

  const filteredProjects = projects.filter(p => {
    if (activeFilter === 'all') return true;
    return p.type === activeFilter;
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !nextAction) return;

    addProject({
      title,
      type,
      status,
      priority: 'high',
      startDate: new Date().toISOString().split('T')[0],
      description,
      nextAction,
      techStack: techStack.split(',').map(s => s.trim()).filter(Boolean),
      repoUrl,
      liveUrl,
      deadline: '',
      progressPercent: parseInt(progressPercent) || 50
    });

    setTitle('');
    setDescription('');
    setNextAction('');
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2.5">
            <FolderGit2 className="w-7 h-7 text-violet-400" />
            <span>Software & AI Projects Center</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track client delivery, community websites (Ethiroli, Jai Varahi Peedam), and AI/ML portfolio builds.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/20 flex items-center space-x-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs w-fit">
        {['all', 'Work', 'Portfolio', 'Personal'].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
              activeFilter === cat ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            {cat} {cat !== 'all' ? `(${projects.filter(p => p.type === cat).length})` : `(${projects.length})`}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredProjects.map((p) => (
          <div
            key={p.id}
            className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-violet-500/30 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold text-[10px] uppercase tracking-wider">
                  {p.type}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  p.status === 'Deployed'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : p.status === 'In Progress'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {p.status}
                </span>
              </div>

              <h2 className="text-lg font-bold text-white">{p.title}</h2>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{p.description}</p>

              {/* Next Action Box */}
              <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 block mb-0.5">
                  Next Practical Milestone:
                </span>
                <p className="text-slate-200 font-medium">{p.nextAction}</p>
              </div>

              {/* Tech Stack */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(p.techStack || []).map((tech, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 text-[10px] font-mono border border-slate-800">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom: Progress & Links */}
            <div className="mt-6 pt-4 border-t border-slate-800/80">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-slate-400">Progress:</span>
                <span className="font-bold text-violet-300">{p.progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-4">
                <div
                  className="bg-gradient-to-r from-violet-600 to-indigo-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${p.progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  {p.repoUrl && (
                    <a
                      href={p.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </a>
                  )}
                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center space-x-1 text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Site</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      const next = p.progressPercent >= 100 ? 100 : p.progressPercent + 10;
                      updateProject(p.id, { progressPercent: next, status: next === 100 ? 'Deployed' : p.status });
                    }}
                    className="px-2 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    +10% Progress
                  </button>
                  <button
                    onClick={() => deleteProject(p.id)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 bg-slate-900 border border-slate-700 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-white mb-4">Add New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Customer Churn Predictor"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Project Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  >
                    <option value="Portfolio">AI/ML Portfolio</option>
                    <option value="Work">Client / Work</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Deployed">Deployed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of the project goals..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Next Action Required</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement Dockerfile and benchmark inference latency"
                  value={nextAction}
                  onChange={e => setNextAction(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={techStack}
                  onChange={e => setTechStack(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Repository URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={repoUrl}
                    onChange={e => setRepoUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Live URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={liveUrl}
                    onChange={e => setLiveUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
