import React from 'react';
import {
  TrendingUp,
  Plus,
  ArrowLeft,
  RefreshCw,
  Coins,
  Edit2,
  Trash2
} from 'lucide-react';
import { InvestmentAsset, InvestmentCategory } from '../../types';

const formatCurrency = (val: number) => `₹${Math.round(val || 0).toLocaleString('en-IN')}`;

interface GrowwStocksDashboardProps {
  investments: InvestmentAsset[];
  growwSummary: any;
  itcLiveCmp: number;
  tatagoldLiveCmp: number;
  setItcLiveCmp: (val: number) => void;
  setTatagoldLiveCmp: (val: number) => void;
  onUpdateStockCMP: (stockId: string, newCmp: number) => void;
  onResetGrowwOfficial: () => void;
  onSyncGrowwLive: () => void;
  isGrowwUpdating: boolean;
  onOpenAddModal: (category?: InvestmentCategory) => void;
  onOpenEditModal: (asset: InvestmentAsset) => void;
  onDeleteInvestment: (id: string) => void;
  onBackToOverview: () => void;
}

export const GrowwStocksDashboard: React.FC<GrowwStocksDashboardProps> = ({
  investments,
  growwSummary,
  itcLiveCmp,
  tatagoldLiveCmp,
  setItcLiveCmp,
  setTatagoldLiveCmp,
  onUpdateStockCMP,
  onResetGrowwOfficial,
  onSyncGrowwLive,
  isGrowwUpdating,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteInvestment,
  onBackToOverview
}) => {
  const itcAsset = investments.find(i => i.id === 'groww-itc');
  const tataAsset = investments.find(i => i.id === 'groww-tatagold');

  const itcQty = itcAsset?.quantity || 5;
  const itcInvested = itcAsset?.investedAmount || 1450.00;
  const itcCurrent = itcAsset?.currentValue || 1289.50;
  const itcCmp = itcAsset?.currentPrice || 257.90;
  const itcBuyAvg = itcAsset?.buyPriceAverage || 290.00;
  const itcReturn = itcAsset?.unrealizedGain !== undefined ? itcAsset.unrealizedGain : -160.50;
  const itcReturnPct = itcAsset?.unrealizedGainPct !== undefined ? itcAsset.unrealizedGainPct : -11.07;
  const itcOneDay = itcAsset?.oneDayReturn !== undefined ? itcAsset.oneDayReturn : -10.50;
  const itcOneDayPct = itcAsset?.oneDayReturnPct !== undefined ? itcAsset.oneDayReturnPct : -0.81;

  const tataQty = tataAsset?.quantity || 39;
  const tataInvested = tataAsset?.investedAmount || 527.28;
  const tataCurrent = tataAsset?.currentValue || 531.57;
  const tataCmp = tataAsset?.currentPrice || 13.63;
  const tataBuyAvg = tataAsset?.buyPriceAverage || 13.52;
  const tataReturn = tataAsset?.unrealizedGain !== undefined ? tataAsset.unrealizedGain : 4.29;
  const tataReturnPct = tataAsset?.unrealizedGainPct !== undefined ? tataAsset.unrealizedGainPct : 0.81;
  const tataOneDay = tataAsset?.oneDayReturn !== undefined ? tataAsset.oneDayReturn : -1.52;
  const tataOneDayPct = tataAsset?.oneDayReturnPct !== undefined ? tataAsset.oneDayReturnPct : -0.29;

  const totalGrowwInvested = growwSummary?.totalInvested || 1977.28;
  const totalGrowwCurrent = growwSummary?.totalCurrent || 1821.07;
  const totalGrowwReturns = growwSummary?.totalReturns || -156.21;
  const totalGrowwReturnsPct = growwSummary?.totalReturnsPct || -7.90;
  const totalGrowwOneDay = growwSummary?.oneDayReturns || -12.02;
  const totalGrowwOneDayPct = growwSummary?.oneDayReturnsPct || -0.66;

  const growwHoldings = investments.filter(
    i => i.category === 'groww_stocks' || i.id.startsWith('groww-') || i.category === 'etf' || i.platform.toLowerCase().includes('groww')
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Groww Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0B1E1C] via-[#081717] to-[#050D11] border border-emerald-500/40 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onBackToOverview}
              className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center gap-1 active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>
            <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 flex items-center gap-1.5 shadow-md">
              <TrendingUp className="w-3.5 h-3.5" />
              Groww App Command Terminal
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              HOLDINGS ({growwHoldings.length})
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              NSE Live Real-Time Feed
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Groww Real-Time Equity & Gold ETF Portfolio
          </h2>
          <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
            Real-time synchronization for direct equity shares and exchange traded funds. Monitor daily 1D return fluctuations, overall unrealized profit/loss, and test live market price scenarios dynamically.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onResetGrowwOfficial}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 transition flex items-center space-x-1.5"
            title="Reset to official Groww statement figures"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Reset Statement</span>
          </button>
          <button
            onClick={onSyncGrowwLive}
            disabled={isGrowwUpdating}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 transition flex items-center space-x-1.5 shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGrowwUpdating ? 'animate-spin' : ''}`} />
            <span>{isGrowwUpdating ? 'Syncing...' : 'Sync Live CMP'}</span>
          </button>
          <button
            onClick={() => onOpenAddModal('groww_stocks')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 transition flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Stock</span>
          </button>
        </div>
      </div>

      {/* Groww App Executive KPI Strip */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Current Portfolio Valuation */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Current Portfolio Value
          </span>
          <div className="text-2xl font-black text-white font-mono tracking-tight">
            ₹{totalGrowwCurrent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400">Total market valuation</span>
        </div>

        {/* Metric 2: 1D Returns */}
        <div className="space-y-1 border-l border-slate-800 pl-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              1D Returns (Daily Change)
            </span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300">
              TODAY
            </span>
          </div>
          <div className={`text-2xl font-black font-mono tracking-tight ${totalGrowwOneDay >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalGrowwOneDay >= 0 ? '+' : ''}{totalGrowwOneDay.toFixed(2)}
          </div>
          <span className={`text-[11px] font-bold font-mono ${totalGrowwOneDay >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            ({totalGrowwOneDayPct >= 0 ? '+' : ''}{totalGrowwOneDayPct.toFixed(2)}%)
          </span>
        </div>

        {/* Metric 3: Total Returns */}
        <div className="space-y-1 border-l border-slate-800 pl-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Returns (All-time P&L)
          </span>
          <div className={`text-2xl font-black font-mono tracking-tight ${totalGrowwReturns >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalGrowwReturns >= 0 ? '+' : ''}{totalGrowwReturns.toFixed(2)}
          </div>
          <span className={`text-[11px] font-bold font-mono ${totalGrowwReturns >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            ({totalGrowwReturnsPct >= 0 ? '+' : ''}{totalGrowwReturnsPct.toFixed(2)}%)
          </span>
        </div>

        {/* Metric 4: Total Invested Capital */}
        <div className="space-y-1 border-l border-slate-800 pl-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Invested Capital
          </span>
          <div className="text-2xl font-black text-white font-mono tracking-tight">
            ₹{totalGrowwInvested.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400">Total acquisition cost</span>
        </div>
      </div>

      {/* Individual Stock Cards Grid (ITC & TATAGOLD) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: ITC Limited */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0C1F1E] via-[#091717] to-[#071214] border border-emerald-500/30 shadow-xl space-y-4 relative flex flex-col justify-between">
          <div className="space-y-3.5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Equity Stock · FMCG
                  </span>
                  <span className="text-xs font-semibold text-slate-400 font-mono">NSE: ITC</span>
                </div>
                <h3 className="text-lg font-extrabold text-white mt-1.5 flex items-center gap-2">
                  <span>ITC Limited</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {itcQty} shares
                  </span>
                </h3>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400 block uppercase">Invested</span>
                <div className="text-base font-black text-white font-mono">
                  ₹{itcInvested.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Avg: ₹{itcBuyAvg.toFixed(2)}</span>
              </div>
            </div>

            {/* Primary Highlight */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Current Market Valuation
                </span>
                <div className="text-3xl font-black text-white font-mono tracking-tight mt-0.5">
                  ₹{itcCurrent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-4 text-xs font-mono">
                <div className="text-slate-400">
                  Total Returns: <strong className={itcReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    {itcReturn >= 0 ? '+' : ''}₹{itcReturn.toFixed(2)} ({itcReturnPct.toFixed(2)}%)
                  </strong>
                </div>
                <div className={`font-bold ${itcOneDay >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  1D Returns: {itcOneDay >= 0 ? '+' : ''}₹{itcOneDay.toFixed(2)} ({itcOneDayPct.toFixed(2)}%)
                </div>
              </div>
            </div>

            {/* Dynamic CMP Modifier */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  Live CMP / Share (NSE):
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Previous Close: ₹260.00</span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2 text-xs font-mono text-slate-400">₹</span>
                  <input
                    type="number"
                    step="0.05"
                    value={itcLiveCmp}
                    onChange={e => {
                      const val = Number(e.target.value) || 0;
                      setItcLiveCmp(val);
                      onUpdateStockCMP('groww-itc', val);
                    }}
                    className="w-full pl-7 pr-3 py-1.5 rounded-lg text-xs bg-[#090D18] border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  onClick={() => {
                    const next = Number((itcLiveCmp - 0.50).toFixed(2));
                    setItcLiveCmp(next);
                    onUpdateStockCMP('groww-itc', next);
                  }}
                  className="px-2 py-1.5 rounded-lg text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  title="Decrease by ₹0.50"
                >
                  -0.50
                </button>
                <button
                  onClick={() => {
                    const next = Number((itcLiveCmp + 0.50).toFixed(2));
                    setItcLiveCmp(next);
                    onUpdateStockCMP('groww-itc', next);
                  }}
                  className="px-2 py-1.5 rounded-lg text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  title="Increase by ₹0.50"
                >
                  +0.50
                </button>
                <button
                  onClick={() => {
                    const next = Number((itcLiveCmp + 2.0).toFixed(2));
                    setItcLiveCmp(next);
                    onUpdateStockCMP('groww-itc', next);
                  }}
                  className="px-2 py-1.5 rounded-lg text-[10px] font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40"
                  title="Increase by ₹2.00"
                >
                  +2.00
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/90 flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-[11px]">Holdings: 5 × ₹{itcCmp.toFixed(2)}</span>
            <button
              onClick={() => onOpenAddModal('groww_stocks')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buy More ITC</span>
            </button>
          </div>
        </div>

        {/* Card 2: TATAGOLD ETF */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#121A2E] via-[#0E1528] to-[#0A0F1E] border border-amber-500/30 shadow-xl space-y-4 relative flex flex-col justify-between">
          <div className="space-y-3.5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Gold ETF
                  </span>
                  <span className="text-xs font-semibold text-slate-400 font-mono">NSE: TATAGOLD</span>
                </div>
                <h3 className="text-lg font-extrabold text-white mt-1.5 flex items-center gap-2">
                  <span>Tata Gold ETF</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {tataQty} shares
                  </span>
                </h3>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400 block uppercase">Invested</span>
                <div className="text-base font-black text-white font-mono">
                  ₹{tataInvested.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Avg: ₹{tataBuyAvg.toFixed(2)}</span>
              </div>
            </div>

            {/* Primary Highlight */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Current Market Valuation
                </span>
                <div className="text-3xl font-black text-amber-300 font-mono tracking-tight mt-0.5">
                  ₹{tataCurrent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-4 text-xs font-mono">
                <div className="text-slate-400">
                  Total Returns: <strong className={tataReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    {tataReturn >= 0 ? '+' : ''}₹{tataReturn.toFixed(2)} (+{tataReturnPct.toFixed(2)}%)
                  </strong>
                </div>
                <div className={`font-bold ${tataOneDay >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  1D Returns: {tataOneDay >= 0 ? '+' : ''}₹{tataOneDay.toFixed(2)} ({tataOneDayPct.toFixed(2)}%)
                </div>
              </div>
            </div>

            {/* Dynamic CMP Modifier */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  Live CMP / Unit (NSE):
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Previous Close: ₹13.67</span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2 text-xs font-mono text-slate-400">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    value={tatagoldLiveCmp}
                    onChange={e => {
                      const val = Number(e.target.value) || 0;
                      setTatagoldLiveCmp(val);
                      onUpdateStockCMP('groww-tatagold', val);
                    }}
                    className="w-full pl-7 pr-3 py-1.5 rounded-lg text-xs bg-[#090D18] border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  onClick={() => {
                    const next = Number((tatagoldLiveCmp - 0.05).toFixed(2));
                    setTatagoldLiveCmp(next);
                    onUpdateStockCMP('groww-tatagold', next);
                  }}
                  className="px-2 py-1.5 rounded-lg text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  title="Decrease by ₹0.05"
                >
                  -0.05
                </button>
                <button
                  onClick={() => {
                    const next = Number((tatagoldLiveCmp + 0.05).toFixed(2));
                    setTatagoldLiveCmp(next);
                    onUpdateStockCMP('groww-tatagold', next);
                  }}
                  className="px-2 py-1.5 rounded-lg text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  title="Increase by ₹0.05"
                >
                  +0.05
                </button>
                <button
                  onClick={() => {
                    const next = Number((tatagoldLiveCmp + 0.20).toFixed(2));
                    setTatagoldLiveCmp(next);
                    onUpdateStockCMP('groww-tatagold', next);
                  }}
                  className="px-2 py-1.5 rounded-lg text-[10px] font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40"
                  title="Increase by ₹0.20"
                >
                  +0.20
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/90 flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-[11px]">Holdings: 39 × ₹{tataCmp.toFixed(2)}</span>
            <button
              onClick={() => onOpenAddModal('etf')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buy More TATAGOLD</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dedicated Groww Holdings Table */}
      <div className="rounded-2xl bg-[#0C1222]/90 border border-emerald-500/30 shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-[#0B101D]">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Groww Stocks & ETF Holdings Register
            </h3>
            <span className="text-xs text-emerald-400 font-mono">({growwHoldings.length} Holdings)</span>
          </div>

          <button
            onClick={() => onOpenAddModal('groww_stocks')}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition flex items-center space-x-1 shadow-md active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Groww Holding</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#090D18] text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Stock / Asset</th>
                <th className="px-4 py-3.5">Shares / Qty</th>
                <th className="px-4 py-3.5">Buy Price Avg</th>
                <th className="px-4 py-3.5">Current Price (CMP)</th>
                <th className="px-4 py-3.5">Invested (₹)</th>
                <th className="px-4 py-3.5">Current Value</th>
                <th className="px-4 py-3.5">1D Return</th>
                <th className="px-4 py-3.5">Total Returns</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {growwHoldings.map(item => {
                const gain = item.currentValue - item.investedAmount;
                const gainPct = item.investedAmount > 0 ? (gain / item.investedAmount) * 100 : 0;
                const isPos = gain >= 0;

                return (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition">
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-sm">{item.name}</span>
                          {item.symbolOrCode && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                              {item.symbolOrCode}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">{item.platform}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4 font-mono font-bold text-white">
                      {item.quantity} {item.unitType || 'shares'}
                    </td>

                    <td className="px-4 py-4 font-mono text-slate-300">
                      ₹{item.buyPriceAverage?.toFixed(2) || '—'}
                    </td>

                    <td className="px-4 py-4 font-mono text-slate-200 font-bold">
                      ₹{item.currentPrice?.toFixed(2) || '—'}
                    </td>

                    <td className="px-4 py-4 font-mono text-white">
                      {formatCurrency(item.investedAmount)}
                    </td>

                    <td className="px-4 py-4 font-mono font-black text-white">
                      {formatCurrency(item.currentValue)}
                    </td>

                    <td className="px-4 py-4 font-mono">
                      <div className={item.oneDayReturn && item.oneDayReturn >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {item.oneDayReturn ? `${item.oneDayReturn >= 0 ? '+' : ''}₹${item.oneDayReturn.toFixed(2)}` : '—'}
                      </div>
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
                          onClick={() => onOpenEditModal(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${item.name} from Groww portfolio?`)) {
                              onDeleteInvestment(item.id);
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
