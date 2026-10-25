import React, { useState, useMemo, useEffect } from 'react';
import {
  Coins,
  ShieldCheck,
  Calendar,
  Sparkles,
  TrendingUp,
  Award,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Printer,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ChevronRight,
  Flame,
  ArrowRight,
  Sliders,
  DollarSign,
  Layers,
  MapPin,
  Building,
  Check,
  Percent,
  Plus
} from 'lucide-react';
import { InvestmentAsset, BullionTransaction } from '../../types';
import { Card3D } from '../ui/Card3D';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { ScrollReveal } from '../ui/ScrollReveal';
import { getLiveDateString } from '../../utils/date-utils';
import {
  SalemDailyRate,
  getStoredSalemHistoricalRates,
  getTodaySalemRate,
  getSalemRateForDate,
  updateTodaySalemRate,
  calculateSchemeItem,
  getSalemShowroomOrnaments,
  PhysicalRedemptionOption
} from '../../services/salemBullionService';

interface SalemGoldSchemeSheetProps {
  goldAsset?: InvestmentAsset;
  silverAsset?: InvestmentAsset;
  onRecordDailyPay: (assetId: string, amount: number, date?: string, notes?: string, customRate?: number, docNo?: string) => void;
  onRecordDualPay?: (goldAmount: number, silverAmount: number, date?: string, notes?: string, goldRate?: number, silverRate?: number) => void;
  onOpenQuickDeposit?: (dayNum: number, dateString: string, metal: 'gold' | 'silver' | 'dual') => void;
}

const formatCurrency = (val: number) => `₹${Math.round(val || 0).toLocaleString('en-IN')}`;

