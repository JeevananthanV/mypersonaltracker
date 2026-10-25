import React from 'react';
import {
  Sparkles,
  Plus,
  ArrowLeft,
  Edit2,
  Trash2,
  Calendar,
  TrendingUp,
  PieChart as PieIcon
} from 'lucide-react';
import { InvestmentAsset, InvestmentCategory } from '../../types';

const formatCurrency = (val: number) => `₹${Math.round(val || 0).toLocaleString('en-IN')}`;

interface MutualFundsDashboardProps {
  mutualFundInvestments: InvestmentAsset[];
  onOpenAddModal: (category?: InvestmentCategory) => void;
  onOpenEditModal: (asset: InvestmentAsset) => void;
  onDeleteInvestment: (id: string) => void;
  onBackToOverview: () => void;
}

export const MutualFundsDashboard: React.FC<MutualFundsDashboardProps> = ({
  mutualFundInvestments,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteInvestment,
  onBackToOverview
}) => {
  const totalSip = mutualFundInvestments.reduce((s, f) => s + (f.monthlySipAmount || 0), 0);
  const totalInvested = mutualFundInvestments.reduce((s, f) => s + f.investedAmount, 0);
  const totalValuation = mutualFundInvestments.reduce((s, f) => s + f.currentValue, 0);
  const totalGain = totalValuation - totalInvested;
  const totalGainPct = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Mutual Funds Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#14122E] via-[#0E1528] to-[#0A0A17] border border-indigo-500/40 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onBackToOverview}
              className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center gap-1 active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>
            <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center gap-1.5 shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              Mutual Funds & ETF SIP Command Center
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              Disciplined Wealth Creation
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Systematic Investment Plans (SIP) & Equity Index Funds
          </h2>
          <p className="text-xs text-slate-400 max-w-3xl">
            Track long-term equity mutual fund portfolios, SIP monthly mandates, NAV fluctuations, and ETF asset allocation across platforms.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onOpenAddModal('mutual_funds')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white transition shadow-lg shadow-indigo-500/20 flex items-center space-x-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Mutual Fund / ETF</span>
          </button>
        </div>
      </div>

      {/* Fund KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0C1222]/90 border border-indigo-500/30 shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">
            Active Fund Portfolios
          </span>
          <div className="text-3xl font-black text-white font-mono tracking-tight">
            {mutualFundInvestments.length} SIP Funds
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Diversified equity & gold ETF allocation
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0C1222]/90 border border-slate-800 shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Monthly SIP Commitment
          </span>
          <div className="text-3xl font-black text-indigo-300 font-mono tracking-tight">
            {formatCurrency(totalSip)}
            <span className="text-xs font-normal text-slate-400">/mo</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Scheduled automated debit
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
            Cumulative capital deployed
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0C1222]/90 border border-emerald-500/30 shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
            Current Fund Valuation
          </span>
          <div className="text-3xl font-black text-emerald-400 font-mono tracking-tight">
            {formatCurrency(totalValuation)}
          </div>
          <div className="mt-2 text-xs text-emerald-300 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{formatCurrency(totalGain)} (+{totalGainPct.toFixed(2)}%)</span>
          </div>
        </div>
      </div>

      {/* Dedicated Mutual Funds Table */}
      <div className="rounded-2xl bg-[#0C1222]/90 border border-indigo-500/30 shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-[#0B101D]">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Mutual Funds & ETF Holdings Register
            </h3>
            <span className="text-xs text-indigo-400 font-mono">({mutualFundInvestments.length} Portfolios)</span>
          </div>

          <button
            onClick={() => onOpenAddModal('mutual_funds')}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center space-x-1 shadow-md active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Fund</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#090D18] text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Fund / Asset Name</th>
                <th className="px-4 py-3.5">Platform</th>
                <th className="px-4 py-3.5">Units Owned</th>
                <th className="px-4 py-3.5">NAV / Current Price</th>
                <th className="px-4 py-3.5">Monthly SIP</th>
                <th className="px-4 py-3.5">Total Invested</th>
                <th className="px-4 py-3.5">Current Value</th>
                <th className="px-4 py-3.5">Returns</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {mutualFundInvestments.map(fund => {
                const gain = fund.currentValue - fund.investedAmount;
                const gainPct = fund.investedAmount > 0 ? (gain / fund.investedAmount) * 100 : 0;
                const isPos = gain >= 0;

                return (
                  <tr key={fund.id} className="hover:bg-slate-800/30 transition">
                    <td className="px-5 py-4">
                      <span className="font-bold text-white text-sm block">{fund.name}</span>
                      <span className="text-[11px] text-slate-400">{fund.symbolOrCode || 'Direct Growth'}</span>
                    </td>

                    <td className="px-4 py-4 font-semibold text-slate-300">
                      {fund.platform}
                    </td>

                    <td className="px-4 py-4 font-mono font-bold text-white">
                      {fund.quantity} {fund.unitType || 'units'}
                    </td>

                    <td className="px-4 py-4 font-mono text-slate-200">
                      ₹{fund.currentPrice?.toFixed(2) || '—'}
                    </td>

                    <td className="px-4 py-4 font-mono text-indigo-300 font-bold">
                      {fund.monthlySipAmount ? formatCurrency(fund.monthlySipAmount) : '—'}
                    </td>

                    <td className="px-4 py-4 font-mono text-white">
                      {formatCurrency(fund.investedAmount)}
                    </td>

                    <td className="px-4 py-4 font-mono font-black text-white">
                      {formatCurrency(fund.currentValue)}
                    </td>

                    <td className="px-4 py-4 font-mono">
                      <div className={`font-bold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isPos ? '+' : ''}{formatCurrency(gain)}
                      </div>
                      <div className={`text-[10px] ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                        ({isPos ? '+' : ''}{gainPct.toFixed(2)}%)
                      </div>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => onOpenEditModal(fund)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${fund.name}?`)) {
                              onDeleteInvestment(fund.id);
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
