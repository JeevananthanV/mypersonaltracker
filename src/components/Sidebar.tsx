import React, { useState, useEffect, useMemo } from 'react';
import {
  Home,
  IndianRupee,
  Layers,
  Coins,
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
  Download,
  ChevronRight,
  ChevronDown,
  Plus,
  Search,
  ShieldCheck,
  TrendingUp,
  Award,
  Flame,
  Scale,
  Droplets,
  Target,
  Clock,
  Wallet,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  Star,
  Zap,
  BarChart3,
  WalletCards
} from 'lucide-react';
import { useLifeOS } from '../context/LifeOSContext';
import { NavTab } from '../types';
import { checkBackendHealth, HealthResponse } from '../services/api';
import { getLiveDateString } from '../utils/date-utils';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

interface SubMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

interface TrackerNavItem {
  id: NavTab;
  label: string;
  icon: React.ReactNode;
  category: 'command' | 'finance' | 'health' | 'career' | 'productivity';
  badge?: string | number;
  badgeColor?: string;
  entryType: 'expense' | 'loan' | 'basic_need' | 'investment' | 'task' | 'fitness' | 'learning' | 'idea';
  entryLabel: string;
  subMenus: SubMenuItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const {
    activeTab,
    activeSubTab,
    setActiveTab,
    setActiveSubTab,
    navigateToTab,
    openQuickAdd,
    loanAccounts,
    outstandingPrincipal,
    investments,
    totalPortfolioValue,
    tasks,
    habits,
    fitnessProfile,
    earnedBadges,
    skills,
    projects,
    ideas,
    exportDataToJson,
    triggerConfetti
  } = useLifeOS();

  const [backendHealth, setBackendHealth] = useState<HealthResponse | null>(null);
  const [checkingBackend, setCheckingBackend] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Track expanded trackers (collapsible state)
  const [expandedTrackers, setExpandedTrackers] = useState<Record<string, boolean>>({
    loans: true,
    investments: true,
    finance: false,
    fitness: false,
    career: false,
    tasks: false
  });

  // Automatically expand the active tracker when tab changes
  useEffect(() => {
    if (activeTab) {
      const parentTab = 
        ['digi_gold', 'digi_silver', 'groww_stocks', 'chits', 'mutual_funds'].includes(activeTab) ? 'investments' :
        ['daily_expense', 'basic_needs'].includes(activeTab) ? 'finance' :
        ['weight_tracker', 'workout_log'].includes(activeTab) ? 'fitness' :
        ['loan_waterfall', 'loan_amortization', 'loan_ledger', 'loan_simulator'].includes(activeTab) ? 'loans' :
        activeTab === 'skills' ? 'career' :
        activeTab === 'habits' ? 'tasks' :
        activeTab;

      setExpandedTrackers(prev => ({
        ...prev,
        [parentTab]: true
      }));
    }
  }, [activeTab]);

  const toggleTrackerExpanded = (trackerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedTrackers(prev => ({
      ...prev,
      [trackerId]: !prev[trackerId]
    }));
  };

  const activeLoansCount = loanAccounts.filter(l => l.currentPrincipal > 0).length;

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

  useEffect(() => {
    refreshHealth();
    const interval = setInterval(refreshHealth, 20000);
    return () => clearInterval(interval);
  }, []);

