import React, { useState, useEffect } from 'react';
import {
  Coins,
  RefreshCw,
  Sparkles,
  MapPin,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Code2,
  Copy,
  Check,
  Building,
  Clock,
  Layers,
  Calculator,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
  Terminal
} from 'lucide-react';
import {
  PothysDailyRate,
  PothysShowroom,
  POTHYS_SHOWROOMS,
  fetchLivePothysRates,
  getCachedPothysRate,
  setSelectedShowroom,
  getSelectedShowroom,
  updatePothysBoardRate,
  getPothysApiCodeSnippets,
  FREE_API_ENDPOINTS
} from '../../services/pothysGoldRateService';
import { useLifeOS } from '../../context/LifeOSContext';

export interface PothysGoldRateMonitorProps {
  onRateSynced?: (rate: PothysDailyRate) => void;
  compact?: boolean;
}

export const PothysGoldRateMonitor: React.FC<PothysGoldRateMonitorProps> = ({
  onRateSynced,
  compact = false
}) => {
  const { triggerConfetti, refreshSalemGoldRate } = useLifeOS();
  const [selectedBranch, setBranchState] = useState<PothysShowroom>(() => getSelectedShowroom());
  const [rate, setRate] = useState<PothysDailyRate>(() => getCachedPothysRate(selectedBranch));
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'rates' | 'calculator' | 'free_api'>('rates');

  // Quick Calculator State
  const [calcAmount, setCalcAmount] = useState<number>(5000);
  const [calcMode, setCalcMode] = useState<'amount' | 'grams'>('amount');
  const [calcGrams, setCalcGrams] = useState<number>(1);
  const [calcMetal, setCalcMetal] = useState<'gold' | 'silver'>('gold');

  // Manual Override Modal
  const [isOverrideOpen, setIsOverrideOpen] = useState<boolean>(false);
  const [overrideGold22k, setOverrideGold22k] = useState<number>(rate.gold22kPerGram);
  const [overrideSilver1g, setOverrideSilver1g] = useState<number>(rate.silver1gRate);

  const fetchRate = async (branch?: PothysShowroom) => {
    setIsFetching(true);
    try {
      const live = await fetchLivePothysRates(branch || selectedBranch);
      setRate(live);
      if (onRateSynced) onRateSynced(live);
      if (refreshSalemGoldRate) refreshSalemGoldRate();
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchRate();
  }, []);

  const handleBranchChange = (branchId: string) => {
    const branch = setSelectedShowroom(branchId);
    setBranchState(branch);
    fetchRate(branch);
  };

  const handleApplyOverride = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updatePothysBoardRate(overrideGold22k, overrideSilver1g, rate.session, selectedBranch);
    setRate(updated);
    setIsOverrideOpen(false);
    triggerConfetti();
    if (onRateSynced) onRateSynced(updated);
    if (refreshSalemGoldRate) refreshSalemGoldRate();
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const snippets = getPothysApiCodeSnippets(rate);

  // Calculator calculations
  const unitRate = calcMetal === 'gold' ? rate.gold22kPerGram : rate.silver1gRate;
  const calculatedGrams = calcMode === 'amount' ? Number((calcAmount / unitRate).toFixed(4)) : calcGrams;
  const calculatedCost = calcMode === 'amount' ? calcAmount : Math.round(calcGrams * unitRate);
  const bonus7PctGrams = Number((calculatedGrams * 0.07).toFixed(4));
  const totalSchemeGrams = Number((calculatedGrams + bonus7PctGrams).toFixed(4));
  const estimatedWastageSavings = Math.round(calculatedCost * 0.14); // 14% typical jewellery VA

  return (
    <section className="p-6 rounded-2xl bg-gradient-to-br from-amber-950/30 via-slate-900/90 to-slate-900 border border-amber-500/30 shadow-xl relative overflow-hidden space-y-6">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Showroom Switcher */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/30 to-amber-700/20 border border-amber-500/50 flex items-center justify-center text-amber-300 shadow-lg shadow-amber-500/10 shrink-0">
            <Coins className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-heading font-black text-amber-100 tracking-tight">
                Pothys Swarna Mahal Gold & Silver Rate
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-semibold text-emerald-300 flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Free Daily API Active
              </span>
            </div>
            <p className="text-xs text-amber-200/70 mt-0.5 flex flex-wrap items-center gap-1.5">
              <span>{selectedBranch.city} Showroom ({selectedBranch.branchName})</span>
              <span aria-hidden="true">·</span>
              <span>Session: {rate.session}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-slate-400">{rate.lastUpdated}</span>
            </p>
          </div>
        </div>

        {/* Action Controls & Showroom Selector */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Branch Dropdown */}
          <div className="relative">
            <select
              value={selectedBranch.id}
              onChange={(e) => handleBranchChange(e.target.value)}
              className="appearance-none bg-slate-900 border border-amber-500/30 text-amber-200 text-xs rounded-xl pl-8 pr-8 py-2 font-medium hover:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              {POTHYS_SHOWROOMS.map(branch => (
                <option key={branch.id} value={branch.id}>
                  {branch.city} — {branch.branchName}
                </option>
              ))}
            </select>
            <MapPin className="w-3.5 h-3.5 text-amber-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-amber-400/70 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => fetchRate()}
            disabled={isFetching}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-semibold transition-all active:scale-95 disabled:opacity-50"
            title="Fetch latest price via free live API"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-300 ${isFetching ? 'animate-spin' : ''}`} />
            <span>{isFetching ? 'Syncing...' : 'Live Sync'}</span>
          </button>

          {/* Board Edit Override Button */}
          <button
            onClick={() => setIsOverrideOpen(true)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-all"
          >
            Showroom Board Edit
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2">
        <button
          onClick={() => setActiveTab('rates')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'rates'
              ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Daily Board Rates
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'calculator'
              ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Pothys Scheme Calculator</span>
        </button>
        <button
          onClick={() => setActiveTab('free_api')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'free_api'
              ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Free API Explorer & Code</span>
        </button>
      </div>

      {/* TAB 1: DAILY BOARD RATES */}
      {activeTab === 'rates' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* 22K 916 Hallmark Gold / gram */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-amber-500/30 hover:border-amber-500/60 transition-all">
              <div className="flex items-center justify-between text-[11px] text-amber-200/80 mb-1">
                <span>22K (916) Gold</span>
                <span className="font-mono text-[10px] text-slate-400">1 Gram</span>
              </div>
              <div className="font-mono text-xl sm:text-2xl font-black text-amber-200 tracking-tight tabular-nums">
                ₹{rate.gold22kPerGram.toLocaleString('en-IN')}
              </div>
              <div className="flex items-center gap-1 mt-1 text-[11px] font-mono">
                {rate.dayChangeGold >= 0 ? (
                  <span className="text-emerald-400 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    +{rate.dayChangeGold} ({rate.dayChangeGoldPct}%)
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-0.5">
                    <TrendingDown className="w-3 h-3" />
                    {rate.dayChangeGold} ({rate.dayChangeGoldPct}%)
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Pothys Daily Hallmark</div>
            </div>

            {/* 1 Sovereign (8g Pavan) */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-amber-500/30 hover:border-amber-500/60 transition-all">
              <div className="flex items-center justify-between text-[11px] text-amber-200/80 mb-1">
                <span>1 Sovereign (Pavan)</span>
                <span className="font-mono text-[10px] text-slate-400">8 Grams 22K</span>
              </div>
              <div className="font-mono text-xl sm:text-2xl font-black text-yellow-300 tracking-tight tabular-nums">
                ₹{rate.goldSovereign8g.toLocaleString('en-IN')}
              </div>
              <div className="flex items-center gap-1 mt-1 text-[11px] font-mono">
                {rate.dayChangeGold >= 0 ? (
                  <span className="text-emerald-400 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    +{rate.dayChangeGold * 8}
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-0.5">
                    <TrendingDown className="w-3 h-3" />
                    {rate.dayChangeGold * 8}
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Standard Tamil Nadu Pavan</div>
            </div>

            {/* 24K Pure Gold 999 */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 transition-all">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span>24K Pure Gold</span>
                <span className="font-mono text-[10px] text-slate-400">999 Purity</span>
              </div>
              <div className="font-mono text-xl sm:text-2xl font-black text-white tracking-tight tabular-nums">
                ₹{rate.gold24kPerGram.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-1">
                8g: ₹{(rate.gold24kPerGram * 8).toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Raw Bullion Benchmark</div>
            </div>

            {/* 18K Hallmarked */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span>18K Gold</span>
                <span className="font-mono text-[10px] text-slate-400">Jewellery</span>
              </div>
              <div className="font-mono text-xl sm:text-2xl font-bold text-slate-200 tracking-tight tabular-nums">
                ₹{rate.gold18kPerGram.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-1">
                8g: ₹{(rate.gold18kPerGram * 8).toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Stone & Diamond Ornaments</div>
            </div>

            {/* Silver 1 Gram 999 */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-cyan-500/20 hover:border-cyan-500/50 transition-all">
              <div className="flex items-center justify-between text-[11px] text-cyan-200/80 mb-1">
                <span>Silver 999</span>
                <span className="font-mono text-[10px] text-slate-400">1 Gram</span>
              </div>
              <div className="font-mono text-xl sm:text-2xl font-black text-cyan-200 tracking-tight tabular-nums">
                ₹{rate.silver1gRate.toFixed(2)}
              </div>
              <div className="flex items-center gap-1 mt-1 text-[11px] font-mono">
                {rate.dayChangeSilver >= 0 ? (
                  <span className="text-emerald-400 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    +{rate.dayChangeSilver.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-0.5">
                    <TrendingDown className="w-3 h-3" />
                    {rate.dayChangeSilver.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Fine Silver Articles</div>
            </div>

            {/* Silver 1 Kilogram Bar */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-cyan-500/20 hover:border-cyan-500/50 transition-all">
              <div className="flex items-center justify-between text-[11px] text-cyan-200/80 mb-1">
                <span>Silver 1 Kg</span>
                <span className="font-mono text-[10px] text-slate-400">1000g Bar</span>
              </div>
              <div className="font-mono text-xl sm:text-2xl font-black text-cyan-300 tracking-tight tabular-nums">
                ₹{rate.silver1kgRate.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-1">
                {rate.dayChangeSilver >= 0 ? `+₹${Math.round(rate.dayChangeSilver * 1000)}` : `-₹${Math.round(Math.abs(rate.dayChangeSilver) * 1000)}`}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Showroom Bar / Deepam</div>
            </div>
          </div>

          {/* Quick Info & Branch Address Strip */}
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong className="text-slate-200">{selectedBranch.branchName}:</strong> {selectedBranch.address}
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="font-mono text-amber-300/80">{selectedBranch.phone}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-emerald-400 font-mono">0% VA on Swarna Varshini Scheme</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: POTHYS SCHEME CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-heading font-black text-white">
                Pothys Swarna Varshini Scheme Weight & Savings Calculator
              </h3>
              <p className="text-xs text-slate-400">
                Calculates gold/silver credit grams at current Pothys rate + 7% early bonus weight
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCalcMetal('gold')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  calcMetal === 'gold' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400'
                }`}
              >
                22K Gold
              </button>
              <button
                onClick={() => setCalcMetal('silver')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  calcMetal === 'silver' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
                }`}
              >
                Pure Silver
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input Controls */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">Calculation Method</span>
                <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setCalcMode('amount')}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium ${
                      calcMode === 'amount' ? 'bg-amber-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    By Amount (₹)
                  </button>
                  <button
                    onClick={() => setCalcMode('grams')}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium ${
                      calcMode === 'grams' ? 'bg-amber-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    By Grams (g)
                  </button>
                </div>
              </div>

              {calcMode === 'amount' ? (
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Deposit Amount (₹)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step={500}
                      value={calcAmount}
                      onChange={(e) => setCalcAmount(Math.max(100, Number(e.target.value)))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-base focus:border-amber-500 focus:outline-none"
                    />
                    <div className="flex gap-1 shrink-0">
                      {[1000, 3000, 5000, 10000].map(val => (
                        <button
                          key={val}
                          onClick={() => setCalcAmount(val)}
                          className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-slate-300"
                        >
                          ₹{val / 1000}k
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Target Weight (Grams)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step={0.5}
                      value={calcGrams}
                      onChange={(e) => setCalcGrams(Math.max(0.1, Number(e.target.value)))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-base focus:border-amber-500 focus:outline-none"
                    />
                    <div className="flex gap-1 shrink-0">
                      {[1, 2, 4, 8].map(g => (
                        <button
                          key={g}
                          onClick={() => setCalcGrams(g)}
                          className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-slate-300"
                        >
                          {g}g {g === 8 ? '(1 Sov)' : ''}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="text-[11px] text-slate-400">
                Current Applied Pothys Rate: <strong className="text-amber-300 font-mono">₹{unitRate}/g</strong>
              </div>
            </div>

            {/* Computation Output Dossier */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Base Weight Credited:</span>
                <span className="font-mono text-white font-bold">{calculatedGrams} grams</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Pothys Early 7% Bonus Weight:</span>
                <span className="font-mono text-emerald-400 font-bold">+{bonus7PctGrams} grams</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                <span className="text-slate-200 font-semibold">Total Net Weight Credited:</span>
                <span className="font-mono text-amber-300 font-black text-sm">
                  {totalSchemeGrams} grams ({Number((totalSchemeGrams / 8).toFixed(3))} Sovereign)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Purchase Cost:</span>
                <span className="font-mono text-white font-bold">₹{calculatedCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-emerald-400 pt-1 border-t border-slate-800">
                <span>0% Wastage (VA) Savings:</span>
                <span className="font-mono font-bold">+₹{estimatedWastageSavings.toLocaleString('en-IN')} saved</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FREE API EXPLORER & DEVELOPER CODE */}
      {activeTab === 'free_api' && (
        <div className="p-5 rounded-xl bg-slate-950/70 border border-cyan-500/20 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-heading font-black text-white">
                  Free Real-Time Gold & Silver API Endpoints
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Zero API key required. CORS-enabled public endpoint for INR gold & silver rates.
              </p>
            </div>
            <a
              href={FREE_API_ENDPOINTS.goldApiInr}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 border border-cyan-500/30 transition-all self-start sm:self-auto"
            >
              <span>Test Endpoint Live</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* cURL & Code Snippets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">cURL Terminal Command</span>
                <button
                  onClick={() => copyToClipboard(snippets.curlSnippet, 'curl')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
                >
                  {copiedKey === 'curl' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'curl' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed">
                {snippets.curlSnippet}
              </pre>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-mono text-slate-400">JavaScript / TypeScript Fetch</span>
                <button
                  onClick={() => copyToClipboard(snippets.jsFetchSnippet, 'js')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
                >
                  {copiedKey === 'js' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'js' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-48">
                {snippets.jsFetchSnippet}
              </pre>
            </div>

            {/* Live JSON Payload */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">Live Normalized Response JSON</span>
                <button
                  onClick={() => copyToClipboard(snippets.sampleJsonResponse, 'json')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
                >
                  {copiedKey === 'json' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'json' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed max-h-72">
                {snippets.sampleJsonResponse}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* MANUAL OVERRIDE MODAL */}
      {isOverrideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-[#0E1526] border border-slate-700 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-heading font-black text-white">
                Showroom Board Rate Override
              </h3>
              <button
                onClick={() => setIsOverrideOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Update today's board rate to match physical showroom price changes at {selectedBranch.city} ({selectedBranch.branchName}).
            </p>

            <form onSubmit={handleApplyOverride} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  22K (916 Hallmark) Rate (₹ / Gram)
                </label>
                <input
                  type="number"
                  value={overrideGold22k}
                  onChange={(e) => setOverrideGold22k(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:border-amber-500 focus:outline-none"
                  required
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  1 Sovereign (8g): ₹{overrideGold22k * 8} · 24K: ₹{Math.round(overrideGold22k * (24 / 22))}
                </span>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  Pure Silver 999 Rate (₹ / Gram)
                </label>
                <input
                  type="number"
                  step={0.1}
                  value={overrideSilver1g}
                  onChange={(e) => setOverrideSilver1g(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:border-amber-500 focus:outline-none"
                  required
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  1 Kg Bar: ₹{Math.round(overrideSilver1g * 1000)}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOverrideOpen(false)}
                  className="w-1/2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md shadow-amber-600/30"
                >
                  Save Board Rate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
