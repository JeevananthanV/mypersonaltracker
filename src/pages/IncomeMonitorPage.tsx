import React, { useState, useMemo } from 'react';
import {
  WalletCards,
  IndianRupee,
  Plus,
  Briefcase,
  Laptop,
  Clock,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Filter,
  DollarSign,
  AlertCircle,
  Edit2,
  Trash2,
  Layers,
  ChevronRight,
  Sliders,
  Check,
  Building2,
  FileText,
  PieChart as PieIcon,
  BarChart3,
  Flame,
  ArrowRight
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useLifeOS } from '../context/LifeOSContext';
import { IncomeItem, IncomeCategory, IncomeFrequency, IncomeStatus } from '../types';
import { Card3D } from '../components/ui/Card3D';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { getLiveDateString } from '../utils/date-utils';

const formatCurrency = (val: number) => `₹${Math.round(val || 0).toLocaleString('en-IN')}`;

export const IncomeMonitorPage: React.FC = () => {
  const {
    salary,
    incomeStreams,
    addIncomeStream,
    updateIncomeStream,
    deleteIncomeStream,
    markIncomeReceived,
    quickCreditSalary,
    totalReceivedIncome,
    totalPendingReceivables,
    totalFreelanceEarnings,
    totalPartTimeEarnings,
    loanAccounts,
    triggerConfetti
  } = useLifeOS();

  const todayStr = getLiveDateString();

  // Active filter tab
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | IncomeCategory>('all');
  const [activeChannelTab, setActiveChannelTab] = useState<'all' | 'salary' | 'freelancing' | 'part_time'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IncomeItem | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<IncomeCategory>('freelancing');
  const [formSource, setFormSource] = useState('');
  const [formAmount, setFormAmount] = useState<number>(10000);
  const [formFrequency, setFormFrequency] = useState<IncomeFrequency>('per_project');
  const [formStatus, setFormStatus] = useState<IncomeStatus>('in_progress');
  const [formDueDate, setFormDueDate] = useState('');
  const [formDateReceived, setFormDateReceived] = useState(todayStr);
  const [formHourlyRate, setFormHourlyRate] = useState<number>(800);
  const [formHoursWorked, setFormHoursWorked] = useState<number>(10);
  const [formMilestone, setFormMilestone] = useState('');
  const [formInvoiceNumber, setFormInvoiceNumber] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formColorTag, setFormColorTag] = useState<'emerald' | 'cyan' | 'amber' | 'indigo' | 'purple' | 'rose'>('cyan');

  // Simulator State: Extra side income simulator
  const [simExtraSideIncome, setSimExtraSideIncome] = useState<number>(15000);

  // Open Modal for Add / Edit
  const handleOpenAddModal = (defaultCat: IncomeCategory = 'freelancing') => {
    setEditingItem(null);
    setFormTitle('');
    setFormCategory(defaultCat);
    setFormSource('');
    setFormAmount(defaultCat === 'part_time' ? 8000 : 15000);
    setFormFrequency(defaultCat === 'part_time' ? 'hourly' : defaultCat === 'salary' ? 'monthly' : 'per_project');
    setFormStatus('in_progress');
    setFormDueDate('');
    setFormDateReceived(todayStr);
    setFormHourlyRate(800);
    setFormHoursWorked(10);
    setFormMilestone('');
    setFormInvoiceNumber('');
    setFormNotes('');
    setFormColorTag(defaultCat === 'salary' ? 'emerald' : defaultCat === 'part_time' ? 'amber' : 'cyan');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: IncomeItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormSource(item.sourceOrClient);
    setFormAmount(item.amount);
    setFormFrequency(item.frequency);
    setFormStatus(item.status);
    setFormDueDate(item.dueDateOrPayday || '');
    setFormDateReceived(item.dateReceived || todayStr);
    setFormHourlyRate(item.hourlyRate || 800);
    setFormHoursWorked(item.hoursWorked || 0);
    setFormMilestone(item.projectMilestone || '');
    setFormInvoiceNumber(item.invoiceNumber || '');
    setFormNotes(item.notes || '');
    setFormColorTag(item.colorTag || 'cyan');
    setIsModalOpen(true);
  };

  const handleSaveIncomeItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formSource.trim()) return;

    const computedAmount = formFrequency === 'hourly' && formHourlyRate > 0 && formHoursWorked > 0
      ? formHourlyRate * formHoursWorked
      : Number(formAmount) || 0;

    if (editingItem) {
      updateIncomeStream(editingItem.id, {
        title: formTitle.trim(),
        category: formCategory,
        sourceOrClient: formSource.trim(),
        amount: computedAmount,
        frequency: formFrequency,
        status: formStatus,
        dueDateOrPayday: formDueDate || undefined,
        dateReceived: formStatus === 'received' ? formDateReceived : undefined,
        hourlyRate: formFrequency === 'hourly' ? Number(formHourlyRate) : undefined,
        hoursWorked: formFrequency === 'hourly' ? Number(formHoursWorked) : undefined,
        projectMilestone: formMilestone.trim() || undefined,
        invoiceNumber: formInvoiceNumber.trim() || undefined,
        notes: formNotes.trim() || undefined,
        colorTag: formColorTag
      });
    } else {
      addIncomeStream({
        title: formTitle.trim(),
        category: formCategory,
        sourceOrClient: formSource.trim(),
        amount: computedAmount,
        frequency: formFrequency,
        status: formStatus,
        dueDateOrPayday: formDueDate || undefined,
        dateReceived: formStatus === 'received' ? formDateReceived : undefined,
        hourlyRate: formFrequency === 'hourly' ? Number(formHourlyRate) : undefined,
        hoursWorked: formFrequency === 'hourly' ? Number(formHoursWorked) : undefined,
        projectMilestone: formMilestone.trim() || undefined,
        invoiceNumber: formInvoiceNumber.trim() || undefined,
        notes: formNotes.trim() || undefined,
        colorTag: formColorTag
      });
    }

    setIsModalOpen(false);
  };

  // Filtered streams
  const filteredStreams = useMemo(() => {
    return incomeStreams.filter(item => {
      const matchCat = activeCategoryFilter === 'all' || item.category === activeCategoryFilter;
      const matchChannel = activeChannelTab === 'all' || item.category === activeChannelTab;
      const matchQuery = searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sourceOrClient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.invoiceNumber && item.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchChannel && matchQuery;
    });
  }, [incomeStreams, activeCategoryFilter, activeChannelTab, searchQuery]);

  // Aggregate Metrics
  const totalPipelineInflow = useMemo(() => {
    return incomeStreams.reduce((s, i) => s + (Number(i.amount) || 0), 0);
  }, [incomeStreams]);

  const sideHustleActiveTotal = totalFreelanceEarnings + totalPartTimeEarnings;
  const sideIncomeRatio = salary > 0 ? ((sideHustleActiveTotal / salary) * 100).toFixed(1) : '0';

  // Total Loan EMI Outflow
  const totalMonthlyEmi = useMemo(() => {
    return loanAccounts
      .filter(l => l.status === 'active')
      .reduce((s, l) => s + (l.monthlyEmi || l.estimatedEmi || 0), 0);
  }, [loanAccounts]);

  // Chart Data: Inflow Breakdown by Category
  const categoryChartData = useMemo(() => {
    const cats: Record<string, number> = {
      'Salary (Job)': 0,
      'Freelancing': 0,
      'Part-Time': 0,
      'Dividends & Other': 0
    };

    incomeStreams.forEach(item => {
      if (item.category === 'salary') cats['Salary (Job)'] += item.amount;
      else if (item.category === 'freelancing') cats['Freelancing'] += item.amount;
      else if (item.category === 'part_time') cats['Part-Time'] += item.amount;
      else cats['Dividends & Other'] += item.amount;
    });

    return [
      { name: 'Salary (Job)', value: cats['Salary (Job)'], color: '#10B981' },
      { name: 'Freelancing', value: cats['Freelancing'], color: '#06B6D4' },
      { name: 'Part-Time', value: cats['Part-Time'], color: '#F59E0B' },
      { name: 'Dividends & Other', value: cats['Dividends & Other'], color: '#8B5CF6' }
    ].filter(c => c.value > 0);
  }, [incomeStreams]);

  // Chart Data: Inflow vs Outflow Comparison
  const inflowVsOutflowData = useMemo(() => {
    return [
      { name: 'Base Salary', amount: salary, fill: '#10B981' },
      { name: 'Total Inflow (Received)', amount: totalReceivedIncome, fill: '#06B6D4' },
      { name: 'Total Pipeline', amount: totalPipelineInflow, fill: '#3B82F6' },
      { name: '3 Loans EMIs', amount: totalMonthlyEmi, fill: '#F43F5E' },
      { name: 'Surplus Buffer', amount: Math.max(0, totalReceivedIncome - totalMonthlyEmi), fill: '#F59E0B' }
    ];
  }, [salary, totalReceivedIncome, totalPipelineInflow, totalMonthlyEmi]);

  // Loan Payoff Simulation Calculation
  const totalOutstandingLoan = useMemo(() => {
    return loanAccounts
      .filter(l => l.status === 'active')
      .reduce((s, l) => s + (l.currentPrincipal || 0), 0);
  }, [loanAccounts]);

  const baseMonthsToFreedom = totalMonthlyEmi > 0 ? Math.ceil(totalOutstandingLoan / totalMonthlyEmi) : 14;
  const acceleratedMonthlyOutflow = totalMonthlyEmi + simExtraSideIncome;
  const acceleratedMonthsToFreedom = acceleratedMonthlyOutflow > 0 ? Math.ceil(totalOutstandingLoan / acceleratedMonthlyOutflow) : 14;
  const monthsSaved = Math.max(0, baseMonthsToFreedom - acceleratedMonthsToFreedom);

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* 1. Header & Top Command Bar */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#071916] via-[#09221C] to-[#0A1726] border border-emerald-500/30 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Glow ambient background elements */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 flex items-center gap-1.5 shadow-md shadow-emerald-500/20">
              <WalletCards className="w-4 h-4 text-slate-950" />
              Income & Revenue Command Center
            </span>
            <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ₹34,000 Guaranteed Base + Side Streams
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Multi-Stream Income & Earnings Monitor
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Real-time tracking for your <span className="text-emerald-300 font-medium">₹34,000 Fixed Salary</span>,{' '}
            <span className="text-cyan-300 font-medium">Freelance Contracts</span>, and{' '}
            <span className="text-amber-300 font-medium">Part-Time Shifts & Gigs</span> with automated bank ledger sync.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => quickCreditSalary()}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition flex items-center space-x-1.5 shadow-sm active:scale-95"
            title="1-Click Record Monthly ₹34,000 Salary Credit"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>⚡ Credit Salary (₹34k)</span>
          </button>

          <button
            onClick={() => handleOpenAddModal('freelancing')}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 transition flex items-center space-x-1.5 shadow-sm active:scale-95"
          >
            <Laptop className="w-4 h-4 text-cyan-400" />
            <span>+ Freelance Gig</span>
          </button>

          <button
            onClick={() => handleOpenAddModal('part_time')}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition flex items-center space-x-1.5 shadow-sm active:scale-95"
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>+ Part-Time Shift</span>
          </button>

          <button
            onClick={() => handleOpenAddModal()}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 transition shadow-lg shadow-emerald-500/20 flex items-center space-x-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Income Stream</span>
          </button>
        </div>
      </div>

      {/* 2. Executive 5-KPI Strip with 3D Tilt Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 perspective-1000">
        {/* Card 1: Total Received Inflow */}
        <ScrollReveal animation="fade-up" delay={50}>
          <Card3D glowColor="emerald" className="h-full">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-xl shadow-xl h-full flex flex-col justify-between hover:border-emerald-500/60 transition-colors group">
              <div className="flex items-center justify-between text-slate-400 mb-3">
                <span className="text-xs font-bold tracking-wide uppercase text-emerald-400">Received Inflow</span>
                <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 shadow-inner group-hover:scale-110 transition-transform">
                  <IndianRupee className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-400 tracking-tight">
                  <AnimatedCounter value={totalReceivedIncome} prefix="₹" />
                </div>
                <div className="mt-2 flex items-center space-x-1.5 text-xs text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Settled & credited to bank</span>
                </div>
              </div>
              <div className="mt-3 w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                  style={{ width: `${Math.min(100, (totalReceivedIncome / (salary || 34000)) * 100)}%` }}
                />
              </div>
            </div>
          </Card3D>
        </ScrollReveal>

        {/* Card 2: Pending Receivables */}
        <ScrollReveal animation="fade-up" delay={100}>
          <Card3D glowColor="cyan" className="h-full">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl shadow-xl h-full flex flex-col justify-between hover:border-cyan-500/50 transition-colors group">
              <div className="flex items-center justify-between text-slate-400 mb-3">
                <span className="text-xs font-bold tracking-wide uppercase text-slate-300">Pending Receivables</span>
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-inner group-hover:scale-110 transition-transform">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-cyan-300 tracking-tight">
                  <AnimatedCounter value={totalPendingReceivables} prefix="₹" />
                </div>
                <div className="mt-2 flex items-center space-x-1.5 text-xs text-cyan-300/80">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Invoiced & active client milestones</span>
                </div>
              </div>
              <div className="mt-3 w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-500 to-teal-400 h-full rounded-full w-2/3 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
              </div>
            </div>
          </Card3D>
        </ScrollReveal>

        {/* Card 3: Total Potential Pipeline */}
        <ScrollReveal animation="fade-up" delay={150}>
          <Card3D glowColor="indigo" className="h-full">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl shadow-xl h-full flex flex-col justify-between hover:border-indigo-500/50 transition-colors group">
              <div className="flex items-center justify-between text-slate-400 mb-3">
                <span className="text-xs font-bold tracking-wide uppercase text-slate-300">Total Month Pipeline</span>
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-inner group-hover:scale-110 transition-transform">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-white tracking-tight">
                  <AnimatedCounter value={totalPipelineInflow} prefix="₹" />
                </div>
                <div className="mt-2 flex items-center space-x-1.5 text-xs text-indigo-300">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{incomeStreams.length} active streams tracked</span>
                </div>
              </div>
              <div className="mt-3 w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-400 h-full rounded-full w-4/5 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
              </div>
            </div>
          </Card3D>
        </ScrollReveal>

        {/* Card 4: Side Hustle Velocity Ratio */}
        <ScrollReveal animation="fade-up" delay={200}>
          <Card3D glowColor="amber" className="h-full">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl shadow-xl h-full flex flex-col justify-between hover:border-amber-500/50 transition-colors group">
              <div className="flex items-center justify-between text-slate-400 mb-3">
                <span className="text-xs font-bold tracking-wide uppercase text-slate-300">Side Income Ratio</span>
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-inner group-hover:scale-110 transition-transform">
                  <Flame className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-amber-300 tracking-tight flex items-baseline">
                  <span>{sideIncomeRatio}%</span>
                  <span className="text-xs font-normal text-slate-400 ml-1.5">of salary</span>
                </div>
                <div className="mt-2 text-xs text-slate-400">
                  <strong className="text-amber-300">{formatCurrency(sideHustleActiveTotal)}</strong> freelance + gigs
                </div>
              </div>
              <div className="mt-3 w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-orange-400 h-full rounded-full w-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
              </div>
            </div>
          </Card3D>
        </ScrollReveal>

        {/* Card 5: Daily Earning Velocity */}
        <ScrollReveal animation="fade-up" delay={250}>
          <Card3D glowColor="emerald" className="h-full">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl shadow-xl h-full flex flex-col justify-between hover:border-emerald-500/50 transition-colors group">
              <div className="flex items-center justify-between text-slate-400 mb-3">
                <span className="text-xs font-bold tracking-wide uppercase text-slate-300">Daily Earning Pace</span>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-inner group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-white tracking-tight flex items-baseline">
                  <AnimatedCounter value={Math.round(totalReceivedIncome / 30)} prefix="₹" />
                  <span className="text-xs font-normal text-slate-400 ml-1">/day</span>
                </div>
                <div className="mt-2 text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>30-Day average run-rate</span>
                </div>
              </div>
              <div className="mt-3 w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full w-full shadow-[0_0_8px_rgba(20,184,166,0.5)]" />
              </div>
            </div>
          </Card3D>
        </ScrollReveal>
      </div>

      {/* 3. Interactive Multi-Stream Revenue Analytics Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Inflow vs Commitments Bar Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0C1222]/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                Revenue Allocation vs Debt Commitment Influx
              </h3>
              <p className="text-xs text-slate-400">
                Visualizing how received and pipeline income clears your ₹18,000 Loan EMI burden and generates surplus.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-800 text-emerald-400 border border-slate-700">
              Net Surplus: {formatCurrency(Math.max(0, totalReceivedIncome - totalMonthlyEmi))}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inflowVsOutflowData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={v => `₹${v / 1000}k`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl shadow-xl text-xs space-y-1">
                          <p className="font-bold text-white">{data.name}</p>
                          <p className="font-mono text-emerald-400 font-extrabold">{formatCurrency(data.amount)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  {inflowVsOutflowData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Revenue Mix Donut Chart */}
        <div className="p-6 rounded-2xl bg-[#0C1222]/90 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-cyan-400" />
              Revenue Diversification Mix
            </h3>
            <p className="text-xs text-slate-400">Share of income across categories</p>
          </div>

          <div className="h-44 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`donut-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [formatCurrency(Number(val)), 'Amount']}
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '0.75rem' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Pipeline</span>
              <span className="text-base font-black text-white">{formatCurrency(totalPipelineInflow)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
            {categoryChartData.map((cat, i) => (
              <div key={i} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="truncate text-slate-300 text-[11px]">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Three Dedicated Stream Command Channels (Interactive Tabs) */}
      <div className="space-y-4">
        {/* Channel Navigation Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Streams & Ledger', icon: Layers, count: incomeStreams.length },
              { id: 'salary', label: 'Fixed Salary Hub (₹34k)', icon: Building2, count: incomeStreams.filter(i => i.category === 'salary').length },
              { id: 'freelancing', label: 'Freelancing & Contracts', icon: Laptop, count: incomeStreams.filter(i => i.category === 'freelancing').length },
              { id: 'part_time', label: 'Part-Time & Gigs', icon: Clock, count: incomeStreams.filter(i => i.category === 'part_time').length },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeChannelTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveChannelTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md font-black'
                      : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-black/25 text-current' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search streams, clients, invoices..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 pl-8 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
            <Filter className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Channel View: Salary Hub Showcase Banner */}
        {(activeChannelTab === 'all' || activeChannelTab === 'salary') && (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#09221C] via-[#061915] to-[#04100D] border border-emerald-500/40 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/30">
                  <Building2 className="w-6 h-6 text-slate-950" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
                      Primary Tech Job Employment
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-200 border border-emerald-500/40">
                      Monthly Fixed Take-Home
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white mt-0.5">
                    ₹34,000 / month · Net Bank Credit
                  </h3>
                  <p className="text-xs text-slate-400">
                    Next arrival due on 1st of every month • Automatically buffers Phase 1 Loan EMIs (HDFC ₹8k, Canara ₹8k, Bajaj ₹2k)
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => quickCreditSalary()}
                  className="px-4 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:from-emerald-400 hover:to-teal-300 transition shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Log This Month's Salary Credit</span>
                </button>
              </div>
            </div>

            {/* Salary Breakdown Metric Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Gross Pay</span>
                <span className="text-base font-black text-white font-mono">₹34,000</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Deductions</span>
                <span className="text-base font-black text-slate-400 font-mono">₹0</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Loan EMI Outflow</span>
                <span className="text-base font-black text-rose-400 font-mono">-₹18,000</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Net Safe Spend Balance</span>
                <span className="text-base font-black text-emerald-400 font-mono">₹16,000</span>
              </div>
            </div>
          </div>
        )}

        {/* Stream Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStreams.map(item => {
            const isReceived = item.status === 'received';
            const isInvoiced = item.status === 'invoiced';
            const isInProgress = item.status === 'in_progress';

            const statusBadgeColor = isReceived
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : isInvoiced
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
              : isInProgress
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-slate-800 text-slate-400 border-slate-700';

            const categoryIcon = item.category === 'salary'
              ? <Building2 className="w-4 h-4 text-emerald-400" />
              : item.category === 'freelancing'
              ? <Laptop className="w-4 h-4 text-cyan-400" />
              : item.category === 'part_time'
              ? <Clock className="w-4 h-4 text-amber-400" />
              : <DollarSign className="w-4 h-4 text-purple-400" />;

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-gradient-to-br from-[#0C1222] to-[#080D1A] border border-slate-800 hover:border-slate-700 transition shadow-xl space-y-4 relative flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                        {categoryIcon}
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block font-mono">
                          {item.sourceOrClient}
                        </span>
                        <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition">
                          {item.title}
                        </h4>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border shrink-0 ${statusBadgeColor}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Amount & Frequency */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-baseline justify-between">
                    <div>
                      <div className="text-2xl font-black text-white font-mono tracking-tight">
                        {formatCurrency(item.amount)}
                      </div>
                      <span className="text-[10px] text-slate-400 capitalize">
                        {item.frequency.replace('_', ' ')}
                        {item.hourlyRate && item.hoursWorked ? ` (${item.hoursWorked} hrs @ ₹${item.hourlyRate}/hr)` : ''}
                      </span>
                    </div>

                    {item.invoiceNumber && (
                      <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        {item.invoiceNumber}
                      </span>
                    )}
                  </div>

                  {/* Project Milestone */}
                  {item.projectMilestone && (
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase">
                        <span>Milestone Deliverable</span>
                        <span className="text-cyan-400">In Progress</span>
                      </div>
                      <p className="font-medium text-slate-200">{item.projectMilestone}</p>
                    </div>
                  )}

                  {/* Notes */}
                  {item.notes && (
                    <p className="text-[11px] text-slate-400 italic">
                      "{item.notes}"
                    </p>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-1.5">
                    {!isReceived && (
                      <button
                        onClick={() => markIncomeReceived(item.id, true)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition flex items-center gap-1 active:scale-95"
                        title="Mark as Received & Deposit to Finance Cash Ledger"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Paid</span>
                      </button>
                    )}
                    {isReceived && (
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Credited ({item.dateReceived || 'Settled'})</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                      title="Edit Stream"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete income stream "${item.title}"?`)) {
                          deleteIncomeStream(item.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                      title="Delete Stream"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Income Acceleration & Loan Payoff Accelerator Simulator */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0C1528] via-[#091D26] to-[#0A1A1E] border border-cyan-500/30 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-black text-white">
                Income Acceleration & Debt Freedom Simulator
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              See how adding extra monthly freelance or part-time earnings accelerates total loan debt elimination (₹2.40 Lakhs).
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/20">
            Current Outstanding Debt: {formatCurrency(totalOutstandingLoan)}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Slider input */}
          <div className="space-y-3 lg:col-span-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300">Simulate Additional Monthly Side Income:</span>
              <span className="font-mono text-base font-black text-cyan-300">
                +{formatCurrency(simExtraSideIncome)} / mo
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50000"
              step="1000"
              value={simExtraSideIncome}
              onChange={e => setSimExtraSideIncome(Number(e.target.value))}
              className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>₹0 (Salary only)</span>
              <span>₹25,000/mo</span>
              <span>₹50,000/mo (Max side hustle)</span>
            </div>
          </div>

          {/* Results Badge */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-center space-y-2 shadow-inner">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Months Saved to 100% Debt Freedom
            </span>
            <div className="text-3xl font-black text-emerald-400 font-mono">
              {monthsSaved} Months Earlier!
            </div>
            <p className="text-[11px] text-slate-300">
              Debt eliminated in <strong className="text-white">{acceleratedMonthsToFreedom} months</strong> instead of {baseMonthsToFreedom} months.
            </p>
          </div>
        </div>
      </div>

      {/* 6. Modal: Add / Edit Income Stream */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0C1222] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#080D1A]">
              <div className="flex items-center space-x-2">
                <WalletCards className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-extrabold text-white">
                  {editingItem ? 'Edit Income Stream' : 'Record New Income Stream'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveIncomeItem} className="p-6 space-y-4 text-xs">
              {/* Category Selector */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold">Income Stream Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'salary', label: 'Fixed Salary', icon: Building2 },
                    { id: 'freelancing', label: 'Freelancing', icon: Laptop },
                    { id: 'part_time', label: 'Part-Time Gig', icon: Clock },
                    { id: 'side_gig', label: 'Side Hustle', icon: Flame },
                    { id: 'investments_dividend', label: 'Dividend / Yield', icon: DollarSign },
                    { id: 'other', label: 'Other Inflow', icon: Layers }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFormCategory(cat.id as any)}
                      className={`px-2.5 py-2 rounded-xl text-left font-bold transition flex items-center space-x-1.5 border ${
                        formCategory === cat.id
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <cat.icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title & Source */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-bold">Stream Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FastAPI Microservice Bot"
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-bold">Source / Employer / Client *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Overseas Client / Upwork"
                    value={formSource}
                    onChange={e => setFormSource(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Frequency & Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-bold">Payment Frequency</label>
                  <select
                    value={formFrequency}
                    onChange={e => setFormFrequency(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="per_project">Per Project / Milestone</option>
                    <option value="monthly">Monthly Recurring</option>
                    <option value="hourly">Hourly Rate Basis</option>
                    <option value="one_time">One-Time Payment</option>
                    <option value="weekly">Weekly Payout</option>
                  </select>
                </div>

                {formFrequency === 'hourly' ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold">Rate/Hr (₹)</label>
                      <input
                        type="number"
                        min="1"
                        value={formHourlyRate}
                        onChange={e => setFormHourlyRate(Number(e.target.value))}
                        className="w-full px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold">Hours</label>
                      <input
                        type="number"
                        min="1"
                        value={formHoursWorked}
                        onChange={e => setFormHoursWorked(Number(e.target.value))}
                        className="w-full px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-bold">Total Inflow Amount (₹) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formAmount}
                      onChange={e => setFormAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}
              </div>

              {/* Status & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-bold">Status</label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="in_progress">In Progress (Active Contract)</option>
                    <option value="invoiced">Invoiced (Payment Pending)</option>
                    <option value="received">Received (Deposited to Bank)</option>
                    <option value="scheduled">Scheduled (Future Payday)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400 font-bold">
                    {formStatus === 'received' ? 'Date Received' : 'Expected Payday / Due Date'}
                  </label>
                  <input
                    type="date"
                    value={formStatus === 'received' ? formDateReceived : formDueDate}
                    onChange={e => formStatus === 'received' ? setFormDateReceived(e.target.value) : setFormDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Milestone & Invoice Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-bold">Project Milestone (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Milestone 1: Prototype Delivered"
                    value={formMilestone}
                    onChange={e => setFormMilestone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-bold">Invoice Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. INV-2026-09"
                    value={formInvoiceNumber}
                    onChange={e => setFormInvoiceNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 font-mono"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold">Notes & Strategy</label>
                <textarea
                  rows={2}
                  placeholder="Details regarding deliverables, payment terms, or client feedback..."
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-extrabold bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:from-emerald-400 hover:to-teal-300 transition shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  {editingItem ? 'Save Changes' : 'Confirm & Log Stream'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