  // Multi-Tracker Catalog with Sub-Menus and Separate Entry / Data Monitoring
  const trackerItems: TrackerNavItem[] = useMemo(() => [
    {
      id: 'dashboard',
      label: 'Home Command Center',
      icon: <Home className="w-4 h-4" />,
      category: 'command',
      badge: 'Live',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      entryType: 'task',
      entryLabel: '+ Focus',
      subMenus: [
        { id: 'overview', label: 'Executive Dashboard', icon: <Zap className="w-3.5 h-3.5 text-indigo-400" /> },
        { id: 'pay_cycle', label: '4-Phase Pay Cycle', icon: <Clock className="w-3.5 h-3.5 text-emerald-400" /> }
      ]
    },
    {
      id: 'loans',
      label: 'Loans & Debt Reduction',
      icon: <Layers className="w-4 h-4 text-rose-400" />,
      category: 'finance',
      badge: activeLoansCount > 0 ? `${activeLoansCount} Loans` : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      entryType: 'loan',
      entryLabel: '+ Pay',
      subMenus: [
        { id: 'dossiers', label: '3 Loan Accounts (HDFC/Canara/Slice)', icon: <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />, badge: `₹${(outstandingPrincipal / 1000).toFixed(0)}k` },
        { id: 'interest_cashflow', label: '4-Phase Waterfall (Days 1–30)', icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> },
        { id: 'amortization', label: 'Fixed ₹2,000 EMI Engine', icon: <IndianRupee className="w-3.5 h-3.5 text-amber-400" /> },
        { id: 'ledger', label: 'Payment Ledger & Statements', icon: <FileText className="w-3.5 h-3.5 text-slate-400" /> },
        { id: 'simulator', label: 'Payoff Simulator & Roadmap', icon: <Target className="w-3.5 h-3.5 text-indigo-400" /> }
      ]
    },
    {
      id: 'investments',
      label: 'Investment & Wealth Portfolio',
      icon: <Coins className="w-4 h-4 text-amber-400" />,
      category: 'finance',
      badge: investments.length > 0 ? `₹${Math.round(totalPortfolioValue).toLocaleString('en-IN')}` : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      entryType: 'investment',
      entryLabel: '+ Add',
      subMenus: [
        { id: 'overview', label: 'Portfolio Overview & Hub', icon: <BarChart3 className="w-3.5 h-3.5 text-amber-400" /> },
        { id: 'daily_chit', label: 'Daily Pay Chit Record', icon: <Flame className="w-3.5 h-3.5 text-amber-400" />, badge: '₹100/day' },
        { id: 'salem_gold_sheet', label: 'Salem Gold Sheet & Scheme Rates', icon: <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />, badge: 'Salem Live' },
        { id: 'digi_gold', label: 'Digital Gold (22K Pothys)', icon: <Coins className="w-3.5 h-3.5 text-yellow-400" />, badge: '0.0395g' },
        { id: 'digi_silver', label: 'Digital Silver (999 Pure)', icon: <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />, badge: '4.954g' },
        { id: 'groww_stocks', label: 'Groww Stocks (ITC & TATAGOLD)', icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />, badge: '₹1,821' },
        { id: 'chits', label: 'Jeweller Chits (11M Shett)', icon: <Award className="w-3.5 h-3.5 text-amber-400" />, badge: '₹4k/mo' },
        { id: 'mutual_funds', label: 'Mutual Funds & SIPs', icon: <Sparkles className="w-3.5 h-3.5 text-indigo-400" />, badge: '₹2k/mo' }
      ]
    },
    {
      id: 'finance',
      label: 'Daily Finance & Budget',
      icon: <IndianRupee className="w-4 h-4 text-emerald-400" />,
      category: 'finance',
      badge: '₹34k Salary',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      entryType: 'expense',
      entryLabel: '+ Expense',
      subMenus: [
        { id: 'overview', label: 'Budget & Cash Flow', icon: <BarChart3 className="w-3.5 h-3.5 text-emerald-400" /> },
        { id: 'income', label: 'Income & Earnings Monitor', icon: <WalletCards className="w-3.5 h-3.5 text-emerald-400" />, badge: '₹34k+' },
        { id: 'daily_tracker', label: 'Daily Expense Ledger', icon: <FileText className="w-3.5 h-3.5 text-teal-400" /> },
        { id: 'loans', label: 'Basic Living Needs (Rent/Food)', icon: <Wallet className="w-3.5 h-3.5 text-amber-400" /> },
        { id: 'simulator', label: 'Income & Expense Simulator', icon: <Target className="w-3.5 h-3.5 text-indigo-400" /> },
        { id: 'transactions', label: 'Full Transaction History', icon: <Clock className="w-3.5 h-3.5 text-slate-400" /> }
      ]
    },
    {
      id: 'fitness',
      label: 'Health & Fitness OS',
      icon: <Activity className="w-4 h-4 text-teal-400" />,
      category: 'health',
      badge: `${fitnessProfile.currentWeight || 57}kg`,
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
      entryType: 'fitness',
      entryLabel: '+ Log',
      subMenus: [
        { id: 'workout', label: 'Workout & Activity Log', icon: <Flame className="w-3.5 h-3.5 text-orange-400" /> },
        { id: 'weight', label: 'Weight Tracker (57kg → 60kg)', icon: <Scale className="w-3.5 h-3.5 text-teal-400" />, badge: 'Target 60' },
        { id: 'trends', label: 'Water & Sleep Trends', icon: <Droplets className="w-3.5 h-3.5 text-blue-400" /> },
        { id: 'badges', label: 'Gamified Badges & Streaks', icon: <Award className="w-3.5 h-3.5 text-yellow-400" />, badge: `${earnedBadges.length}` }
      ]
    },
    {
      id: 'career',
      label: 'AI/ML Career Center',
      icon: <BrainCircuit className="w-4 h-4 text-violet-400" />,
      category: 'career',
      badge: '₹10-15 LPA',
      badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
      entryType: 'learning',
      entryLabel: '+ Hours',
      subMenus: [
        { id: 'skills', label: `Skill Modules (${skills.length})`, icon: <Zap className="w-3.5 h-3.5 text-violet-400" /> },
        { id: 'overview', label: 'Target CTC & Career Roadmap', icon: <Target className="w-3.5 h-3.5 text-indigo-400" /> }
      ]
    },
    {
      id: 'projects',
      label: 'Software Projects Tracker',
      icon: <FolderGit2 className="w-4 h-4 text-cyan-400" />,
      category: 'career',
      badge: projects.length > 0 ? `${projects.length}` : undefined,
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      entryType: 'idea',
      entryLabel: '+ Project',
      subMenus: [
        { id: 'active', label: 'Active Repositories & Demos', icon: <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" /> },
        { id: 'completed', label: 'Shipped Software Portfolio', icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> }
      ]
    },
    {
      id: 'ideas',
      label: 'Ideas & Second Brain',
      icon: <Lightbulb className="w-4 h-4 text-yellow-400" />,
      category: 'career',
      badge: ideas.length > 0 ? `${ideas.length}` : undefined,
      badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      entryType: 'idea',
      entryLabel: '+ Note',
      subMenus: [
        { id: 'pinned', label: 'Pinned Insights & Core Vision', icon: <Star className="w-3.5 h-3.5 text-yellow-400" /> },
        { id: 'all', label: 'All Notes & Brainstorming', icon: <FileText className="w-3.5 h-3.5 text-slate-400" /> }
      ]
    },
    {
      id: 'tasks',
      label: 'Tasks & Habits Matrix',
      icon: <CheckSquare className="w-4 h-4 text-blue-400" />,
      category: 'productivity',
      badge: pendingTasks > 0 ? `${pendingTasks} Due` : undefined,
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      entryType: 'task',
      entryLabel: '+ Task',
      subMenus: [
        { id: 'top3', label: 'Daily Top 3 Priorities', icon: <Star className="w-3.5 h-3.5 text-amber-400" /> },
        { id: 'all', label: 'Scheduled Tasks & Deadlines', icon: <Clock className="w-3.5 h-3.5 text-slate-400" /> },
        { id: 'habits', label: 'Daily Habits Consistency', icon: <Flame className="w-3.5 h-3.5 text-emerald-400" />, badge: `${habitPercentage}%` }
      ]
    },
    {
      id: 'review',
      label: 'Weekly Planner & Calendar',
      icon: <CalendarDays className="w-4 h-4 text-purple-400" />,
      category: 'productivity',
      entryType: 'task',
      entryLabel: '+ Plan',
      subMenus: [
        { id: 'calendar', label: 'Weekly Planner & Calendar', icon: <CalendarDays className="w-3.5 h-3.5 text-purple-400" /> },
        { id: 'retrospective', label: 'Sprint Retrospective & Wins', icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> }
      ]
    }
  ], [
    activeLoansCount,
    outstandingPrincipal,
    investments.length,
    totalPortfolioValue,
    fitnessProfile.currentWeight,
    earnedBadges.length,
    skills.length,
    projects.length,
    ideas.length,
    pendingTasks,
    habitPercentage
  ]);

  // Section categories
  const sections = [
    {
      key: 'command',
      title: 'COMMAND CENTER',
      accentColor: 'text-indigo-400',
      trackers: trackerItems.filter(t => t.category === 'command')
    },
    {
      key: 'finance',
      title: 'WEALTH & FINANCE TRACKERS',
      accentColor: 'text-amber-400',
      trackers: trackerItems.filter(t => t.category === 'finance')
    },
    {
      key: 'health',
      title: 'HEALTH & FITNESS TRACKERS',
      accentColor: 'text-teal-400',
      trackers: trackerItems.filter(t => t.category === 'health')
    },
    {
      key: 'career',
      title: 'AI/ML & CAREER TRACKERS',
      accentColor: 'text-violet-400',
      trackers: trackerItems.filter(t => t.category === 'career')
    },
    {
      key: 'productivity',
      title: 'PRODUCTIVITY TRACKERS',
      accentColor: 'text-blue-400',
      trackers: trackerItems.filter(t => t.category === 'productivity')
    }
  ];

  // Search filter
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const query = searchQuery.toLowerCase();

    return sections
      .map(sec => {
        const matchingTrackers = sec.trackers.filter(t => {
          const matchLabel = t.label.toLowerCase().includes(query);
          const matchSub = t.subMenus.some(s => s.label.toLowerCase().includes(query));
          return matchLabel || matchSub;
        });

        return {
          ...sec,
          trackers: matchingTrackers
        };
      })
      .filter(sec => sec.trackers.length > 0);
  }, [searchQuery, sections]);

  const handleSelectSubMenu = (tabId: NavTab, subMenuId: string) => {
    // Dedicated standalone pages mapping
    const separatePageMap: Record<string, NavTab> = {
      income: 'income',
      daily_chit: 'daily_chit',
      salem_gold_sheet: 'salem_gold_sheet',
      digi_gold: 'digi_gold',
      digi_silver: 'digi_silver',
      groww_stocks: 'groww_stocks',
      chits: 'chits',
      mutual_funds: 'mutual_funds',
      daily_tracker: 'daily_expense',
      weight: 'weight_tracker',
      workout: 'workout_log',
      skills: 'skills',
      habits: 'habits'
    };

    if (separatePageMap[subMenuId]) {
      setActiveTab(separatePageMap[subMenuId]);
      setActiveSubTab(subMenuId);
    } else {
      navigateToTab(tabId, subMenuId);
    }
    setMobileOpen(false);
  };

  const handleQuickAddClick = (e: React.MouseEvent, entryType: any) => {
    e.stopPropagation();
    openQuickAdd(entryType);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 z-40 lg:hidden backdrop-blur-md"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0B101D] border-r border-slate-800/90 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Brand Logo & App Identity with 3D Depth */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-slate-800/80">
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                <Sparkles className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-base font-black text-white tracking-tight">Life OS</span>
                <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  3D PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Jeeva's Personal OS</p>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search / Filter Trackers Bar & Global Quick Add */}
        <div className="p-3 space-y-2 border-b border-slate-800/70 bg-[#080C16]">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search trackers & monitors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={() => openQuickAdd('expense')}
            className="w-full py-1.5 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-500 to-emerald-500 hover:from-indigo-400 hover:to-emerald-400 text-slate-950 flex items-center justify-center space-x-1.5 shadow-md shadow-indigo-500/20 transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Quick Entry / Record</span>
          </button>
        </div>

        {/* Scrollable Navigation Hierarchy with Sub-Headings and Sub-Menus */}
        <nav className="flex-1 space-y-5 overflow-y-auto p-3 scrollbar-thin">
          {filteredSections.map((sec) => (
            <div key={sec.key} className="space-y-1.5">
              {/* Section Sub-Heading */}
              <div className="px-2 pt-1 flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                <span className={`flex items-center gap-1.5 ${sec.accentColor}`}>
                  {sec.title}
                </span>
                <span className="text-[9px] text-slate-400 font-mono">
                  {sec.trackers.length} {sec.trackers.length === 1 ? 'tracker' : 'trackers'}
                </span>
              </div>

              {/* Trackers List in this Section */}
              <div className="space-y-1">
                {sec.trackers.map((item) => {
                  const isTrackerActive = activeTab === item.id ||
                    (item.id === 'investments' && ['daily_chit', 'digi_gold', 'digi_silver', 'groww_stocks', 'chits', 'mutual_funds'].includes(activeTab)) ||
                    (item.id === 'finance' && ['income', 'daily_expense', 'basic_needs'].includes(activeTab)) ||
                    (item.id === 'fitness' && ['weight_tracker', 'workout_log'].includes(activeTab)) ||
                    (item.id === 'loans' && ['loan_waterfall', 'loan_amortization', 'loan_ledger', 'loan_simulator'].includes(activeTab)) ||
                    (item.id === 'career' && activeTab === 'skills') ||
                    (item.id === 'tasks' && activeTab === 'habits');

                  const isExpanded = expandedTrackers[item.id] || searchQuery.length > 0;
                  const hasSubMenus = item.subMenus && item.subMenus.length > 0;

                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl transition-all duration-300 border ${
                        isTrackerActive
                          ? 'bg-gradient-to-r from-indigo-950/50 via-slate-900/90 to-slate-900/80 border-indigo-500/40 shadow-lg shadow-indigo-950/40'
                          : 'bg-transparent border-transparent hover:bg-slate-900/40 hover:border-slate-800/60'
                      }`}
                    >
                      {/* Tracker Parent Header Row */}
                      <div
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-2xl text-xs font-bold cursor-pointer transition select-none group ${
                          isTrackerActive
                            ? 'text-white'
                            : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-2 min-w-0">
                          {/* Expand/Collapse Toggle Chevron */}
                          {hasSubMenus ? (
                            <button
                              type="button"
                              onClick={(e) => toggleTrackerExpanded(item.id, e)}
                              className="p-1 -ml-1 text-slate-400 hover:text-white transition rounded"
                              title={isExpanded ? 'Collapse sub-menus' : 'Expand sub-menus'}
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                              )}
                            </button>
                          ) : (
                            <div className="w-4" />
                          )}

                          <span className={`shrink-0 ${isTrackerActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'}`}>
                            {item.icon}
                          </span>
                          <span className="truncate">{item.label}</span>
                        </div>

                        {/* Right Actions: Live Badge & Dedicated Separate Entry '+' Button */}
                        <div className="flex items-center space-x-1.5 shrink-0 ml-1">
                          {item.badge !== undefined && (
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono border ${
                              item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}>
                              {item.badge}
                            </span>
                          )}

                          {/* Dedicated Tracker Entry '+' Trigger */}
                          <button
                            type="button"
                            onClick={(e) => handleQuickAddClick(e, item.entryType)}
                            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition opacity-80 group-hover:opacity-100 hover:scale-110 active:scale-95"
                            title={`Quick Record / Entry: ${item.entryLabel}`}
                          >
                            <Plus className="w-3.5 h-3.5 text-emerald-400" />
                          </button>
                        </div>
                      </div>

                      {/* Sub-Menus (Separate Data Monitoring Rows) */}
                      {hasSubMenus && isExpanded && (
                        <div className="ml-5 pl-2.5 my-1 space-y-0.5 border-l border-slate-800/80 animate-fade-in">
                          {item.subMenus.map((sub) => {
                            const isSubActive =
                              activeTab === sub.id ||
                              (activeTab === 'income' && sub.id === 'income') ||
                              (activeTab === 'daily_chit' && sub.id === 'daily_chit') ||
                              (activeTab === 'digi_gold' && sub.id === 'digi_gold') ||
                              (activeTab === 'digi_silver' && sub.id === 'digi_silver') ||
                              (activeTab === 'groww_stocks' && sub.id === 'groww_stocks') ||
                              (activeTab === 'chits' && sub.id === 'chits') ||
                              (activeTab === 'mutual_funds' && sub.id === 'mutual_funds') ||
                              (activeTab === 'daily_expense' && sub.id === 'daily_tracker') ||
                              (activeTab === 'weight_tracker' && sub.id === 'weight') ||
                              (activeTab === 'workout_log' && sub.id === 'workout') ||
                              (activeTab === 'skills' && sub.id === 'skills') ||
                              (activeTab === 'habits' && sub.id === 'habits') ||
                              (isTrackerActive && activeSubTab === sub.id);

                            return (
                              <button
                                key={sub.id}
                                onClick={() => handleSelectSubMenu(item.id, sub.id)}
                                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition text-left group/sub ${
                                  isSubActive
                                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                                }`}
                              >
                                <div className="flex items-center space-x-2 truncate">
                                  {sub.icon || <div className={`w-1.5 h-1.5 rounded-full ${isSubActive ? 'bg-indigo-400' : 'bg-slate-600'}`} />}
                                  <span className="truncate">{sub.label}</span>
                                </div>

                                {sub.badge && (
                                  <span className="ml-1.5 px-1.5 py-0.2 rounded text-[9.5px] font-mono bg-slate-800/90 text-slate-300 border border-slate-700/80 shrink-0">
                                    {sub.badge}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* MongoDB Cloud Sync Pill */}
        <div className="pt-2 pb-1 px-3 border-t border-slate-800/80 bg-[#080C16]">
          <button
            onClick={refreshHealth}
            title={backendHealth?.database.connected ? 'MongoDB Atlas Online' : 'Local Storage Mode'}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs bg-slate-900/90 border border-slate-800 text-slate-300 hover:border-slate-700 transition-colors"
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
        <div className="p-3 bg-[#080C16]">
          <div className="p-3 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800/80 text-left relative overflow-hidden group">
            <div className="flex items-center space-x-2.5 mb-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Mountain className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">Better Habits</p>
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

            <p className="text-[10px] text-slate-400 italic leading-relaxed">
              "Small steps every day lead to big results."
            </p>

            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
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
        </div>
      </aside>
    </>
  );
};
