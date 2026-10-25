import React from 'react';
import {
  ShieldCheck,
  Plus,
  ArrowLeft,
  HelpCircle,
  FileSpreadsheet,
  Trash2,
  Calendar
} from 'lucide-react';
import { InvestmentAsset } from '../../types';

const formatCurrency = (val: number) => `₹${Math.round(val || 0).toLocaleString('en-IN')}`;

interface DigiSilverDashboardProps {
  investments: InvestmentAsset[];
  silverSpotRate: number;
  onOpenDepositModal: (assetId: 'pothys-digi-silver') => void;
  onOpenRulesModal: () => void;
  onBackToOverview: () => void;
  onDeleteTransaction: (assetId: string, txId: string) => void;
  onOpenEditModal: (asset: InvestmentAsset) => void;
}

export const DigiSilverDashboard: React.FC<DigiSilverDashboardProps> = ({
  investments,
  silverSpotRate,
  onOpenDepositModal,
  onOpenRulesModal,
  onBackToOverview,
  onDeleteTransaction,
  onOpenEditModal
}) => {
  const silverAsset = investments.find(i => i.id === 'pothys-digi-silver');
  const silverWeight = Number(silverAsset?.quantity || 4.95431);
  const silverBase = silverAsset?.schemeDetails?.baseWeightGrams || 4.65690;
  const silverBonus = silverAsset?.schemeDetails?.bonusWeightGrams || 0.29741;
  const silverTarget = silverAsset?.schemeDetails?.recommendedTarget || 11000;
  const silverInvested = silverAsset?.investedAmount || 1100;
  const silverVal = silverAsset?.currentValue || 483;
  const silverProgress = Math.min(100, (silverInvested / silverTarget) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Silver Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0F1E33] via-[#0C172B] to-[#0A1221] border border-cyan-500/40 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onBackToOverview}
              className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center gap-1 active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>
            <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 flex items-center gap-1.5 shadow-md">
              <ShieldCheck className="w-3.5 h-3.5" />
              Digital Silver (999 Pure) Command Center
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              Pothys Swarna Mahal
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            999 Pure Silver Saving Plan — Accumulation & Promo Code Register
          </h2>
          <p className="text-xs text-slate-400 max-w-3xl">
            Turn micro-savings into physical 999 pure silver. Redeemable against silver pooja articles, nagas, bridal ornaments, or 999 bullion bars on the 330th day.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenRulesModal}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 transition flex items-center space-x-1.5"
            title="View Complete Terms, Bonus Tiers & Physical Redemption Guide"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Plan Rules & T&C</span>
          </button>
          <button
            onClick={() => onOpenDepositModal('pothys-digi-silver')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 transition shadow-lg shadow-cyan-500/20 flex items-center space-x-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Buy / Add Digi Silver (₹100+)</span>
          </button>
        </div>
      </div>

      {/* Silver Dedicated KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Accumulated Weight */}
        <div className="p-5 rounded-2xl bg-[#0C1222]/90 border border-cyan-500/40 shadow-lg relative overflow-hidden">
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
            Total Accumulated 999 Weight
          </span>
          <div className="text-3xl font-black text-slate-100 font-mono tracking-tight">
            {silverWeight.toFixed(5)} <span className="text-base font-semibold text-cyan-300/80">gms</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>Base: <strong className="text-white">{silverBase.toFixed(5)}g</strong></span>
            <span className="text-cyan-400 font-bold">Bonus (+7%): +{silverBonus.toFixed(5)}g</span>
          </div>
        </div>

        {/* KPI 2: Total Invested Capital */}
        <div className="p-5 rounded-2xl bg-[#0C1222]/90 border border-slate-800 shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Silver Invested
          </span>
          <div className="text-3xl font-black text-white font-mono tracking-tight">
            {formatCurrency(silverInvested)}
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Starting from ₹100 · 4 Transactions
          </p>
        </div>

        {/* KPI 3: Current Market Valuation */}
        <div className="p-5 rounded-2xl bg-[#0C1222]/90 border border-emerald-500/30 shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
            Current Silver Value
          </span>
          <div className="text-3xl font-black text-emerald-400 font-mono tracking-tight">
            {formatCurrency(silverVal)}
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Spot Rate: ₹{silverSpotRate}/g (999 Pure)
          </p>
        </div>

        {/* KPI 4: Target Progress */}
        <div className="p-5 rounded-2xl bg-[#0C1222]/90 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              ₹11,000 Target Goal
            </span>
            <span className="text-xs font-mono font-bold text-cyan-400">{silverProgress.toFixed(1)}%</span>
          </div>
          <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${silverProgress}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Maturity: <strong className="text-slate-200">09 Sep, 2027</strong></span>
            <span className="text-cyan-400 font-medium">330 Days</span>
          </p>
        </div>
      </div>

      {/* Direct Full Silver Transaction Ledger & Document Register Table */}
      <div className="rounded-2xl bg-[#0C1222]/90 border border-cyan-500/30 shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0B101D]">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Pothys Swarna Mahal — Digi Silver Document & Transaction Register
              </h3>
              <p className="text-[11px] text-slate-400">
                Official Document Numbers, promo codes, and instantaneous 7% bonus silver weight additions
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenDepositModal('pothys-digi-silver')}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition flex items-center space-x-1 shadow-md active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Buy / Add Silver Transaction</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#090D18] text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Transaction Date</th>
                <th className="px-4 py-3.5">Document No / Promo</th>
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
              {(!silverAsset?.transactions || silverAsset.transactions.length === 0) ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-slate-400">
                    No silver transactions logged yet. Click "+ Buy / Add Silver Transaction" above.
                  </td>
                </tr>
              ) : (
                silverAsset.transactions.map(tx => {
                  const totalCredited = tx.weightGrams + (tx.bonusWeightGrams || 0);
                  return (
                    <tr key={tx.id} className="hover:bg-slate-800/30 transition">
                      <td className="px-5 py-3.5 text-slate-300 font-sans font-medium whitespace-nowrap">
                        {tx.date}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center space-x-1.5">
                          <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-cyan-300 font-bold border border-slate-700">
                            {tx.docNo || 'APP27SCTM/1998979'}
                          </span>
                          {tx.promoCode && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                              {tx.promoCode}
                            </span>
                          )}
                        </div>
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
                      <td className="px-4 py-3.5 text-cyan-400 font-bold">
                        +{tx.bonusWeightGrams ? tx.bonusWeightGrams.toFixed(5) : '0.00000'}g ({tx.bonusPercentage || 7}%)
                      </td>
                      <td className="px-4 py-3.5 text-slate-100 font-black">
                        {totalCredited.toFixed(5)}g
                      </td>
                      <td className="px-4 py-3.5 font-sans text-slate-400 text-[11px] max-w-xs truncate">
                        {tx.notes || 'Silver Saving Plan'}
                      </td>
                      <td className="px-4 py-3.5 text-right font-sans">
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete transaction #${tx.docNo || tx.id} of ₹${tx.amount}?`)) {
                              onDeleteTransaction('pothys-digi-silver', tx.id);
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

      {/* Silver Physical Redemption Guide */}
      <div className="p-5 rounded-2xl bg-[#090D18] border border-slate-800 space-y-3">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          Physical Silver Redemption Choices & Pothys Quality Guarantee
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed">
          Convert accumulated 999 pure silver weight into antique silver jewelry, pooja articles, silver vessels, nagas, or pure 999 silver bars/coins at maturity (330 days). Unlimited deposits can be booked whenever you spot a favorable silver board price.
        </p>
      </div>
    </div>
  );
};
