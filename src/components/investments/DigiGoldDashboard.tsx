import React from 'react';
import {
  Coins,
  Plus,
  ArrowLeft,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  FileSpreadsheet,
  Trash2,
  Calendar
} from 'lucide-react';
import { InvestmentAsset } from '../../types';

const formatCurrency = (val: number) => `₹${Math.round(val || 0).toLocaleString('en-IN')}`;

interface DigiGoldDashboardProps {
  investments: InvestmentAsset[];
  goldSpotRate: number;
  onOpenDepositModal: (assetId: 'pothys-digi-gold') => void;
  onOpenRulesModal: () => void;
  onBackToOverview: () => void;
  onDeleteTransaction: (assetId: string, txId: string) => void;
  onOpenEditModal: (asset: InvestmentAsset) => void;
}

export const DigiGoldDashboard: React.FC<DigiGoldDashboardProps> = ({
  investments,
  goldSpotRate,
  onOpenDepositModal,
  onOpenRulesModal,
  onBackToOverview,
  onDeleteTransaction,
  onOpenEditModal
}) => {
  const goldAsset = investments.find(i => i.id === 'pothys-digi-gold');
  const goldWeight = Number(goldAsset?.quantity || 0.03954);
  const goldBase = goldAsset?.schemeDetails?.baseWeightGrams || 0.03696;
  const goldBonus = goldAsset?.schemeDetails?.bonusWeightGrams || 0.00258;
  const goldTarget = goldAsset?.schemeDetails?.recommendedTarget || 11000;
  const goldInvested = goldAsset?.investedAmount || 500;
  const goldVal = goldAsset?.currentValue || 292;
  const goldProgress = Math.min(100, (goldInvested / goldTarget) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Gold Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#101935] to-[#0A0E1F] border border-amber-500/40 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onBackToOverview}
              className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center gap-1 active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>
            <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 flex items-center gap-1.5 shadow-md">
              <Coins className="w-3.5 h-3.5" />
              Digital Gold (22K) Command Center
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              Pothys Swarna Mahal & MMTC-PAMP
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              7% Instant Bonus Active
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            22K Gold Saving Plan — Real-Time Weight & Instant Bonus Center
          </h2>
          <p className="text-xs text-slate-400 max-w-3xl">
            22K Hallmark gold in 24 seconds. Guaranteed physical gold redemption across all Pothys Swarna Mahal showrooms on the 330th day with 0% VA/wastage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenRulesModal}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 transition flex items-center space-x-1.5"
            title="View Complete Terms, Bonus Tiers & Physical Redemption Guide"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Plan Rules & T&C</span>
          </button>
          <button
            onClick={() => onOpenDepositModal('pothys-digi-gold')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 transition shadow-lg shadow-amber-500/20 flex items-center space-x-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Buy / Add Digi Gold (₹100+)</span>
          </button>
        </div>
      </div>

      {/* Gold Dedicated KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Accumulated Weight */}
        <div className="p-5 rounded-2xl bg-[#0C1222]/90 border border-amber-500/40 shadow-lg relative overflow-hidden">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
            Total Accumulated 22K Weight
          </span>
          <div className="text-3xl font-black text-amber-300 font-mono tracking-tight">
            {goldWeight.toFixed(5)} <span className="text-base font-semibold text-amber-400/80">gms</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>Base: <strong className="text-white">{goldBase.toFixed(5)}g</strong></span>
            <span className="text-emerald-400 font-bold">Bonus (+7%): +{goldBonus.toFixed(5)}g</span>
          </div>
        </div>

        {/* KPI 2: Total Invested Capital */}
        <div className="p-5 rounded-2xl bg-[#0C1222]/90 border border-slate-800 shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Gold Invested
          </span>
          <div className="text-3xl font-black text-white font-mono tracking-tight">
            {formatCurrency(goldInvested)}
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Starting from ₹100 · Unlimited top-ups
          </p>
        </div>

        {/* KPI 3: Current Market Valuation */}
        <div className="p-5 rounded-2xl bg-[#0C1222]/90 border border-emerald-500/30 shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
            Current Gold Value
          </span>
          <div className="text-3xl font-black text-emerald-400 font-mono tracking-tight">
            {formatCurrency(goldVal)}
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Evaluated @ ₹{goldSpotRate}/g (24K Spot)
          </p>
        </div>

        {/* KPI 4: Target Progress */}
        <div className="p-5 rounded-2xl bg-[#0C1222]/90 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              ₹11,000 Target Goal
            </span>
            <span className="text-xs font-mono font-bold text-amber-400">{goldProgress.toFixed(1)}%</span>
          </div>
          <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
              style={{ width: `${goldProgress}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Maturity: <strong className="text-slate-200">10 Sep, 2027</strong></span>
            <span className="text-amber-400 font-medium">330 Days</span>
          </p>
        </div>
      </div>

      {/* 4-Tier Instant Bonus Weight Architecture Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-[#0D1429] to-slate-950 border border-amber-500/40 space-y-2 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Pothys 4-Tier Instant Bonus Schedule
          </span>
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            Current Tier: Days 0-75 (+7% Instant Bonus Weight)
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-xs">
          <div className="p-2.5 rounded-lg bg-amber-500/20 border border-amber-500/50 text-center">
            <span className="text-[10px] text-amber-400 block font-sans">Days 0 to 75</span>
            <strong className="text-sm text-white">+7% Weight Bonus</strong>
            <span className="text-[9px] text-amber-300 block font-sans mt-0.5 font-bold">[ACTIVE NOW]</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-sans">Days 76 to 150</span>
            <strong className="text-sm text-white">+5% Weight Bonus</strong>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-sans">Days 151 to 225</span>
            <strong className="text-sm text-white">+3% Weight Bonus</strong>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-sans">Days 226 to 300</span>
            <strong className="text-sm text-white">+1% Weight Bonus</strong>
          </div>
        </div>
      </div>

      {/* Direct Full Gold Transaction Ledger & Document Register Table */}
      <div className="rounded-2xl bg-[#0C1222]/90 border border-amber-500/30 shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0B101D]">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Pothys Swarna Mahal — Digi Gold Document & Transaction Register
              </h3>
              <p className="text-[11px] text-slate-400">
                Official Document Numbers, booking rates, and instantaneous 7% bonus gold weight additions
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenDepositModal('pothys-digi-gold')}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition flex items-center space-x-1 shadow-md active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Buy / Add Gold Transaction</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#090D18] text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Transaction Date</th>
                <th className="px-4 py-3.5">Document No / Ref</th>
                <th className="px-4 py-3.5">Invested (₹)</th>
                <th className="px-4 py-3.5">Rate (₹/g)</th>
                <th className="px-4 py-3.5">Base Weight</th>
                <th className="px-4 py-3.5">Bonus Weight (+7%)</th>
                <th className="px-4 py-3.5">Total Credited</th>
                <th className="px-4 py-3.5">Transaction Details</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {(!goldAsset?.transactions || goldAsset.transactions.length === 0) ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-slate-400">
                    No gold transactions logged yet. Click "+ Buy / Add Gold Transaction" above.
                  </td>
                </tr>
              ) : (
                goldAsset.transactions.map(tx => {
                  const totalCredited = tx.weightGrams + (tx.bonusWeightGrams || 0);
                  return (
                    <tr key={tx.id} className="hover:bg-slate-800/30 transition">
                      <td className="px-5 py-3.5 text-slate-300 font-sans font-medium whitespace-nowrap">
                        {tx.date}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-amber-300 font-bold border border-slate-700">
                          {tx.docNo || 'APP27SCTM/1936226'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-white">
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="px-4 py-3.5 text-slate-300">
                        ₹{tx.rate.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3.5 text-slate-200">
                        {tx.weightGrams.toFixed(5)}g
                      </td>
                      <td className="px-4 py-3.5 text-emerald-400 font-bold">
                        +{tx.bonusWeightGrams ? tx.bonusWeightGrams.toFixed(5) : '0.00000'}g ({tx.bonusPercentage || 7}%)
                      </td>
                      <td className="px-4 py-3.5 text-amber-300 font-black">
                        {totalCredited.toFixed(5)}g
                      </td>
                      <td className="px-4 py-3.5 font-sans text-slate-400 text-[11px] max-w-xs truncate">
                        {tx.notes || 'Gold Saving Plan - 22K in 24 seconds'}
                      </td>
                      <td className="px-4 py-3.5 text-right font-sans">
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete transaction #${tx.docNo || tx.id} of ₹${tx.amount}?`)) {
                              onDeleteTransaction('pothys-digi-gold', tx.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                          title="Delete Transaction"
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

      {/* Gold Physical Redemption & Vault Assurance Card */}
      <div className="p-5 rounded-2xl bg-[#090D18] border border-slate-800 space-y-3">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          Physical Gold Redemption Terms & Security Vault
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed">
          All accumulated grams are 100% backed by physical 22K (916) Hallmark gold held in insured security vaults. Advance deposit period runs for 300 days; you can redeem your accumulated grams on the 330th day at any Pothys Swarna Mahal showroom for antique jewellery, bridal collections, or gold coins with zero making charges/wastage perks.
        </p>
      </div>
    </div>
  );
};
