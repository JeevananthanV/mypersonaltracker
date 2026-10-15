import React, { useState } from 'react';
import {
  IndianRupee,
  AlertCircle,
  Plus,
  ShieldCheck,
  Calculator,
  Calendar,
  Trash2,
  PieChart as PieIcon,
  Search,
  Flame,
  Zap,
  CheckCircle2,
  Layers,
  ArrowRight,
  TrendingDown,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { useLifeOS } from '../context/LifeOSContext';
import { QuickAddModal } from '../components/QuickAddModal';
import { ExpenseCategory } from '../types';

export const FinancePage: React.FC = () => {
  const {
    salary,
    loanAccounts,
    totalOriginalPrincipal,
    outstandingPrincipal,
    totalPrincipalPaid,
    totalInterestPaid,
    loanPayments,
    deleteLoanPayment,
    transactions,
    addTransaction,
    deleteTransaction,
    firstLakhProgress
  } = useLifeOS();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'expense' | 'loan'>('expense');
  const [activeTab, setActiveTab] = useState<'overview' | 'loans' | 'daily_tracker' | 'simulator' | 'transactions'>('overview');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedLoanFilter, setSelectedLoanFilter] = useState<string>('all');

  // Daily Tracker state
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDateFilter, setSelectedDateFilter] = useState<'today' | 'yesterday' | 'week' | 'month' | 'all'>('month');
  const [customDate, setCustomDate] = useState<string>(todayStr);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Quick Daily Add inline state
  const [quickTitle, setQuickTitle] = useState('');
  const [quickAmount, setQuickAmount] = useState('');
  const [quickCategory, setQuickCategory] = useState<ExpenseCategory>('Food & Groceries');
  const [quickIsWant, setQuickIsWant] = useState(false);
  const [quickNotes, setQuickNotes] = useState('');

  // Simulator state: Monthly Principal payment slider
  const [simMonthlyPayment, setSimMonthlyPayment] = useState<number>(16000);

  // Current Month calculations
  const currentMonth = todayStr.substring(0, 7);
  const monthTxs = transactions.filter(t => t.month === currentMonth);
  const totalMonthExpenses = monthTxs.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const totalMonthLoanPaid = monthTxs.filter(t => t.type === 'loan_payment').reduce((acc, t) => acc + t.amount, 0);
  const totalMonthSpent = totalMonthExpenses + totalMonthLoanPaid;
  const netSavings = Math.max(0, salary - totalMonthSpent);

  // Daily Budget calculations
  const monthlyLivingBudget = salary - 16000; // e.g. ₹18,000 living budget
  const safeDailyBudget = Math.round(monthlyLivingBudget / 30); // ~₹600/day

  // Today's spending
  const todayTxs = transactions.filter(t => t.date === todayStr && (t.type === 'expense' || t.type === 'loan_payment'));
  const todaySpent = todayTxs.reduce((acc, t) => acc + t.amount, 0);
  const todayRemaining = safeDailyBudget - todaySpent;

  // Category breakdown for Pie Chart
  const categoryTotals: Record<string, number> = {};
  monthTxs.forEach(t => {
    if (t.type === 'expense' || t.type === 'loan_payment') {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    }
  });

  const pieData = Object.keys(categoryTotals).map(cat => ({
    name: cat,
    value: categoryTotals[cat]
  }));

  const COLORS = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6', '#ec4899', '#64748b'];

  // Needs vs Wants calculation
  const needsCategories = ['Rent & Utilities', 'Loan Principal', 'Loan Interest', 'Transit & Fuel', 'Health & Wellness'];
  let totalNeeds = 0;
  let totalWants = 0;
  monthTxs.forEach(t => {
    if (t.type === 'expense' || t.type === 'loan_payment') {
      if (needsCategories.includes(t.category)) {
        totalNeeds += t.amount;
      } else {
        totalWants += t.amount;
      }
    }
  });

  // Top 5 largest single expenses
  const sortedExpenses = [...monthTxs]
    .filter(t => t.type === 'expense' || t.type === 'loan_payment')
    .sort((a, b) => b.amount - a.amount);
  const topFiveExpenses = sortedExpenses.slice(0, 5);

  // Daily Spending timeline data for bar chart
  const dateTotals: Record<string, number> = {};
  monthTxs.forEach(t => {
    if (t.type === 'expense' || t.type === 'loan_payment') {
      dateTotals[t.date] = (dateTotals[t.date] || 0) + t.amount;
    }
  });

  const dailyBarData = Object.keys(dateTotals)
    .sort()
    .map(d => ({
      date: d.split('-')[2],
      amount: dateTotals[d],
      fullDate: d
    }));

  // Simulator feasibility calculations
  const monthsToPayoff = simMonthlyPayment > 0 ? Math.ceil(outstandingPrincipal / simMonthlyPayment) : 0;
  const simMonthlyLivingBudget = salary - simMonthlyPayment;
  const isHighRisk = simMonthlyLivingBudget < 5000;

  // Filtered transactions for Daily Tracker view
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const filteredDailyTxs = transactions.filter(t => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match = t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || (t.notes || '').toLowerCase().includes(q);
      if (!match) return false;
    }

    if (selectedDateFilter === 'today') return t.date === todayStr;
    if (selectedDateFilter === 'yesterday') return t.date === yesterdayStr;
    if (selectedDateFilter === 'week') {
      const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
      return t.date >= sevenDaysAgo;
    }
    if (selectedDateFilter === 'month') return t.month === currentMonth;
    return true;
  });

  // Filtered loan payments
  const filteredLoanPayments = loanPayments.filter(lp => {
    if (selectedLoanFilter === 'all') return true;
    return lp.loanId === selectedLoanFilter || (lp.loanName && lp.loanName.includes(selectedLoanFilter));
  });

  // Quick Daily Add submit handler
  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle || !quickAmount) return;

    addTransaction({
      title: quickTitle,
      amount: parseFloat(quickAmount),
      type: 'expense',
      category: quickCategory,
      date: customDate,
      notes: quickNotes ? `${quickNotes} (${quickIsWant ? 'Want' : 'Need'})` : (quickIsWant ? 'Discretionary / Want' : 'Essential / Need')
    });

    setQuickTitle('');
    setQuickAmount('');
    setQuickNotes('');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2.5">
            <IndianRupee className="w-7 h-7 text-emerald-400" />
            <span>Finance & Loan Freedom Center</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time tracking for your ₹34,000 salary, 3 separate loans (₹1L + ₹1L + ₹40k), and daily expense audit.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setModalType('loan');
              setModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/20 flex items-center space-x-1.5 transition-all hover:scale-105"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Pay Loan EMI</span>
          </button>
          <button
            onClick={() => {
              setModalType('expense');
              setModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 flex items-center space-x-1.5 transition-all hover:scale-105"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Safe Daily Spend Target */}
        <div className="glass-panel p-5 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-slate-900 to-indigo-950/20">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-indigo-300">Daily Safe Allowance</span>
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">
            ₹{safeDailyBudget.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-400">/ day</span>
          </div>
          <div className="mt-2 text-xs flex items-center justify-between">
            <span className="text-slate-400">Spent Today:</span>
            <span className={`font-bold ${todaySpent > safeDailyBudget ? 'text-rose-400' : 'text-emerald-400'}`}>
              ₹{todaySpent.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {todayRemaining >= 0 ? `₹${todayRemaining} safe margin today` : `⚠️ Over daily limit by ₹${Math.abs(todayRemaining)}`}
          </p>
        </div>

        {/* Card 2: Combined Loan Balance */}
        <div className="glass-panel p-5 rounded-2xl border border-rose-500/20 bg-rose-950/10">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total Loan Balance Due</span>
            <span className="text-rose-400 font-bold">3 Separate Loans</span>
          </div>
          <div className="text-2xl font-black text-rose-400">
            ₹{outstandingPrincipal.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Original Total: ₹{totalOriginalPrincipal.toLocaleString('en-IN')} · Paid: ₹{totalPrincipalPaid.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Card 3: Monthly Expenses vs Salary */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Monthly Salary & Spend</span>
            <span className="text-emerald-400 font-semibold">₹{salary.toLocaleString('en-IN')} / mo</span>
          </div>
          <div className="text-2xl font-black text-slate-200">
            ₹{totalMonthSpent.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-400">spent</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            ₹{netSavings.toLocaleString('en-IN')} remaining in October
          </p>
        </div>

        {/* Card 4: ₹1 Lakh Discount Milestone */}
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-amber-950/10">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Loan 1 Discount Rule</span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300">
            {firstLakhProgress}% <span className="text-xs font-normal text-slate-400">Cleared</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Close Loan 1 to save <strong className="text-emerald-400 font-bold">₹2,000/mo</strong> on EMI
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          Overview & Insights
        </button>
        <button
          onClick={() => setActiveTab('loans')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
            activeTab === 'loans'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>3 Separate Loans Tracker ({loanAccounts.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('daily_tracker')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
            activeTab === 'daily_tracker'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Daily Expense Tracker & Leak Detective</span>
        </button>
        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'simulator'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          Payoff Feasibility Simulator
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'transactions'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          All Transactions ({transactions.length})
        </button>
      </div>

      {/* TAB: 3 SEPARATE LOANS TRACKER */}
      {activeTab === 'loans' && (
        <div className="space-y-6">
          {/* Top Banner explaining the 3 separate loans */}
          <div className="glass-panel p-6 rounded-3xl border border-rose-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-rose-400" />
                  <span>3 Separate Loans Breakdown & EMI Tracking</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Track and repay each of your 3 distinct loans individually with separate principal and EMI deductions.
                </p>
              </div>
              <div className="text-xs text-right">
                <span className="text-slate-400 block">Total Original Debt:</span>
                <span className="text-base font-bold text-white">₹{totalOriginalPrincipal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* THE 3 SEPARATE LOAN CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
              {loanAccounts.map((loan, idx) => {
                const paid = loan.originalPrincipal - loan.currentPrincipal;
                const progress = Math.min(100, Math.round((paid / loan.originalPrincipal) * 100));
                const isClosed = loan.currentPrincipal === 0 || loan.status === 'closed';

                return (
                  <div
                    key={loan.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                      isClosed
                        ? 'bg-emerald-950/20 border-emerald-500/40'
                        : idx === 0
                        ? 'bg-slate-900/90 border-rose-500/40 shadow-lg'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold text-[10px] uppercase">
                          Loan #{idx + 1}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isClosed
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {isClosed ? 'CLEARED' : 'ACTIVE'}
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold text-white">{loan.name}</h3>

                      <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Balance Remaining:</span>
                          <span className="font-bold text-rose-400">₹{loan.currentPrincipal.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">Principal Cleared:</span>
                          <span className="font-semibold text-emerald-400">₹{paid.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">Original Principal:</span>
                          <span className="text-slate-300">₹{loan.originalPrincipal.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      {/* Special Lender Rule on Loan 1 */}
                      {idx === 0 && (
                        <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 leading-snug">
                          <strong>⭐ ₹2,000 EMI Drop:</strong> Clearing this loan reduces your monthly payment by ₹2,000!
                        </div>
                      )}
                      {idx > 0 && loan.lenderNotes && (
                        <p className="mt-2 text-[11px] text-slate-400 leading-snug">
                          {loan.lenderNotes}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-800/80">
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400">Repayment Progress:</span>
                        <span className="font-bold text-white">{progress}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
                        <div
                          className="bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <button
                        onClick={() => {
                          setModalType('loan');
                          setModalOpen(true);
                        }}
                        disabled={isClosed}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                          isClosed
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isClosed ? 'Loan Fully Paid' : `Pay EMI for ${loan.name}`}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* LOAN REPAYMENT HISTORY TABLE */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-100">Separate Loan Repayment Records</h2>
                <p className="text-xs text-slate-400">Every payment is logged specifically to its loan account</p>
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={selectedLoanFilter}
                  onChange={(e) => setSelectedLoanFilter(e.target.value)}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200"
                >
                  <option value="all">All Loans</option>
                  {loanAccounts.map(loan => (
                    <option key={loan.id} value={loan.id}>{loan.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    setModalType('loan');
                    setModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-sm"
                >
                  + Record Payment
                </button>
              </div>
            </div>

            <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Target Loan</th>
                      <th className="px-4 py-3">Opening Bal</th>
                      <th className="px-4 py-3 text-emerald-400">Principal Paid</th>
                      <th className="px-4 py-3 text-rose-400">Interest Paid</th>
                      <th className="px-4 py-3">Total Paid</th>
                      <th className="px-4 py-3 text-cyan-300">Closing Bal</th>
                      <th className="px-4 py-3">Notes</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredLoanPayments.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-4 py-8 text-center text-slate-500 text-xs">
                          No loan payments logged yet. Click "Record Payment" to log your first EMI payment!
                        </td>
                      </tr>
                    ) : (
                      filteredLoanPayments.map((lp) => (
                        <tr key={lp.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-3 text-slate-300 font-mono">{lp.date}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-bold text-[11px]">
                              {lp.loanName || 'Loan'}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-300">₹{lp.openingBalance.toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3 font-bold text-emerald-400">₹{lp.principalPaid.toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3 font-bold text-rose-400">₹{lp.interestPaid.toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3 font-black text-white">₹{lp.totalPaid.toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3 font-bold text-cyan-300">₹{lp.closingBalance.toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3 text-slate-400 max-w-xs truncate">{lp.notes || '-'}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => deleteLoanPayment(lp.id)}
                              className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Delete payment record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: DAILY EXPENSE TRACKER & LEAK DETECTIVE */}
      {activeTab === 'daily_tracker' && (
        <div className="space-y-6">
          {/* "WHERE DID MY MONEY GO?" DETECTIVE AUDIT BANNER */}
          <div className="glass-panel p-6 rounded-3xl border border-indigo-500/25 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-2">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Search className="w-5 h-5 text-indigo-400" />
                  <span>"Where Did My Money Go?" — Expense Leak Detective</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Detailed analysis pinpointing your biggest outflows and actionable savings levers.
                </p>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold">
                  Essential Needs: ₹{totalNeeds.toLocaleString('en-IN')}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 font-bold">
                  Discretionary Wants: ₹{totalWants.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {/* Top 5 Biggest Expenses */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400 block">
                  Top 5 Outflows This Month:
                </span>
                <div className="space-y-1.5 text-xs">
                  {topFiveExpenses.length === 0 ? (
                    <div className="text-slate-500 text-xs py-4 text-center">No expenses recorded yet this month.</div>
                  ) : (
                    topFiveExpenses.map((exp, idx) => (
                      <div key={exp.id} className="flex justify-between items-center p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                        <div className="truncate pr-2">
                          <span className="font-semibold text-slate-200 block truncate">#{idx + 1} {exp.title}</span>
                          <span className="text-[10px] text-slate-500">{exp.date} · {exp.category}</span>
                        </div>
                        <span className="font-bold text-white shrink-0">₹{exp.amount.toLocaleString('en-IN')}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Day-by-Day Spending Bar Chart */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 block mb-1">
                    Daily Spending Trend:
                  </span>
                  <p className="text-[11px] text-slate-400 mb-2">Track outflows day by day to spot impulse days</p>
                </div>
                <div className="h-40 w-full">
                  {dailyBarData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-slate-500">
                      No daily spending records yet
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dailyBarData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                        <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                        <YAxis stroke="#64748b" fontSize={10} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                          formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Spent']}
                          labelFormatter={(lbl) => `Day ${lbl} of month`}
                        />
                        <Bar dataKey="amount" fill="#6366f1" radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Actionable Recommendations */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5 text-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                  💡 Safe Budget Strategy:
                </span>
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-slate-300 text-[11px] leading-relaxed">
                  <strong className="text-amber-300">Loan 1 First Priority:</strong> Concentrate prepayment on Loan 1 (₹1,00,000). As soon as that is cleared, your required monthly outflow decreases by ₹2,000 immediately.
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-slate-300 text-[11px] leading-relaxed">
                  <strong className="text-emerald-300">Daily Safe Limit:</strong> Keep everyday discretionary spend under <strong className="text-white">₹600/day</strong> to guarantee all 3 loans and living expenses are serviced smoothly.
                </div>
              </div>
            </div>
          </div>

          {/* QUICK INLINE EXPENSE LOGGER */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/80">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Log Today's Real-Time Expense</span>
            </h3>
            <form onSubmit={handleQuickAdd} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
              <div className="lg:col-span-2">
                <label className="block text-slate-400 mb-1">Expense Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lunch, Metro recharge, Groceries"
                  value={quickTitle}
                  onChange={e => setQuickTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="₹ Amount"
                  value={quickAmount}
                  onChange={e => setQuickAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Category</label>
                <select
                  value={quickCategory}
                  onChange={e => setQuickCategory(e.target.value as ExpenseCategory)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                >
                  <option value="Food & Groceries">Food & Groceries</option>
                  <option value="Transit & Fuel">Transit & Fuel</option>
                  <option value="Rent & Utilities">Rent & Utilities</option>
                  <option value="Learning & Courses">Learning & Courses</option>
                  <option value="Health & Wellness">Health & Wellness</option>
                  <option value="Personal & Leisure">Personal & Leisure</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={customDate}
                  onChange={e => setCustomDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-md transition-all"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>

          {/* DATE FILTER BUTTONS & EXPENSES TABLE */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setSelectedDateFilter('today')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    selectedDateFilter === 'today' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setSelectedDateFilter('yesterday')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    selectedDateFilter === 'yesterday' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Yesterday
                </button>
                <button
                  onClick={() => setSelectedDateFilter('week')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    selectedDateFilter === 'week' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Last 7 Days
                </button>
                <button
                  onClick={() => setSelectedDateFilter('month')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    selectedDateFilter === 'month' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  This Month
                </button>
                <button
                  onClick={() => setSelectedDateFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    selectedDateFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All
                </button>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 w-48 sm:w-60"
                />
              </div>
            </div>

            <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Expense Name</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Classification</th>
                      <th className="px-4 py-3 text-right">Amount</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredDailyTxs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-slate-500 text-xs">
                          No real-time expenses logged yet for this filter. Use the form above to log your first expense!
                        </td>
                      </tr>
                    ) : (
                      filteredDailyTxs.map((t) => {
                        const isNeed = needsCategories.includes(t.category);
                        return (
                          <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="px-4 py-3 font-mono text-slate-300">{t.date}</td>
                            <td className="px-4 py-3">
                              <span className="font-semibold text-white block">{t.title}</span>
                              {t.notes && <span className="text-[10px] text-slate-500">{t.notes}</span>}
                            </td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                                {t.category}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                isNeed ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                              }`}>
                                {isNeed ? 'Essential Need' : 'Discretionary Want'}
                              </span>
                            </td>
                            <td className={`px-4 py-3 text-right font-bold text-sm ${t.type === 'salary' ? 'text-emerald-400' : 'text-slate-100'}`}>
                              {t.type === 'salary' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => deleteTransaction(t.id)}
                                className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: OVERVIEW & INSIGHTS */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Summary of the 3 Loans */}
          <div className="lg:col-span-6 space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-rose-500/30 bg-gradient-to-br from-slate-900 to-rose-950/20">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2 text-rose-400">
                  <ShieldCheck className="w-5 h-5" />
                  <h3 className="text-sm font-bold text-slate-100">3 Separate Loans Portfolio</h3>
                </div>
                <button
                  onClick={() => setActiveTab('loans')}
                  className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center space-x-1"
                >
                  <span>Manage All 3</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {loanAccounts.map((loan, idx) => (
                  <div key={loan.id} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white">{loan.name}</span>
                        {idx === 0 && (
                          <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded font-semibold">
                            ₹2k Drop Rule
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Balance: <strong className="text-rose-400">₹{loan.currentPrincipal.toLocaleString('en-IN')}</strong> of ₹{loan.originalPrincipal.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setModalType('loan');
                        setModalOpen(true);
                      }}
                      className="px-2.5 py-1 rounded bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-semibold transition-colors"
                    >
                      Pay EMI
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Practical Loan Payoff Advice */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
              <div className="flex items-center space-x-2 text-indigo-400 mb-3">
                <AlertCircle className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-100">Recommended Payoff Strategy</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Prioritize clearing <strong className="text-rose-300">Loan 1 (₹1,00,000)</strong> first. The moment Loan 1 reaches ₹0, your monthly commitment drops by <strong className="text-emerald-400 font-bold">₹2,000</strong> immediately. Then roll that ₹2,000 into crushing Loan 3 (₹40,000) in under 3 months!
              </p>
            </div>
          </div>

          {/* Right: Category Expense Breakdown */}
          <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-slate-100 mb-1 flex items-center space-x-2">
              <PieIcon className="w-4 h-4 text-indigo-400" />
              <span>Spending Breakdown (₹{totalMonthSpent.toLocaleString('en-IN')})</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Real-time distribution between loans and living expenses
            </p>

            <div className="h-64 w-full">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={45}
                      paddingAngle={3}
                      label={({ name, percent }) => `${((name as string) || '').split(' ')[0]} ${((percent || 0) * 100).toFixed(0)}%`}
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                      formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-xs text-slate-500 space-y-2">
                  <Sparkles className="w-6 h-6 text-slate-600" />
                  <span>No transactions recorded yet this month.</span>
                  <span className="text-[11px] text-slate-600">Start logging your daily expenses to see visual graphs!</span>
                </div>
              )}
            </div>

            {pieData.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-4 text-[11px]">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center space-x-2 p-1.5 rounded bg-slate-950/60 border border-slate-800">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-slate-300 truncate">{d.name}:</span>
                    <span className="font-bold text-white ml-auto">₹{d.value.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: PAYOFF FEASIBILITY SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-amber-400" />
              <span>Interactive Loan Payoff Calculator</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Adjust your monthly principal repayment to see how quickly you become debt-free across your 3 loans.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-300">
                  Monthly Principal Repayment Allocation:
                </label>
                <div className="text-2xl font-black text-emerald-400">
                  ₹{simMonthlyPayment.toLocaleString('en-IN')} / month
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSimMonthlyPayment(15000)}
                  className="px-2.5 py-1 text-xs rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300"
                >
                  ₹15,000 (Safe)
                </button>
                <button
                  onClick={() => setSimMonthlyPayment(18000)}
                  className="px-2.5 py-1 text-xs rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300"
                >
                  ₹18,000 (Balanced)
                </button>
              </div>
            </div>

            <input
              type="range"
              min="5000"
              max="30000"
              step="1000"
              value={simMonthlyPayment}
              onChange={(e) => setSimMonthlyPayment(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Total Outstanding:</span>
                <div className="text-lg font-bold text-white">₹{outstandingPrincipal.toLocaleString('en-IN')}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Months to Zero Debt:</span>
                <div className="text-lg font-bold text-cyan-400">~{monthsToPayoff} months</div>
              </div>
              <div className={`p-3 rounded-xl border ${isHighRisk ? 'bg-rose-950/30 border-rose-800 text-rose-300' : 'bg-slate-900 border-slate-800 text-emerald-400'}`}>
                <span className="text-slate-400">Leftover for Living:</span>
                <div className="text-lg font-bold">₹{simMonthlyLivingBudget.toLocaleString('en-IN')}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: ALL TRANSACTIONS */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-100">Real-Time Transactions Ledger</h2>
              <p className="text-xs text-slate-400">All recorded income, expense, and loan repayments</p>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200"
              >
                <option value="all">All Types</option>
                <option value="expense">Expenses Only</option>
                <option value="loan_payment">Loan Repayments</option>
                <option value="salary">Salary Only</option>
              </select>
              <button
                onClick={() => {
                  setModalType('expense');
                  setModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                + Add Transaction
              </button>
            </div>
          </div>

          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {transactions.filter(t => filterType === 'all' || t.type === filterType).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-500 text-xs">
                        No transactions recorded yet. Click "+ Add Transaction" to record your real data!
                      </td>
                    </tr>
                  ) : (
                    transactions.filter(t => filterType === 'all' || t.type === filterType).map((t) => (
                      <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3 text-slate-300 font-mono">{t.date}</td>
                        <td className="px-4 py-3 font-semibold text-white">{t.title}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                            {t.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                            t.type === 'salary'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : t.type === 'loan_payment'
                              ? 'bg-rose-500/20 text-rose-400'
                              : 'bg-indigo-500/20 text-indigo-300'
                          }`}>
                            {t.type.replace('_', ' ')}
                          </span>
                        </td>
                        <td className={`px-4 py-3 text-right font-bold text-sm ${t.type === 'salary' ? 'text-emerald-400' : 'text-slate-200'}`}>
                          {t.type === 'salary' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => deleteTransaction(t.id)}
                            className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <QuickAddModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultType={modalType}
      />
    </div>
  );
};
