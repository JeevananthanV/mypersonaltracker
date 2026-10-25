import React from 'react';
import {
  Award,
  Plus,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  Edit2,
  Trash2,
  Flame,
  ChevronRight
} from 'lucide-react';
import { InvestmentAsset, InvestmentCategory } from '../../types';
import { useLifeOS } from '../../context/LifeOSContext';

const formatCurrency = (val: number) => `₹${Math.round(val || 0).toLocaleString('en-IN')}`;

interface ChitSchemesDashboardProps {
  chitSchemes: InvestmentAsset[];
  onPayChitQuick: (asset: InvestmentAsset) => void;
  onOpenAddModal: (category?: InvestmentCategory) => void;
  onOpenEditModal: (asset: InvestmentAsset) => void;
  onDeleteInvestment: (id: string) => void;
  onBackToOverview: () => void;
}

export const ChitSchemesDashboard: React.FC<ChitSchemesDashboardProps> = ({
  chitSchemes,
  onPayChitQuick,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteInvestment,
  onBackToOverview
}) => {
  const { navigateToTab } = useLifeOS();
  const totalMonthlyCommitment = chitSchemes.reduce(
    (s, c) => s + (c.chitMonthlyAmount || c.monthlySipAmount || 0),
    0
  );
  const totalInvested = chitSchemes.reduce((s, c) => s + c.investedAmount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Chit Schemes Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1A180E] via-[#0E1528] to-[#0A0F1D] border border-amber-500/40 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onBackToOverview}
              className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center gap-1 active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>
            <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 flex items-center gap-1.5 shadow-md">
              <Award className="w-3.5 h-3.5" />
              11-Month Jewellery Scheme ("Gold & Silver Shett") Command Center
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              GRT Jewellers & Lalitha Thanga Maligai
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Traditional Indian Jeweller Gold & Silver Savings ("Shett") Schemes
          </h2>
          <p className="text-xs text-slate-400 max-w-3xl">
            Monthly installment commitment tracker with visual 11-month milestone roadmaps, gram accrual calculations, and guaranteed 12th-month jeweller bonus tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onOpenAddModal('gold_chit')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 transition shadow-lg shadow-amber-500/20 flex items-center space-x-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Enroll New Chit Scheme</span>
          </button>
        </div>
      </div>

      {/* Daily Pay Chit Quick-Access Banner */}
      <div
        onClick={() => navigateToTab('daily_chit')}
        className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 border border-amber-500/40 hover:border-amber-400/80 shadow-lg cursor-pointer transition group flex items-center justify-between gap-4"
      >
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform shrink-0">
            <Flame className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                Pothys Swarna Mahal 22K Gold Saving Plan
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-200 border border-amber-500/40">
                Target: ₹100 / Day
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              300-Day Daily Deposit Terminal started on <strong>15-Oct-2026</strong> · 4-tier instant weight bonus (+7% in Days 0–75) · 0% VA & Making Charges guaranteed.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 group-hover:text-amber-300 shrink-0">
          <span>Open Daily Terminal</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Chit Schemes KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0C1222]/90 border border-yellow-500/30 shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-400 block mb-1">
            Active Chit Accounts
          </span>
          <div className="text-3xl font-black text-white font-mono tracking-tight">
            {chitSchemes.length} Schemes
          </div>
          <p className="mt-2 text-xs text-slate-400">
            GRT Gold Chit + Lalitha Silver Chit
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0C1222]/90 border border-slate-800 shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Monthly Commitment Outflow
          </span>
          <div className="text-3xl font-black text-amber-300 font-mono tracking-tight">
            {formatCurrency(totalMonthlyCommitment)}
            <span className="text-xs font-normal text-slate-400">/mo</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Due between 10th-15th of every month
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0C1222]/90 border border-slate-800 shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Capital Invested
          </span>
          <div className="text-3xl font-black text-white font-mono tracking-tight">
            {formatCurrency(totalInvested)}
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Cumulative installments paid
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0C1222]/90 border border-emerald-500/30 shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
            12th Month Free Bonus Perks
          </span>
          <div className="text-3xl font-black text-emerald-400 font-mono tracking-tight">
            ₹3,000+
          </div>
          <p className="mt-2 text-xs text-slate-400">
            1 full month jeweller contribution + 0% VA
          </p>
        </div>
      </div>

      {/* Chit Scheme Progress Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {chitSchemes.map(chit => {
          const tenure = chit.chitTenureMonths || 11;
          const paid = chit.chitMonthsPaid || 1;
          const progressPct = Math.min(100, Math.round((paid / tenure) * 100));
          const monthlyAmt = chit.chitMonthlyAmount || chit.monthlySipAmount || 0;
          const isGold = chit.category === 'gold_chit' || chit.name.toLowerCase().includes('gold');

          return (
            <div
              key={chit.id}
              className="p-5 rounded-xl bg-[#090D18] border border-slate-800 hover:border-amber-500/40 transition shadow-md relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        isGold ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                      }`}>
                        {isGold ? 'Gold Chit (11M)' : 'Silver Chit (11M)'}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">{chit.platform}</span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1">{chit.name}</h3>
                    {chit.symbolOrCode && (
                      <p className="text-[11px] font-mono text-slate-400">{chit.symbolOrCode}</p>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400">Monthly Due</span>
                    <div className="text-base font-black text-amber-300">{formatCurrency(monthlyAmt)}</div>
                    <span className="text-[10px] text-slate-400">Due 10th-15th</span>
                  </div>
                </div>

                {/* Progress Step Visualizer */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-semibold">
                      Installments: <span className="text-amber-400 font-bold">{paid} of {tenure} Paid</span>
                    </span>
                    <span className="text-amber-400 font-mono font-bold">{progressPct}% Complete</span>
                  </div>

                  <div className="grid grid-cols-11 gap-1.5 pt-1">
                    {Array.from({ length: tenure }).map((_, idx) => {
                      const stepNum = idx + 1;
                      const isCompleted = stepNum <= paid;
                      const isCurrent = stepNum === paid + 1;
                      return (
                        <div
                          key={stepNum}
                          className={`h-7 rounded flex items-center justify-center text-[10px] font-bold transition-all ${
                            isCompleted
                              ? isGold
                                ? 'bg-gradient-to-t from-amber-600 to-amber-500 text-slate-950 shadow-sm'
                                : 'bg-gradient-to-t from-cyan-600 to-cyan-500 text-slate-950 shadow-sm'
                              : isCurrent
                              ? 'bg-amber-500/20 border border-amber-500/60 text-amber-300 animate-pulse'
                              : 'bg-slate-800/80 text-slate-400 border border-slate-700/50'
                          }`}
                          title={`Month ${stepNum}: ${isCompleted ? 'Paid' : 'Upcoming'}`}
                        >
                          {isCompleted ? '✓' : stepNum}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Scheme Highlights & Weight */}
                <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-slate-800/80 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#0C1222] border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase">Accumulated</span>
                    <span className="text-sm font-black text-amber-300">
                      {chit.quantity ? `${chit.quantity}g` : '—'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0C1222] border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase">Total Invested</span>
                    <span className="text-sm font-black text-white">
                      {formatCurrency(chit.investedAmount)}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0C1222] border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase">Market Valuation</span>
                    <span className="text-sm font-black text-emerald-400">
                      {formatCurrency(chit.currentValue)}
                    </span>
                  </div>
                </div>

                {/* Bonus feature badge */}
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-amber-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-semibold">Maturity Perk:</span>
                    <span className="text-amber-200">
                      {chit.maturityBonus ? `+${formatCurrency(chit.maturityBonus)} 12th Month Jeweller Bonus` : '0% Wastage / VA charges on gold'}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase bg-amber-500/20 px-2 py-0.5 rounded">
                    Month 12 Free
                  </span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-slate-800/90 flex items-center justify-between gap-2">
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Next Due: <strong className="text-slate-300">Month #{paid + 1}</strong></span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onOpenEditModal(chit)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    title="Edit Scheme Details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onPayChitQuick(chit)}
                    disabled={paid >= tenure}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                      paid >= tenure
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                        : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-md active:scale-95'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{paid >= tenure ? 'Scheme Matured!' : `Pay Month #${paid + 1} (+${formatCurrency(monthlyAmt)})`}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dedicated Jeweller Schemes Table */}
      <div className="rounded-2xl bg-[#0C1222]/90 border border-yellow-500/30 shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-[#0B101D]">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Jeweller Chit Schemes ("Shett") Master Register
            </h3>
            <span className="text-xs text-yellow-400 font-mono">({chitSchemes.length} Schemes)</span>
          </div>

          <button
            onClick={() => onOpenAddModal('gold_chit')}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-yellow-500 hover:bg-yellow-400 text-slate-950 transition flex items-center space-x-1 shadow-md active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Enroll New Scheme</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#090D18] text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Scheme Name</th>
                <th className="px-4 py-3.5">Jeweller Platform</th>
                <th className="px-4 py-3.5">Monthly Installment</th>
                <th className="px-4 py-3.5">Milestone Progress</th>
                <th className="px-4 py-3.5">Accumulated Weight</th>
                <th className="px-4 py-3.5">Total Invested</th>
                <th className="px-4 py-3.5">Current Value</th>
                <th className="px-4 py-3.5">12th Month Bonus</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {chitSchemes.map(scheme => {
                const paid = scheme.chitMonthsPaid || 1;
                const tenure = scheme.chitTenureMonths || 11;
                const monthly = scheme.chitMonthlyAmount || scheme.monthlySipAmount || 0;

                return (
                  <tr key={scheme.id} className="hover:bg-slate-800/30 transition">
                    <td className="px-5 py-4">
                      <span className="font-bold text-white text-sm block">{scheme.name}</span>
                      <span className="text-[11px] text-slate-400">{scheme.symbolOrCode || 'Shett Plan'}</span>
                    </td>

                    <td className="px-4 py-4 font-semibold text-slate-300">
                      {scheme.platform}
                    </td>

                    <td className="px-4 py-4 font-mono font-bold text-amber-300">
                      {formatCurrency(monthly)}
                    </td>

                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-white font-mono">
                          Month {paid} / {tenure} Paid
                        </span>
                        <div className="h-1.5 w-24 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${Math.min(100, (paid / tenure) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 font-mono font-bold text-slate-200">
                      {scheme.quantity ? `${scheme.quantity}g` : '—'}
                    </td>

                    <td className="px-4 py-4 font-mono text-white">
                      {formatCurrency(scheme.investedAmount)}
                    </td>

                    <td className="px-4 py-4 font-mono font-bold text-emerald-400">
                      {formatCurrency(scheme.currentValue)}
                    </td>

                    <td className="px-4 py-4">
                      <span className="px-2 py-0.5 rounded text-[11px] bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30">
                        {scheme.maturityBonus ? `+${formatCurrency(scheme.maturityBonus)} Free` : '0% VA Perks'}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => onPayChitQuick(scheme)}
                          disabled={paid >= tenure}
                          className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-bold text-xs transition disabled:opacity-50"
                        >
                          + Pay Month #{paid + 1}
                        </button>
                        <button
                          onClick={() => onOpenEditModal(scheme)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${scheme.name}?`)) {
                              onDeleteInvestment(scheme.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