export const SalemGoldSchemeSheet: React.FC<SalemGoldSchemeSheetProps> = ({
  goldAsset,
  silverAsset,
  onRecordDailyPay,
  onRecordDualPay,
  onOpenQuickDeposit
}) => {
  const todayStr = getLiveDateString(); // "2026-10-25"
  const schemeStartDateStr = '2026-10-15';
  const schemeStartDate = new Date(schemeStartDateStr);

  // Metal View Mode: 'gold' | 'silver' | 'dual'
  const [activeSheetMetal, setActiveSheetMetal] = useState<'gold' | 'silver' | 'dual'>('dual');

  // Filter mode: 'all' | 'paid' | 'backlog'
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'backlog'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Salem Market Live Price State
  const [salemRates, setSalemRates] = useState<SalemDailyRate>(() => getTodaySalemRate());
  const [isEditSalemRateOpen, setIsEditSalemRateOpen] = useState(false);
  const [inputGold22k, setInputGold22k] = useState<number>(salemRates.gold22kPerGram);
  const [inputSilver1g, setInputSilver1g] = useState<number>(salemRates.silver1gRate);
  const [inputSession, setInputSession] = useState<'Morning (10:00 AM)' | 'Evening (04:00 PM)'>('Morning (10:00 AM)');
  const [rateFeedbackMsg, setRateFeedbackMsg] = useState('');

  // What-If Simulator State
  const [simDailyAmount, setSimDailyAmount] = useState<number>(100);
  const [simProjectedGoldRate, setSimProjectedGoldRate] = useState<number>(7500);
  const [simProjectedSilverRate, setSimProjectedSilverRate] = useState<number>(100);

  // Sync state on load
  useEffect(() => {
    setSalemRates(getTodaySalemRate());
  }, []);

  // Calculate days elapsed from start date
  const todayDate = new Date(todayStr);
  const daysElapsed = Math.max(
    1,
    Math.floor((todayDate.getTime() - schemeStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
  );

  const totalTenureDays = 300;
  const lockInDays = 330;
  const daysRemaining = Math.max(0, totalTenureDays - daysElapsed);

  // Target Reach Projections
  const targetReachDate = new Date(schemeStartDate);
  targetReachDate.setDate(schemeStartDate.getDate() + 300);
  const targetReachDateFormatted = targetReachDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const maturityDate = new Date(schemeStartDate);
  maturityDate.setDate(schemeStartDate.getDate() + 330);
  const maturityDateFormatted = maturityDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  // Handle Salem rate update
  const handleSaveSalemRate = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updateTodaySalemRate(Number(inputGold22k), Number(inputSilver1g), inputSession);
    setSalemRates(updated);
    setRateFeedbackMsg('Salem Daily Bullion Market Rate updated & sheet recalculated!');
    setTimeout(() => {
      setRateFeedbackMsg('');
      setIsEditSalemRateOpen(false);
    }, 1200);
  };

  // Transactions mapped
  const goldTransactions: BullionTransaction[] = useMemo(() => goldAsset?.transactions || [], [goldAsset]);
  const silverTransactions: BullionTransaction[] = useMemo(() => silverAsset?.transactions || [], [silverAsset]);

  // Generate 300-day Scheme Ledger Sheet Rows
  const sheetRows = useMemo(() => {
    const rows = [];

    let cumGoldGrams = 0;
    let cumGoldInvested = 0;
    let cumSilverGrams = 0;
    let cumSilverInvested = 0;

    for (let i = 0; i < totalTenureDays; i++) {
      const d = new Date(schemeStartDate);
      d.setDate(schemeStartDate.getDate() + i);
      const dateString = d.toISOString().split('T')[0];
      const dayNum = i + 1;
      const isPastOrToday = dateString <= todayStr;
      const isToday = dateString === todayStr;

      // Salem Daily Market Rate on this date
      const salemDaily = getSalemRateForDate(dateString);

      // Gold transactions on this date
      const dayGoldTxs = goldTransactions.filter(t => t.date === dateString);
      const goldPaid = dayGoldTxs.reduce((sum, t) => sum + t.amount, 0);
      const isGoldPaid = goldPaid >= 100;
      const goldDoc = dayGoldTxs[0]?.docNo || `APP27SCTM/GLD-D${dayNum}`;

      // Silver transactions on this date
      const daySilverTxs = silverTransactions.filter(t => t.date === dateString);
      const silverPaid = daySilverTxs.reduce((sum, t) => sum + t.amount, 0);
      const isSilverPaid = silverPaid >= 100;
      const silverDoc = daySilverTxs[0]?.docNo || `APP27SCTM/SLV-D${dayNum}`;

      // Dual status
      const isDualPaid = isGoldPaid && isSilverPaid;
      const totalPaid = goldPaid + silverPaid;

      // Scheme Calculation for Gold on this date
      const goldCalc = calculateSchemeItem(
        isGoldPaid ? goldPaid : 100,
        dateString,
        'gold',
        salemRates.gold22kPerGram
      );

      // Scheme Calculation for Silver on this date
      const silverCalc = calculateSchemeItem(
        isSilverPaid ? silverPaid : 100,
        dateString,
        'silver',
        salemRates.silver1gRate
      );

      if (isGoldPaid) {
        cumGoldGrams += goldCalc.totalWeightGrams;
        cumGoldInvested += goldPaid;
      }
      if (isSilverPaid) {
        cumSilverGrams += silverCalc.totalWeightGrams;
        cumSilverInvested += silverPaid;
      }

      // Status determinations
      const isMissedGold = isPastOrToday && !isToday && !isGoldPaid;
      const isMissedSilver = isPastOrToday && !isToday && !isSilverPaid;
      const isMissedAny = isMissedGold || isMissedSilver;

      rows.push({
        dayNum,
        dateString,
        dateFormatted: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        weekday: d.toLocaleDateString('en-GB', { weekday: 'short' }),
        isToday,
        isPastOrToday,
        salemGoldRate: salemDaily.gold22kPerGram,
        salemSilverRate: salemDaily.silver1gRate,
        salemSovereignRate: salemDaily.goldSovereign8g,
        goldPaid,
        isGoldPaid,
        goldDoc,
        goldCalc,
        silverPaid,
        isSilverPaid,
        silverDoc,
        silverCalc,
        isDualPaid,
        totalPaid,
        isMissedGold,
        isMissedSilver,
        isMissedAny,
        cumGoldGrams: Number(cumGoldGrams.toFixed(5)),
        cumGoldInvested,
        cumSilverGrams: Number(cumSilverGrams.toFixed(3)),
        cumSilverInvested
      });
    }
    return rows;
  }, [schemeStartDate, todayStr, goldTransactions, silverTransactions, salemRates]);

  // Filtered rows for Sheet Display
  const filteredRows = useMemo(() => {
    return sheetRows.filter(row => {
      // Status filter
      if (statusFilter === 'paid') {
        if (activeSheetMetal === 'gold' && !row.isGoldPaid) return false;
        if (activeSheetMetal === 'silver' && !row.isSilverPaid) return false;
        if (activeSheetMetal === 'dual' && !row.isDualPaid) return false;
      } else if (statusFilter === 'backlog') {
        if (activeSheetMetal === 'gold' && !row.isMissedGold) return false;
        if (activeSheetMetal === 'silver' && !row.isMissedSilver) return false;
        if (activeSheetMetal === 'dual' && !row.isMissedAny) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesDate = row.dateFormatted.toLowerCase().includes(q) || row.dateString.includes(q);
        const matchesDay = `day ${row.dayNum}`.includes(q) || `${row.dayNum}` === q;
        const matchesDoc = row.goldDoc.toLowerCase().includes(q) || row.silverDoc.toLowerCase().includes(q);
        if (!matchesDate && !matchesDay && !matchesDoc) return false;
      }

      return true;
    });
  }, [sheetRows, statusFilter, activeSheetMetal, searchQuery]);

  // Aggregate Metrics based on active metal view
  const aggregateMetrics = useMemo(() => {
    const totalGoldInvested = goldTransactions.reduce((acc, t) => acc + t.amount, 0);
    const totalSilverInvested = silverTransactions.reduce((acc, t) => acc + t.amount, 0);
    const goldGramsAccrued = goldAsset?.quantity || 0.03954;
    const silverGramsAccrued = silverAsset?.quantity || 4.95431;

    const goldCurrentValuation = Math.round(goldGramsAccrued * salemRates.gold22kPerGram);
    const silverCurrentValuation = Math.round(silverGramsAccrued * salemRates.silver1gRate);

    // Guaranteed Jeweller Perks Savings:
    // 0% VA (Wastage) on 22K Gold Jewellery (~15% of ₹30,000) = ₹4,500
    // 0% Making Charges (~8%) = ₹2,400
    const goldJewellerSavings = Math.round(30000 * 0.15 + 30000 * 0.08); // ₹6,900
    const silverJewellerSavings = Math.round(30000 * 0.12 + 30000 * 0.06); // ₹5,400
    const totalJewellerSavings = goldJewellerSavings + silverJewellerSavings; // ~₹12,300+

    const projectedDay300GoldGrams = Number(((30000 / salemRates.gold22kPerGram) * 1.05).toFixed(4)); // ~4.26g
    const projectedDay300SilverGrams = Number(((30000 / salemRates.silver1gRate) * 1.05).toFixed(2)); // ~323g

    return {
      totalGoldInvested,
      totalSilverInvested,
      goldGramsAccrued,
      silverGramsAccrued,
      goldCurrentValuation,
      silverCurrentValuation,
      combinedInvested: totalGoldInvested + totalSilverInvested,
      combinedValuation: goldCurrentValuation + silverCurrentValuation,
      goldJewellerSavings,
      silverJewellerSavings,
      totalJewellerSavings,
      projectedDay300GoldGrams,
      projectedDay300SilverGrams
    };
  }, [goldTransactions, silverTransactions, goldAsset, silverAsset, salemRates]);

  // Salem Showroom Ornaments Catalog
  const showroomOrnaments: PhysicalRedemptionOption[] = useMemo(() => {
    return getSalemShowroomOrnaments(
      aggregateMetrics.goldGramsAccrued,
      aggregateMetrics.silverGramsAccrued,
      salemRates.gold22kPerGram,
      salemRates.silver1gRate
    );
  }, [aggregateMetrics, salemRates]);

  // Export Sheet to CSV
  const handleExportCSV = () => {
    const headers = [
      'Day #',
      'Date',
      'Weekday',
      'Plan Type',
      'Voucher Doc ID',
      'Daily Target (INR)',
      'Paid Amount (INR)',
      'Salem Market Rate (INR/g)',
      'Base Weight (g)',
      'Bonus Tier %',
      'Bonus Weight (g)',
      'Total Credited Weight (g)',
      'Cumulative Weight (g)',
      'Salem Valuation (INR)',
      'Wastage & Making Savings (INR)',
      'Status'
    ];

    const csvLines = [headers.join(',')];

    sheetRows.forEach(row => {
      if (activeSheetMetal === 'gold' || activeSheetMetal === 'dual') {
        csvLines.push([
          row.dayNum,
          row.dateString,
          row.weekday,
          '22K Hallmark Gold (Pothys)',
          `"${row.goldDoc}"`,
          100,
          row.goldPaid,
          row.salemGoldRate,
          row.goldCalc.baseWeightGrams,
          `${row.goldCalc.bonusTierPct}%`,
          row.goldCalc.bonusWeightGrams,
          row.goldCalc.totalWeightGrams,
          row.cumGoldGrams,
          row.goldCalc.currentValuationAtLiveRate,
          row.goldCalc.wastageSavingsEstimated + row.goldCalc.makingChargesSavingsEstimated,
          row.isGoldPaid ? 'PAID' : row.isToday ? 'DUE TODAY' : row.isMissedGold ? 'MISSED BACKLOG' : 'SCHEDULED'
        ].join(','));
      }

      if (activeSheetMetal === 'silver' || activeSheetMetal === 'dual') {
        csvLines.push([
          row.dayNum,
          row.dateString,
          row.weekday,
          '999 Pure Silver (Pothys)',
          `"${row.silverDoc}"`,
          100,
          row.silverPaid,
          row.salemSilverRate,
          row.silverCalc.baseWeightGrams,
          `${row.silverCalc.bonusTierPct}%`,
          row.silverCalc.bonusWeightGrams,
          row.silverCalc.totalWeightGrams,
          row.cumSilverGrams,
          row.silverCalc.currentValuationAtLiveRate,
          row.silverCalc.wastageSavingsEstimated + row.silverCalc.makingChargesSavingsEstimated,
          row.isSilverPaid ? 'PAID' : row.isToday ? 'DUE TODAY' : row.isMissedSilver ? 'MISSED BACKLOG' : 'SCHEDULED'
        ].join(','));
      }
    });

    const csvBlob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(csvBlob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Pothys_Swarna_Mahal_Salem_Chit_Sheet_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-7 animate-fade-in pb-16 perspective-1000">
      {/* 1. OFFICIAL JEWELLER WEBSITE SCHEME PASSBOOK HEADER */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1E1708] via-[#12162A] to-[#0A0E1C] border border-amber-500/40 shadow-2xl relative overflow-hidden">
        {/* Glow Ambient Blobs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 flex items-center gap-1.5 shadow-md">
                <Building className="w-3.5 h-3.5" />
                Pothys Swarna Mahal — Salem Showroom Portal
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono">
                Passbook Reg: APP27SCTM / SLM-2026-8842
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Verified Customer Statement
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Coins className="w-7 h-7 text-amber-400 animate-pulse" />
              <span>Official Gold & Silver Scheme Passbook Sheet</span>
            </h1>

            <div className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed flex flex-wrap items-center gap-y-1 gap-x-4">
              <span>
                <strong className="text-slate-400">Customer:</strong> <strong className="text-white">Jeevananthan V</strong>
              </span>
              <span>•</span>
              <span>
                <strong className="text-slate-400">Branch:</strong>{' '}
                <strong className="text-amber-300 flex-inline items-center gap-1">
                  <MapPin className="w-3 h-3 inline text-amber-400" /> Meyyanur, Salem - 636004
                </strong>
              </span>
              <span>•</span>
              <span>
                <strong className="text-slate-400">Tenure:</strong> 300 Days (Maturity: {maturityDateFormatted})
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">
                0% VA (Wastage) & 0% Making Charges Guaranteed
              </span>
            </div>
          </div>

          {/* Quick Header Export & Pay Actions */}
          <div className="flex flex-wrap items-center gap-2.5 relative z-10">
            <button
              onClick={() => setIsEditSalemRateOpen(true)}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/40 transition flex items-center space-x-1.5 active:scale-95 shadow-md"
              title="Update Today's Salem Bullion Market Rate"
            >
              <RefreshCw className="w-4 h-4 text-amber-400" />
              <span>Update Salem Price</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 transition flex items-center space-x-1.5 active:scale-95 shadow-md"
              title="Download official statement in CSV format"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 transition flex items-center space-x-1.5 active:scale-95 shadow-md"
              title="Print Passbook Statement"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span>Print Sheet</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SALEM DAILY BULLION MARKET LIVE RATES COMMAND TICKER */}
      <div className="p-5 rounded-2xl bg-[#0C1222] border border-amber-500/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Salem Bullion Market — Today's Official Rates
              </span>
              <p className="text-[11px] text-slate-400 font-mono">
                Salem District Jewellers & Bullion Association • {salemRates.session} • Status: {salemRates.marketStatus}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className="text-slate-400 font-mono text-[11px] bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
              {salemRates.lastUpdated}
            </span>
            <button
              onClick={() => setIsEditSalemRateOpen(true)}
              className="px-3 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 font-bold transition flex items-center gap-1 text-[11px]"
            >
              <Sliders className="w-3 h-3" />
              <span>Modify Rate</span>
            </button>
          </div>
        </div>

        {/* 4-Rate Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tile 1: Salem 22K (916) Gold */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#1C1709] to-[#0E1528] border border-amber-500/40 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Salem 22K (916) Gold
              </span>
              <span className={`text-[10px] font-bold font-mono ${salemRates.dayChangeGold >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {salemRates.dayChangeGold >= 0 ? `+₹${salemRates.dayChangeGold}` : `₹${salemRates.dayChangeGold}`}
              </span>
            </div>
            <div className="text-2xl font-black text-white font-mono tracking-tight mt-1">
              ₹{salemRates.gold22kPerGram.toLocaleString('en-IN')}{' '}
              <span className="text-xs text-slate-400 font-normal">/ gram</span>
            </div>
            <div className="mt-1 pt-2 border-t border-amber-500/20 text-[11px] text-amber-300 font-mono flex justify-between">
              <span>₹100 Booking:</span>
              <strong className="text-emerald-400">
                {Number(((100 / salemRates.gold22kPerGram) * 1.07).toFixed(5))}g (+7%)
              </strong>
            </div>
          </div>

          {/* Tile 2: Salem 1 Sovereign (8g) 22K */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#1A1406] to-[#0B1020] border border-yellow-500/30 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-400">
                Salem 1 Sovereign (8 Grams)
              </span>
              <span className="text-[10px] font-bold text-yellow-300 font-mono">1 Pavan</span>
            </div>
            <div className="text-2xl font-black text-yellow-300 font-mono tracking-tight mt-1">
              ₹{salemRates.goldSovereign8g.toLocaleString('en-IN')}{' '}
              <span className="text-xs text-slate-400 font-normal">/ 8g</span>
            </div>
            <div className="mt-1 pt-2 border-t border-yellow-500/20 text-[11px] text-slate-400 font-mono flex justify-between">
              <span>Standard TN Jewellery Unit</span>
              <span className="text-slate-300 font-bold">8 × 22K Rate</span>
            </div>
          </div>

          {/* Tile 3: Salem 24K Pure Gold */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#161208] to-[#090D1A] border border-amber-500/25 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                Salem 24K Pure Gold (999)
              </span>
              <span className="text-[10px] font-mono text-slate-400">Bullion Bar</span>
            </div>
            <div className="text-2xl font-black text-white font-mono tracking-tight mt-1">
              ₹{salemRates.gold24kPerGram.toLocaleString('en-IN')}{' '}
              <span className="text-xs text-slate-400 font-normal">/ gram</span>
            </div>
            <div className="mt-1 pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono flex justify-between">
              <span>Purity Premium:</span>
              <span className="text-amber-400 font-bold">+9.08% vs 22K</span>
            </div>
          </div>

          {/* Tile 4: Salem 999 Fine Silver */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#0B1A24] to-[#0A1220] border border-cyan-500/40 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                Salem 999 Fine Silver
              </span>
              <span className={`text-[10px] font-bold font-mono ${salemRates.dayChangeSilver >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {salemRates.dayChangeSilver >= 0 ? `+₹${salemRates.dayChangeSilver}` : `₹${salemRates.dayChangeSilver}`}
              </span>
            </div>
            <div className="text-2xl font-black text-cyan-300 font-mono tracking-tight mt-1">
              ₹{salemRates.silver1gRate.toFixed(2)}{' '}
              <span className="text-xs text-slate-400 font-normal">/ gram</span>
            </div>
            <div className="mt-1 pt-2 border-t border-cyan-500/20 text-[11px] text-cyan-300 font-mono flex justify-between">
              <span>₹100 Booking:</span>
              <strong className="text-emerald-400">
                {Number(((100 / salemRates.silver1gRate) * 1.07).toFixed(4))}g (+7%)
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* 3. EXECUTIVE ACCUMULATION & VALUE KPI STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 perspective-1000">
        {/* KPI 1: Total Deposited vs Target */}
        <ScrollReveal animation="fade-up" delay={50}>
          <Card3D glowColor="amber" className="h-full">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl h-full flex flex-col justify-between hover:border-amber-500/50 transition-colors">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold tracking-wide uppercase text-slate-300">Total Deposited</span>
                <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/25 text-amber-400">
                  <Coins className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-white font-mono">
                  {formatCurrency(aggregateMetrics.combinedInvested)}
                </div>
                <div className="text-xs text-slate-400 mt-1 flex justify-between">
                  <span>Gold: {formatCurrency(aggregateMetrics.totalGoldInvested)}</span>
                  <span>Silver: {formatCurrency(aggregateMetrics.totalSilverInvested)}</span>
                </div>
              </div>
              <div className="mt-3 text-[10px] text-slate-400 font-mono flex justify-between border-t border-slate-800 pt-1.5">
                <span>Day {daysElapsed} / 300</span>
                <span>Full Target: ₹60,000</span>
              </div>
            </div>
          </Card3D>
        </ScrollReveal>

        {/* KPI 2: Total Accumulated Weight */}
        <ScrollReveal animation="fade-up" delay={100}>
          <Card3D glowColor="amber" className="h-full">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/30 backdrop-blur-xl shadow-xl h-full flex flex-col justify-between hover:border-amber-500/60 transition-colors">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold tracking-wide uppercase text-amber-300">Accumulated Weight</span>
                <div className="p-2 rounded-xl bg-yellow-500/15 border border-yellow-500/25 text-yellow-400">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-xl font-black text-amber-300 font-mono">
                  {aggregateMetrics.goldGramsAccrued.toFixed(5)}g Gold
                </div>
                <div className="text-base font-black text-cyan-300 font-mono mt-0.5">
                  {aggregateMetrics.silverGramsAccrued.toFixed(3)}g Silver
                </div>
              </div>
              <div className="mt-3 text-[10px] text-emerald-400 font-mono flex items-center gap-1 border-t border-slate-800 pt-1.5">
                <Sparkles className="w-3 h-3" />
                <span>Includes +7% Instant Bonus Weight</span>
              </div>
            </div>
          </Card3D>
        </ScrollReveal>

        {/* KPI 3: Current Market Valuation in Salem */}
        <ScrollReveal animation="fade-up" delay={150}>
          <Card3D glowColor="emerald" className="h-full">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-xl shadow-xl h-full flex flex-col justify-between hover:border-emerald-500/60 transition-colors">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold tracking-wide uppercase text-emerald-400">Salem Market Valuation</span>
                <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-400 font-mono">
                  {formatCurrency(aggregateMetrics.combinedValuation)}
                </div>
                <div className="text-xs text-slate-400 mt-1 flex justify-between">
                  <span>Gold: {formatCurrency(aggregateMetrics.goldCurrentValuation)}</span>
                  <span>Silver: {formatCurrency(aggregateMetrics.silverCurrentValuation)}</span>
                </div>
              </div>
              <div className="mt-3 text-[10px] text-slate-400 font-mono flex justify-between border-t border-slate-800 pt-1.5">
                <span>At Current Salem Rates</span>
                <span className="text-emerald-400 font-bold">Live Synced</span>
              </div>
            </div>
          </Card3D>
        </ScrollReveal>

        {/* KPI 4: Guaranteed Jeweller Perks Savings */}
        <ScrollReveal animation="fade-up" delay={200}>
          <Card3D glowColor="cyan" className="h-full">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-xl shadow-xl h-full flex flex-col justify-between hover:border-cyan-500/60 transition-colors">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold tracking-wide uppercase text-cyan-300">Jeweller Perks Benefit</span>
                <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/25 text-cyan-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-cyan-300 font-mono">
                  +{formatCurrency(aggregateMetrics.totalJewellerSavings)}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  0% Wastage (VA) + 0% Making Charges
                </div>
              </div>
              <div className="mt-3 text-[10px] text-cyan-400 font-mono flex justify-between border-t border-slate-800 pt-1.5">
                <span>Salem Showroom</span>
                <span>~23% Extra Savings</span>
              </div>
            </div>
          </Card3D>
        </ScrollReveal>
      </div>

      {/* 4. PASSBOOK LEDGER CONTROLS & METAL TOGGLE */}
      <div className="p-6 rounded-2xl bg-[#0C1222]/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          {/* Metal View Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'dual', label: 'Combined Dual Sheet (₹200/day)', icon: Layers },
              { id: 'gold', label: '22K Gold Sheet (₹100/day)', icon: Coins },
              { id: 'silver', label: '999 Silver Sheet (₹100/day)', icon: ShieldCheck }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeSheetMetal === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSheetMetal(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Status & Search Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status pills */}
            <div className="flex items-center space-x-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              {[
                { id: 'all', label: 'All 300 Days' },
                { id: 'paid', label: 'Paid Deposits' },
                { id: 'backlog', label: 'Backlog / Skipped' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    statusFilter === f.id
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-56">
              <input
                type="text"
                placeholder="Search date or day..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-3 py-1.5 pl-8 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>

        {/* 5. OFFICIAL PASSBOOK LEDGER TABLE (DATE-BY-DATE AUTOMATED SCHEME VALUES) */}
        <div className="overflow-x-auto rounded-xl border border-slate-800/80">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-800 bg-[#090E1A] text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Day #</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Metal / Plan</th>
                <th className="py-3 px-3">Voucher Doc No</th>
                <th className="py-3 px-3">Deposit (₹)</th>
                <th className="py-3 px-3">Salem Market Rate</th>
                <th className="py-3 px-3">Base Weight</th>
                <th className="py-3 px-3">Bonus Tier</th>
                <th className="py-3 px-3">Bonus Weight</th>
                <th className="py-3 px-3">Total Credited Weight</th>
                <th className="py-3 px-3">Cumulative Weight</th>
                <th className="py-3 px-3">Salem Valuation</th>
                <th className="py-3 px-3">VA/MC Savings</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={15} className="py-10 text-center text-slate-500 font-sans">
                    No matching days found for the current search filter.
                  </td>
                </tr>
              ) : (
                filteredRows.slice(0, 100).map(row => {
                  const showGold = activeSheetMetal === 'gold' || activeSheetMetal === 'dual';
                  const showSilver = activeSheetMetal === 'silver' || activeSheetMetal === 'dual';

                  return (
                    <React.Fragment key={row.dayNum}>
                      {/* GOLD ROW */}
                      {showGold && (
                        <tr className={`hover:bg-slate-900/60 transition ${row.isToday ? 'bg-amber-950/20' : ''}`}>
                          <td className="py-2.5 px-3 font-bold text-amber-300">Day {row.dayNum}</td>
                          <td className="py-2.5 px-3 text-slate-300">{row.dateFormatted}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              22K Gold
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-400 text-[11px]">{row.goldDoc}</td>
                          <td className="py-2.5 px-3 text-white font-bold">
                            {formatCurrency(row.isGoldPaid ? row.goldPaid : 100)}
                          </td>
                          <td className="py-2.5 px-3 text-amber-300 font-bold">
                            ₹{row.salemGoldRate.toLocaleString('en-IN')}/g
                          </td>
                          <td className="py-2.5 px-3 text-slate-300">{row.goldCalc.baseWeightGrams.toFixed(5)}g</td>
                          <td className="py-2.5 px-3 text-emerald-400 font-bold">+{row.goldCalc.bonusTierPct}%</td>
                          <td className="py-2.5 px-3 text-emerald-400">+{row.goldCalc.bonusWeightGrams.toFixed(5)}g</td>
                          <td className="py-2.5 px-3 text-white font-extrabold">{row.goldCalc.totalWeightGrams.toFixed(5)}g</td>
                          <td className="py-2.5 px-3 text-amber-400 font-bold">{row.cumGoldGrams.toFixed(5)}g</td>
                          <td className="py-2.5 px-3 text-emerald-400 font-bold">
                            {formatCurrency(row.goldCalc.currentValuationAtLiveRate)}
                          </td>
                          <td className="py-2.5 px-3 text-cyan-300">
                            +{formatCurrency(row.goldCalc.wastageSavingsEstimated + row.goldCalc.makingChargesSavingsEstimated)}
                          </td>
                          <td className="py-2.5 px-3">
                            {row.isGoldPaid ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 w-max">
                                <Check className="w-3 h-3" /> Paid
                              </span>
                            ) : row.isToday ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse w-max">
                                ⏳ Today Due
                              </span>
                            ) : row.isMissedGold ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 w-max">
                                ⚠️ Missed
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-medium text-slate-500 bg-slate-900 border border-slate-800 w-max">
                                Scheduled
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {!row.isGoldPaid && (
                              <button
                                onClick={() => onOpenQuickDeposit?.(row.dayNum, row.dateString, 'gold')}
                                className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-amber-500 hover:bg-amber-400 text-slate-950 transition active:scale-95 shadow-sm"
                              >
                                Pay Gold
                              </button>
                            )}
                          </td>
                        </tr>
                      )}

                      {/* SILVER ROW */}
                      {showSilver && (
                        <tr className={`hover:bg-slate-900/60 transition ${row.isToday ? 'bg-cyan-950/20' : ''}`}>
                          <td className="py-2.5 px-3 font-bold text-cyan-300">Day {row.dayNum}</td>
                          <td className="py-2.5 px-3 text-slate-300">{row.dateFormatted}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                              999 Silver
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-400 text-[11px]">{row.silverDoc}</td>
                          <td className="py-2.5 px-3 text-white font-bold">
                            {formatCurrency(row.isSilverPaid ? row.silverPaid : 100)}
                          </td>
                          <td className="py-2.5 px-3 text-cyan-300 font-bold">
                            ₹{row.salemSilverRate.toFixed(2)}/g
                          </td>
                          <td className="py-2.5 px-3 text-slate-300">{row.silverCalc.baseWeightGrams.toFixed(4)}g</td>
                          <td className="py-2.5 px-3 text-emerald-400 font-bold">+{row.silverCalc.bonusTierPct}%</td>
                          <td className="py-2.5 px-3 text-emerald-400">+{row.silverCalc.bonusWeightGrams.toFixed(4)}g</td>
                          <td className="py-2.5 px-3 text-white font-extrabold">{row.silverCalc.totalWeightGrams.toFixed(4)}g</td>
                          <td className="py-2.5 px-3 text-cyan-400 font-bold">{row.cumSilverGrams.toFixed(3)}g</td>
                          <td className="py-2.5 px-3 text-emerald-400 font-bold">
                            {formatCurrency(row.silverCalc.currentValuationAtLiveRate)}
                          </td>
                          <td className="py-2.5 px-3 text-cyan-300">
                            +{formatCurrency(row.silverCalc.wastageSavingsEstimated + row.silverCalc.makingChargesSavingsEstimated)}
                          </td>
                          <td className="py-2.5 px-3">
                            {row.isSilverPaid ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 w-max">
                                <Check className="w-3 h-3" /> Paid
                              </span>
                            ) : row.isToday ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse w-max">
                                ⏳ Today Due
                              </span>
                            ) : row.isMissedSilver ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 w-max">
                                ⚠️ Missed
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-medium text-slate-500 bg-slate-900 border border-slate-800 w-max">
                                Scheduled
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {!row.isSilverPaid && (
                              <button
                                onClick={() => onOpenQuickDeposit?.(row.dayNum, row.dateString, 'silver')}
                                className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition active:scale-95 shadow-sm"
                              >
                                Pay Silver
                              </button>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {filteredRows.length > 100 && (
          <p className="text-center text-xs text-slate-500 pt-2">
            Showing first 100 days of the 300-day scheme. Use search or status filter to inspect other days.
          </p>
        )}
      </div>

      {/* 6. AUTOMATIC SCHEME VALUE CALCULATOR & SIMULATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Calculator Controls & Outcome */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0C1222]/90 border border-slate-800 shadow-xl space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                Automatic Scheme Value & Maturity Calculator
              </h3>
              <p className="text-xs text-slate-400">
                Simulate how your daily deposit and Salem bullion market rates yield your gold ornaments at Day 300.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              Tenure: 300 Days
            </span>
          </div>

          {/* Slider 1: Daily Target Deposit */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-bold">Daily Deposit Outlay</span>
              <span className="text-amber-300 font-black font-mono">₹{simDailyAmount} / day</span>
            </div>
            <input
              type="range"
              min={100}
              max={2000}
              step={100}
              value={simDailyAmount}
              onChange={e => setSimDailyAmount(Number(e.target.value))}
              className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>₹100 (Scheme Min)</span>
              <span>₹500 / day</span>
              <span>₹1,000 / day</span>
              <span>₹2,000 / day</span>
            </div>
          </div>

          {/* Slider 2: Projected Salem Gold Rate at Maturity */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-bold">Projected Salem 22K Gold Rate at Maturity</span>
              <span className="text-emerald-400 font-black font-mono">₹{simProjectedGoldRate} / gram</span>
            </div>
            <input
              type="range"
              min={7000}
              max={9500}
              step={50}
              value={simProjectedGoldRate}
              onChange={e => setSimProjectedGoldRate(Number(e.target.value))}
              className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>₹7,000 / g</span>
              <span>₹7,500 / g</span>
              <span>₹8,500 / g</span>
              <span>₹9,500 / g</span>
            </div>
          </div>

          {/* Projected Outcomes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Outlay (300D)</span>
              <span className="text-base font-black text-white font-mono">
                {formatCurrency(simDailyAmount * 300)}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Estimated Gold Weight</span>
              <span className="text-base font-black text-amber-300 font-mono">
                {Number((((simDailyAmount * 300) / simProjectedGoldRate) * 1.05).toFixed(3))}g
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">0% VA + MC Savings</span>
              <span className="text-base font-black text-cyan-300 font-mono">
                +{formatCurrency((simDailyAmount * 300) * 0.23)}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-emerald-500/40 bg-emerald-950/20">
              <span className="text-[10px] text-emerald-400 uppercase font-bold block">Total Value Unlocked</span>
              <span className="text-base font-black text-emerald-400 font-mono">
                {formatCurrency((simDailyAmount * 300) * 1.28)}
              </span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Physical Ornaments Redemption in Salem Showroom */}
        <div className="p-6 rounded-2xl bg-[#0C1222]/90 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Salem Showroom Ornaments
              </h3>
              <p className="text-xs text-slate-400">
                Physical jewellery items redeemable at 0% Wastage (VA) & 0% Making Charges in Salem showroom.
              </p>
            </div>

            <div className="mt-4 space-y-3">
              {showroomOrnaments.map(orn => {
                const isGold = orn.category === 'gold';
                const hasSufficientWeight = isGold
                  ? aggregateMetrics.goldGramsAccrued >= orn.typicalWeightGrams
                  : aggregateMetrics.silverGramsAccrued >= orn.typicalWeightGrams;

                return (
                  <div
                    key={orn.id}
                    className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 transition space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-white flex items-center gap-1.5">
                        {isGold ? <Coins className="w-3.5 h-3.5 text-amber-400" /> : <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />}
                        {orn.title}
                      </span>
                      <span className="font-mono text-amber-300">{orn.typicalWeightGrams}g</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      {orn.description}
                    </p>
                    <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-800/80 font-mono">
                      <span className="text-emerald-400 font-bold">
                        Saves ~{formatCurrency(orn.zeroWastageSavingsAmount + orn.zeroMakingChargesSavingsAmount)} VA/MC
                      </span>
                      <span className={hasSufficientWeight ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                        {hasSufficientWeight ? '✓ Unlocked' : 'In Progress'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
            <strong>Salem Showroom Address:</strong> Meyyanur Main Road, Near New Bus Stand, Salem - 636004. Open 10 AM to 9 PM daily.
          </div>
        </div>
      </div>

      {/* 7. MODAL: EDIT & SYNC SALEM DAILY BULLION RATE */}
      {isEditSalemRateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0C1222] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#080D1A]">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-extrabold text-white">
                  Update Salem Daily Bullion Market Rate
                </h3>
              </div>
              <button
                onClick={() => setIsEditSalemRateOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveSalemRate} className="p-6 space-y-4">
              {rateFeedbackMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
                  {rateFeedbackMsg}
                </div>
              )}

              {/* 22K Gold Rate */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex justify-between">
                  <span>Salem 22K (916) Hallmark Gold Rate (₹/gram)</span>
                  <span className="text-amber-400 font-mono">1 Sovereign = ₹{inputGold22k * 8}</span>
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={inputGold22k}
                    onChange={e => setInputGold22k(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-sm focus:outline-none focus:border-amber-500"
                    placeholder="7380"
                    required
                  />
                  <div className="flex space-x-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setInputGold22k(prev => prev + 10)}
                      className="px-2 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700"
                    >
                      +₹10
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputGold22k(prev => prev - 10)}
                      className="px-2 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700"
                    >
                      -₹10
                    </button>
                  </div>
                </div>
              </div>

              {/* 999 Silver Rate */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex justify-between">
                  <span>Salem 999 Pure Silver Rate (₹/gram)</span>
                  <span className="text-cyan-400 font-mono">1 Kg = ₹{Math.round(inputSilver1g * 1000)}</span>
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    step="0.1"
                    value={inputSilver1g}
                    onChange={e => setInputSilver1g(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-sm focus:outline-none focus:border-cyan-500"
                    placeholder="97.50"
                    required
                  />
                  <div className="flex space-x-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setInputSilver1g(prev => Number((prev + 0.5).toFixed(2)))}
                      className="px-2 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700"
                    >
                      +₹0.5
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputSilver1g(prev => Number((prev - 0.5).toFixed(2)))}
                      className="px-2 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700"
                    >
                      -₹0.5
                    </button>
                  </div>
                </div>
              </div>

              {/* Session Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Salem Bullion Market Session</label>
                <select
                  value={inputSession}
                  onChange={e => setInputSession(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="Morning (10:00 AM)">Morning Session (10:00 AM Fixing)</option>
                  <option value="Evening (04:00 PM)">Evening Session (04:00 PM Fixing)</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 transition active:scale-95 shadow-lg shadow-amber-500/20"
                >
                  ⚡ Save & Automatically Recalculate Scheme Sheet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
