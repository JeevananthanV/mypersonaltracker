import React, { useState } from 'react';
import {
  Coins,
  Layers,
  TrendingUp,
  Award,
  IndianRupee,
  CheckCircle2,
  RefreshCw,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Sparkles,
  Calculator,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useLifeOS } from '../context/LifeOSContext';
import { AchievementBadges } from '../components/dashboard/AchievementBadges';
import { AIMLCourseTrendChart } from '../components/dashboard/AIMLCourseTrendChart';
import { DailyHabitTracker } from '../components/dashboard/DailyHabitTracker';
import { HabitHeatmap } from '../components/dashboard/HabitHeatmap';
import { DebtPaydownCalculator } from '../components/loans/DebtPaydownCalculator';
import { DebtWaterfallCascade } from '../components/loans/DebtWaterfallCascade';
import { SmartDebtAlertSystem } from '../components/loans/SmartDebtAlertSystem';
import { PothysGoldRateMonitor } from '../components/investments/PothysGoldRateMonitor';

export const DashboardPage: React.FC = () => {
  const {
    salary,
    loanAccounts,
    outstandingPrincipal,
    totalPrincipalPaid,
    totalInterestPaid,
    firstLakhProgress,
    investments,
    totalInvestedCapital,
    totalPortfolioValue,
    totalInvestmentReturns,
    totalInvestmentReturnsPct,
    tasks,
    toggleTask,
    fitnessProfile,
    navigateToTab,
    openQuickAdd,
    payChitInstallment,
    triggerConfetti
  } = useLifeOS();

  // Filter strictly to the 3 chits and 2 stocks
  const activeChits = investments.filter(i =>
    ['chit-grt-gold-11m', 'chit-saravana-fund-20m', 'chit-offline-monthly-1000'].includes(i.id)
  );
  const activeStocks = investments.filter(i =>
    ['groww-itc', 'groww-tatagold'].includes(i.id)
  );

  // Today's Top Priorities
  const todayTasks = tasks.slice(0, 3);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Executive Headline & Strategic Blueprint */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-emerald-400">Jeeva's Personal Command Center</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">Salem, Tamil Nadu</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
            Financial Freedom & Career OS
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Managing <strong className="text-emerald-400">₹34,000/mo salary</strong>, eliminating <strong className="text-rose-400">3 loans (₹2.40L)</strong>, growing <strong className="text-amber-300">3 chits & 2 stocks</strong>, and monitoring <strong className="text-amber-400">Salem Bullion Gold Rates</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => openQuickAdd('loan')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            <Layers className="w-3.5 h-3.5 text-rose-400" />
            <span>Pay Loan</span>
          </button>
          <button
            onClick={() => openQuickAdd('investment')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-semibold transition-all"
          >
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>Deposit Chit</span>
          </button>
          <button
            onClick={() => openQuickAdd('task')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>
        </div>
      </section>

      {/* SMART DEBT ALERT & PUSH NOTIFICATION SYSTEM */}
      <SmartDebtAlertSystem onPayLoanClick={() => openQuickAdd('loan')} />

      {/* 2. POTHYS SWARNA MAHAL DAILY GOLD & SILVER RATE MONITOR (Free API) */}
      <PothysGoldRateMonitor />

      {/* 3. FOUR DOMINANT METRIC CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Salary */}
        <div className="p-5 rounded-2xl bg-[#0E1526] border border-slate-800 hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Monthly Inflow</span>
            <span className="text-emerald-400 font-medium">1st of Month</span>
          </div>
          <div className="font-mono text-2xl font-black text-white tabular-nums">
            ₹{salary.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
            <span>Tech Career Salary</span>
            <span className="text-emerald-400 font-semibold">100% Fixed</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            Covers ₹19.5k total EMIs & monthly savings
          </div>
        </div>

        {/* Card 2: 3 Loans Principal Balance */}
        <div className="p-5 rounded-2xl bg-[#0E1526] border border-slate-800 hover:border-rose-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>3 Active Loans</span>
            <span className="text-rose-400 font-medium">₹6,000/mo Int.</span>
          </div>
          <div className="font-mono text-2xl font-black text-rose-300 tabular-nums">
            ₹{outstandingPrincipal.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
            <span>Principal Left</span>
            <span className="text-rose-400 font-semibold">
              ₹{(totalPrincipalPaid / 1000).toFixed(0)}k Paid
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span>Next ₹1L Milestone</span>
              <span className="text-indigo-400 font-mono font-semibold">{firstLakhProgress.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-rose-500 rounded-full"
                style={{ width: `${Math.min(100, firstLakhProgress)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: 3 Chits & 2 Stocks Portfolio */}
        <div className="p-5 rounded-2xl bg-[#0E1526] border border-slate-800 hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>3 Chits + 2 Stocks</span>
            <span className="text-amber-400 font-medium font-mono">5 Assets</span>
          </div>
          <div className="font-mono text-2xl font-black text-amber-200 tabular-nums">
            ₹{Math.round(totalPortfolioValue).toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
            <span>Invested: ₹{Math.round(totalInvestedCapital).toLocaleString('en-IN')}</span>
            <span className={`font-semibold ${totalInvestmentReturns >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {totalInvestmentReturns >= 0 ? '+' : ''}{totalInvestmentReturnsPct.toFixed(1)}%
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Salem Gold + Demat</span>
            <button
              onClick={() => navigateToTab('chits')}
              className="text-amber-400 hover:text-amber-300 font-medium"
            >
              View Chits →
            </button>
          </div>
        </div>

        {/* Card 4: Fitness & Weight Target */}
        <div className="p-5 rounded-2xl bg-[#0E1526] border border-slate-800 hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Body Weight Goal</span>
            <span className="text-emerald-400 font-medium">3x / week</span>
          </div>
          <div className="font-mono text-2xl font-black text-white tabular-nums">
            {fitnessProfile.currentWeight} <span className="text-sm font-normal text-slate-400">kg</span>
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
            <span>Target: 60 kg</span>
            <span className="text-indigo-400 font-semibold">160 cm (BMI 22.3)</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Mobility & Walking</span>
            <button
              onClick={() => navigateToTab('fitness')}
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Log Workout →
            </button>
          </div>
        </div>
      </section>

      {/* 4. GAMIFIED MASTERY & ACHIEVEMENT BADGES */}
      <AchievementBadges />

      {/* 5. AI/ML COURSE COMPLETION TREND OVER TIME (RECHARTS VISUALIZATION) */}
      <AIMLCourseTrendChart />

      {/* 6. VISUAL DEBT WATERFALL & CASCADING REPAYMENT BARS */}
      <DebtWaterfallCascade />

      {/* 3 ACTIVE LOAN DOSSIERS */}
      <section className="p-6 rounded-2xl bg-[#0E1526] border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-rose-400" />
              <h2 className="text-base font-heading font-black text-white tracking-tight">
                Active Loan Tranches & Direct Repayment
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Individual balances, interest breakdown, and quick payment actions for each active loan.
            </p>
          </div>
          <button
            onClick={() => navigateToTab('loans')}
            className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-semibold self-start sm:self-auto"
          >
            <span>Complete Loan Dossiers</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Loan Account Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {loanAccounts.slice(0, 3).map((loan, idx) => {
            const paid = loan.originalPrincipal - loan.currentPrincipal;
            const pctPaid = loan.originalPrincipal > 0 ? (paid / loan.originalPrincipal) * 100 : 0;
            return (
              <div
                key={loan.id}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-rose-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-white">Loan #{idx + 1}: {loan.lender}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-mono font-medium">
                      ₹{loan.fixedInterestAmount || 2000}/mo Int.
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mb-3">{loan.loanType || 'Personal Loan'}</div>

                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-xs text-slate-400">Balance:</span>
                    <span className="font-mono text-lg font-bold text-rose-200 tabular-nums">
                      ₹{loan.currentPrincipal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between text-xs text-slate-400 mb-3">
                    <span>Monthly EMI:</span>
                    <span className="font-mono text-slate-200">
                      ₹{loan.monthlyEmi?.toLocaleString('en-IN') || 8000}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, pctPaid)}%` }}
                    />
                  </div>
                  <button
                    onClick={() => openQuickAdd('loan')}
                    className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-rose-600/30 text-rose-300 hover:text-white text-xs font-semibold transition-colors"
                  >
                    Log Repayment
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. DEBT PAYDOWN CALCULATOR (EXTRA PAYMENTS & ACCELERATION) */}
      <DebtPaydownCalculator />

      {/* 8. THE 3 CHITS & 2 STOCKS WEALTH CENTER */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3 Active Chits */}
        <div className="p-6 rounded-2xl bg-[#0E1526] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-heading font-black text-white">
                  3 Active Chits & Jeweller Schemes
                </h3>
              </div>
              <p className="text-xs text-slate-400">Salem jewellery & registered family chit funds</p>
            </div>
            <button
              onClick={() => navigateToTab('chits')}
              className="text-xs text-emerald-400 hover:underline font-semibold"
            >
              Manage Chits →
            </button>
          </div>

          <div className="space-y-3">
            {activeChits.map((chit) => (
              <div
                key={chit.id}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/30 transition-all flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-white text-xs sm:text-sm">
                    {chit.name}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                    <span>{chit.platform}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-400 font-mono font-medium">
                      Month {chit.chitMonthsPaid || 0} of {chit.chitTenureMonths || 12}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">
                    Invested: ₹{(chit.investedAmount || 0).toLocaleString('en-IN')} · ₹{chit.chitMonthlyAmount || 2000}/mo
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="font-mono text-sm font-bold text-amber-300 tabular-nums">
                    ₹{(chit.currentValue || chit.investedAmount).toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={() => payChitInstallment(chit.id)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white text-[11px] font-semibold transition-colors"
                  >
                    + Pay Month
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2 Active Stocks */}
        <div className="p-6 rounded-2xl bg-[#0E1526] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-heading font-black text-white">
                  2 Active Growth Stocks
                </h3>
              </div>
              <p className="text-xs text-slate-400">Groww App Demat holdings (ITC Ltd & Tata Gold ETF)</p>
            </div>
            <button
              onClick={() => navigateToTab('groww_stocks')}
              className="text-xs text-cyan-400 hover:underline font-semibold"
            >
              Open Stocks →
            </button>
          </div>

          <div className="space-y-3">
            {activeStocks.map((stock) => {
              const gain = (stock.currentValue || 0) - (stock.investedAmount || 0);
              const gainPct = stock.investedAmount > 0 ? (gain / stock.investedAmount) * 100 : 0;
              return (
                <div
                  key={stock.id}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/30 transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-xs sm:text-sm">{stock.name}</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300">
                        {stock.symbolOrCode}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                      <span>{stock.quantity} {stock.unitType || 'shares'}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">Avg: ₹{stock.buyPriceAverage?.toFixed(2)}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 font-mono">
                      Current Price: ₹{stock.currentPrice?.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="font-mono text-sm font-bold text-white tabular-nums">
                      ₹{stock.currentValue?.toFixed(2)}
                    </span>
                    <span className={`text-[11px] font-mono font-semibold ${gain >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {gain >= 0 ? '+' : ''}{gain.toFixed(2)} ({gainPct.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Note */}
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              All non-core investments, extra mutual funds, and silver schemes have been cleanly pruned.
            </span>
          </div>
        </div>
      </section>

      {/* 6. DAILY HABIT TRACKER & 7-DAY STREAKS */}
      <DailyHabitTracker />

      {/* 7. ANNUAL HABIT ACTIVITY HEATMAP */}
      <HabitHeatmap />

      {/* 8. TODAY'S NON-NEGOTIABLE TOP 3 PRIORITIES */}
      <section className="p-6 rounded-2xl bg-[#0E1526] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-heading font-black text-white">
              Today's Non-Negotiable Priorities
            </h3>
            <p className="text-xs text-slate-400">Execute today's top outcomes with zero distraction</p>
          </div>
          <button
            onClick={() => navigateToTab('tasks')}
            className="text-xs text-indigo-400 hover:underline font-semibold"
          >
            All Tasks →
          </button>
        </div>

        {todayTasks.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            No pending tasks for today. Tap "+ Quick Add" to define your top 3 daily priorities!
          </div>
        ) : (
          <div className="space-y-2.5">
            {todayTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => {
                  toggleTask(task.id);
                  if (task.status !== 'completed') triggerConfetti();
                }}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  task.status === 'completed'
                    ? 'bg-emerald-950/10 border-emerald-500/20 text-slate-400 line-through'
                    : 'bg-slate-950/60 border-slate-800 text-slate-200 hover:border-indigo-500/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                    task.status === 'completed'
                      ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                      : 'border-slate-700 bg-slate-900'
                  }`}>
                    {task.status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <span className="text-xs sm:text-sm font-medium">{task.title}</span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  {task.area}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
