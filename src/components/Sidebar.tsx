import React, { useState } from 'react';
import {
  Home,
  Coins,
  Award,
  TrendingUp,
  Layers,
  IndianRupee,
  CheckSquare,
  Activity,
  BrainCircuit,
  FolderGit2,
  CalendarDays,
  Calendar,
  X,
  RefreshCw,
  Download,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useLifeOS } from '../context/LifeOSContext';
import { NavTab } from '../types';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const {
    activeTab,
    navigateToTab,
    loanAccounts,
    outstandingPrincipal,
    investments,
    totalPortfolioValue,
    salemRate,
    isFetchingSalemRate,
    refreshSalemGoldRate,
    tasks,
    fitnessProfile,
    exportDataToJson,
    triggerConfetti
  } = useLifeOS();

  const handleNavClick = (id: NavTab) => {
    navigateToTab(id);
    setMobileOpen(false);
  };

  const activeLoansCount = loanAccounts.filter(l => l.currentPrincipal > 0).length;
  const pendingTasksCount = tasks.filter(t => t.status !== 'completed').length;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0B101D] border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand & App Identity */}
        <div className="px-6 py-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-600/30">
              J
            </div>
            <div>
              <div className="font-heading font-black text-base text-white tracking-tight flex items-center gap-1.5">
                <span>Jeeva's Life OS</span>
              </div>
              <p className="text-[11px] text-slate-400">Personal Command Center · 2026</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Salem Gold Ticker Card in Sidebar */}
        <div className="p-4 mx-4 mt-4 rounded-2xl bg-amber-500/10 border border-amber-500/25">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-amber-300 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              Salem Bullion Live
            </span>
            <button
              onClick={() => refreshSalemGoldRate()}
              className="text-amber-400 hover:text-amber-200 transition-colors"
              title="Refresh live rate"
            >
              <RefreshCw className={`w-3 h-3 ${isFetchingSalemRate ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-[11px] text-amber-400/80">22K 916 Hallmark</div>
              <div className="font-mono text-base font-bold text-amber-200 tabular-nums">
                ₹{salemRate.gold22kPerGram.toLocaleString('en-IN')}<span className="text-[11px] font-normal text-amber-400/80">/g</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-amber-400/80">1 Sovereign (8g)</div>
              <div className="font-mono text-xs font-semibold text-amber-300 tabular-nums">
                ₹{salemRate.goldSovereign8g.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Categories */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 text-xs">
          {/* 1. Core Overview */}
          <div>
            <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Overview
            </div>
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Home className="w-4 h-4 text-indigo-400" />
                <span className="text-sm">Command Center</span>
              </span>
              {activeTab === 'dashboard' && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
            </button>
          </div>

          {/* 2. Salem Gold & Wealth (3 Chits & 2 Stocks) */}
          <div>
            <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Gold & Wealth
            </div>
            <div className="space-y-1">
              <button
                onClick={() => handleNavClick('salem_gold_sheet')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'salem_gold_sheet'
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>Salem Gold Monitor</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-[10px] font-mono text-amber-300">
                  Live
                </span>
              </button>

              <button
                onClick={() => handleNavClick('chits')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'chits'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>3 Active Chits</span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  GRT/Saravana
                </span>
              </button>

              <button
                onClick={() => handleNavClick('groww_stocks')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'groww_stocks'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span>2 Active Stocks</span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  ITC/TATAGOLD
                </span>
              </button>
            </div>
          </div>

          {/* 3. Debt Freedom (3 Loans) */}
          <div>
            <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Debt Freedom
            </div>
            <button
              onClick={() => handleNavClick('loans')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === 'loans'
                  ? 'bg-rose-600/90 text-white shadow-md shadow-rose-600/30 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-rose-400" />
                <span>3 Loans Waterfall</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-mono text-[10px]">
                ₹{(outstandingPrincipal / 1000).toFixed(0)}k
              </span>
            </button>
          </div>

          {/* 4. Cash Flow & Salary */}
          <div>
            <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Cash Flow
            </div>
            <div className="space-y-1">
              <button
                onClick={() => handleNavClick('income')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'income'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <IndianRupee className="w-4 h-4 text-emerald-400" />
                  <span>₹34k Salary & Income</span>
                </span>
              </button>

              <button
                onClick={() => handleNavClick('daily_expense')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'daily_expense'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <IndianRupee className="w-4 h-4 text-slate-400" />
                  <span>Daily Expense Log</span>
                </span>
              </button>
            </div>
          </div>

          {/* 5. Health, Career & Habits */}
          <div>
            <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Growth & Health
            </div>
            <div className="space-y-1">
              <button
                onClick={() => handleNavClick('tasks')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'tasks'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <CheckSquare className="w-4 h-4 text-violet-400" />
                  <span>Tasks & Top 3</span>
                </span>
                {pendingTasksCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[10px] font-mono">
                    {pendingTasksCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick('fitness')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'fitness'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Fitness & 57 kg Goal</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {fitnessProfile.currentWeight}kg
                </span>
              </button>

              <button
                onClick={() => handleNavClick('career')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'career'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <BrainCircuit className="w-4 h-4 text-indigo-400" />
                  <span>AI/ML Career</span>
                </span>
              </button>

              <button
                onClick={() => handleNavClick('projects')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'projects'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <FolderGit2 className="w-4 h-4 text-cyan-400" />
                  <span>Software Projects</span>
                </span>
              </button>

              <button
                onClick={() => handleNavClick('review')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'review'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <CalendarDays className="w-4 h-4 text-amber-400" />
                  <span>Sunday Review</span>
                </span>
              </button>

              <button
                onClick={() => handleNavClick('calendar')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'calendar'
                    ? 'bg-gradient-to-r from-indigo-600 to-emerald-600 text-white font-semibold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>Google Calendar</span>
                </span>
                <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-[10px] font-mono text-emerald-300">
                  Live
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Footer Actions */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
            <span>Data Storage</span>
            <span className="text-emerald-400 font-mono text-[11px]">Local & Real-Time</span>
          </div>
          <button
            onClick={() => {
              exportDataToJson();
              triggerConfetti();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-medium transition-all"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export JSON Backup</span>
          </button>
        </div>
      </aside>
    </>
  );
};
