import React, { useState, useMemo } from 'react';
import {
  Coins,
  Plus,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Award,
  AlertCircle,
  HelpCircle,
  FileSpreadsheet,
  ChevronRight,
  Flame,
  Check,
  ArrowUpRight,
  Wallet,
  Bell,
  RefreshCw,
  Sliders,
  DollarSign,
  Info,
  CalendarDays,
  Percent,
  Layers,
  ArrowRight
} from 'lucide-react';
import { InvestmentAsset, BullionTransaction } from '../../types';
import { Card3D } from '../ui/Card3D';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { ScrollReveal } from '../ui/ScrollReveal';
import { getLiveDateString } from '../../utils/date-utils';
import { SalemGoldSchemeSheet } from './SalemGoldSchemeSheet';

const formatCurrency = (val: number) => `₹${Math.round(val || 0).toLocaleString('en-IN')}`;

interface DailyPayChitDashboardProps {
  goldAsset?: InvestmentAsset;
  silverAsset?: InvestmentAsset;
  goldSpotRate: number;
  silverSpotRate: number;
  onRecordDailyPay: (assetId: string, amount: number, date?: string, notes?: string, customRate?: number, docNo?: string) => void;
  onRecordDualPay?: (goldAmount: number, silverAmount: number, date?: string, notes?: string, goldRate?: number, silverRate?: number) => void;
  onBatchPay?: (payments: { assetId: string; amount: number; date: string; customRate?: number; notes?: string }[]) => void;
  onBackToOverview: () => void;
  onOpenRulesModal?: () => void;
}

