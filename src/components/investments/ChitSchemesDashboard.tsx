import React, { useState } from 'react';
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
  ChevronRight,
  Coins,
  FileText,
  Search,
  Receipt,
  Calendar,
  CreditCard,
  X,
  ShieldCheck,
  AlertCircle,
  Filter,
  Layers,
  TrendingUp,
  Percent,
  Bookmark,
  Bell,
  Check,
  Zap,
  MapPin
} from 'lucide-react';
import { InvestmentAsset, InvestmentCategory, BullionTransaction } from '../../types';
import { useLifeOS } from '../../context/LifeOSContext';
import { getLiveDateString } from '../../utils/date-utils';

const formatCurrency = (val: number) => `₹${Math.round(val || 0).toLocaleString('en-IN')}`;

interface ChitSchemesDashboardProps {
  chitSchemes: InvestmentAsset[];
  onPayChitQuick?: (asset: InvestmentAsset) => void;
  onOpenAddModal?: (category?: InvestmentCategory) => void;
  onOpenEditModal?: (asset: InvestmentAsset) => void;
  onDeleteInvestment?: (id: string) => void;
  onBackToOverview?: () => void;
}

export const ChitSchemesDashboard: React.FC<ChitSchemesDashboardProps> = ({
  chitSchemes,
  onPayChitQuick,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteInvestment,
  onBackToOverview
}) => {
  const {
    navigateToTab,
    addInvestment,
    updateInvestment,
    deleteInvestment: contextDeleteInvestment,
    payChitInstallment,
    logChitInstallmentPayment,
    deleteChitVoucher,
    triggerConfetti
  } = useLifeOS();

  // Separate Monitoring Filter & Search State
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'offline' | 'digi_bullion' | 'jeweller' | 'chit_fund' | 'active' | 'matured'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Built-in CRUD Modals State
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [editingChit, setEditingChit] = useState<InvestmentAsset | null>(null);
  const [paymentModalChit, setPaymentModalChit] = useState<InvestmentAsset | null>(null);
  const [passbookModalChit, setPassbookModalChit] = useState<InvestmentAsset | null>(null);
  const [deletingChit, setDeletingChit] = useState<InvestmentAsset | null>(null);

  // Enroll / Edit Form Fields
  const [formCategory, setFormCategory] = useState<'gold_chit' | 'silver_chit' | 'offline_chit' | 'digi_gold' | 'other'>('offline_chit');
  const [formName, setFormName] = useState('');
  const [formPlatform, setFormPlatform] = useState('Offline Local Committee');
  const [formSymbolOrCode, setFormSymbolOrCode] = useState('');
  const [formMonthlyAmount, setFormMonthlyAmount] = useState<number | string>(1000);
  const [formTenureMonths, setFormTenureMonths] = useState<number | string>(12);
  const [formMonthsPaid, setFormMonthsPaid] = useState<number | string>(1);
  const [formDueDay, setFormDueDay] = useState<number | string>(14);
  const [formAccumulatedGrams, setFormAccumulatedGrams] = useState<number | string>('');
  const [formMaturityBonus, setFormMaturityBonus] = useState<number | string>(1000);
  const [formStartDate, setFormStartDate] = useState('2026-10-14');
  const [formMaturityDate, setFormMaturityDate] = useState('');
  const [formStatus, setFormStatus] = useState<'active' | 'matured'>('active');
  const [formNotes, setFormNotes] = useState('');

  // Payment Recording Form Fields
  const [payDate, setPayDate] = useState(getLiveDateString());
  const [payAmount, setPayAmount] = useState<number | string>(1000);
  const [payMethod, setPayMethod] = useState('Cash (Physical Counterfoil)');
  const [payDocNo, setPayDocNo] = useState('');
  const [payGrams, setPayGrams] = useState<number | string>('');
  const [payNotes, setPayNotes] = useState('');

  // Open Enroll Modal with smart presets
  const handleOpenEnrollModal = (presetCategory: 'gold_chit' | 'silver_chit' | 'offline_chit' | 'other' = 'offline_chit') => {
    setFormCategory(presetCategory);
    if (presetCategory === 'offline_chit') {
      setFormName('Offline Monthly Chit (₹1,000 / 14-Oct)');
      setFormPlatform('Offline Physical Chit / Local Committee (Salem)');
      setFormSymbolOrCode('OFFLINE-CHIT-1000');
      setFormMonthlyAmount(1000);
      setFormTenureMonths(12);
      setFormMonthsPaid(1);
      setFormDueDay(14);
      setFormAccumulatedGrams('');
      setFormMaturityBonus(1000);
      setFormStartDate('2026-10-14');
      setFormMaturityDate('2027-10-14');
      setFormNotes('Offline physical savings chit fund started on 14-Oct-2026. Monthly installment ₹1,000 due on 14th of every month. Month #1 paid on 14-Oct-2026.');
    } else if (presetCategory === 'gold_chit') {
      setFormName('GRT Jewellers — Golden Eleven (11-Month Gold Scheme)');
      setFormPlatform('GRT Jewellers');
      setFormSymbolOrCode('GRT-GE-90812');
      setFormMonthlyAmount(2000);
      setFormTenureMonths(11);
      setFormMonthsPaid(6);
      setFormDueDay(10);
      setFormAccumulatedGrams('2.012');
      setFormMaturityBonus(2000);
      setFormStartDate('2026-05-10');
      setFormMaturityDate('2027-04-10');
      setFormNotes('11 monthly installments of ₹2,000. 12th month paid as bonus (+₹2,000 credit). 0% Wastage / VA charges up to 18%.');
    } else if (presetCategory === 'silver_chit') {
      setFormName('Lalitha Thanga Maligai — 11-Month Silver Jewel Scheme');
      setFormPlatform('Lalitha Thanga Maligai');
      setFormSymbolOrCode('LTM-SLV-44102');
      setFormMonthlyAmount(3000);
      setFormTenureMonths(11);
      setFormMonthsPaid(4);
      setFormDueDay(5);
      setFormAccumulatedGrams('135.38');
      setFormMaturityBonus(3000);
      setFormStartDate('2026-07-05');
      setFormMaturityDate('2027-06-05');
      setFormNotes('11 monthly installments of ₹3,000. Full 12th month paid as bonus (+₹3,000). 0% Making Charges & 0% Wastage on silver articles.');
    } else {
      setFormName('Sri Saravana Chits — 20-Month Family Chit Fund');
      setFormPlatform('Sri Saravana Chits (Salem)');
      setFormSymbolOrCode('SSC-CHIT-1L-20M');
      setFormMonthlyAmount(5000);
      setFormTenureMonths(20);
      setFormMonthsPaid(7);
      setFormDueDay(15);
      setFormAccumulatedGrams('');
      setFormMaturityBonus(3500);
      setFormStartDate('2026-04-15');
      setFormMaturityDate('2027-11-15');
      setFormNotes('Registered 20-month auction chit fund. Monthly call with auction dividend deduction.');
    }
    setFormStatus('active');
    setIsEnrollModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (chit: InvestmentAsset) => {
    setEditingChit(chit);
    setFormCategory((chit.category as any) || 'offline_chit');
    setFormName(chit.name);
    setFormPlatform(chit.platform);
    setFormSymbolOrCode(chit.symbolOrCode || '');
    setFormMonthlyAmount(chit.chitMonthlyAmount || chit.monthlySipAmount || 1000);
    setFormTenureMonths(chit.chitTenureMonths || (chit.category === 'other' ? 20 : 11));
    setFormMonthsPaid(chit.chitMonthsPaid || 0);
    setFormDueDay(chit.dueDayOfMonth || (chit.category === 'offline_chit' ? 14 : 10));
    setFormAccumulatedGrams(chit.quantity || '');
    setFormMaturityBonus(chit.maturityBonus || 0);
    setFormStartDate(chit.purchaseDate || getLiveDateString());
    setFormMaturityDate(chit.maturityDate || '');
    setFormStatus(chit.status === 'matured' ? 'matured' : 'active');
    setFormNotes(chit.notes || '');
  };

  // Save Enrolled or Edited Chit
  const handleSaveChit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const monthlyAmt = Number(formMonthlyAmount) || 0;
    const monthsPaid = Number(formMonthsPaid) || 0;
    const tenureMonths = Number(formTenureMonths) || 11;
    const investedAmount = monthlyAmt * monthsPaid;
    const bonusAmt = Number(formMaturityBonus) || 0;

    let grams = Number(formAccumulatedGrams);
    if (!grams || isNaN(grams)) {
      if (formCategory === 'gold_chit' || formCategory === 'digi_gold') {
        grams = Number((investedAmount / 7380).toFixed(3));
      } else if (formCategory === 'silver_chit') {
        grams = Number((investedAmount / 97.5).toFixed(2));
      } else {
        grams = monthsPaid;
      }
    }

    const currentRate = formCategory === 'gold_chit' || formCategory === 'digi_gold' ? 7380 : formCategory === 'silver_chit' ? 97.5 : 1000;
    const currentValue = formCategory === 'gold_chit' || formCategory === 'silver_chit' || formCategory === 'digi_gold'
      ? Math.round(grams * currentRate)
      : investedAmount + bonusAmt;

    const chitPayload: Omit<InvestmentAsset, 'id'> = {
      name: formName.trim(),
      category: formCategory,
      platform: formPlatform.trim(),
      symbolOrCode: formSymbolOrCode.trim() || undefined,
      investedAmount,
      currentValue,
      quantity: grams,
      unitType: formCategory === 'gold_chit' || formCategory === 'silver_chit' || formCategory === 'digi_gold' ? 'grams' : 'chit_tokens',
      isMonthlySip: true,
      monthlySipAmount: monthlyAmt,
      chitMonthlyAmount: monthlyAmt,
      chitTenureMonths: tenureMonths,
      chitMonthsPaid: monthsPaid,
      dueDayOfMonth: Number(formDueDay) || undefined,
      maturityBonus: bonusAmt,
      status: monthsPaid >= tenureMonths || formStatus === 'matured' ? 'matured' : 'active',
      purchaseDate: formStartDate,
      maturityDate: formMaturityDate || undefined,
      colorTag: formCategory === 'offline_chit' ? 'purple' : formCategory === 'gold_chit' ? 'amber' : formCategory === 'silver_chit' ? 'cyan' : 'emerald',
      notes: formNotes.trim() || undefined,
      updatedAt: getLiveDateString()
    };

    if (editingChit) {
      updateInvestment(editingChit.id, chitPayload);
      setEditingChit(null);
    } else {
      addInvestment(chitPayload);
      setIsEnrollModalOpen(false);
    }

    triggerConfetti();
  };

  // Open Payment Modal
  const handleOpenPaymentModal = (chit: InvestmentAsset) => {
    const nextMonth = (chit.chitMonthsPaid || 0) + 1;
    const monthlyAmt = chit.chitMonthlyAmount || chit.monthlySipAmount || 1000;
    const isGold = chit.category === 'gold_chit' || chit.name.toLowerCase().includes('gold');
    const isSilver = chit.category === 'silver_chit' || chit.name.toLowerCase().includes('silver');
    const isOffline = chit.category === 'offline_chit' || chit.name.toLowerCase().includes('offline');

    const expectedGrams = isGold
      ? Number((monthlyAmt / 7380).toFixed(4))
      : isSilver
      ? Number((monthlyAmt / 97.5).toFixed(3))
      : 1;

    setPaymentModalChit(chit);
    setPayDate(getLiveDateString());
    setPayAmount(monthlyAmt);
    setPayMethod(isOffline ? 'Cash (Physical Counterfoil)' : 'UPI (Google Pay / PhonePe)');
    setPayDocNo(
      isOffline
        ? `OFFLINE-RCPT-M${nextMonth.toString().padStart(2, '0')}`
        : `${chit.platform.slice(0, 3).toUpperCase()}/SLM/${nextMonth.toString().padStart(2, '0')}`
    );
    setPayGrams(expectedGrams);
    setPayNotes(
      isOffline
        ? `Month #${nextMonth} installment paid on ${chit.dueDayOfMonth || 14}th cycle (Physical passbook entry)`
        : `Installment Month #${nextMonth} of ${chit.chitTenureMonths || 11}`
    );
  };

  // Submit Payment Record
  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalChit) return;

    logChitInstallmentPayment(paymentModalChit.id, {
      amount: Number(payAmount) || paymentModalChit.chitMonthlyAmount || 1000,
      date: payDate,
      paymentMode: payMethod,
      docNo: payDocNo,
      notes: payNotes,
      gramsCredited: Number(payGrams) || undefined
    });

    setPaymentModalChit(null);
    triggerConfetti();
  };

  // Safe Delete Action
  const handleConfirmDelete = () => {
    if (!deletingChit) return;
    if (onDeleteInvestment) {
      onDeleteInvestment(deletingChit.id);
    } else {
      contextDeleteInvestment(deletingChit.id);
    }
    setDeletingChit(null);
  };

  // Categorization helpers
  const isDigiBullion = (c: InvestmentAsset) =>
    c.id === 'pothys-digi-gold' ||
    c.id === 'pothys-digi-silver' ||
    c.category === 'digi_gold' ||
    c.name.toLowerCase().includes('digi gold') ||
    c.name.toLowerCase().includes('digi silver') ||
    Boolean(c.schemeDetails);

  const isOfflineChit = (c: InvestmentAsset) =>
    c.category === 'offline_chit' ||
    c.id === 'chit-offline-monthly-1000' ||
    c.name.toLowerCase().includes('offline');

  const isJewellerShett = (c: InvestmentAsset) =>
    (c.category === 'gold_chit' || c.category === 'silver_chit') && !isDigiBullion(c) && !isOfflineChit(c);

  const isTraditionalChitFund = (c: InvestmentAsset) =>
    (c.category === 'other' || c.name.toLowerCase().includes('chit fund') || (c.chitTenureMonths && c.chitTenureMonths > 11)) &&
    !isOfflineChit(c);

  // Computed Totals
  const totalMonthlyCommitment = chitSchemes.reduce(
    (s, c) => s + (c.chitMonthlyAmount || c.monthlySipAmount || 0),
    0
  );
  const totalInvested = chitSchemes.reduce((s, c) => s + c.investedAmount, 0);
  const totalCurrentValue = chitSchemes.reduce((s, c) => s + c.currentValue, 0);

  const totalGoldGrams = chitSchemes
    .filter(c => c.category === 'gold_chit' || c.name.toLowerCase().includes('gold'))
    .reduce((s, c) => s + (c.quantity || 0), 0);

  const totalSilverGrams = chitSchemes
    .filter(c => c.category === 'silver_chit' || c.name.toLowerCase().includes('silver'))
    .reduce((s, c) => s + (c.quantity || 0), 0);

  const totalBonusPerks = chitSchemes.reduce((s, c) => s + (c.maturityBonus || 0), 0);

  // Offline Chit Specific Item
  const offlineChit = chitSchemes.find(isOfflineChit);

  // Filter & Search Logic
  const filteredSchemes = chitSchemes.filter(chit => {
    const isOffline = isOfflineChit(chit);
    const isBullion = isDigiBullion(chit);
    const isJeweller = isJewellerShett(chit);
    const isChitFund = isTraditionalChitFund(chit);
    const isMatured = chit.status === 'matured' || (chit.chitMonthsPaid || 0) >= (chit.chitTenureMonths || 11);

    if (activeFilter === 'offline' && !isOffline) return false;
    if (activeFilter === 'digi_bullion' && !isBullion) return false;
    if (activeFilter === 'jeweller' && !isJeweller) return false;
    if (activeFilter === 'chit_fund' && !isChitFund) return false;
    if (activeFilter === 'active' && isMatured) return false;
    if (activeFilter === 'matured' && !isMatured) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        chit.name.toLowerCase().includes(q) ||
        chit.platform.toLowerCase().includes(q) ||
        (chit.symbolOrCode && chit.symbolOrCode.toLowerCase().includes(q)) ||
        (chit.notes && chit.notes.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* 1. Header Command Strip */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1A180E] via-[#0E1528] to-[#0A0F1D] border border-amber-500/40 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            {onBackToOverview && (
              <button
                onClick={onBackToOverview}
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center gap-1 active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Overview</span>
              </button>
            )}
            <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 flex items-center gap-1.5 shadow-md">
              <Award className="w-3.5 h-3.5" />
              Unified Chit & Shett Command Center
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
              Offline Chit (₹1k/14-Oct) · Digi Gold · Digi Silver · GRT · Lalitha
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Chits, Jeweller Shett & Bullion Savings Command Center
          </h2>
          <p className="text-xs text-slate-400 max-w-3xl">
            Separate monitoring for Offline Monthly Chit (₹1,000 started 14-Oct), Pothys Digi Gold & Digi Silver (₹100/day daily terminal), GRT & Lalitha 11-Month Jeweller Shett, and Traditional Chit Funds.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleOpenEnrollModal('offline_chit')}
            className="px-3.5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white transition shadow-lg shadow-purple-500/20 flex items-center space-x-1.5 active:scale-95"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>+ Enroll Offline Chit</span>
          </button>
          <button
            onClick={() => handleOpenEnrollModal('gold_chit')}
            className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 transition shadow-lg shadow-amber-500/20 flex items-center space-x-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Enroll Jeweller Scheme</span>
          </button>
        </div>
      </div>

      {/* 2. SPOTLIGHT: Offline Monthly Chit (₹1,000 / Started 14-Oct) */}
      {offlineChit && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#0E1528] to-purple-950/30 border border-purple-500/50 shadow-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-purple-500 text-slate-950 flex items-center gap-1 shadow-md">
                  <Bookmark className="w-3 h-3" />
                  OFFLINE MONTHLY CHIT SPOTLIGHT
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-500/20 text-purple-200 border border-purple-500/40">
                  Target: ₹1,000 / Month · Due Every 14th
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-800 text-slate-300">
                  Started: 14-Oct-2026
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span>{offlineChit.name}</span>
                  <span className="text-xs font-normal text-purple-300">({offlineChit.platform})</span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Month #1 paid on <strong>14-Oct-2026</strong> (₹1,000) · <strong>Next Due: Month #2 on 14-Nov-2026</strong> (₹1,000) · Physical counterfoil passbook tracking.
                </p>
              </div>

              {/* 14th of Every Month Visual Milestone Stepper */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-semibold">
                    12-Month Schedule: <strong className="text-purple-300">{offlineChit.chitMonthsPaid || 1} of {offlineChit.chitTenureMonths || 12} Paid</strong>
                  </span>
                  <span className="text-purple-300 font-mono font-bold">
                    {Math.round(((offlineChit.chitMonthsPaid || 1) / (offlineChit.chitTenureMonths || 12)) * 100)}% Complete
                  </span>
                </div>

                <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
                  {Array.from({ length: offlineChit.chitTenureMonths || 12 }).map((_, idx) => {
                    const monthNum = idx + 1;
                    const isPaid = monthNum <= (offlineChit.chitMonthsPaid || 1);
                    const isNextDue = monthNum === (offlineChit.chitMonthsPaid || 1) + 1;
                    const monthDate = `14-${['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'][idx % 12]}`;

                    return (
                      <div
                        key={monthNum}
                        className={`p-1.5 rounded-lg text-center flex flex-col justify-center items-center transition-all ${
                          isPaid
                            ? 'bg-gradient-to-t from-purple-700 to-purple-600 text-white font-black shadow-sm'
                            : isNextDue
                            ? 'bg-purple-500/20 border-2 border-purple-400 text-purple-200 animate-pulse font-extrabold'
                            : 'bg-slate-900/80 text-slate-500 border border-slate-800'
                        }`}
                        title={`Month #${monthNum}: Due ${monthDate} (${isPaid ? 'PAID' : isNextDue ? 'NEXT DUE' : 'UPCOMING'})`}
                      >
                        <span className="text-[9px] uppercase font-mono block opacity-80">{monthDate}</span>
                        <span className="text-[11px] font-black">{isPaid ? '✓' : `M${monthNum}`}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Offline Chit Action Panel */}
            <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
              <div className="text-left lg:text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Capital Deposited</span>
                <span className="text-xl font-black text-purple-300 font-mono">
                  {formatCurrency(offlineChit.investedAmount)}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Maturity Pool: <strong className="text-white font-mono">{formatCurrency((offlineChit.chitMonthlyAmount || 1000) * (offlineChit.chitTenureMonths || 12))}</strong>
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPassbookModalChit(offlineChit)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center space-x-1 border border-slate-700"
                >
                  <Receipt className="w-3.5 h-3.5 text-purple-400" />
                  <span>Physical Passbook</span>
                </button>
                <button
                  onClick={() => handleOpenPaymentModal(offlineChit)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white shadow-md active:scale-95 transition flex items-center space-x-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>+ Pay Month #{(offlineChit.chitMonthsPaid || 1) + 1}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. DEDICATED SEPARATE MONITORING TABS */}
      <div className="p-3.5 rounded-2xl bg-[#0C1222]/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-black uppercase text-slate-400 px-2 flex items-center gap-1">
            <Filter className="w-3 h-3 text-amber-400" />
            <span>Separate Monitor:</span>
          </span>

          {[
            { id: 'all', label: `All Chits (${chitSchemes.length})` },
            { id: 'offline', label: `Offline Chit (₹1k/14-Oct)` },
            { id: 'digi_bullion', label: 'Digi Gold & Silver (Pothys)' },
            { id: 'jeweller', label: 'Jeweller Shett (GRT & Lalitha)' },
            { id: 'chit_fund', label: 'Chit Funds (Saravana 20M)' },
            { id: 'active', label: `Active (${chitSchemes.filter(c => c.status !== 'matured').length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeFilter === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Offline, Pothys, GRT..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 4. CHIT DUE CALENDAR & PAYMENT MATRIX STRIP */}
      <div className="p-4 rounded-2xl bg-[#090D18] border border-slate-800 shadow-lg space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              Monthly Chit Payment Schedule & Due Dates Matrix
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Total Monthly Commitment: <strong className="text-amber-300 font-mono">{formatCurrency(totalMonthlyCommitment)}/mo</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
          {/* Daily Digi Gold & Silver */}
          <div
            onClick={() => navigateToTab('daily_chit')}
            className="p-3 rounded-xl bg-[#0C1222] border border-amber-500/30 hover:border-amber-400 transition cursor-pointer"
          >
            <span className="text-[10px] font-bold uppercase text-amber-400 block">Daily Deposit</span>
            <div className="text-sm font-extrabold text-white mt-0.5">Pothys Digi Gold & Silver</div>
            <div className="text-xs font-mono font-bold text-amber-300 mt-1">₹200 / Day</div>
            <span className="text-[10px] text-slate-400 block mt-0.5">Day 12 of 300 · Target Active</span>
          </div>

          {/* 5th of Month: Lalitha */}
          <div className="p-3 rounded-xl bg-[#0C1222] border border-cyan-500/30">
            <span className="text-[10px] font-bold uppercase text-cyan-400 block">5th of Every Month</span>
            <div className="text-sm font-extrabold text-white mt-0.5">Lalitha Silver Jewel Scheme</div>
            <div className="text-xs font-mono font-bold text-cyan-300 mt-1">₹3,000 / Month</div>
            <span className="text-[10px] text-slate-400 block mt-0.5">Month 4 of 11 Paid · Next: 05-Nov</span>
          </div>

          {/* 10th of Month: GRT */}
          <div className="p-3 rounded-xl bg-[#0C1222] border border-yellow-500/30">
            <span className="text-[10px] font-bold uppercase text-yellow-400 block">10th of Every Month</span>
            <div className="text-sm font-extrabold text-white mt-0.5">GRT Golden Eleven (22K)</div>
            <div className="text-xs font-mono font-bold text-yellow-300 mt-1">₹2,000 / Month</div>
            <span className="text-[10px] text-slate-400 block mt-0.5">Month 6 of 11 Paid · Next: 10-Nov</span>
          </div>

          {/* 14th of Month: Offline Chit */}
          <div className="p-3 rounded-xl bg-purple-500/15 border border-purple-500/40">
            <span className="text-[10px] font-bold uppercase text-purple-300 block">14th of Every Month</span>
            <div className="text-sm font-extrabold text-white mt-0.5">Offline Physical Chit</div>
            <div className="text-xs font-mono font-bold text-purple-200 mt-1">₹1,000 / Month</div>
            <span className="text-[10px] text-purple-300 block mt-0.5">Started 14-Oct · Next: 14-Nov</span>
          </div>

          {/* 15th of Month: Saravana */}
          <div className="p-3 rounded-xl bg-[#0C1222] border border-emerald-500/30">
            <span className="text-[10px] font-bold uppercase text-emerald-400 block">15th of Every Month</span>
            <div className="text-sm font-extrabold text-white mt-0.5">Sri Saravana Chit Fund</div>
            <div className="text-xs font-mono font-bold text-emerald-300 mt-1">₹5,000 / Month</div>
            <span className="text-[10px] text-slate-400 block mt-0.5">Month 7 of 20 Paid · Next: 15-Nov</span>
          </div>
        </div>
      </div>

      {/* 5. Comprehensive KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-[#0C1222]/90 border border-yellow-500/30 shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-400 block mb-1">
            Active Chit Accounts
          </span>
          <div className="text-2xl font-black text-white font-mono tracking-tight">
            {chitSchemes.filter(c => c.status !== 'matured').length} / {chitSchemes.length}
            <span className="text-xs font-normal text-slate-400 ml-1">Plans</span>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-400">
            Digi Bullion + Offline + Jeweller Shett
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0C1222]/90 border border-slate-800 shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Monthly Commitment Outflow
          </span>
          <div className="text-2xl font-black text-amber-300 font-mono tracking-tight">
            {formatCurrency(totalMonthlyCommitment)}
            <span className="text-xs font-normal text-slate-400">/mo</span>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-400">
            Offline ₹1k + Shett ₹5k + Chit ₹5k
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0C1222]/90 border border-slate-800 shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Capital Invested
          </span>
          <div className="text-2xl font-black text-white font-mono tracking-tight">
            {formatCurrency(totalInvested)}
          </div>
          <p className="mt-1.5 text-[11px] text-slate-400">
            Cumulative installments paid
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0C1222]/90 border border-emerald-500/30 shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
            Accumulated Bullion Weight
          </span>
          <div className="text-xl font-black text-emerald-400 font-mono tracking-tight">
            {totalGoldGrams > 0 ? `${totalGoldGrams.toFixed(2)}g Gold` : ''}
            {totalGoldGrams > 0 && totalSilverGrams > 0 ? ' · ' : ''}
            {totalSilverGrams > 0 ? `${totalSilverGrams.toFixed(1)}g Silver` : ''}
          </div>
          <p className="mt-1.5 text-[11px] text-slate-400">
            Valuation: <strong className="text-white font-mono">{formatCurrency(totalCurrentValue)}</strong>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0C1222]/90 border border-amber-500/30 shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
            12th Month Bonus Perks
          </span>
          <div className="text-2xl font-black text-amber-300 font-mono tracking-tight">
            +{formatCurrency(totalBonusPerks)}
          </div>
          <p className="mt-1.5 text-[11px] text-slate-400">
            Free Month Paid + 0% VA Perks
          </p>
        </div>
      </div>

      {/* 6. Chit Scheme Cards Grid (Dedicated Separate Monitors) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredSchemes.map(chit => {
          const isOffline = isOfflineChit(chit);
          const isBullion = isDigiBullion(chit);
          const isGold = chit.category === 'gold_chit' || chit.name.toLowerCase().includes('gold');
          const isSilver = chit.category === 'silver_chit' || chit.name.toLowerCase().includes('silver');

          const tenure = chit.chitTenureMonths || (isBullion ? 10 : isOffline ? 12 : chit.category === 'other' ? 20 : 11);
          const paid = chit.chitMonthsPaid || 0;
          const progressPct = Math.min(100, Math.round((paid / tenure) * 100));
          const monthlyAmt = chit.chitMonthlyAmount || chit.monthlySipAmount || 0;
          const isMatured = chit.status === 'matured' || paid >= tenure;
          const vouchersCount = chit.transactions?.length || 0;

          return (
            <div
              key={chit.id}
              className={`p-5 rounded-2xl border transition-all shadow-xl relative overflow-hidden flex flex-col justify-between ${
                isOffline
                  ? 'bg-gradient-to-b from-purple-950/30 via-[#0D1322] to-[#090D18] border-purple-500/40 hover:border-purple-400'
                  : isBullion
                  ? 'bg-gradient-to-b from-amber-950/30 via-[#0D1322] to-[#090D18] border-amber-500/40 hover:border-amber-400'
                  : 'bg-gradient-to-b from-[#0D1322] to-[#090D18] border-slate-800 hover:border-amber-500/40'
              }`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          isOffline
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                            : isBullion
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : isGold
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : isSilver
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {isOffline
                          ? 'Offline Chit (Monthly)'
                          : isBullion
                          ? 'Digi Bullion Plan'
                          : isGold
                          ? 'Gold Shett (11M)'
                          : isSilver
                          ? 'Silver Shett (11M)'
                          : 'Family Chit Fund (20M)'}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">{chit.platform}</span>
                      {chit.dueDayOfMonth && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                          Due Every {chit.dueDayOfMonth}th
                        </span>
                      )}
                      {isMatured && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          Matured
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-extrabold text-white tracking-tight">{chit.name}</h3>
                    {chit.symbolOrCode && (
                      <p className="text-[11px] font-mono text-slate-400">{chit.symbolOrCode}</p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Commitment</span>
                    <div className="text-lg font-black text-amber-300 font-mono">
                      {isBullion ? '₹100/day' : `${formatCurrency(monthlyAmt)}/mo`}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {chit.dueDayOfMonth ? `Due on ${chit.dueDayOfMonth}th` : 'Due 10th-15th'}
                    </span>
                  </div>
                </div>

                {/* Milestone Stepper Visualizer */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-semibold">
                      Milestones: <strong className="text-amber-400">{paid} of {tenure} Paid</strong>
                    </span>
                    <span className="text-amber-400 font-mono font-bold">{progressPct}% Complete</span>
                  </div>

                  <div
                    className="grid gap-1.5 pt-1"
                    style={{ gridTemplateColumns: `repeat(${tenure <= 12 ? (tenure <= 11 ? 11 : 12) : 10}, minmax(0, 1fr))` }}
                  >
                    {Array.from({ length: tenure }).map((_, idx) => {
                      const stepNum = idx + 1;
                      const isCompleted = stepNum <= paid;
                      const isCurrent = stepNum === paid + 1;
                      const isLastStep = stepNum === tenure;

                      return (
                        <div
                          key={stepNum}
                          className={`h-7 rounded flex items-center justify-center text-[10px] font-black transition-all ${
                            isCompleted
                              ? isOffline
                                ? 'bg-gradient-to-t from-purple-700 to-purple-600 text-white shadow-sm'
                                : isGold || isBullion
                                ? 'bg-gradient-to-t from-amber-600 to-amber-500 text-slate-950 shadow-sm'
                                : isSilver
                                ? 'bg-gradient-to-t from-cyan-600 to-cyan-500 text-slate-950 shadow-sm'
                                : 'bg-gradient-to-t from-emerald-600 to-emerald-500 text-slate-950 shadow-sm'
                              : isCurrent
                              ? isOffline
                                ? 'bg-purple-500/20 border-2 border-purple-400 text-purple-200 animate-pulse font-extrabold'
                                : 'bg-amber-500/20 border-2 border-amber-500 text-amber-300 animate-pulse font-extrabold'
                              : isLastStep
                              ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                              : 'bg-slate-900/80 text-slate-500 border border-slate-800'
                          }`}
                          title={`Month ${stepNum}: ${isCompleted ? 'Paid' : isCurrent ? 'Next Due' : 'Upcoming'}`}
                        >
                          {isCompleted ? '✓' : isLastStep ? '★' : stepNum}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Scheme Highlights */}
                <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-slate-800/80 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#090D18] border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">
                      {isGold || isSilver || isBullion ? 'Booked Weight' : 'Paid Calls'}
                    </span>
                    <span className="text-sm font-black text-amber-300 font-mono">
                      {chit.quantity ? `${chit.quantity}${isGold || isSilver || isBullion ? 'g' : ' Calls'}` : '—'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#090D18] border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Capital Paid</span>
                    <span className="text-sm font-black text-white font-mono">
                      {formatCurrency(chit.investedAmount)}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#090D18] border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Market Valuation</span>
                    <span className="text-sm font-black text-emerald-400 font-mono">
                      {formatCurrency(chit.currentValue)}
                    </span>
                  </div>
                </div>

                {/* Bonus Perk / Terms Badge */}
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-amber-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="font-bold">Maturity Perk:</span>
                    <span className="text-amber-200">
                      {chit.maturityBonus
                        ? `+${formatCurrency(chit.maturityBonus)} Bonus Contribution`
                        : isBullion
                        ? '+7% Instant Bonus Weight in Days 0-75'
                        : '0% Wastage / VA charges on gold'}
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-amber-400 uppercase bg-amber-500/20 px-2 py-0.5 rounded">
                    {isBullion ? '7% Bonus Tier' : 'Bonus Perk'}
                  </span>
                </div>

                {chit.notes && (
                  <p className="text-[11px] text-slate-400 italic line-clamp-2">
                    {chit.notes}
                  </p>
                )}
              </div>

              {/* Action Buttons Toolbar */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPassbookModalChit(chit)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center space-x-1 border border-slate-700"
                    title="View Voucher Passbook"
                  >
                    <Receipt className="w-3.5 h-3.5 text-amber-400" />
                    <span>Passbook ({vouchersCount})</span>
                  </button>

                  <button
                    onClick={() => handleOpenEdit(chit)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    title="Edit Scheme Details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDeletingChit(chit)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                    title="Delete Chit Scheme"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  {isBullion ? (
                    <button
                      onClick={() => navigateToTab('daily_chit')}
                      className="px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 transition flex items-center space-x-1 shadow-md active:scale-95"
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>Open 300D Terminal</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenPaymentModal(chit)}
                      disabled={isMatured}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center space-x-1.5 shadow-md active:scale-95 ${
                        isMatured
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                          : isOffline
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white'
                          : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        {isMatured ? 'Scheme Matured!' : `+ Pay Month #${paid + 1} (${formatCurrency(monthlyAmt)})`}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 7. Master Register Table */}
      <div className="rounded-2xl bg-[#0C1222]/90 border border-yellow-500/30 shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0B101D]">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              All Chits & Jeweller Schemes Master Register
            </h3>
            <span className="text-xs text-yellow-400 font-mono">({filteredSchemes.length} Schemes)</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleOpenEnrollModal('offline_chit')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition flex items-center space-x-1 shadow-md active:scale-95"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>+ Offline Chit</span>
            </button>
            <button
              onClick={() => handleOpenEnrollModal('gold_chit')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-yellow-500 hover:bg-yellow-400 text-slate-950 transition flex items-center space-x-1 shadow-md active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Jeweller Scheme</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#090D18] text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Scheme & Merchant</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Installment Target</th>
                <th className="px-4 py-3.5">Milestone Progress</th>
                <th className="px-4 py-3.5">Weight / Quantity</th>
                <th className="px-4 py-3.5">Total Invested</th>
                <th className="px-4 py-3.5">Current Value</th>
                <th className="px-4 py-3.5">Due Date</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredSchemes.map(scheme => {
                const paid = scheme.chitMonthsPaid || 0;
                const tenure = scheme.chitTenureMonths || 11;
                const monthly = scheme.chitMonthlyAmount || scheme.monthlySipAmount || 0;
                const isOffline = isOfflineChit(scheme);
                const isBullion = isDigiBullion(scheme);
                const isGold = scheme.category === 'gold_chit' || scheme.name.toLowerCase().includes('gold');
                const isSilver = scheme.category === 'silver_chit' || scheme.name.toLowerCase().includes('silver');
                const isMatured = scheme.status === 'matured' || paid >= tenure;

                return (
                  <tr key={scheme.id} className="hover:bg-slate-800/30 transition">
                    <td className="px-5 py-4">
                      <span className="font-bold text-white text-sm block">{scheme.name}</span>
                      <span className="text-[11px] text-slate-400">{scheme.platform} · {scheme.symbolOrCode || 'Shett Plan'}</span>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          isOffline
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : isBullion
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : isGold
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : isSilver
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {isOffline ? 'Offline Chit' : isBullion ? 'Digi Bullion' : isGold ? 'Gold 11M' : isSilver ? 'Silver 11M' : 'Chit Fund'}
                      </span>
                    </td>

                    <td className="px-4 py-4 font-mono font-bold text-amber-300">
                      {isBullion ? '₹100/day' : formatCurrency(monthly)}
                    </td>

                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-white font-mono">
                          {isBullion ? `Day ${scheme.schemeDetails?.activeDayIndex || 11} / 300` : `Month ${paid} / ${tenure} Paid`}
                        </span>
                        <div className="h-1.5 w-24 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isOffline ? 'bg-purple-500' : 'bg-amber-500'}`}
                            style={{ width: `${Math.min(100, (paid / tenure) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 font-mono font-bold text-slate-200">
                      {scheme.quantity ? `${scheme.quantity}${isGold || isSilver || isBullion ? 'g' : ' calls'}` : '—'}
                    </td>

                    <td className="px-4 py-4 font-mono text-white">
                      {formatCurrency(scheme.investedAmount)}
                    </td>

                    <td className="px-4 py-4 font-mono font-bold text-emerald-400">
                      {formatCurrency(scheme.currentValue)}
                    </td>

                    <td className="px-4 py-4">
                      <span className="text-xs text-slate-300 font-medium">
                        {scheme.dueDayOfMonth ? `Every ${scheme.dueDayOfMonth}th` : isBullion ? 'Daily' : '10th-15th'}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => handleOpenPaymentModal(scheme)}
                          disabled={isMatured}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-bold text-xs transition disabled:opacity-50"
                        >
                          + Pay Month #{paid + 1}
                        </button>
                        <button
                          onClick={() => setPassbookModalChit(scheme)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                          title="Passbook"
                        >
                          <Receipt className="w-3.5 h-3.5 text-amber-400" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(scheme)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingChit(scheme)}
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

      {/* ========================================================================= */}
      {/* 8. MODAL: Enroll New Chit / Shett Scheme (CREATE)                         */}
      {/* ========================================================================= */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0E1526] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0B101D] shrink-0">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    Enroll New Chit Scheme
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Offline Chit, Jeweller Shett, or Traditional Chit Fund
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEnrollModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveChit} className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Type Switcher */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold">Scheme Category *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'offline_chit', label: 'Offline Chit', icon: <Bookmark className="w-3.5 h-3.5 text-purple-400" /> },
                    { id: 'gold_chit', label: 'Gold Shett (11M)', icon: <Coins className="w-3.5 h-3.5 text-amber-400" /> },
                    { id: 'silver_chit', label: 'Silver Shett (11M)', icon: <Layers className="w-3.5 h-3.5 text-cyan-400" /> },
                    { id: 'other', label: 'Chit Fund (20M)', icon: <Percent className="w-3.5 h-3.5 text-emerald-400" /> }
                  ].map(cat => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => {
                        setFormCategory(cat.id as any);
                        if (cat.id === 'offline_chit') {
                          setFormPlatform('Offline Physical Chit / Local Committee');
                          setFormMonthlyAmount(1000);
                          setFormTenureMonths(12);
                          setFormDueDay(14);
                          setFormMaturityBonus(1000);
                        } else if (cat.id === 'gold_chit') {
                          setFormPlatform('GRT Jewellers');
                          setFormMonthlyAmount(2000);
                          setFormTenureMonths(11);
                          setFormDueDay(10);
                          setFormMaturityBonus(2000);
                        } else if (cat.id === 'silver_chit') {
                          setFormPlatform('Lalitha Thanga Maligai');
                          setFormMonthlyAmount(3000);
                          setFormTenureMonths(11);
                          setFormDueDay(5);
                          setFormMaturityBonus(3000);
                        } else {
                          setFormPlatform('Sri Saravana Chits (Salem)');
                          setFormMonthlyAmount(5000);
                          setFormTenureMonths(20);
                          setFormDueDay(15);
                          setFormMaturityBonus(3500);
                        }
                      }}
                      className={`p-2 rounded-xl border text-left flex items-center space-x-1.5 transition ${
                        formCategory === cat.id
                          ? 'border-amber-500 bg-amber-500/15 text-white font-bold'
                          : 'border-slate-800 bg-[#090D18] text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {cat.icon}
                      <span className="text-[11px] truncate">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Scheme Name */}
              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Scheme Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. Offline Monthly Chit (₹1,000 / 14-Oct)"
                  className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Platform & Account Number */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Platform / Collector *</label>
                  <input
                    type="text"
                    required
                    value={formPlatform}
                    onChange={e => setFormPlatform(e.target.value)}
                    placeholder="GRT, Lalitha, Local Committee"
                    className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Passbook Code / Receipt ID</label>
                  <input
                    type="text"
                    value={formSymbolOrCode}
                    onChange={e => setFormSymbolOrCode(e.target.value)}
                    placeholder="e.g. OFFLINE-1000"
                    className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              {/* Monthly Amount, Tenure & Due Day */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Monthly Due (₹) *</label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={formMonthlyAmount}
                    onChange={e => setFormMonthlyAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Tenure (Months) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formTenureMonths}
                    onChange={e => setFormTenureMonths(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Due Day</label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={formDueDay}
                    onChange={e => setFormDueDay(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Months Paid & Accumulated Grams */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Months Already Paid</label>
                  <input
                    type="number"
                    min={0}
                    value={formMonthsPaid}
                    onChange={e => setFormMonthsPaid(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Accumulated Grams</label>
                  <input
                    type="number"
                    step="any"
                    value={formAccumulatedGrams}
                    onChange={e => setFormAccumulatedGrams(e.target.value)}
                    placeholder="Optional for gold/silver"
                    className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-emerald-400 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Maturity Bonus & Start Date */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Maturity Perk / Bonus (₹)</label>
                  <input
                    type="number"
                    value={formMaturityBonus}
                    onChange={e => setFormMaturityBonus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-amber-300 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Start Date</label>
                  <input
                    type="date"
                    value={formStartDate}
                    onChange={e => setFormStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Notes & Terms</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  placeholder="Payment notes, physical passbook location, committee contact..."
                  className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Buttons */}
              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-slate-950 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 font-black shadow-lg shadow-amber-500/20 transition active:scale-95"
                >
                  Enroll Scheme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. MODAL: Edit Chit Scheme (UPDATE)                                      */}
      {/* ========================================================================= */}
      {editingChit && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0E1526] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0B101D] shrink-0">
              <div className="flex items-center space-x-2">
                <Edit2 className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-extrabold text-white">
                  Edit Chit Scheme: {editingChit.name}
                </h3>
              </div>
              <button
                onClick={() => setEditingChit(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveChit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Scheme Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Platform / Collector</label>
                  <input
                    type="text"
                    required
                    value={formPlatform}
                    onChange={e => setFormPlatform(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Passbook / Code</label>
                  <input
                    type="text"
                    value={formSymbolOrCode}
                    onChange={e => setFormSymbolOrCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Monthly Due (₹)</label>
                  <input
                    type="number"
                    required
                    value={formMonthlyAmount}
                    onChange={e => setFormMonthlyAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Total Tenure</label>
                  <input
                    type="number"
                    required
                    value={formTenureMonths}
                    onChange={e => setFormTenureMonths(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Due Day</label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={formDueDay}
                    onChange={e => setFormDueDay(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Months Paid</label>
                  <input
                    type="number"
                    min={0}
                    value={formMonthsPaid}
                    onChange={e => setFormMonthsPaid(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Accumulated Grams</label>
                  <input
                    type="number"
                    step="any"
                    value={formAccumulatedGrams}
                    onChange={e => setFormAccumulatedGrams(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-emerald-400 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Maturity Perk (₹)</label>
                  <input
                    type="number"
                    value={formMaturityBonus}
                    onChange={e => setFormMaturityBonus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-amber-300 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Status</label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="active">Active (Ongoing)</option>
                    <option value="matured">Matured (Completed)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Notes</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingChit(null)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-slate-950 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 font-black shadow-lg shadow-amber-500/20 transition active:scale-95"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. MODAL: Record Installment Payment (UPDATE & VOUCHER ENTRY)            */}
      {/* ========================================================================= */}
      {paymentModalChit && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0E1526] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0B101D]">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    Record Installment Payment
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Month #{(paymentModalChit.chitMonthsPaid || 0) + 1} of {paymentModalChit.chitTenureMonths || 12} · {paymentModalChit.platform}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPaymentModalChit(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPayment} className="p-6 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 block">Scheme Name</span>
                  <span className="text-sm font-bold text-white">{paymentModalChit.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Next Month</span>
                  <span className="text-sm font-black text-amber-300 font-mono">
                    #{(paymentModalChit.chitMonthsPaid || 0) + 1}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Payment Date *</label>
                  <input
                    type="date"
                    required
                    value={payDate}
                    onChange={e => setPayDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Amount Paid (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={payAmount}
                    onChange={e => setPayAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Payment Mode</label>
                <select
                  value={payMethod}
                  onChange={e => setPayMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Cash (Physical Counterfoil)">Cash (Physical Counterfoil / Showroom)</option>
                  <option value="UPI (Google Pay / PhonePe)">UPI (Google Pay / PhonePe / Paytm)</option>
                  <option value="Net Banking / IMPS">Net Banking / IMPS / NEFT</option>
                  <option value="Debit / Credit Card">Debit / Credit Card</option>
                  <option value="Auto-Debit NACH">Auto-Debit NACH</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Receipt / Voucher No</label>
                  <input
                    type="text"
                    value={payDocNo}
                    onChange={e => setPayDocNo(e.target.value)}
                    placeholder="e.g. OFFLINE-RCPT-02"
                    className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Grams Booked (If Bullion)</label>
                  <input
                    type="number"
                    step="any"
                    value={payGrams}
                    onChange={e => setPayGrams(e.target.value)}
                    placeholder="Auto or 0"
                    className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-emerald-400 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Notes</label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={e => setPayNotes(e.target.value)}
                  placeholder="Collector receipt confirmed"
                  className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalChit(null)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-slate-950 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 font-black shadow-lg shadow-amber-500/20 transition active:scale-95 flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                  <span>Confirm & Credit Passbook</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11. MODAL: Passbook & Voucher Ledger (READ & MANAGE VOUCHERS)             */}
      {/* ========================================================================= */}
      {passbookModalChit && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0E1526] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0B101D] shrink-0">
              <div className="flex items-center space-x-2">
                <Receipt className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    Passbook & Voucher History: {passbookModalChit.name}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {passbookModalChit.platform} · {passbookModalChit.chitMonthsPaid || 0} of {passbookModalChit.chitTenureMonths || 12} Installments Paid
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPassbookModalChit(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Passbook Summary Banner */}
            <div className="p-4 bg-[#090D18] border-b border-slate-800/80 grid grid-cols-3 gap-3 text-center shrink-0">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Capital Deposited</span>
                <span className="text-base font-black text-white font-mono">
                  {formatCurrency(passbookModalChit.investedAmount)}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Accumulated Weight / Calls</span>
                <span className="text-base font-black text-amber-300 font-mono">
                  {passbookModalChit.quantity
                    ? `${passbookModalChit.quantity}${passbookModalChit.unitType === 'grams' ? 'g' : ' Calls'}`
                    : '—'}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Maturity Perk</span>
                <span className="text-base font-black text-emerald-400 font-mono">
                  +{formatCurrency(passbookModalChit.maturityBonus || 0)}
                </span>
              </div>
            </div>

            {/* Vouchers Table */}
            <div className="p-4 overflow-y-auto space-y-3">
              {(!passbookModalChit.transactions || passbookModalChit.transactions.length === 0) ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  <Receipt className="w-8 h-8 mx-auto mb-2 opacity-40 text-amber-400" />
                  <p className="font-bold">No voucher entries recorded in passbook yet.</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Click "+ Record Installment" below to add past vouchers or pay the next month.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {passbookModalChit.transactions.map((tx, idx) => (
                    <div
                      key={tx.id}
                      className="p-3 rounded-xl bg-[#090D18] border border-slate-800 hover:border-slate-700 transition flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center font-bold font-mono text-amber-300 text-[11px] shrink-0">
                          #{idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white">{tx.docNo || 'Installment Voucher'}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{tx.date}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{tx.notes || 'Monthly installment'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <span className="font-black text-amber-300 font-mono text-sm block">
                            {formatCurrency(tx.amount)}
                          </span>
                          {tx.weightGrams && tx.weightGrams > 0 ? (
                            <span className="text-[10px] font-mono text-emerald-400">
                              +{tx.weightGrams}g booked
                            </span>
                          ) : null}
                        </div>

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete voucher ${tx.docNo || tx.id}?`)) {
                              deleteChitVoucher(passbookModalChit.id, tx.id);
                            }
                          }}
                          className="p-1 rounded text-slate-500 hover:text-rose-400 transition"
                          title="Delete Voucher"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Passbook Footer */}
            <div className="px-6 py-3 bg-[#0B101D] border-t border-slate-800 flex items-center justify-between shrink-0">
              <button
                onClick={() => {
                  const target = passbookModalChit;
                  setPassbookModalChit(null);
                  handleOpenPaymentModal(target);
                }}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs shadow-md transition active:scale-95 flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>+ Record New Installment</span>
              </button>

              <button
                onClick={() => setPassbookModalChit(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition text-xs"
              >
                Close Passbook
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 12. MODAL: Delete Chit Scheme Confirmation (DELETE)                      */}
      {/* ========================================================================= */}
      {deletingChit && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0E1526] border border-rose-500/40 rounded-2xl shadow-2xl p-6 space-y-4 animate-scale-in text-xs">
            <div className="flex items-center space-x-3 text-rose-400">
              <div className="p-2 rounded-xl bg-rose-500/20">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Delete Chit Scheme?</h3>
                <p className="text-[11px] text-slate-400">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed">
              Are you sure you want to delete <strong className="text-white">{deletingChit.name}</strong> ({deletingChit.platform})?
              Total capital invested so far: <strong className="text-amber-300 font-mono">{formatCurrency(deletingChit.investedAmount)}</strong> ({deletingChit.chitMonthsPaid || 0} installments).
            </p>

            <div className="pt-2 flex items-center justify-end space-x-2">
              <button
                onClick={() => setDeletingChit(null)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 font-bold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl text-white bg-rose-600 hover:bg-rose-500 font-black shadow-lg shadow-rose-600/30 transition active:scale-95"
              >
                Yes, Delete Scheme
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
