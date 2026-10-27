import React, { useState, useMemo } from 'react';
import {
  Layers,
  TrendingDown,
  ArrowDown,
  ArrowRight,
  Zap,
  Target,
  Flame
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import { useLifeOS } from '../../context/LifeOSContext';

interface DebtWaterfallCascadeProps {
  className?: string;
}

export const DebtWaterfallCascade: React.FC<DebtWaterfallCascadeProps> = ({
  className = ''
}) => {
  const {
    loanAccounts,
    openQuickAdd,
    triggerConfetti
  } = useLifeOS();

  const [activeStepHover, setActiveStepHover] = useState<string | null>(null);
  const [cascadeMode, setCascadeMode] = useState<'cascade' | 'comparison'>('cascade');

  // Strictly take the 3 active loans
  const loans = useMemo(() => {
    return loanAccounts.slice(0, 3).map((l, index) => {
      const original = l.originalPrincipal || 100000;
      const current = l.currentPrincipal !== undefined ? l.currentPrincipal : original;
      const paid = Math.max(0, original - current);
      const pctPaid = original > 0 ? (paid / original) * 100 : 0;
      const interest = l.fixedInterestAmount || 2000;
      const emi = l.monthlyEmi || 8000;
      const principalPortion = Math.max(0, emi - interest);

      return {
        id: l.id,
        name: l.lender || `Loan #${index + 1}`,
        loanType: l.loanType || 'Personal Loan',
        original,
        current,
        paid,
        pctPaid,
        interest,
        emi,
        principalPortion,
        dueDay: l.dueDayOfMonth || 5,
        priority: index === 2 ? 'Target 1 (Fastest)' : index === 0 ? 'Target 2' : 'Target 3',
        color: index === 2 ? '#10b981' : index === 0 ? '#6366f1' : '#f43f5e'
      };
    });
  }, [loanAccounts]);

  const totalOriginalDebt = useMemo(() => {
    const sum = loans.reduce((acc, l) => acc + l.original, 0);
    return sum > 0 ? sum : 240000;
  }, [loans]);

  const totalCurrentRemaining = useMemo(() => {
    const sum = loans.reduce((acc, l) => acc + l.current, 0);
    return sum > 0 ? sum : 240000;
  }, [loans]);

  const totalPaidSoFar = Math.max(0, totalOriginalDebt - totalCurrentRemaining);
  const overallProgressPct = totalOriginalDebt > 0 ? (totalPaidSoFar / totalOriginalDebt) * 100 : 0;

  // Waterfall Tranche Data for the cascading bars
  // Step 1: Hand Loan (₹40,000)
  // Step 2: HDFC Bank (₹1,00,000)
  // Step 3: Canara Bank (₹1,00,000)
  const handLoan = loans.find(l => l.id === 'loan-3' || l.original <= 50000) || loans[2];
  const loan1 = loans.find(l => l.id === 'loan-1') || loans[0];
  const loan2 = loans.find(l => l.id === 'loan-2') || loans[1];

  const waterfallSteps = useMemo(() => {
    return [
      {
        id: 'start',
        stepIndex: 1,
        title: 'Starting Total Debt',
        subtitle: 'Original Liability Baseline',
        amount: totalOriginalDebt,
        paidAmount: 0,
        remainingAmount: totalOriginalDebt,
        cumulativeInterestDrop: 0,
        barHeightPct: 100,
        color: '#f43f5e',
        tag: 'Baseline Liability',
        desc: '3 combined loans before waterfall execution.'
      },
      {
        id: 'step-1',
        stepIndex: 2,
        title: 'Tier 1: Hand Loan',
        subtitle: handLoan?.name || 'Private Hand Loan',
        amount: handLoan?.original || 40000,
        paidAmount: handLoan?.paid || 0,
        remainingAmount: handLoan?.current || 40000,
        cumulativeInterestDrop: 2000,
        barHeightPct: ((handLoan?.current || 40000) / totalOriginalDebt) * 100,
        color: '#10b981',
        tag: '⚡ 1st Waterfall Target',
        desc: 'Clearing this ₹40k eliminates ₹2,000/mo fixed interest! Its ₹3,500 EMI cascades into Tier 2.',
        monthlySavingsUnlocked: 2000,
        cashFlowRollover: 3500
      },
      {
        id: 'step-2',
        stepIndex: 3,
        title: 'Tier 2: Primary Tranche',
        subtitle: loan1?.name || 'HDFC Bank',
        amount: loan1?.original || 100000,
        paidAmount: loan1?.paid || 0,
        remainingAmount: loan1?.current || 100000,
        cumulativeInterestDrop: 4000,
        barHeightPct: ((loan1?.current || 100000) / totalOriginalDebt) * 100,
        color: '#6366f1',
        tag: '⭐ Agreement Milestone',
        desc: 'Hits the 1st ₹1 Lakh drop milestone (-₹2,000/mo interest). Rollover cashflow jumps to ₹11,500/mo!',
        monthlySavingsUnlocked: 2000,
        cashFlowRollover: 8000
      },
      {
        id: 'step-3',
        stepIndex: 4,
        title: 'Tier 3: Secondary Tranche',
        subtitle: loan2?.name || 'Canara Bank',
        amount: loan2?.original || 100000,
        paidAmount: loan2?.paid || 0,
        remainingAmount: loan2?.current || 100000,
        cumulativeInterestDrop: 6000,
        barHeightPct: ((loan2?.current || 100000) / totalOriginalDebt) * 100,
        color: '#38bdf8',
        tag: '🏁 Final Hurdle',
        desc: 'Final ₹1 Lakh tranche. Attacked with total combined power of ₹19,500/mo!',
        monthlySavingsUnlocked: 2000,
        cashFlowRollover: 19500
      },
      {
        id: 'finish',
        stepIndex: 5,
        title: '100% Debt Freedom',
        subtitle: 'Zero Active Liabilities',
        amount: 0,
        paidAmount: totalOriginalDebt,
        remainingAmount: 0,
        cumulativeInterestDrop: 6000,
        barHeightPct: 4,
        color: '#10b981',
        tag: '🎉 Complete Freedom',
        desc: 'All ₹6,000/mo fixed interest eliminated. Full ₹19,500/mo cascades directly into Salem Gold & Wealth!'
      }
    ];
  }, [totalOriginalDebt, handLoan, loan1, loan2]);

  // Recharts waterfall data
  const chartData = useMemo(() => {
    return [
      {
        name: 'Total Debt',
        balance: totalOriginalDebt,
        paid: 0,
        color: '#f43f5e',
        tag: '₹2.40L'
      },
      {
        name: 'Paid Off',
        balance: totalPaidSoFar,
        paid: totalPaidSoFar,
        color: '#10b981',
        tag: `₹${(totalPaidSoFar / 1000).toFixed(0)}k`
      },
      {
        name: 'Tier 1: Hand',
        balance: handLoan?.current || 40000,
        paid: handLoan?.paid || 0,
        color: '#10b981',
        tag: `₹${((handLoan?.current || 40000) / 1000).toFixed(0)}k`
      },
      {
        name: 'Tier 2: HDFC',
        balance: loan1?.current || 100000,
        paid: loan1?.paid || 0,
        color: '#6366f1',
        tag: `₹${((loan1?.current || 100000) / 1000).toFixed(0)}k`
      },
      {
        name: 'Tier 3: Canara',
        balance: loan2?.current || 100000,
        paid: loan2?.paid || 0,
        color: '#38bdf8',
        tag: `₹${((loan2?.current || 100000) / 1000).toFixed(0)}k`
      },
      {
        name: 'Debt Free',
        balance: 0,
        paid: totalOriginalDebt,
        color: '#10b981',
        tag: '₹0'
      }
    ];
  }, [totalOriginalDebt, totalPaidSoFar, handLoan, loan1, loan2]);

  return (
    <section className={`p-6 rounded-2xl bg-[#0E1526] border border-slate-800 space-y-6 ${className}`}>
      {/* 1. Header with Strategic Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <Layers className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-heading font-black text-white tracking-tight">
              Cascading Debt Waterfall
            </h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono font-bold border border-rose-500/30">
              Snowball Acceleration
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Visual cascading tiers of the 3 active loans. Agreement: Clearing each tranche permanently terminates ₹2,000/mo interest and cascades its EMI into the next tier.
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setCascadeMode('cascade')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                cascadeMode === 'cascade'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Waterfall Cascade
            </button>
            <button
              onClick={() => setCascadeMode('comparison')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                cascadeMode === 'comparison'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Chart Breakdown
            </button>
          </div>

          <button
            onClick={() => {
              triggerConfetti();
              openQuickAdd('loan');
            }}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Log Repayment</span>
            <ArrowRight className="w-3.5 h-3.5 text-rose-400" />
          </button>
        </div>
      </div>

      {/* 2. OVERALL WATERFALL PROGRESS SUMMARY BAR */}
      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">
              Waterfall Progress: ₹{totalPaidSoFar.toLocaleString('en-IN')} Paid of ₹{totalOriginalDebt.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono">
            <span className="text-slate-400">Remaining Balance:</span>
            <strong className="text-rose-300 text-sm">₹{totalCurrentRemaining.toLocaleString('en-IN')}</strong>
            <span className="text-[10px] text-slate-500">({(100 - overallProgressPct).toFixed(0)}% to go)</span>
          </div>
        </div>

        {/* Progress Bar with Milestone Pin */}
        <div className="relative">
          <div className="h-3.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 flex shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 transition-all duration-700"
              style={{ width: `${Math.max(2, overallProgressPct)}%` }}
            />
          </div>

          {/* ₹1 Lakh Reduction Milestone Pin */}
          <div
            className="absolute -top-1.5 w-0.5 h-6 bg-amber-400 z-10"
            style={{ left: `${(100000 / totalOriginalDebt) * 100}%` }}
            title="First ₹1 Lakh Milestone (-₹2,000/mo interest permanently)"
          >
            <div className="absolute -top-5 -translate-x-1/2 px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-mono text-[9px] font-black whitespace-nowrap shadow-sm">
              -₹2k/mo Int. Drop
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>Tier 1: ₹40k Hand Loan (Target #1)</span>
          <span>Tier 2: ₹1.00L Primary Tranche (Target #2)</span>
          <span>Tier 3: ₹1.00L Secondary Tranche (Target #3)</span>
        </div>
      </div>

      {/* 3. THE CASCADING WATERFALL SERIES OF BARS */}
      {cascadeMode === 'cascade' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 items-stretch">
            {waterfallSteps.map((step, idx) => {
              const isHovered = activeStepHover === step.id;
              const isFirst = idx === 0;
              const isLast = idx === waterfallSteps.length - 1;

              return (
                <div
                  key={step.id}
                  onMouseEnter={() => setActiveStepHover(step.id)}
                  onMouseLeave={() => setActiveStepHover(null)}
                  className={`p-4 rounded-2xl border transition-all relative flex flex-col justify-between ${
                    isLast
                      ? 'bg-gradient-to-b from-emerald-950/30 to-slate-950 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                      : isFirst
                        ? 'bg-gradient-to-b from-rose-950/20 to-slate-950 border-rose-500/30'
                        : isHovered
                          ? 'bg-slate-900 border-indigo-500/60 shadow-md'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Step Header */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                        Step #{step.stepIndex}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isLast ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {step.tag}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white line-clamp-1">
                      {step.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">
                      {step.subtitle}
                    </p>
                  </div>

                  {/* Visual Cascading Bar Representation */}
                  <div className="my-4 py-2 flex flex-col items-center justify-end h-28 bg-slate-900/50 rounded-xl p-2 border border-slate-800/60 relative overflow-hidden">
                    {/* Amount Label on top of bar */}
                    <span className="text-xs font-mono font-bold text-white mb-1 z-10 tabular-nums">
                      {isLast ? '₹0' : `₹${(step.remainingAmount / 1000).toFixed(0)}k`}
                    </span>

                    {/* Cascading Bar */}
                    <div
                      className="w-full rounded-lg transition-all duration-500 relative flex items-center justify-center shadow-md"
                      style={{
                        height: isLast ? '14px' : `${Math.max(16, step.barHeightPct)}%`,
                        backgroundColor: step.color,
                        opacity: isLast ? 0.9 : 0.85
                      }}
                    >
                      {step.paidAmount > 0 && !isLast && (
                        <div
                          className="absolute inset-0 bg-emerald-400/40 rounded-lg"
                          style={{
                            height: `${Math.min(100, (step.paidAmount / step.amount) * 100)}%`
                          }}
                        />
                      )}
                    </div>

                    {/* Step-down cascade connector indicator */}
                    {!isLast && (
                      <div className="absolute -right-2 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-4 h-4 rounded-full bg-slate-800 border border-slate-700 text-slate-400 z-20">
                        <ArrowDown className="w-2.5 h-2.5 rotate-[-90deg]" />
                      </div>
                    )}
                  </div>

                  {/* Step Footer Details */}
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] space-y-1">
                    {step.monthlySavingsUnlocked && (
                      <div className="flex items-center justify-between text-emerald-400 font-medium">
                        <span>Interest Saved:</span>
                        <span className="font-mono font-bold">-₹{step.monthlySavingsUnlocked}/mo</span>
                      </div>
                    )}
                    {step.cashFlowRollover && (
                      <div className="flex items-center justify-between text-indigo-300 font-medium">
                        <span>Rollover Power:</span>
                        <span className="font-mono">₹{step.cashFlowRollover.toLocaleString('en-IN')}/mo</span>
                      </div>
                    )}
                    <p className="text-[10px] text-slate-500 leading-tight pt-1">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cascading Water Flow Logic Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 via-indigo-950/30 to-slate-950 border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div className="text-slate-300">
                <strong className="text-white">Waterfall Cash Flow Rollover Rule:</strong> Once Loan 3's ₹40k hand loan is eliminated, its full <span className="text-emerald-400 font-bold font-mono">₹3,500 monthly payment</span> rolls directly into Loan 1 (HDFC Bank), accelerating debt freedom by months!
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 font-mono text-[11px] text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/30">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>₹6,000/mo Total Fixed Interest</span>
            </div>
          </div>
        </div>
      ) : (
        /* Recharts Comparative Waterfall Bar Chart */
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
              Remaining Balance Waterfall Comparison (₹)
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Visual Step-Down Tranches
            </span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 15, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis
                  dataKey="name"
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
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Balance']}
                />
                <Bar
                  dataKey="balance"
                  radius={[8, 8, 0, 0]}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-rose-500" />
              <span>Initial Total Debt (₹2.40L)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-500" />
              <span>Tier 1: Hand Loan (₹40k)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-indigo-500" />
              <span>Tier 2: HDFC (₹1.00L)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-sky-400" />
              <span>Tier 3: Canara (₹1.00L)</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
