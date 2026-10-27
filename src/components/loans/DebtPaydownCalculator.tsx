import React, { useState, useMemo } from 'react';
import {
  Calculator,
  TrendingDown,
  Sparkles,
  Flame,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Zap,
  Info,
  DollarSign,
  Clock,
  Target
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { useLifeOS } from '../../context/LifeOSContext';
import { DebtWhatIfSimulation } from './DebtWhatIfSimulation';

interface DebtPaydownCalculatorProps {
  className?: string;
  defaultExtraPayment?: number;
}

export const DebtPaydownCalculator: React.FC<DebtPaydownCalculatorProps> = ({
  className = '',
  defaultExtraPayment = 3000
}) => {
  const {
    loanAccounts,
    salary,
    totalOriginalPrincipal,
    outstandingPrincipal,
    totalPrincipalPaid,
    firstLakhProgress,
    triggerConfetti
  } = useLifeOS();

  // View toggle: 'what_if' | 'calculator'
  const [activeView, setActiveView] = useState<'what_if' | 'calculator'>('what_if');
  const [extraMonthlyPayment, setExtraMonthlyPayment] = useState<number>(defaultExtraPayment);
  const [lumpSumBonus, setLumpSumBonus] = useState<number>(0);
  const [strategy, setStrategy] = useState<'snowball' | 'waterfall' | 'balanced'>('snowball');
  const [showChart, setShowChart] = useState<boolean>(true);

  // Take the 3 active loans
  const loans = useMemo(() => {
    return loanAccounts.slice(0, 3).map((l, index) => ({
      id: l.id,
      name: l.lender || `Loan #${index + 1}`,
      principal: l.currentPrincipal > 0 ? l.currentPrincipal : l.originalPrincipal,
      original: l.originalPrincipal,
      fixedInterest: l.fixedInterestAmount || 2000,
      baseEmi: l.monthlyEmi || 8000,
      // Principal portion of base EMI
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

  const totalFixedInterest = useMemo(() => {
    return loans.reduce((acc, l) => acc + l.fixedInterest, 0);
  }, [loans]);

  // Max recommended extra payment based on salary surplus
  // Salary ₹34,000 - EMIs ₹19,500 = ₹14,500 surplus
  const monthlySalarySurplus = Math.max(0, salary - totalBaseEmi);

  // Simulation Engine: Calculates month-by-month trajectory
  const simulation = useMemo(() => {
    // 1. Simulate Baseline (No extra payment)
    const runSimulation = (extraPay: number, lumpSum: number, strat: 'snowball' | 'waterfall' | 'balanced') => {
      // Deep clone current balances
      let activeBalances = loans.map(l => ({
        ...l,
        balance: Math.max(0, l.principal - (l.id === 'loan-3' && lumpSum > 0 ? lumpSum : 0))
      }));

      // Adjust lump sum if applied generally
      if (lumpSum > 0 && strat !== 'snowball') {
        let remLump = lumpSum;
        for (const l of activeBalances) {
          const applied = Math.min(l.balance, remLump);
          l.balance -= applied;
          remLump -= applied;
          if (remLump <= 0) break;
        }
      }

      let month = 0;
      let totalInterestPaidAccum = 0;
      let totalPrincipalPaidAccum = lumpSum;
      const trajectory: { month: number; balance: number; interestPaid: number }[] = [];
      const milestoneMonths: Record<string, number> = {};

      const maxMonths = 60; // 5 year ceiling

      while (month < maxMonths) {
        const remainingTotal = activeBalances.reduce((acc, l) => acc + l.balance, 0);
        trajectory.push({
          month,
          balance: Math.round(remainingTotal),
          interestPaid: Math.round(totalInterestPaidAccum)
        });

        if (remainingTotal <= 0) break;

        month++;

        // Monthly Interest Incurred for active loans:
        // Rule: A loan only incurs fixed interest if its balance is > 0
        let currentMonthInterest = 0;
        activeBalances.forEach(l => {
          if (l.balance > 0) {
            currentMonthInterest += l.fixedInterest;
          }
        });
        totalInterestPaidAccum += currentMonthInterest;

        // Total Principal payment available this month:
        // Base principal payments across all active loans
        let availablePrincipal = 0;
        activeBalances.forEach(l => {
          if (l.balance > 0) {
            availablePrincipal += l.basePrincipalPortion;
          }
        });

        // Add Extra Payment
        availablePrincipal += extraPay;

        // Apply Principal according to chosen strategy
        if (strat === 'snowball') {
          // Sort by lowest balance first (Loan 3: ₹40k, then Loan 1/2)
          const sorted = [...activeBalances].sort((a, b) => a.balance - b.balance);
          for (const item of sorted) {
            if (item.balance <= 0) continue;
            const target = activeBalances.find(l => l.id === item.id)!;
            const pay = Math.min(target.balance, availablePrincipal);
            target.balance -= pay;
            availablePrincipal -= pay;
            totalPrincipalPaidAccum += pay;

            if (target.balance === 0 && !milestoneMonths[target.id]) {
              milestoneMonths[target.id] = month;
            }

            if (availablePrincipal <= 0) break;
          }
        } else if (strat === 'waterfall') {
          // Target ₹1L Tranche first (Loan 1) to eliminate ₹2,000/mo interest
          const sorted = [...activeBalances].sort((a, b) => {
            if (a.id === 'loan-1') return -1;
            if (b.id === 'loan-1') return 1;
            return b.balance - a.balance;
          });
          for (const item of sorted) {
            if (item.balance <= 0) continue;
            const target = activeBalances.find(l => l.id === item.id)!;
            const pay = Math.min(target.balance, availablePrincipal);
            target.balance -= pay;
            availablePrincipal -= pay;
            totalPrincipalPaidAccum += pay;

            if (target.balance === 0 && !milestoneMonths[target.id]) {
              milestoneMonths[target.id] = month;
            }

            if (availablePrincipal <= 0) break;
          }
        } else {
          // Balanced / Pro-Rata
          const totalActive = activeBalances.reduce((acc, l) => acc + (l.balance > 0 ? l.balance : 0), 0);
          if (totalActive > 0) {
            activeBalances.forEach(target => {
              if (target.balance > 0) {
                const proportion = target.balance / totalActive;
                const pay = Math.min(target.balance, availablePrincipal * proportion);
                target.balance -= pay;
                totalPrincipalPaidAccum += pay;
                if (target.balance === 0 && !milestoneMonths[target.id]) {
                  milestoneMonths[target.id] = month;
                }
              }
            });
          }
        }
      }

      return {
        totalMonths: month,
        totalInterestPaid: totalInterestPaidAccum,
        trajectory,
        milestoneMonths
      };
    };

    const baseline = runSimulation(0, 0, 'snowball');
    const accelerated = runSimulation(extraMonthlyPayment, lumpSumBonus, strategy);

    const monthsSaved = Math.max(0, baseline.totalMonths - accelerated.totalMonths);
    const interestSaved = Math.max(0, baseline.totalInterestPaid - accelerated.totalInterestPaid);

    // Merge trajectories for Recharts comparison
    const maxLen = Math.max(baseline.trajectory.length, accelerated.trajectory.length);
    const chartData = [];
    for (let m = 0; m < maxLen; m++) {
      const basePoint = baseline.trajectory[m] || { balance: 0 };
      const accelPoint = accelerated.trajectory[m] || { balance: 0 };
      chartData.push({
        month: `M${m}`,
        monthNum: m,
        standardBalance: basePoint.balance,
        acceleratedBalance: accelPoint.balance,
        savingsGap: Math.max(0, basePoint.balance - accelPoint.balance)
      });
    }

    return {
      baseline,
      accelerated,
      monthsSaved,
      interestSaved,
      chartData
    };
  }, [loans, extraMonthlyPayment, lumpSumBonus, strategy]);

  // Target payoff date calculations
  const calculatePayoffDate = (monthsFromNow: number) => {
    const d = new Date();
    d.setMonth(d.getMonth() + monthsFromNow);
    return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  };

  const baselinePayoffDate = calculatePayoffDate(simulation.baseline.totalMonths);
  const acceleratedPayoffDate = calculatePayoffDate(simulation.accelerated.totalMonths);

  // Progress Bar Calculations
  const alreadyPaidAmount = totalOriginalDebt - totalCurrentRemaining;
  const currentPaidPct = totalOriginalDebt > 0 ? (alreadyPaidAmount / totalOriginalDebt) * 100 : 0;
  const remainingDebtPct = 100 - currentPaidPct;

  // Extra payment 6-month projected debt paydown
  const projectedPaidIn6Months = Math.min(
    totalCurrentRemaining,
    (totalBaseEmi - totalFixedInterest + extraMonthlyPayment) * 6
  );
  const projected6MonthPct = totalOriginalDebt > 0 ? (projectedPaidIn6Months / totalOriginalDebt) * 100 : 0;

  const quickChips = [
    { label: '+₹1,000', amount: 1000 },
    { label: '+₹2,500', amount: 2500 },
    { label: '+₹5,000', amount: 5000 },
    { label: '+₹7,500', amount: 7500 },
    { label: 'Max Surplus (+₹10k)', amount: 10000 }
  ];

  return (
    <section className={`p-6 rounded-2xl bg-[#0E1526] border border-slate-800 space-y-6 ${className}`}>
      {/* 1. Header & Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <Calculator className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-heading font-black text-white tracking-tight">
              Debt Paydown Calculator
            </h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono font-medium border border-rose-500/30">
              Income Acceleration
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Simulate how allocating surplus salary beyond the base ₹19,500 EMI slashes your loan tenure and terminates fixed monthly interest.
          </p>
        </div>

        {/* Highlight Result Pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <TrendingDown className="w-4 h-4 text-emerald-400" />
            <div className="text-xs">
              <span className="text-emerald-300/80">Term Saved: </span>
              <strong className="font-mono text-emerald-300">{simulation.monthsSaved} Months</strong>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <Zap className="w-4 h-4 text-amber-400" />
            <div className="text-xs">
              <span className="text-amber-300/80">Interest Saved: </span>
              <strong className="font-mono text-amber-300">
                ₹{simulation.interestSaved.toLocaleString('en-IN')}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Mode Selector: 'What-If' Simulation vs Full Calculator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/80 p-2 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveView('what_if')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeView === 'what_if'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>'What-If' Simulation (Timeline Progress Bar)</span>
          </button>
          <button
            onClick={() => setActiveView('calculator')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeView === 'calculator'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Detailed Paydown Breakdown & Area Chart</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-400 px-2 font-mono hidden sm:inline">
          {activeView === 'what_if' ? '⚡ Dynamic Timeline Shrink' : '📊 Full Amortization Curve'}
        </span>
      </div>

      {/* RENDER ACTIVE VIEW */}
      {activeView === 'what_if' ? (
        <DebtWhatIfSimulation
          initialExtraPayment={extraMonthlyPayment}
          onSelectAmount={(amt) => setExtraMonthlyPayment(amt)}
        />
      ) : (
        <>
          {/* 3. PROGRESS BAR: REMAINING DEBT AGAINST TOTAL GOAL */}
      <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-rose-400" />
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                Total Debt Elimination Progress
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Original Principal: <span className="font-mono text-slate-200">₹{totalOriginalDebt.toLocaleString('en-IN')}</span> across 3 active loans
            </p>
          </div>

          <div className="flex items-baseline gap-2 text-right">
            <span className="text-xs text-slate-400">Remaining Debt:</span>
            <span className="font-mono text-lg font-black text-rose-300 tabular-nums">
              ₹{totalCurrentRemaining.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              ({remainingDebtPct.toFixed(0)}% left)
            </span>
          </div>
        </div>

        {/* Multi-Segment Rich Progress Bar */}
        <div className="space-y-2">
          <div className="relative h-4 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 flex shadow-inner">
            {/* Segment 1: Paid So Far */}
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500 relative group"
              style={{ width: `${Math.max(2, currentPaidPct)}%` }}
              title={`Paid: ₹${alreadyPaidAmount.toLocaleString('en-IN')} (${currentPaidPct.toFixed(1)}%)`}
            />

            {/* Segment 2: 6-Month Projected Reduction with Extra Payment */}
            {extraMonthlyPayment > 0 && (
              <div
                className="h-full bg-gradient-to-r from-indigo-500/80 to-indigo-400/80 transition-all duration-500 border-l border-white/20 animate-pulse"
                style={{ width: `${Math.min(remainingDebtPct, projected6MonthPct)}%` }}
                title={`Projected 6-Month Accelerated Paydown: ~₹${Math.round(projectedPaidIn6Months).toLocaleString('en-IN')}`}
              />
            )}

            {/* Segment 3: Remaining Debt */}
            <div
              className="h-full bg-slate-800/60 flex-1"
              title={`Remaining: ₹${totalCurrentRemaining.toLocaleString('en-IN')}`}
            />
          </div>

          {/* Milestone Markers */}
          <div className="grid grid-cols-4 text-[10px] text-slate-400 font-mono pt-1">
            <div className="text-left">
              <span className="text-emerald-400 font-bold">₹0</span>
              <div className="text-[9px] text-slate-500">Starting Point</div>
            </div>
            <div className="text-center">
              <span className="text-slate-300">₹40,000</span>
              <div className="text-[9px] text-indigo-400">Loan 3 Freedom</div>
            </div>
            <div className="text-center">
              <span className="text-slate-300">₹1,40,000</span>
              <div className="text-[9px] text-amber-400">-₹2k/mo Interest</div>
            </div>
            <div className="text-right">
              <span className="text-rose-400 font-bold">₹2,40,000</span>
              <div className="text-[9px] text-emerald-400 font-bold">100% Debt Free 🚀</div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-slate-400 border-t border-slate-800/60">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>Principal Paid to Date</span>
          </div>
          {extraMonthlyPayment > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
              <span>Projected 6-Month Paydown (+₹{extraMonthlyPayment.toLocaleString('en-IN')}/mo)</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <span>Unpaid Balance Target</span>
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE SIMULATOR CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Sliders & Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-5 p-5 rounded-xl bg-slate-950/60 border border-slate-800">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-400" />
                <span>Extra Monthly Payment (From Savings)</span>
              </label>
              <span className="font-mono text-sm font-black text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                ₹{extraMonthlyPayment.toLocaleString('en-IN')}/mo
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={15000}
              step={500}
              value={extraMonthlyPayment}
              onChange={(e) => setExtraMonthlyPayment(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500 focus:outline-none"
            />

            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>₹0 (Standard EMI Only)</span>
              <span>₹7,500</span>
              <span>₹15,000 (Max Capacity)</span>
            </div>

            {/* Quick Chips */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {quickChips.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => setExtraMonthlyPayment(chip.amount)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    extraMonthlyPayment === chip.amount
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Payoff Strategy Selector */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">
              Payoff Allocation Strategy
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setStrategy('snowball')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center text-center transition-all cursor-pointer ${
                  strategy === 'snowball'
                    ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="font-bold">Snowball</span>
                <span className="text-[9px] text-slate-400 mt-0.5">Loan 3 Hand Loan first</span>
              </button>

              <button
                onClick={() => setStrategy('waterfall')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center text-center transition-all cursor-pointer ${
                  strategy === 'waterfall'
                    ? 'bg-indigo-500/20 border-indigo-500 text-indigo-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="font-bold">₹1L Waterfall</span>
                <span className="text-[9px] text-slate-400 mt-0.5">Drop ₹2k int. first</span>
              </button>

              <button
                onClick={() => setStrategy('balanced')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center text-center transition-all cursor-pointer ${
                  strategy === 'balanced'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="font-bold">Pro-Rata</span>
                <span className="text-[9px] text-slate-400 mt-0.5">Split across all 3</span>
              </button>
            </div>
          </div>

          {/* Cashflow Info Box */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span>Monthly Salary Inflow:</span>
              <span className="font-mono text-emerald-400 font-bold">₹{salary.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Standard Loan EMIs (3 Loans):</span>
              <span className="font-mono text-rose-400">₹{totalBaseEmi.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Total Extra Paydown Allocated:</span>
              <span className="font-mono text-amber-300 font-bold">
                ₹{extraMonthlyPayment.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-slate-300 font-medium">
              <span>Remaining Monthly Buffer:</span>
              <span className="font-mono text-indigo-300 font-bold">
                ₹{Math.max(0, monthlySalarySurplus - extraMonthlyPayment).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Right Col: Timeline & Side-by-Side Comparison (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Side by side comparison cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Standard Trajectory Card */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Standard Trajectory</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[10px]">
                    ₹0 Extra
                  </span>
                </div>
                <div className="text-2xl font-black font-mono text-slate-300">
                  {simulation.baseline.totalMonths} <span className="text-sm font-normal text-slate-400">Months</span>
                </div>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Debt Free: <strong>{baselinePayoffDate}</strong></span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Total Fixed Interest:</span>
                <span className="font-mono text-rose-400 font-semibold">
                  ₹{simulation.baseline.totalInterestPaid.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Accelerated Trajectory Card */}
            <div className="p-4 rounded-xl bg-emerald-950/15 border border-emerald-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-emerald-400 mb-2">
                  <span className="font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Accelerated Plan
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                    +₹{extraMonthlyPayment.toLocaleString('en-IN')}/mo
                  </span>
                </div>
                <div className="text-2xl font-black font-mono text-emerald-300">
                  {simulation.accelerated.totalMonths} <span className="text-sm font-normal text-slate-400">Months</span>
                </div>
                <div className="text-xs text-emerald-400/90 mt-1 flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Debt Free: <strong className="text-white">{acceleratedPayoffDate}</strong></span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-500/20 text-[11px] flex items-center justify-between">
                <span className="text-slate-400">Total Fixed Interest:</span>
                <span className="font-mono text-emerald-300 font-bold">
                  ₹{simulation.accelerated.totalInterestPaid.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Visual Paydown Trajectory Area Chart */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                Remaining Debt Balance Over Time (₹)
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Standard vs Accelerated
              </span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={simulation.chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="standardDebtGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="accelDebtGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                  <XAxis
                    dataKey="month"
                    stroke="#64748b"
                    fontSize={10}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={10}
                    tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      fontSize: '11px',
                      color: '#fff'
                    }}
                    formatter={(val: any, name: any) => [
                      `₹${Number(val).toLocaleString('en-IN')}`,
                      name === 'standardBalance' ? 'Standard Balance' : 'Accelerated Balance'
                    ]}
                    labelFormatter={(label) => `Timeline: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="standardBalance"
                    name="standardBalance"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#standardDebtGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="acceleratedBalance"
                    name="acceleratedBalance"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#accelDebtGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-6 text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-rose-500 rounded-full" />
                <span>Standard Schedule</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-emerald-400 rounded-full" />
                <span className="text-emerald-300 font-semibold">With Extra Pay (+₹{extraMonthlyPayment.toLocaleString('en-IN')})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. TRANCHE-BY-TRANCHE ELIMINATION ROADMAP */}
      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Projected Tranche Elimination Milestones
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            Agreement: Clearing ₹1L drops ₹2,000/mo interest permanently
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {loans.map((loan, idx) => {
            const finishMonth = simulation.accelerated.milestoneMonths[loan.id] || simulation.accelerated.totalMonths;
            const targetDate = calculatePayoffDate(finishMonth);

            return (
              <div
                key={loan.id}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-200">Tranche #{idx + 1}: {loan.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-400">
                      ₹{loan.principal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Monthly Interest: <span className="font-mono text-rose-300">₹{loan.fixedInterest}/mo</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] flex items-center justify-between">
                  <span className="text-slate-400">Eliminated In:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    Month {finishMonth} ({targetDate})
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
        </>
      )}
    </section>
  );
};