export const DailyPayChitDashboard: React.FC<DailyPayChitDashboardProps> = ({
  goldAsset,
  silverAsset,
  goldSpotRate: initialGoldRate,
  silverSpotRate: initialSilverRate,
  onRecordDailyPay,
  onRecordDualPay,
  onBatchPay,
  onBackToOverview,
  onOpenRulesModal
}) => {
  const todayStr = getLiveDateString(); // e.g. "2026-10-25"
  const schemeStartDateStr = '2026-10-15'; // Exact user specified start date
  const schemeStartDate = new Date(schemeStartDateStr);
  const minDailyTarget = 100; // ₹100 minimum daily investment target per metal

  // Terminal View Mode: 'terminal' | 'salem_sheet'
  const [activeTerminalTab, setActiveTerminalTab] = useState<'terminal' | 'salem_sheet'>('terminal');

  // Active Metal View Tab: 'combined' | 'gold' | 'silver'
  const [activeMetalTab, setActiveMetalTab] = useState<'combined' | 'gold' | 'silver'>('combined');

  // Calendar View Mode: 'active_horizon' | 'monthly' | 'milestones_300'
  const [calendarViewMode, setCalendarViewMode] = useState<'active_horizon' | 'monthly' | 'milestones_300'>('active_horizon');

  // Live Rates Control State
  const [goldLiveRate, setGoldLiveRate] = useState<number>(initialGoldRate || 7380);
  const [silverLiveRate, setSilverLiveRate] = useState<number>(initialSilverRate || 97.5);
  const [rateMode, setRateMode] = useState<'spot' | 'scheme'>('spot');
  const [isUpdatingRates, setIsUpdatingRates] = useState<boolean>(false);

  // Reminder alert preference
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(true);
  const [reminderTime, setReminderTime] = useState<string>('20:00');

  // Form / Modal State for Quick Deposit
  const [payAmount, setPayAmount] = useState<number>(100);
  const [payDate, setPayDate] = useState<string>(todayStr);
  const [payMetal, setPayMetal] = useState<'gold' | 'silver' | 'dual'>('dual');
  const [payNotes, setPayNotes] = useState<string>('');
  const [isPayModalOpen, setIsPayModalOpen] = useState<boolean>(false);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | null>(null);

  // Passbook Filter State
  const [passbookFilter, setPassbookFilter] = useState<'all' | 'gold' | 'silver'>('all');

  // Calculate days elapsed from 2026-10-15 to today
  const todayDate = new Date(todayStr);
  const daysElapsed = Math.max(
    1,
    Math.floor((todayDate.getTime() - schemeStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
  );

  const totalTenureDays = 300; // 300 deposit days
  const lockInDays = 330; // 330 days maturity lock-in
  const daysRemaining = Math.max(0, totalTenureDays - daysElapsed);

  // Target Reach Projections
  // Day 300 target deposit date: 2026-10-15 + 300 days = 2027-08-11
  const targetReachDate = new Date(schemeStartDate);
  targetReachDate.setDate(schemeStartDate.getDate() + 300);
  const targetReachDateFormatted = targetReachDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  // Day 330 maturity redemption date: 2026-10-15 + 330 days = 2027-09-10
  const maturityDate = new Date(schemeStartDate);
  maturityDate.setDate(schemeStartDate.getDate() + 330);
  const maturityDateFormatted = maturityDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  // 4-Tier Bonus Calculation based on Days Elapsed
  let activeBonusTierPct = 7;
  let activeTierLabel = 'Tier 1: Days 1–75 (+7% Instant Bonus Weight)';
  let activeTierBadge = '+7% Instant Bonus';
  if (daysElapsed > 225) {
    activeBonusTierPct = 1;
    activeTierLabel = 'Tier 4: Days 226–300 (+1% Bonus Weight)';
    activeTierBadge = '+1% Bonus';
  } else if (daysElapsed > 150) {
    activeBonusTierPct = 3;
    activeTierLabel = 'Tier 3: Days 151–225 (+3% Bonus Weight)';
    activeTierBadge = '+3% Bonus';
  } else if (daysElapsed > 75) {
    activeBonusTierPct = 5;
    activeTierLabel = 'Tier 2: Days 76–150 (+5% Bonus Weight)';
    activeTierBadge = '+5% Bonus';
  }

  // Scheme Calculations: Gold
  const goldTransactions: BullionTransaction[] = useMemo(() => {
    return goldAsset?.transactions || [];
  }, [goldAsset]);

  const goldInvested = goldAsset?.investedAmount || 500;
  const goldWeightGrams = goldAsset?.quantity || 0.03954;
  const goldBaseWeightGrams = goldAsset?.schemeDetails?.baseWeightGrams || 0.03696;
  const goldBonusWeightGrams = goldAsset?.schemeDetails?.bonusWeightGrams || 0.00258;
  const goldValuation = Math.round(goldWeightGrams * goldLiveRate);
  const goldTargetToDate = daysElapsed * minDailyTarget; // e.g. 11 * 100 = ₹1,100
  const goldFullTarget = totalTenureDays * minDailyTarget; // ₹30,000

  // Scheme Calculations: Silver
  const silverTransactions: BullionTransaction[] = useMemo(() => {
    return silverAsset?.transactions || [];
  }, [silverAsset]);

  const silverInvested = silverAsset?.investedAmount || 1100;
  const silverWeightGrams = silverAsset?.quantity || 4.95431;
  const silverBaseWeightGrams = silverAsset?.schemeDetails?.baseWeightGrams || 4.65690;
  const silverBonusWeightGrams = silverAsset?.schemeDetails?.bonusWeightGrams || 0.29741;
  const silverValuation = Math.round(silverWeightGrams * silverLiveRate);
  const silverTargetToDate = daysElapsed * minDailyTarget; // e.g. 11 * 100 = ₹1,100
  const silverFullTarget = totalTenureDays * minDailyTarget; // ₹30,000

  // Combined Calculations
  const combinedInvested = goldInvested + silverInvested;
  const combinedValuation = goldValuation + silverValuation;
  const combinedTargetToDate = goldTargetToDate + silverTargetToDate; // e.g. ₹2,200
  const combinedFullTarget = goldFullTarget + silverFullTarget; // ₹60,000
  const combinedTargetDaily = 200; // ₹100 Gold + ₹100 Silver

  // Estimated Total Weight at 300th Day
  const projectedGoldWeight = Number(((30000 / goldLiveRate) * 1.05).toFixed(4)); // ~4.26g
  const projectedSilverWeight = Number(((30000 / silverLiveRate) * 1.05).toFixed(2)); // ~323g

  // Guaranteed Jeweller Perks Savings:
  // 0% VA (Wastage) saves ~15% on 22K gold jewellery (~₹4,500 - ₹5,400) + 0% Making Charges (~₹3,000)
  const estimatedJewellerPerkSavings = Math.round((30000 * 0.15) + (30000 * 0.08) + (30000 * 0.05)); // ~₹8,400+

  // Live Spot Rate adjustment handlers
  const handleRateStep = (metal: 'gold' | 'silver', delta: number) => {
    if (metal === 'gold') {
      setGoldLiveRate(prev => Math.max(1000, Number((prev + delta).toFixed(2))));
    } else {
      setSilverLiveRate(prev => Math.max(10, Number((prev + delta).toFixed(2))));
    }
  };

  const handleResetRates = () => {
    setIsUpdatingRates(true);
    setGoldLiveRate(7380);
    setSilverLiveRate(97.5);
    setTimeout(() => setIsUpdatingRates(false), 250);
  };

  // Generate Calendar Matrix (From 2026-10-15 onwards)
  const calendarDays = useMemo(() => {
    const list = [];
    const numDaysToShow = calendarViewMode === 'milestones_300' ? 300 : Math.max(30, daysElapsed + 5);

    for (let i = 0; i < numDaysToShow; i++) {
      const d = new Date(schemeStartDate);
      d.setDate(schemeStartDate.getDate() + i);
      const dateString = d.toISOString().split('T')[0];
      const dayNum = i + 1;
      const isPastOrToday = dateString <= todayStr;
      const isToday = dateString === todayStr;

      // Transactions on this date for Gold and Silver
      const goldTxs = goldTransactions.filter(t => t.date === dateString);
      const goldPaid = goldTxs.reduce((acc, t) => acc + t.amount, 0);
      const goldGrams = goldTxs.reduce((acc, t) => acc + t.weightGrams + (t.bonusWeightGrams || 0), 0);
      const isGoldMet = goldPaid >= minDailyTarget;

      const silverTxs = silverTransactions.filter(t => t.date === dateString);
      const silverPaid = silverTxs.reduce((acc, t) => acc + t.amount, 0);
      const silverGrams = silverTxs.reduce((acc, t) => acc + t.weightGrams + (t.bonusWeightGrams || 0), 0);
      const isSilverMet = silverPaid >= minDailyTarget;

      const isDualMet = isGoldMet && isSilverMet;
      const totalPaidOnDate = goldPaid + silverPaid;

      // Missed status: date is before today and target was NOT met
      const isGoldMissed = isPastOrToday && !isToday && !isGoldMet;
      const isSilverMissed = isPastOrToday && !isToday && !isSilverMet;
      const isAnyMissed = isGoldMissed || isSilverMissed;

      list.push({
        dayNum,
        dateString,
        dateFormatted: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        weekday: d.toLocaleDateString('en-GB', { weekday: 'short' }),
        isToday,
        isPastOrToday,
        goldPaid,
        goldGrams,
        isGoldMet,
        silverPaid,
        silverGrams,
        isSilverMet,
        isDualMet,
        totalPaidOnDate,
        isGoldMissed,
        isSilverMissed,
        isAnyMissed
      });
    }
    return list;
  }, [schemeStartDate, todayStr, goldTransactions, silverTransactions, daysElapsed, calendarViewMode]);

  // Automated Missed / Skipped Days Detection
  const missedDaysList = useMemo(() => {
    return calendarDays.filter(d => d.isPastOrToday && !d.isToday && (d.isGoldMissed || d.isSilverMissed));
  }, [calendarDays]);

  const totalMissedCount = missedDaysList.length;
  const missedGoldCount = calendarDays.filter(d => d.isPastOrToday && !d.isToday && d.isGoldMissed).length;
  const missedSilverCount = calendarDays.filter(d => d.isPastOrToday && !d.isToday && d.isSilverMissed).length;
  const missedGoldDeficit = missedGoldCount * minDailyTarget;
  const missedSilverDeficit = missedSilverCount * minDailyTarget;
  const totalCatchUpAmount = missedGoldDeficit + missedSilverDeficit;

  // Today's Payment Status
  const todayRecord = calendarDays.find(d => d.isToday);
  const isTodayGoldPaid = todayRecord ? todayRecord.isGoldMet : false;
  const isTodaySilverPaid = todayRecord ? todayRecord.isSilverMet : false;
  const isTodayDualPaid = isTodayGoldPaid && isTodaySilverPaid;

  // Quick Pay Submit Handler
  const handleExecutePayment = (
    metalType: 'gold' | 'silver' | 'dual',
    amount: number,
    targetDate?: string
  ) => {
    const effectiveDate = targetDate || payDate;
    const currentRate = metalType === 'silver' ? silverLiveRate : goldLiveRate;

    if (metalType === 'dual') {
      const half = amount / 2;
      if (onRecordDualPay) {
        onRecordDualPay(half, half, effectiveDate, `Dual Pay Chit • ₹${half} Gold + ₹${half} Silver`, goldLiveRate, silverLiveRate);
      } else {
        onRecordDailyPay('pothys-digi-gold', half, effectiveDate, `Day #${daysElapsed} Gold Target Met`, goldLiveRate);
        onRecordDailyPay('pothys-digi-silver', half, effectiveDate, `Day #${daysElapsed} Silver Target Met`, silverLiveRate);
      }
    } else {
      const targetAssetId = metalType === 'silver' ? 'pothys-digi-silver' : 'pothys-digi-gold';
      const doc = `APP27SCTM/${metalType.toUpperCase()}-DAY-${daysElapsed}`;
      const notes = `Pothys ${metalType === 'silver' ? '999 Pure Silver' : '22K Gold'} Saving Plan • Day #${daysElapsed} (₹${amount} deposited)`;
      onRecordDailyPay(targetAssetId, amount, effectiveDate, notes, currentRate, doc);
    }

    setIsPayModalOpen(false);
  };

  // 1-Click Batch Catch-Up Handler
  const handleClearAllMissedDays = () => {
    if (missedDaysList.length === 0) return;

    if (onBatchPay) {
      const batchItems: { assetId: string; amount: number; date: string; customRate?: number; notes?: string }[] = [];
      missedDaysList.forEach(item => {
        if (item.isGoldMissed) {
          batchItems.push({
            assetId: 'pothys-digi-gold',
            amount: 100,
            date: item.dateString,
            customRate: goldLiveRate,
            notes: `Catch-Up: Day #${item.dayNum} Gold Backlog Paid (+${activeBonusTierPct}% Bonus)`
          });
        }
        if (item.isSilverMissed) {
          batchItems.push({
            assetId: 'pothys-digi-silver',
            amount: 100,
            date: item.dateString,
            customRate: silverLiveRate,
            notes: `Catch-Up: Day #${item.dayNum} Silver Backlog Paid (+${activeBonusTierPct}% Bonus)`
          });
        }
      });
      onBatchPay(batchItems);
    } else {
      // Fallback sequential
      missedDaysList.forEach(item => {
        if (item.isGoldMissed) {
          onRecordDailyPay('pothys-digi-gold', 100, item.dateString, `Catch-Up Day #${item.dayNum}`, goldLiveRate);
        }
        if (item.isSilverMissed) {
          onRecordDailyPay('pothys-digi-silver', 100, item.dateString, `Catch-Up Day #${item.dayNum}`, silverLiveRate);
        }
      });
    }
  };

  const handleOpenDayPay = (dayNum: number, dateString: string, metal: 'gold' | 'silver' | 'dual' = 'dual') => {
    setSelectedDayNumber(dayNum);
    setPayDate(dateString);
    setPayMetal(metal);
    setPayAmount(metal === 'dual' ? 200 : 100);
    setIsPayModalOpen(true);
  };

  // All Bullion Transactions merged for Passbook
  const allTransactions = useMemo(() => {
    const goldList = (goldAsset?.transactions || []).map(t => ({ ...t, metal: 'gold' as const, assetName: '22K Gold' }));
    const silverList = (silverAsset?.transactions || []).map(t => ({ ...t, metal: 'silver' as const, assetName: '999 Pure Silver' }));
    const merged = [...goldList, ...silverList];
    merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return merged.filter(t => passbookFilter === 'all' || t.metal === passbookFilter);
  }, [goldAsset, silverAsset, passbookFilter]);

  // Live Conversion Ticker values for ₹100 Target
  const goldGramsPer100 = Number(((100 / goldLiveRate) * (1 + activeBonusTierPct / 100)).toFixed(5));
  const silverGramsPer100 = Number(((100 / silverLiveRate) * (1 + activeBonusTierPct / 100)).toFixed(4));

  return (
    <div className="space-y-7 animate-fade-in pb-16 perspective-1000">
      {/* 0. TOP VIEW MODE SWITCHER */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-[#0B101D] border border-slate-800 shadow-xl">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTerminalTab('terminal')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 active:scale-95 ${
              activeTerminalTab === 'terminal'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Daily Pay Terminal (₹100 Target)</span>
          </button>

          <button
            onClick={() => setActiveTerminalTab('salem_sheet')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 active:scale-95 ${
              activeTerminalTab === 'salem_sheet'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-400" />
            <span>Official Salem Gold Sheet & Scheme Rates</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
              Live Salem
            </span>
          </button>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-amber-300 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Salem Market: 22K ₹{goldLiveRate.toLocaleString('en-IN')}/g · Silver ₹{silverLiveRate.toFixed(2)}/g</span>
        </div>
      </div>

      {activeTerminalTab === 'salem_sheet' ? (
        <SalemGoldSchemeSheet
          goldAsset={goldAsset}
          silverAsset={silverAsset}
          onRecordDailyPay={onRecordDailyPay}
          onRecordDualPay={onRecordDualPay}
          onOpenQuickDeposit={(dayNum, dateStr, metal) => {
            handleOpenDayPay(dayNum, dateStr, metal);
          }}
        />
      ) : (
        <>
          {/* 1. TOP HEADER BANNER */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1F190B] via-[#10172D] to-[#080D1A] border border-amber-500/40 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative overflow-hidden">
            {/* Glow background blooms */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-2 relative z-10">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={onBackToOverview}
                  className="px-3 py-1 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center gap-1.5 active:scale-95"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Investments</span>
                </button>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 flex items-center gap-1.5 shadow-md">
                  <Award className="w-3.5 h-3.5" />
                  Daily Pay Chit Terminal (APP27SCTM)
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Start: 15-Oct-2026
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  {activeTierBadge} (Days 1–75)
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                <Coins className="w-7 h-7 text-amber-400 animate-pulse" />
                <span>Pothys Swarna Mahal — Dual Gold & Silver Daily Chit</span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                Target: <strong className="text-amber-300 font-bold">₹100 Gold + ₹100 Silver Daily</strong> starting{' '}
                <strong className="text-white">15-Oct-2026</strong>. 300 deposit days with{' '}
                <strong className="text-emerald-400 font-bold">+7% instant weight bonus</strong> and{' '}
                <strong className="text-amber-300 font-bold">guaranteed 0% Wastage (VA) & 0% Making Charges</strong> on physical redemption.
              </p>
            </div>

            {/* Quick Header Actions */}
            <div className="flex flex-wrap items-center gap-3 relative z-10">
              <button
                onClick={() => setActiveTerminalTab('salem_sheet')}
                className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/40 transition flex items-center space-x-1.5 active:scale-95 shadow-md"
                title="Open Salem Showroom Scheme Passbook Sheet"
              >
                <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                <span>Salem Scheme Sheet</span>
              </button>

              <button
                onClick={() => handleExecutePayment('dual', 200, todayStr)}
                className="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 transition shadow-lg shadow-amber-500/20 flex items-center space-x-1.5 active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>⚡ Pay Dual Combo (₹200)</span>
              </button>

              <button
                onClick={() => {
                  setPayMetal('gold');
                  setPayAmount(100);
                  setIsPayModalOpen(true);
                }}
                className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition flex items-center space-x-1.5 active:scale-95"
              >
                <Coins className="w-4 h-4 text-amber-400" />
                <span>Pay Gold (₹100)</span>
              </button>

              <button
                onClick={() => {
                  setPayMetal('silver');
                  setPayAmount(100);
                  setIsPayModalOpen(true);
                }}
                className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 transition flex items-center space-x-1.5 active:scale-95"
              >
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Pay Silver (₹100)</span>
              </button>
            </div>
          </div>

      {/* 2. LIVE GOLD & SILVER SPOT RATE COMMAND & CONVERTER BAR */}
      <div className="p-5 rounded-2xl bg-[#0B101D] border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Live Bullion Spot & Scheme Booking Rates
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={handleResetRates}
              className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition ${isUpdatingRates ? 'animate-spin' : ''}`}
              title="Reset Live Spot Rates"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400 font-mono text-[11px]">Dynamic Grams Valuation</span>
          </div>
        </div>

        {/* Live Rates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card A: 22K Gold Rate */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#1C1709] to-[#0E1528] border border-amber-500/40 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                22K Gold Live Rate
              </span>
              <div className="text-xl font-black text-white font-mono tracking-tight mt-0.5">
                ₹{goldLiveRate.toLocaleString('en-IN')} <span className="text-[10px] text-slate-400 font-normal">/ gram</span>
              </div>
              <span className="text-[10px] text-amber-300 font-medium mt-0.5 block">
                ₹100 Target = <strong className="text-emerald-400 font-bold">{goldGramsPer100}g</strong> (+7% bonus)
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <button
                onClick={() => handleRateStep('gold', 10)}
                className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              >
                +₹10
              </button>
              <button
                onClick={() => handleRateStep('gold', -10)}
                className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              >
                -₹10
              </button>
            </div>
          </div>

          {/* Card B: 999 Silver Rate */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#0B1A24] to-[#0A1220] border border-cyan-500/40 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">
                999 Pure Silver Live Rate
              </span>
              <div className="text-xl font-black text-white font-mono tracking-tight mt-0.5">
                ₹{silverLiveRate.toFixed(2)} <span className="text-[10px] text-slate-400 font-normal">/ gram</span>
              </div>
              <span className="text-[10px] text-cyan-300 font-medium mt-0.5 block">
                ₹100 Target = <strong className="text-emerald-400 font-bold">{silverGramsPer100}g</strong> (+7% bonus)
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <button
                onClick={() => handleRateStep('silver', 0.50)}
                className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              >
                +₹0.5
              </button>
              <button
                onClick={() => handleRateStep('silver', -0.50)}
                className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              >
                -₹0.5
              </button>
            </div>
          </div>

          {/* Card C: Dual Target Pace */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Daily Target Outlay
            </span>
            <div className="text-xl font-black text-emerald-400 font-mono tracking-tight">
              ₹200 <span className="text-xs text-slate-400 font-normal">/ day (Dual Combo)</span>
            </div>
            <span className="text-[10px] text-slate-400">
              ₹100 Gold + ₹100 Silver for 300 Days
            </span>
          </div>

          {/* Card D: Guaranteed Jeweller Perks Value */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#1A1409] to-[#0A0D15] border border-amber-500/30 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                0% VA & MC Benefit
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-200">
                Day 330
              </span>
            </div>
            <div className="text-xl font-black text-amber-300 font-mono tracking-tight">
              +{formatCurrency(estimatedJewellerPerkSavings)}
            </div>
            <span className="text-[10px] text-slate-400">
              0% Wastage + 0% Making Charges Guaranteed
            </span>
          </div>
        </div>
      </div>

      {/* 3. MISSED DAYS & SKIPPED DAYS REMINDER / CATCH-UP ALERT BANNER */}
      {totalMissedCount > 0 && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-[#1F1015] to-[#14080D] border border-rose-500/40 shadow-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                <AlertCircle className="w-5 h-5 text-rose-400 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black uppercase tracking-wider text-rose-300">
                    Missed Daily Chit Deposit Reminder
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-200 border border-rose-500/40">
                    {totalMissedCount} Days Skipped
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  You have skipped days since start date <strong>15-Oct-2026</strong>. Outstanding Backlog:{' '}
                  <strong className="text-rose-300 font-bold">{formatCurrency(totalCatchUpAmount)}</strong>{' '}
                  (Gold: {formatCurrency(missedGoldDeficit)} • Silver: {formatCurrency(missedSilverDeficit)}).
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleClearAllMissedDays}
                className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 transition shadow-lg shadow-rose-500/20 flex items-center gap-1.5 active:scale-95"
              >
                <Flame className="w-4 h-4" />
                <span>⚡ 1-Click Catch-Up: Pay All Missed ({formatCurrency(totalCatchUpAmount)})</span>
              </button>
            </div>
          </div>

          {/* Skipped dates chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-rose-500/20 text-[11px]">
            <span className="text-slate-400 font-medium">Skipped Dates:</span>
            {missedDaysList.slice(0, 10).map(d => (
              <button
                key={d.dateString}
                onClick={() => handleOpenDayPay(d.dayNum, d.dateString, 'dual')}
                className="px-2 py-0.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono transition flex items-center gap-1"
                title={`Pay backlog for ${d.dateFormatted}`}
              >
                <span>Day {d.dayNum} ({d.dateFormatted})</span>
                <Plus className="w-3 h-3 text-rose-400" />
              </button>
            ))}
            {missedDaysList.length > 10 && (
              <span className="text-slate-500 text-[10px]">+{missedDaysList.length - 10} more</span>
            )}
          </div>
        </div>
      )}

      {/* 4. EXECUTIVE 5-KPI STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 perspective-1000">
        {/* Card 1: Today's Status */}
        <ScrollReveal animation="fade-up" delay={50}>
          <Card3D glowColor={isTodayDualPaid ? 'emerald' : 'amber'} className="h-full">
            <div className={`p-5 rounded-2xl bg-slate-900/80 border backdrop-blur-xl shadow-xl h-full flex flex-col justify-between transition-colors group ${
              isTodayDualPaid ? 'border-emerald-500/40' : 'border-amber-500/40'
            }`}>
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold tracking-wide uppercase text-slate-300">Today's Target</span>
                <div className={`p-2 rounded-xl border ${
                  isTodayDualPaid ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                }`}>
                  {isTodayDualPaid ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                </div>
              </div>
              <div>
                <div className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>{isTodayDualPaid ? 'Target Met!' : 'Pending Deposit'}</span>
                </div>
                <div className="mt-2 space-y-1 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Gold ₹100:</span>
                    <span className={isTodayGoldPaid ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                      {isTodayGoldPaid ? '✓ Paid' : '⏳ Due'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Silver ₹100:</span>
                    <span className={isTodaySilverPaid ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                      {isTodaySilverPaid ? '✓ Paid' : '⏳ Due'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                {!isTodayDualPaid ? (
                  <button
                    onClick={() => handleExecutePayment('dual', 200, todayStr)}
                    className="w-full py-1.5 rounded-lg text-xs font-extrabold bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 transition flex items-center justify-center gap-1 active:scale-95 shadow-md shadow-amber-500/20"
                  >
                    <span>+ Pay ₹200 Today</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-emerald-400 font-bold flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Streak Active</span>
                  </span>
                )}
              </div>
            </div>
          </Card3D>
        </ScrollReveal>

        {/* Card 2: 300-Day Journey Progress */}
        <ScrollReveal animation="fade-up" delay={100}>
          <Card3D glowColor="amber" className="h-full">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl shadow-xl h-full flex flex-col justify-between hover:border-amber-500/50 transition-colors group">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold tracking-wide uppercase text-slate-300">Days Timeline</span>
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-amber-300 tracking-tight font-mono">
                  Day {daysElapsed} <span className="text-xs font-normal text-slate-400">/ 300 Days</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {daysRemaining} deposit days remaining
                </p>
                <div className="mt-2 text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{activeTierBadge} (Day 1 to 75)</span>
                </div>
              </div>
              <div className="mt-3 w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, (daysElapsed / 300) * 100)}%` }}
                />
              </div>
            </div>
          </Card3D>
        </ScrollReveal>

        {/* Card 3: 22K Gold Reserves */}
        <ScrollReveal animation="fade-up" delay={150}>
          <Card3D glowColor="amber" className="h-full">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/30 backdrop-blur-xl shadow-xl h-full flex flex-col justify-between hover:border-amber-500/60 transition-colors group">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold tracking-wide uppercase text-amber-300">22K Gold Accumulated</span>
                <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/25 text-amber-400">
                  <Coins className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-white tracking-tight font-mono">
                  {goldWeightGrams.toFixed(5)} <span className="text-xs text-amber-300 font-normal">gms</span>
                </div>
                <div className="mt-1 flex items-baseline justify-between text-xs font-mono">
                  <span className="text-slate-400">Value:</span>
                  <span className="text-emerald-400 font-bold">{formatCurrency(goldValuation)}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Base: {goldBaseWeightGrams.toFixed(4)}g + Bonus: <strong className="text-emerald-400">+{goldBonusWeightGrams.toFixed(4)}g</strong>
                </div>
              </div>
              <div className="mt-3 text-[10px] text-slate-500 font-mono flex justify-between border-t border-slate-800 pt-1.5">
                <span>Invested: {formatCurrency(goldInvested)}</span>
                <span>Target: ₹30k</span>
              </div>
            </div>
          </Card3D>
        </ScrollReveal>

        {/* Card 4: 999 Pure Silver Reserves */}
        <ScrollReveal animation="fade-up" delay={200}>
          <Card3D glowColor="cyan" className="h-full">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-xl shadow-xl h-full flex flex-col justify-between hover:border-cyan-500/60 transition-colors group">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold tracking-wide uppercase text-cyan-300">999 Silver Accumulated</span>
                <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/25 text-cyan-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-white tracking-tight font-mono">
                  {silverWeightGrams.toFixed(3)} <span className="text-xs text-cyan-300 font-normal">gms</span>
                </div>
                <div className="mt-1 flex items-baseline justify-between text-xs font-mono">
                  <span className="text-slate-400">Value:</span>
                  <span className="text-emerald-400 font-bold">{formatCurrency(silverValuation)}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Base: {silverBaseWeightGrams.toFixed(3)}g + Bonus: <strong className="text-emerald-400">+{silverBonusWeightGrams.toFixed(3)}g</strong>
                </div>
              </div>
              <div className="mt-3 text-[10px] text-slate-500 font-mono flex justify-between border-t border-slate-800 pt-1.5">
                <span>Invested: {formatCurrency(silverInvested)}</span>
                <span>Target: ₹30k</span>
              </div>
            </div>
          </Card3D>
        </ScrollReveal>

        {/* Card 5: Target Reach Projections */}
        <ScrollReveal animation="fade-up" delay={250}>
          <Card3D glowColor="indigo" className="h-full">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl shadow-xl h-full flex flex-col justify-between hover:border-indigo-500/50 transition-colors group">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold tracking-wide uppercase text-slate-300">Target Reach Time</span>
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-base font-black text-white font-mono tracking-tight">
                  {targetReachDateFormatted}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Day 300 Completion Date
                </p>
                <div className="mt-2 text-xs text-amber-300 font-mono">
                  Redemption: {maturityDateFormatted}
                </div>
                <div className="text-[10px] text-slate-400">
                  Day 330 (0% Wastage / 0% MC)
                </div>
              </div>
              <div className="mt-3 w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-400 h-full rounded-full w-full" />
              </div>
            </div>
          </Card3D>
        </ScrollReveal>
      </div>

      {/* 5. 4-TIER BONUS STRUCTURE SCHEDULE BANNER */}
      <div className="p-5 rounded-2xl bg-[#0B101D] border border-amber-500/30 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
              Official Pothys Swarna Mahal 4-Tier Weight Bonus Schedule
            </h3>
          </div>
          <span className="text-[11px] text-amber-300 font-mono">Current Position: Day {daysElapsed} (Tier 1: +7%)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {[
            { tier: 'Tier 1', days: 'Days 1–75', bonus: '+7% Instant Bonus Weight', active: daysElapsed <= 75, color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300' },
            { tier: 'Tier 2', days: 'Days 76–150', bonus: '+5% Instant Bonus Weight', active: daysElapsed > 75 && daysElapsed <= 150, color: 'border-amber-500/30 bg-slate-900 text-amber-300' },
            { tier: 'Tier 3', days: 'Days 151–225', bonus: '+3% Instant Bonus Weight', active: daysElapsed > 150 && daysElapsed <= 225, color: 'border-slate-800 bg-slate-900 text-slate-300' },
            { tier: 'Tier 4', days: 'Days 226–300', bonus: '+1% Instant Bonus Weight', active: daysElapsed > 225, color: 'border-slate-800 bg-slate-900 text-slate-400' }
          ].map(t => (
            <div key={t.tier} className={`p-3 rounded-xl border flex flex-col justify-between space-y-1 ${t.color}`}>
              <div className="flex items-center justify-between">
                <span className="font-extrabold uppercase text-[10px]">{t.tier} ({t.days})</span>
                {t.active && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-emerald-400 text-slate-950">
                    Active Now
                  </span>
                )}
              </div>
              <span className="text-sm font-black font-mono">{t.bonus}</span>
              <p className="text-[10px] text-slate-400">Credited instantly to passbook on every deposit</p>
            </div>
          ))}
        </div>
      </div>

      {/* 6. INTERACTIVE CALENDAR MATRIX & STREAK GRID */}
      <div className="p-6 rounded-2xl bg-[#0C1222]/95 border border-slate-800 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <CalendarDays className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-extrabold text-white">
                300-Day Deposit Calendar & Daily Streak Matrix
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Started on <strong className="text-white">15-Oct-2026</strong>. Click any day to view deposit voucher or pay missed target.
            </p>
          </div>

          {/* View mode switcher */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'active_horizon', label: 'Active Horizon (30 Days)' },
              { id: 'monthly', label: 'Monthly Grid' },
              { id: 'milestones_300', label: 'Full 300 Days' }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setCalendarViewMode(m.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  calendarViewMode === m.id
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/50" />
            <span className="text-slate-300">Target Met (Paid)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-amber-500/30 border border-amber-400 animate-pulse" />
            <span className="text-amber-300 font-bold">Today (Active)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-rose-500/20 border border-rose-500/40" />
            <span className="text-rose-300">Missed Day (Deficit)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-slate-900 border border-slate-800" />
            <span className="text-slate-500">Upcoming Days</span>
          </div>
        </div>

        {/* Calendar Day Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-10 gap-2.5 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
          {calendarDays.map(day => {
            const isToday = day.isToday;
            const isTargetMet = activeMetalTab === 'gold' ? day.isGoldMet : activeMetalTab === 'silver' ? day.isSilverMet : day.isDualMet;
            const isMissed = activeMetalTab === 'gold' ? day.isGoldMissed : activeMetalTab === 'silver' ? day.isSilverMissed : day.isAnyMissed;

            let cardBg = 'bg-slate-900/60 border-slate-800 text-slate-500';
            if (isToday) {
              cardBg = isTargetMet
                ? 'bg-emerald-950/60 border-emerald-400 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/30 text-white'
                : 'bg-amber-950/60 border-amber-400 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/40 text-white animate-pulse';
            } else if (isTargetMet) {
              cardBg = 'bg-emerald-950/30 border-emerald-500/40 hover:border-emerald-400 text-emerald-200';
            } else if (isMissed) {
              cardBg = 'bg-rose-950/20 border-rose-500/30 hover:border-rose-400 text-rose-300';
            }

            return (
              <div
                key={day.dayNum}
                onClick={() => handleOpenDayPay(day.dayNum, day.dateString, activeMetalTab === 'combined' ? 'dual' : activeMetalTab)}
                className={`p-2.5 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-1.5 group select-none ${cardBg}`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-mono font-bold">Day {day.dayNum}</span>
                  <span className="text-slate-400">{day.weekday}</span>
                </div>

                <div className="text-xs font-black">
                  {day.dateFormatted}
                </div>

                {/* Day status pill */}
                <div className="pt-1 border-t border-slate-800/80 text-[10px] font-mono flex items-center justify-between">
                  {isTargetMet ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                      <Check className="w-3 h-3" />
                      ₹{day.totalPaidOnDate}
                    </span>
                  ) : isMissed ? (
                    <span className="text-rose-400 font-bold">
                      ⚠️ Skip
                    </span>
                  ) : isToday ? (
                    <span className="text-amber-400 font-bold">
                      + Pay
                    </span>
                  ) : (
                    <span className="text-slate-600 font-medium">₹100</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. COMBINED PASSBOOK & TRANSACTION AUDIT LEDGER */}
      <div className="p-6 rounded-2xl bg-[#0C1222]/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-extrabold text-white">
                Official Chit Passbook & Weight Bonus Ledger
              </h3>
              <p className="text-xs text-slate-400">
                Detailed record of every deposit voucher with voucher code, rate, base weight, and bonus credit.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Deposits' },
              { id: 'gold', label: '22K Gold' },
              { id: 'silver', label: '999 Pure Silver' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setPassbookFilter(f.id as any)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                  passbookFilter === f.id
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Metal / Plan</th>
                <th className="py-2.5 px-3">Voucher Doc No</th>
                <th className="py-2.5 px-3">Amount Deposited</th>
                <th className="py-2.5 px-3">Rate (₹/g)</th>
                <th className="py-2.5 px-3">Base Weight</th>
                <th className="py-2.5 px-3">Bonus Weight (+7%)</th>
                <th className="py-2.5 px-3">Total Weight Credited</th>
                <th className="py-2.5 px-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {allTransactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500 font-sans">
                    No deposit transactions logged yet. Click "+ Pay Today's Target" to start your passbook!
                  </td>
                </tr>
              ) : (
                allTransactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-900/60 transition">
                    <td className="py-3 px-3 text-slate-300">{tx.date}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tx.metal === 'gold' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      }`}>
                        {tx.assetName}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">{tx.docNo || '—'}</td>
                    <td className="py-3 px-3 text-white font-bold">{formatCurrency(tx.amount)}</td>
                    <td className="py-3 px-3 text-slate-300">₹{tx.rate}</td>
                    <td className="py-3 px-3 text-slate-400">{tx.weightGrams.toFixed(4)}g</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">
                      +{tx.bonusWeightGrams ? tx.bonusWeightGrams.toFixed(4) : '0'}g ({tx.bonusPercentage || 7}%)
                    </td>
                    <td className="py-3 px-3 text-amber-300 font-black">
                      {(tx.weightGrams + (tx.bonusWeightGrams || 0)).toFixed(4)}g
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-sans text-[11px] truncate max-w-xs">
                      {tx.notes || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}

      {/* 8. MODAL: QUICK DEPOSIT TERMINAL */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0C1222] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#080D1A]">
              <div className="flex items-center space-x-2">
                <Coins className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-extrabold text-white">
                  Record Daily Chit Deposit {selectedDayNumber ? `(Day #${selectedDayNumber})` : ''}
                </h3>
              </div>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 text-xs">
              {/* Metal selector */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold">Select Metal Plan</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPayMetal('dual');
                      setPayAmount(200);
                    }}
                    className={`py-2 px-3 rounded-xl font-bold border transition ${
                      payMetal === 'dual'
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black border-amber-400'
                        : 'bg-slate-900 text-slate-300 border-slate-800'
                    }`}
                  >
                    ⭐ Dual Combo (₹200)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPayMetal('gold');
                      setPayAmount(100);
                    }}
                    className={`py-2 px-3 rounded-xl font-bold border transition ${
                      payMetal === 'gold'
                        ? 'bg-amber-500 text-slate-950 font-black border-amber-400'
                        : 'bg-slate-900 text-slate-300 border-slate-800'
                    }`}
                  >
                    👑 22K Gold (₹100)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPayMetal('silver');
                      setPayAmount(100);
                    }}
                    className={`py-2 px-3 rounded-xl font-bold border transition ${
                      payMetal === 'silver'
                        ? 'bg-cyan-500 text-slate-950 font-black border-cyan-400'
                        : 'bg-slate-900 text-slate-300 border-slate-800'
                    }`}
                  >
                    🥈 999 Silver (₹100)
                  </button>
                </div>
              </div>

              {/* Amount Presets */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold">Deposit Amount (₹)</label>
                <div className="flex items-center space-x-2">
                  {[100, 200, 500, 1000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setPayAmount(amt)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border ${
                        payAmount === amt
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="50"
                  value={payAmount}
                  onChange={e => setPayAmount(Number(e.target.value))}
                  className="w-full mt-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold">Deposit Date</label>
                <input
                  type="date"
                  value={payDate}
                  onChange={e => setPayDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Live Conversion Preview */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-1 text-slate-300">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Rate Applied:</span>
                  <span className="font-mono text-white">
                    {payMetal === 'silver' ? `₹${silverLiveRate}/g` : `₹${goldLiveRate}/g`}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Bonus Percentage:</span>
                  <span className="font-mono text-emerald-400 font-bold">+{activeBonusTierPct}% Instant Weight</span>
                </div>
                <div className="flex justify-between text-xs pt-1 border-t border-slate-800">
                  <span className="font-bold text-white">Credit Weight:</span>
                  <span className="font-mono text-amber-300 font-black">
                    {payMetal === 'silver'
                      ? `${((payAmount / silverLiveRate) * 1.07).toFixed(4)}g Silver`
                      : payMetal === 'gold'
                      ? `${((payAmount / goldLiveRate) * 1.07).toFixed(5)}g Gold`
                      : `${((100 / goldLiveRate) * 1.07).toFixed(5)}g Gold + ${((100 / silverLiveRate) * 1.07).toFixed(4)}g Silver`}
                  </span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleExecutePayment(payMetal, payAmount, payDate)}
                  className="px-5 py-2 rounded-xl font-extrabold bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:from-amber-400 hover:to-yellow-400 transition shadow-lg shadow-amber-500/20 active:scale-95"
                >
                  Confirm & Deposit ₹{payAmount}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
