import React, { useState } from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import { ExpenseCategory, Transaction } from '../types';
import {
  IndianRupee,
  Plus,
  Trash2,
  Calendar,
  Filter,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  TrendingDown,
  Search,
  CheckCircle2
} from 'lucide-react';
import {
  getLiveDateString,
  getYesterdayDateString,
  getDaysAgoDateString,
  getLiveMonthFormatted
} from '../utils/date-utils';

const formatCurrency = (val: number) => `₹${Math.round(val || 0).toLocaleString('en-IN')}`;

export const DailyExpensePage: React.FC = () => {
  const {
    transactions,
    addTransaction,
    deleteTransaction,
    navigateToTab,
    triggerConfetti
  } = useLifeOS();

  const todayStr = getLiveDateString();
  const [selectedFilter, setSelectedFilter] = useState<'today' | 'yesterday' | 'week' | 'month' | 'all'>('month');
  const [searchTerm, setSearchTerm] = useState('');

  // Quick Inline Add form state
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Food & Groceries');
  const [isWant, setIsWant] = useState(false);
  const [date, setDate] = useState(todayStr);
  const [notes, setNotes] = useState('');

  const categories: ExpenseCategory[] = [
    'Food & Groceries',
    'Rent & Utilities',
    'Transit & Fuel',
    'Health & Wellness',
    'Learning & Courses',
    'Personal & Leisure',
    'Family & Commitments',
    'Other'
  ];

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!title.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    const formattedNotes = isWant
      ? `[WANT] ${notes.trim()}`
      : notes.trim() || undefined;

    addTransaction({
      title: title.trim(),
      amount: parsedAmount,
      type: 'expense',
      category,
      date: date || todayStr,
      notes: formattedNotes
    });

    setTitle('');
    setAmount('');
    setNotes('');
    triggerConfetti();
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(t => {
    if (t.type !== 'expense') return false;

    // Date filtering
    if (selectedFilter === 'today' && t.date !== todayStr) return false;
    if (selectedFilter === 'yesterday' && t.date !== getYesterdayDateString()) return false;
    if (selectedFilter === 'week' && t.date < getDaysAgoDateString(7)) return false;
    if (selectedFilter === 'month' && !t.date.startsWith(todayStr.slice(0, 7))) return false;

    // Search term
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.notes && t.notes.toLowerCase().includes(q))
      );
    }

    return true;
  });

  const isWantTx = (t: Transaction) => (t.notes && t.notes.includes('[WANT]')) || t.category === 'Personal & Leisure';

  const totalFilteredSpend = filteredTransactions.reduce((acc, t) => acc + t.amount, 0);
  const totalNeedsSpend = filteredTransactions.filter(t => !isWantTx(t)).reduce((acc, t) => acc + t.amount, 0);
  const totalWantsSpend = filteredTransactions.filter(t => isWantTx(t)).reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0C1F1E] via-[#091717] to-[#071214] border border-emerald-500/40 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigateToTab('finance', 'overview')}
              className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center gap-1 active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Finance</span>
            </button>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono">
              Daily Expense Terminal
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <IndianRupee className="w-6 h-6 text-emerald-400" />
            Daily Expense Tracker & Cash Ledger
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Real-time daily expenditure monitoring with Needs vs. Wants discipline. Record day-to-day outlays instantly and keep free cashflow predictable.
          </p>
        </div>

        {/* Executive Summary Cards */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Total Spent</span>
            <div className="text-xl font-black text-white font-mono">{formatCurrency(totalFilteredSpend)}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-right">
            <span className="text-[10px] text-emerald-400 uppercase tracking-wider block font-bold">Needs (Essential)</span>
            <div className="text-xl font-black text-emerald-400 font-mono">{formatCurrency(totalNeedsSpend)}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/90 border border-rose-500/30 text-right">
            <span className="text-[10px] text-rose-400 uppercase tracking-wider block font-bold">Wants (Discretionary)</span>
            <div className="text-xl font-black text-rose-400 font-mono">{formatCurrency(totalWantsSpend)}</div>
          </div>
        </div>
      </div>

      {/* Inline Quick Expense Entry Bar */}
      <div className="p-5 rounded-2xl bg-[#0E1526] border border-slate-800 shadow-xl">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Quick Record Expense</span>
        </h3>

        <form onSubmit={handleQuickAdd} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="lg:col-span-2">
            <input
              type="text"
              required
              placeholder="Expense title (e.g. Lunch, Groceries, Metro)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs text-slate-500 font-mono">₹</span>
              <input
                type="number"
                required
                step="1"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-6 pr-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setIsWant(!isWant)}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 border ${
                isWant
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}
            >
              <span>{isWant ? 'Want (Discretionary)' : 'Need (Essential)'}</span>
            </button>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-md shadow-emerald-500/20 active:scale-95 flex items-center justify-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Expense</span>
            </button>
          </div>
        </form>
      </div>

      {/* Date Filter Pills & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
          {(['today', 'yesterday', 'week', 'month', 'all'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                selectedFilter === filter
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {filter === 'month' ? getLiveMonthFormatted() : filter}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Transactions Ledger Table */}
      <div className="rounded-2xl bg-[#0C1222]/90 border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#090D18] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Expense Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Classification</th>
                <th className="px-4 py-3 font-mono">Amount</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No expense transactions found for this period.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 text-slate-400 font-mono">{tx.date}</td>
                    <td className="px-4 py-3 font-bold text-white">{tx.title}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        !isWantTx(tx)
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                      }`}>
                        {!isWantTx(tx) ? 'Need' : 'Want'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-rose-400">
                      -{formatCurrency(tx.amount)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => deleteTransaction(tx.id)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                        title="Delete expense"
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
  );
};
