import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Flame,
  TrendingDown,
  Calendar,
  CheckCircle2,
  Clock,
  Coins
} from 'lucide-react';
import { useLifeOS } from '../../context/LifeOSContext';

export interface WhatIfScenario {
  id: string;
  name: string;
  description: string;
  extraAmount: number;
  badge?: string;
  badgeColor?: string;
}

interface DebtWhatIfSimulationProps {
  className?: string;
  initialExtraPayment?: number;
  onSelectAmount?: (amount: number) => void;
}

export const DebtWhatIfSimulation: React.FC<DebtWhatIfSimulationProps> = ({
  className = '',
  initialExtraPayment = 3500,
  onSelectAmount
}) => {
  const {
    loanAccounts,
    salary,
    triggerConfetti
  } = useLifeOS();

  // Active extra payment toggle
  const [extraPayment, setExtraPayment] = useState<number>(initialExtraPayment);
  const [allocationMode, setAllocationMode] = useState<'snowball' | 'waterfall'>('snowball');

  // Pre-configured "What-If" scenario presets
  const scenarios: WhatIfScenario[] = [
    {
      id: 'sc-0',
      name: 'Standard Baseline',
      description: 'Zero extra pay, standard EMI pace',
      extraAmount: 0,
      badge: 'Base EMI',
      badgeColor: 'bg-slate-800 text-slate-300'
    },
    {
      id: 'sc-1500',
      name: 'Coffee & Daily Cuts',
      description: 'Save ~₹50/day from minor expenses',
      extraAmount: 1500,
      badge: '+₹1.5k/mo',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
    },
    {
      id: 'sc-3500',
      name: 'Balanced Thrift',
      description: '25% of surplus monthly salary',
      extraAmount: 3500,
      badge: 'Popular ⭐',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
    },
    {
      id: 'sc-6000',
      name: 'Aggressive Sprint',
      description: 'Redirect ₹6k surplus straight to debt',
      extraAmount: 6000,
      badge: 'Fast Track ⚡',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    {
      id: 'sc-10000',
      name: 'Maximum Velocity',
      description: 'All-in surplus focus for rapid freedom',
      extraAmount: 10000,
      badge: 'Max Speed 🚀',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    }
  ];

  // Map active loans
  const loans = useMemo(() => {
    return loanAccounts.slice(0, 3).map((l, index) => ({
      id: l.id,
      name: l.lender || `Loan #${index + 1}`,
      principal: l.currentPrincipal > 0 ? l.currentPrincipal : l.originalPrincipal,
      original: l.originalPrincipal,
      fixedInterest: l.fixedInterestAmount || 2000,
      baseEmi: l.monthlyEmi || 8000,
      basePrincipalPortion: Math.max(1000, (l.monthlyEmi || 8000) - (l.fixedInterestAmount || 2000))
    }));
  }, [loanAccounts]);

  const totalOriginalDebt = useMemo(() => {
    const sum = loans.reduce((acc, l) => acc + l.original, 0);
    return sum > 0 ? sum : 240000;
  }, [loans]);

  const totalCurrentRemaining = useMemo(() => {
    const sum = loans.reduce((acc, l) => acc + l.principal, 0);
    return sum > 0 ? sum : 240000;
  }, [loans]);

  const totalBaseEmi = useMemo(() => {
    return loans.reduce((acc, l) => acc + l.baseEmi, 0);
  }, [loans]);

  // Simulation calculator function
  const runSimulation = (extraPay: number, mode: 'snowball' | 'waterfall') => {
    let activeBalances = loans.map(l => ({ ...l, balance: l.principal }));
    let month = 0;
    let totalInterestPaid = 0;
    const maxMonths = 48; // 4-year cutoff

    const milestoneMonths: { loanId: string; name: string; month: number }[] = [];

    while (month < maxMonths) {
      const remainingTotal = activeBalances.reduce((acc, l) => acc + l.balance, 0);
      if (remainingTotal <= 0) break;

      month++;

      // Interest incurred
      activeBalances.forEach(l => {
        if (l.balance > 0) {
          totalInterestPaid += l.fixedInterest;
        }
      });

      // Available principal payment
      let availablePrincipal = extraPay;
      activeBalances.forEach(l => {
        if (l.balance > 0) {
          availablePrincipal += l.basePrincipalPortion;
        }
      });

      // Apply based on mode
      const sorted = [...activeBalances].sort((a, b) => {
        if (mode === 'snowball') return a.balance - b.balance; // lowest first
        if (a.id === 'loan-1') return -1; // ₹1L tranche first
        return b.balance - a.balance;
      });

      for (const item of sorted) {
        if (item.balance <= 0) continue;
        const target = activeBalances.find(l => l.id === item.id)!;
        const payment = Math.min(target.balance, availablePrincipal);
        target.balance -= payment;
        availablePrincipal -= payment;

        if (target.balance === 0 && !milestoneMonths.some(m => m.loanId === target.id)) {
          milestoneMonths.push({
            loanId: target.id,
            name: target.name,
            month
          });
        }

        if (availablePrincipal <= 0) break;
      }
    }

    return {
      totalMonths: Math.max(1, month),
      totalInterestPaid,
      milestoneMonths
    };
  };

  // Base and simulated results
  const baselineResult = useMemo(() => runSimulation(0, allocationMode), [loans, allocationMode]);
  const simulatedResult = useMemo(() => runSimulation(extraPayment, allocationMode), [loans, extraPayment, allocationMode]);

  const monthsSaved = Math.max(0, baselineResult.totalMonths - simulatedResult.totalMonths);
  const interestSaved = Math.max(0, baselineResult.totalInterestPaid - simulatedResult.totalInterestPaid);

  // Payoff dates
  const calculatePayoffDate = (monthsFromNow: number) => {
    const d = new Date();
    d.setMonth(d.getMonth() + monthsFromNow);
    return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  };

  const baselinePayoffDate = calculatePayoffDate(baselineResult.totalMonths);
  const simulatedPayoffDate = calculatePayoffDate(simulatedResult.totalMonths);

  // Maximum timeline duration to normalize progress bar
  // Base term is typically 18 months
  const maxBaselineTerm = Math.max(18, baselineResult.totalMonths);

  // Timeline Progress Bar metrics (0% = immediate, 100% = baseline length)
  const simulatedTermPct = Math.min(100, (simulatedResult.totalMonths / maxBaselineTerm) * 100);
  const timeSavedPct = 100 - simulatedTermPct;

  // Debt Progress Bar calculation:
  // How much principal is cleared at Month 6 under this simulation
  const debtClearedIn6Mo = Math.min(
    totalCurrentRemaining,
    (loans.reduce((acc, l) => acc + l.basePrincipalPortion, 0) + extraPayment) * 6
  );
  const debtClearedIn6MoPct = totalCurrentRemaining > 0
    ? Math.min(100, (debtClearedIn6Mo / totalCurrentRemaining) * 100)
    : 100;

  const handleSelectScenario = (amount: number) => {
    setExtraPayment(amount);
    if (onSelectAmount) onSelectAmount(amount);
    if (amount >= 6000) triggerConfetti();
  };

  return (
    <div className={`p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6 ${className}`}>
      {/* 1. Header with 'What-If' Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </span>
            <h3 className="text-base font-heading font-black text-white tracking-tight">
              'What-If' Paydown Timeline Simulator
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-bold border border-indigo-500/30">
              Dynamic Visualizer
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Toggle different extra monthly payment scenarios to see the repayment timeline shrink on the progress bar in real time.
          </p>
        </div>

        {/* Strategy Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs shrink-0">
          <button
            onClick={() => setAllocationMode('snowball')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              allocationMode === 'snowball'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Snowball (Fast)
          </button>
          <button
            onClick={() => setAllocationMode('waterfall')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              allocationMode === 'waterfall'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ₹1L Waterfall
          </button>
        </div>
      </div>

      {/* 2. Interactive Extra Payment Toggle Presets */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Toggle Extra Payment Scenarios:
          </span>
          <span className="font-mono text-sm font-black text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/30">
            +₹{extraPayment.toLocaleString('en-IN')}/month
          </span>
        </div>

        {/* Toggle Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {scenarios.map((sc) => {
            const isSelected = extraPayment === sc.extraAmount;
            return (
              <button
                key={sc.id}
                onClick={() => handleSelectScenario(sc.extraAmount)}
                className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-b from-indigo-950/60 to-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${sc.badgeColor}`}>
                      {sc.badge}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                    )}
                  </div>
                  <h4 className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {sc.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
                    {sc.description}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-800/80 font-mono text-xs font-bold text-amber-300">
                  {sc.extraAmount === 0 ? '₹0 Extra' : `+₹${sc.extraAmount.toLocaleString('en-IN')}/mo`}
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Fine-Tuning Slider */}
        <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 flex items-center gap-3">
          <span className="text-xs text-slate-400 shrink-0 font-medium">Fine-tune:</span>
          <input
            type="range"
            min={0}
            max={12000}
            step={500}
            value={extraPayment}
            onChange={(e) => {
              const val = Number(e.target.value);
              setExtraPayment(val);
              if (onSelectAmount) onSelectAmount(val);
            }}
            className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <span className="font-mono text-xs text-slate-300 shrink-0">
            ₹{extraPayment.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* 3. CORE VISUAL: THE REPAYMENT TIMELINE PROGRESS BAR */}
      <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                Visual Repayment Timeline Compression
              </h4>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Standard Baseline: <span className="font-mono text-slate-300">{baselineResult.totalMonths} Months</span> ({baselinePayoffDate}) vs. Simulated: <span className="font-mono text-emerald-400 font-bold">{simulatedResult.totalMonths} Months</span> ({simulatedPayoffDate})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Timeline Reduction:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs border border-emerald-500/30">
              ⚡ {monthsSaved} Months Faster
            </span>
          </div>
        </div>

        {/* Dynamic Dual Timeline Progress Bar */}
        <div className="space-y-3 pt-2">
          {/* Timeline Bar Container */}
          <div className="relative">
            {/* Background Full Track (Baseline Months) */}
            <div className="h-6 w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-800 relative flex items-center">
              {/* Active Simulated Duration Bar (Contracts with extra payment) */}
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 transition-all duration-700 ease-out flex items-center justify-end pr-2 relative shadow-lg shadow-emerald-500/20"
                style={{ width: `${Math.max(12, simulatedTermPct)}%` }}
              >
                <span className="text-[10px] font-mono font-black text-slate-950 select-none">
                  {simulatedResult.totalMonths} mo
                </span>

                {/* Animated Pulsing Pin on finish line */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-emerald-500 shadow-md shadow-emerald-500/50 flex items-center justify-center z-10 animate-pulse">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                </div>
              </div>

              {/* Saved Time Gap (Shaded striped section) */}
              {monthsSaved > 0 && (
                <div
                  className="h-full bg-emerald-950/30 flex items-center justify-center transition-all duration-700 border-l border-dashed border-emerald-500/50"
                  style={{ width: `${timeSavedPct}%` }}
                >
                  <span className="text-[10px] font-mono font-bold text-emerald-400/90 truncate px-2 select-none">
                    - {monthsSaved} mo shaved off!
                  </span>
                </div>
              )}
            </div>

            {/* Floating Finish Flag Banner */}
            <div
              className="absolute -top-7 transition-all duration-700 ease-out flex flex-col items-center"
              style={{
                left: `calc(${Math.min(94, Math.max(10, simulatedTermPct))}% - 36px)`
              }}
            >
              <div className="px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 text-[10px] font-bold font-mono shadow-md whitespace-nowrap">
                🏁 {simulatedPayoffDate}
              </div>
              <div className="w-1 h-1.5 bg-emerald-500" />
            </div>
          </div>

          {/* Timeline Axis Ticks */}
          <div className="grid grid-cols-6 text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
            <div>Month 0 (Now)</div>
            <div className="text-center">M3</div>
            <div className="text-center">M6</div>
            <div className="text-center">M9</div>
            <div className="text-center">M12</div>
            <div className="text-right">M{maxBaselineTerm} (Baseline)</div>
          </div>
        </div>

        {/* Tranche Elimination Checkpoints on the Timeline */}
        <div className="pt-2 border-t border-slate-800/60">
          <span className="text-[11px] font-semibold text-slate-400 block mb-2">
            Timeline Milestones Under Current Scenario:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {loans.map((loan, idx) => {
              const milestone = simulatedResult.milestoneMonths.find(m => m.loanId === loan.id);
              const finishMo = milestone ? milestone.month : simulatedResult.totalMonths;
              const dateStr = calculatePayoffDate(finishMo);

              return (
                <div
                  key={loan.id}
                  className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-mono text-[10px] text-slate-300 font-bold">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-slate-200 text-[11px] truncate max-w-[120px]">
                        {loan.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        ₹{loan.principal.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-emerald-300 font-bold text-[11px]">
                      Month {finishMo}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {dateStr}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. What-If Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Card 1: Time Freedom */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Debt Freedom Date</span>
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="font-mono text-xl font-black text-white">
            {simulatedPayoffDate}
          </div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">
            {monthsSaved > 0 ? `Saves ${monthsSaved} months of payments` : 'Standard schedule pace'}
          </div>
        </div>

        {/* Card 2: Cash Interest Saved */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Fixed Interest Saved</span>
            <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="font-mono text-xl font-black text-amber-300">
            ₹{interestSaved.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Hard cash saved from ₹2k/mo charges
          </div>
        </div>

        {/* Card 3: Monthly Cashflow Unlocked */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Post-Debt Freedom Inflow</span>
            <Coins className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="font-mono text-xl font-black text-cyan-300">
            ₹{totalBaseEmi.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-400">/mo</span>
          </div>
          <div className="text-[11px] text-cyan-400/90 font-medium mt-1">
            Redirected to Salem Gold & Wealth
          </div>
        </div>
      </div>
    </div>
  );
};
