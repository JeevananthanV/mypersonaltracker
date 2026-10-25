import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  IndianRupee,
  BrainCircuit,
  CheckSquare,
  Activity,
  FolderGit2,
  CalendarCheck,
  Lightbulb,
  Download,
  Upload,
  RotateCcw,
  Menu,
  X,
  Sparkles,
  Database,
  RefreshCw
} from 'lucide-react';
import { useLifeOS } from '../context/LifeOSContext';
import { NavTab } from '../types';
import { checkBackendHealth, HealthResponse } from '../services/api';
import { DatabaseConnectionModal } from './common/DatabaseConnectionModal';
import { getLiveDateString } from '../utils/date-utils';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    outstandingPrincipal,
    tasks,
    exportDataToJson,
    importDataFromJson,
    resetToCleanRealState,
    triggerConfetti
  } = useLifeOS();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [backendHealth, setBackendHealth] = useState<HealthResponse | null>(null);
  const [checkingBackend, setCheckingBackend] = useState(false);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);

  const pendingTasksToday = tasks.filter(t => t.status !== 'completed' && t.dueDate === getLiveDateString()).length;

  const refreshHealth = async () => {
    setCheckingBackend(true);
    const health = await checkBackendHealth();
    setBackendHealth(health);
    setCheckingBackend(false);
  };

  useEffect(() => {
    refreshHealth();
    const interval = setInterval(refreshHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { id: 'dashboard', label: 'Command Center', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'finance', label: 'Finance & Loans', icon: <IndianRupee className="w-4 h-4" /> },
    { id: 'career', label: 'AI/ML Career', icon: <BrainCircuit className="w-4 h-4" /> },
    { id: 'tasks', label: 'Tasks & Habits', icon: <CheckSquare className="w-4 h-4" />, badge: pendingTasksToday > 0 ? pendingTasksToday : undefined },
    { id: 'fitness', label: 'Fitness & Wellness', icon: <Activity className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects Center', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'review', label: 'Weekly Review', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'ideas', label: 'Ideas Vault', icon: <Lightbulb className="w-4 h-4" /> },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          const success = importDataFromJson(content);
          if (success) {
            alert('Life OS data imported successfully!');
            triggerConfetti();
          } else {
            alert('Invalid backup file format.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                <span className="text-xl">🚀</span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  Jeeva's Life OS
                </span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 tracking-wider">
                  2026
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">AI/ML Engineer · Command Center</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 relative ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm shadow-indigo-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <span className={isActive ? 'text-indigo-400' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-1.5 px-1.5 py-0.2 bg-indigo-500 text-white rounded-full text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="hidden sm:flex items-center space-x-2">
            {/* MongoDB Backend Status Pill */}
            <button
              onClick={() => setIsDbModalOpen(true)}
              title={`Database Status: ${backendHealth?.database.connected ? 'MongoDB Atlas Connected' : 'Local Storage Mode'}. Click for connection details.`}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-all ${
                backendHealth?.database.connected
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : backendHealth
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-current" />
              <span>
                {backendHealth?.database.connected
                  ? 'MongoDB'
                  : backendHealth
                  ? 'Express API'
                  : 'Local Cache'}
              </span>
              <RefreshCw className={`w-3 h-3 ml-0.5 opacity-60 ${checkingBackend ? 'animate-spin' : ''}`} />
            </button>

            <div className="hidden xl:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
              <span className="text-slate-400">Principal Due:</span>
              <span className="font-semibold text-rose-400">₹{outstandingPrincipal.toLocaleString('en-IN')}</span>
            </div>

            {/* Data export / import */}
            <div className="flex items-center space-x-1 border-l border-slate-800 pl-2">
              <button
                onClick={exportDataToJson}
                title="Backup all data to JSON"
                className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
              <label
                title="Restore from JSON backup"
                className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
              </label>
              <button
                onClick={resetToCleanRealState}
                title="Reset to clean state (3 loans, 0 fake transactions)"
                className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800/80 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={triggerConfetti}
                title="Celebrate progress!"
                className="p-2 rounded-lg text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950/95 px-4 pt-3 pb-6 space-y-1 backdrop-blur-2xl">
          <div 
            onClick={() => setIsDbModalOpen(true)}
            className="pb-3 mb-2 border-b border-slate-800 flex justify-between items-center text-xs cursor-pointer hover:bg-slate-900/50 p-1.5 rounded-lg transition-colors"
          >
            <span className="text-slate-400">Database & Backend:</span>
            <span className={`font-bold ${backendHealth?.database.connected ? 'text-emerald-400' : 'text-amber-400'}`}>
              {backendHealth?.database.connected ? 'MongoDB Connected' : 'Local Storage Mode (Tap)'}
            </span>
          </div>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-indigo-600/25 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 bg-indigo-500 text-white rounded-full text-xs font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-3 border-t border-slate-800 flex justify-around">
            <button onClick={exportDataToJson} className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white py-2">
              <Download className="w-4 h-4" /> <span>Backup JSON</span>
            </button>
            <button onClick={resetToCleanRealState} className="flex items-center space-x-1 text-xs text-amber-400 hover:text-amber-300 py-2">
              <RotateCcw className="w-4 h-4" /> <span>Reset Clean State</span>
            </button>
          </div>
        </div>
      )}

      <DatabaseConnectionModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
        onRefreshHealth={refreshHealth}
      />
    </header>
  );
};
