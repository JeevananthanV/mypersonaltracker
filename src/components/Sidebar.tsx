import React from 'react';
import {
  Home,
  IndianRupee,
  BrainCircuit,
  CalendarDays,
  Activity,
  CheckSquare,
  FolderGit2,
  Lightbulb,
  Sparkles,
  Mountain,
  X,
  Database,
  RefreshCw,
  Download
} from 'lucide-react';
import { useLifeOS } from '../context/LifeOSContext';
import { NavTab } from '../types';
import { checkBackendHealth, HealthResponse } from '../services/api';
import { getLiveDateString } from '../utils/date-utils';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const {
    activeTab,
    setActiveTab,
    tasks,
    habits,
    exportDataToJson,
    triggerConfetti
  } = useLifeOS();

  const [backendHealth, setBackendHealth] = React.useState<HealthResponse | null>(null);
  const [checkingBackend, setCheckingBackend] = React.useState(false);

  const pendingTasks = tasks.filter(
    (t) => t.status !== 'completed' && t.dueDate === getLiveDateString()
  ).length;

  const completedHabits = habits.filter((h) => h.completedToday).length;
  const habitPercentage = habits.length > 0 ? Math.round((completedHabits / habits.length) * 100) : 60;

  const refreshHealth = async () => {
    setCheckingBackend(true);
    const health = await checkBackendHealth();
    setBackendHealth(health);
    setCheckingBackend(false);
  };

  React.useEffect(() => {
    refreshHealth();
    const interval = setInterval(refreshHealth, 20000);
    return () => clearInterval(interval);
  }, []);

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { id: 'dashboard', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'finance', label: 'Finance & 3 Loans', icon: <IndianRupee className="w-4 h-4" /> },
    { id: 'career', label: 'AI/ML Career', icon: <BrainCircuit className="w-4 h-4" /> },
    { id: 'fitness', label: 'Health & Fitness', icon: <Activity className="w-4 h-4" /> },
    { id: 'tasks', label: 'Tasks & Habits', icon: <CheckSquare className="w-4 h-4" />, badge: pendingTasks > 0 ? pendingTasks : undefined },
    { id: 'review', label: 'Weekly Planner', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'projects', label: 'Software Projects', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'ideas', label: 'Ideas & Notes', icon: <Lightbulb className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0F172A] border-r border-slate-800/80 flex flex-col p-4 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Brand Logo */}
        <div className="flex items-center justify-between px-2 pt-2 pb-6">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-base font-extrabold text-white tracking-tight">Life OS</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Jeeva's Command Center</p>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <span className={isActive ? 'text-blue-400' : 'text-slate-400'}>{item.icon}</span>
                <span className="truncate">{item.label}</span>
                {item.badge !== undefined && (
                  <span className="ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* MongoDB Cloud Sync Pill */}
        <div className="pt-3 pb-2 px-1">
          <button
            onClick={refreshHealth}
            title={backendHealth?.database.connected ? 'MongoDB Atlas Online' : 'Local Storage Mode'}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs bg-slate-900/90 border border-slate-800 text-slate-300 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[11px] font-medium truncate">
                {backendHealth?.database.connected ? 'Atlas Connected' : 'Local Cache Active'}
              </span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  backendHealth?.database.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <RefreshCw
                className={`w-3 h-3 text-slate-500 ${checkingBackend ? 'animate-spin' : ''}`}
              />
            </div>
          </button>
        </div>

        {/* Bottom Motivational Habits Card */}
        <div className="mt-2 p-3.5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800/80 text-left relative overflow-hidden group">
          <div className="flex items-center space-x-2.5 mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Mountain className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">Better habits</p>
              <p className="text-[10px] text-slate-400 leading-tight">Build a healthier you</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${habitPercentage}%` }}
            />
          </div>

          <p className="text-[10.5px] text-slate-400 italic leading-relaxed">
            "Small steps every day lead to big results."
          </p>

          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <button
              onClick={exportDataToJson}
              className="text-slate-400 hover:text-white flex items-center space-x-1 transition-colors"
              title="Backup your Life OS data"
            >
              <Download className="w-3 h-3" />
              <span>Backup</span>
            </button>
            <button
              onClick={triggerConfetti}
              className="text-amber-400 hover:text-amber-300 flex items-center space-x-1 transition-colors"
              title="Celebrate progress"
            >
              <Sparkles className="w-3 h-3" />
              <span>Celebrate</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
