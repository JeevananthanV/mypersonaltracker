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
  Percent
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

  // Filter & Search State
  const [activeFilter, setActiveFilter] = useState<'all' | 'gold' | 'silver' | 'chit_fund' | 'active' | 'matured'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Built-in CRUD Modals State
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [editingChit, setEditingChit] = useState<InvestmentAsset | null>(null);
  const [paymentModalChit, setPaymentModalChit] = useState<InvestmentAsset | null>(null);
  const [passbookModalChit, setPassbookModalChit] = useState<InvestmentAsset | null>(null);
  const [deletingChit, setDeletingChit] = useState<InvestmentAsset | null>(null);

  // Enroll / Edit Form Fields
  const [formCategory, setFormCategory] = useState<'gold_chit' | 'silver_chit' | 'other'>('gold_chit');
  const [formName, setFormName] = useState('');
  const [formPlatform, setFormPlatform] = useState('GRT Jewellers');
  const [formSymbolOrCode, setFormSymbolOrCode] = useState('');
  const [formMonthlyAmount, setFormMonthlyAmount] = useState<number | string>(2000);
  const [formTenureMonths, setFormTenureMonths] = useState<number | string>(11);
  const [formMonthsPaid, setFormMonthsPaid] = useState<number | string>(1);
  const [formAccumulatedGrams, setFormAccumulatedGrams] = useState<number | string>('');
  const [formMaturityBonus, setFormMaturityBonus] = useState<number | string>(2000);
  const [formStartDate, setFormStartDate] = useState(getLiveDateString());
  const [formMaturityDate, setFormMaturityDate] = useState('');
  const [formStatus, setFormStatus] = useState<'active' | 'matured'>('active');
  const [formNotes, setFormNotes] = useState('');

  // Payment Recording Form Fields
  const [payDate, setPayDate] = useState(getLiveDateString());
  const [payAmount, setPayAmount] = useState<number | string>(2000);
  const [payMethod, setPayMethod] = useState('UPI (Google Pay / PhonePe)');
  const [payDocNo, setPayDocNo] = useState('');
  const [payGrams, setPayGrams] = useState<number | string>('');
  const [payNotes, setPayNotes] = useState('');

  // Open Enroll Modal
  const handleOpenEnrollModal = (presetCategory: 'gold_chit' | 'silver_chit' | 'other' = 'gold_chit') => {
    setFormCategory(presetCategory);
    setFormName(
      presetCategory === 'gold_chit'
        ? 'GRT Jewellers — Golden Eleven (11-Month Gold Scheme)'
        : presetCategory === 'silver_chit'
        ? 'Lalitha Thanga Maligai — 11-Month Silver Scheme'
        : 'Sri Saravana Chits — 20-Month Family Chit Fund'
    );
    setFormPlatform(
      presetCategory === 'gold_chit'
        ? 'GRT Jewellers'
        : presetCategory === 'silver_chit'
        ? 'Lalitha Thanga Maligai'
        : 'Sri Saravana Chits (Salem)'
    );
    setFormSymbolOrCode(
      presetCategory === 'gold_chit' ? 'GRT-GE-90812' : presetCategory === 'silver_chit' ? 'LTM-SLV-44102' : 'SSC-CHIT-1L-20M'
    );
    setFormMonthlyAmount(presetCategory === 'other' ? 5000 : presetCategory === 'silver_chit' ? 3000 : 2000);
    setFormTenureMonths(presetCategory === 'other' ? 20 : 11);
    setFormMonthsPaid(0);
    setFormAccumulatedGrams('');
    setFormMaturityBonus(presetCategory === 'other' ? 3500 : presetCategory === 'silver_chit' ? 3000 : 2000);
    setFormStartDate(getLiveDateString());
    setFormMaturityDate('');
    setFormStatus('active');
    setFormNotes(
      presetCategory === 'gold_chit'
        ? 'Customer pays 11 months; jeweller credits 12th month as bonus. 0% Wastage / Value Addition charges up to 18%.'
        : presetCategory === 'silver_chit'
        ? 'Customer pays 11 monthly installments; 12th month paid by jeweller. 0% VA and 0% making charges on silver jewellery.'
        : 'Registered 20-month auction chit fund. Monthly call with auction dividend deduction.'
    );
    setIsEnrollModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (chit: InvestmentAsset) => {
    setEditingChit(chit);
    setFormCategory((chit.category as any) || 'gold_chit');
    setFormName(chit.name);
    setFormPlatform(chit.platform);
    setFormSymbolOrCode(chit.symbolOrCode || '');
    setFormMonthlyAmount(chit.chitMonthlyAmount || chit.monthlySipAmount || 2000);
    setFormTenureMonths(chit.chitTenureMonths || 11);
    setFormMonthsPaid(chit.chitMonthsPaid || 0);
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
      if (formCategory === 'gold_chit') {
        grams = Number((investedAmount / 7380).toFixed(3));
      } else if (formCategory === 'silver_chit') {
        grams = Number((investedAmount / 97.5).toFixed(2));
      } else {
        grams = monthsPaid;
      }
    }

    const currentRate = formCategory === 'gold_chit' ? 7380 : formCategory === 'silver_chit' ? 97.5 : 5500;
    const currentValue = formCategory === 'gold_chit' || formCategory === 'silver_chit'
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
      unitType: formCategory === 'gold_chit' || formCategory === 'silver_chit' ? 'grams' : 'chit_tokens',
      isMonthlySip: true,
      monthlySipAmount: monthlyAmt,
      chitMonthlyAmount: monthlyAmt,
      chitTenureMonths: tenureMonths,
      chitMonthsPaid: monthsPaid,
      maturityBonus: bonusAmt,
      status: monthsPaid >= tenureMonths || formStatus === 'matured' ? 'matured' : 'active',
      purchaseDate: formStartDate,
      maturityDate: formMaturityDate || undefined,
      colorTag: formCategory === 'gold_chit' ? 'amber' : formCategory === 'silver_chit' ? 'cyan' : 'emerald',
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
    const monthlyAmt = chit.chitMonthlyAmount || chit.monthlySipAmount || 2000;
    const isGold = chit.category === 'gold_chit' || chit.name.toLowerCase().includes('gold');
    const isSilver = chit.category === 'silver_chit' || chit.name.toLowerCase().includes('silver');

    const expectedGrams = isGold
      ? Number((monthlyAmt / 7380).toFixed(4))
      : isSilver
      ? Number((monthlyAmt / 97.5).toFixed(3))
      : 1;

    setPaymentModalChit(chit);
    setPayDate(getLiveDateString());
    setPayAmount(monthlyAmt);
    setPayMethod('UPI (Google Pay / PhonePe)');
    setPayDocNo(`${chit.platform.slice(0, 3).toUpperCase()}/SLM/${nextMonth.toString().padStart(2, '0')}`);
    setPayGrams(expectedGrams);
    setPayNotes(`Installment Month #${nextMonth} of ${chit.chitTenureMonths || 11}`);
  };

  // Submit Payment Record
  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalChit) return;

    logChitInstallmentPayment(paymentModalChit.id, {
      amount: Number(payAmount) || paymentModalChit.chitMonthlyAmount || 2000,
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

  // Computed Summaries
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

  // Filter & Search Logic
  const filteredSchemes = chitSchemes.filter(chit => {
    const isGold = chit.category === 'gold_chit' || chit.name.toLowerCase().includes('gold');
    const isSilver = chit.category === 'silver_chit' || chit.name.toLowerCase().includes('silver');
    const isChitFund = chit.category === 'other' || chit.name.toLowerCase().includes('chit fund') || (chit.chitTenureMonths && chit.chitTenureMonths > 11);
    const isMatured = chit.status === 'matured' || (chit.chitMonthsPaid || 0) >= (chit.chitTenureMonths || 11);

    if (activeFilter === 'gold' && !isGold) return false;
    if (activeFilter === 'silver' && !isSilver) return false;
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
    <div className="space-y-6 animate-fade-in pb-12">
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
              11-Month Jewellery Scheme ("Gold & Silver Shett") Command Center
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              GRT · Lalitha · Sri Saravana · Pothys
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Traditional Jeweller Gold & Silver Savings ("Shett") & Chit Funds
          </h2>
          <p className="text-xs text-slate-400 max-w-3xl">
            Monthly commitment ledger with visual 11-month and 20-month milestone roadmaps, voucher history passbooks, gram accrual calculations, and guaranteed 12th-month bonus tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => handleOpenEnrollModal('gold_chit')}
            className="px-4 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 transition shadow-lg shadow-amber-500/20 flex items-center space-x-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Enroll New Chit Scheme</span>
          </button>
        </div>
      </div>

      {/* 2. Quick Access to Pothys 300-Day Daily Pay Terminal */}
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
                Pothys Swarna Mahal 300-Day Daily Deposit Terminal
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

      {/* 3. Comprehensive Chit KPI Strip */}
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
            GRT · Lalitha · Saravana
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
            Due 5th to 15th each month
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

      {/* 4. Filter Toolbar & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#0C1222]/80 border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: `All Schemes (${chitSchemes.length})` },
            { id: 'gold', label: 'Gold Shett (11M)' },
            { id: 'silver', label: 'Silver Shett (11M)' },
            { id: 'chit_fund', label: 'Chit Funds (20M)' },
            { id: 'active', label: `Active (${chitSchemes.filter(c => c.status !== 'matured').length})` },
            { id: 'matured', label: `Matured (${chitSchemes.filter(c => c.status === 'matured').length})` }
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
            placeholder="Search GRT, Lalitha, Chit..."
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

      {/* 5. Chit Scheme Progress Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredSchemes.map(chit => {
          const tenure = chit.chitTenureMonths || 11;
          const paid = chit.chitMonthsPaid || 0;
          const progressPct = Math.min(100, Math.round((paid / tenure) * 100));
          const monthlyAmt = chit.chitMonthlyAmount || chit.monthlySipAmount || 0;
          const isGold = chit.category === 'gold_chit' || chit.name.toLowerCase().includes('gold');
          const isSilver = chit.category === 'silver_chit' || chit.name.toLowerCase().includes('silver');
          const isMatured = chit.status === 'matured' || paid >= tenure;
          const vouchersCount = chit.transactions?.length || 0;

          return (
            <div
              key={chit.id}
              className="p-5 rounded-2xl bg-gradient-to-b from-[#0D1322] to-[#090D18] border border-slate-800 hover:border-amber-500/40 transition-all shadow-xl relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          isGold
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : isSilver
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {isGold ? 'Gold Shett (11M)' : isSilver ? 'Silver Shett (11M)' : 'Family Chit Fund (20M)'}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">{chit.platform}</span>
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
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Monthly Commitment</span>
                    <div className="text-lg font-black text-amber-300 font-mono">{formatCurrency(monthlyAmt)}</div>
                    <span className="text-[10px] text-slate-400">Due 10th-15th</span>
                  </div>
                </div>

                {/* Milestone Step Progress Visualizer */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-semibold">
                      Milestone Progress: <strong className="text-amber-400">{paid} of {tenure} Paid</strong>
                    </span>
                    <span className="text-amber-400 font-mono font-bold">{progressPct}% Complete</span>
                  </div>

                  {/* Grid of Months */}
                  <div
                    className={`grid gap-1.5 pt-1`}
                    style={{ gridTemplateColumns: `repeat(${tenure <= 11 ? 11 : 10}, minmax(0, 1fr))` }}
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
                              ? isGold
                                ? 'bg-gradient-to-t from-amber-600 to-amber-500 text-slate-950 shadow-sm'
                                : isSilver
                                ? 'bg-gradient-to-t from-cyan-600 to-cyan-500 text-slate-950 shadow-sm'
                                : 'bg-gradient-to-t from-emerald-600 to-emerald-500 text-slate-950 shadow-sm'
                              : isCurrent
                              ? 'bg-amber-500/20 border-2 border-amber-500 text-amber-300 animate-pulse font-extrabold'
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

                {/* Scheme Metrics: Accumulated Weight, Total Invested, Market Value */}
                <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-slate-800/80 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#090D18] border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">
                      {isGold ? 'Gold Booked' : isSilver ? 'Silver Booked' : 'Paid Calls'}
                    </span>
                    <span className="text-sm font-black text-amber-300 font-mono">
                      {chit.quantity ? `${chit.quantity}${isGold || isSilver ? 'g' : ' Calls'}` : '—'}
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

                {/* Guaranteed Jeweller Bonus Perk Badge */}
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-amber-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="font-bold">Maturity Perk:</span>
                    <span className="text-amber-200">
                      {chit.maturityBonus
                        ? `+${formatCurrency(chit.maturityBonus)} Free Month Contribution`
                        : '0% Wastage / VA charges on jewellery'}
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-amber-400 uppercase bg-amber-500/20 px-2 py-0.5 rounded">
                    Month 12 Free
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
                  <button
                    onClick={() => handleOpenPaymentModal(chit)}
                    disabled={isMatured}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center space-x-1.5 shadow-md active:scale-95 ${
                      isMatured
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                        : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {isMatured ? 'Scheme Matured!' : `+ Pay Month #${paid + 1} (${formatCurrency(monthlyAmt)})`}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 6. Jeweller Chit Schemes ("Shett") Master Register Table */}
      <div className="rounded-2xl bg-[#0C1222]/90 border border-yellow-500/30 shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0B101D]">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Jeweller Chit Schemes ("Shett") Master Register
            </h3>
            <span className="text-xs text-yellow-400 font-mono">({filteredSchemes.length} Schemes)</span>
          </div>

          <button
            onClick={() => handleOpenEnrollModal('gold_chit')}
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
                <th className="px-5 py-3.5">Scheme & Merchant</th>
                <th className="px-4 py-3.5">Category</th>
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
              {filteredSchemes.map(scheme => {
                const paid = scheme.chitMonthsPaid || 0;
                const tenure = scheme.chitTenureMonths || 11;
                const monthly = scheme.chitMonthlyAmount || scheme.monthlySipAmount || 0;
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
                          isGold
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : isSilver
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {isGold ? 'Gold 11M' : isSilver ? 'Silver 11M' : 'Chit Fund'}
                      </span>
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
                      {scheme.quantity ? `${scheme.quantity}${isGold || isSilver ? 'g' : ' calls'}` : '—'}
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
      {/* 7. MODAL: Enroll New Chit / Shett Scheme (CREATE)                         */}
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
                    Enroll New Chit Scheme ("Shett")
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Add 11-Month Jeweller Scheme, Silver Savings, or Chit Fund
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
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'gold_chit', label: 'Gold Shett (11M)', icon: <Coins className="w-3.5 h-3.5 text-amber-400" /> },
                    { id: 'silver_chit', label: 'Silver Shett (11M)', icon: <Layers className="w-3.5 h-3.5 text-cyan-400" /> },
                    { id: 'other', label: 'Chit Fund (20M)', icon: <Percent className="w-3.5 h-3.5 text-emerald-400" /> }
                  ].map(cat => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => {
                        setFormCategory(cat.id as any);
                        if (cat.id === 'gold_chit') {
                          setFormPlatform('GRT Jewellers');
                          setFormMonthlyAmount(2000);
                          setFormTenureMonths(11);
                          setFormMaturityBonus(2000);
                        } else if (cat.id === 'silver_chit') {
                          setFormPlatform('Lalitha Thanga Maligai');
                          setFormMonthlyAmount(3000);
                          setFormTenureMonths(11);
                          setFormMaturityBonus(3000);
                        } else {
                          setFormPlatform('Sri Saravana Chits (Salem)');
                          setFormMonthlyAmount(5000);
                          setFormTenureMonths(20);
                          setFormMaturityBonus(3500);
                        }
                      }}
                      className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition ${
                        formCategory === cat.id
                          ? 'border-amber-500 bg-amber-500/15 text-white font-bold'
                          : 'border-slate-800 bg-[#090D18] text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {cat.icon}
                      <span>{cat.label}</span>
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
                  placeholder="e.g. GRT Golden Eleven, Lalitha Silver Scheme"
                  className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Jeweller / Platform & Account Number */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Jeweller / Platform *</label>
                  <input
                    type="text"
                    required
                    value={formPlatform}
                    onChange={e => setFormPlatform(e.target.value)}
                    placeholder="GRT, Lalitha, Pothys, Saravana"
                    className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Account / Passbook Code</label>
                  <input
                    type="text"
                    value={formSymbolOrCode}
                    onChange={e => setFormSymbolOrCode(e.target.value)}
                    placeholder="e.g. GRT-GE-90812"
                    className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              {/* Monthly Amount & Tenure */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Monthly Installment (₹) *</label>
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
                  <label className="text-slate-300 font-bold">Total Tenure (Months) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={60}
                    value={formTenureMonths}
                    onChange={e => setFormTenureMonths(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Months Paid & Accumulated Grams */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Already Paid Months</label>
                  <input
                    type="number"
                    min={0}
                    value={formMonthsPaid}
                    onChange={e => setFormMonthsPaid(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-slate-500">0 for new enrolment</span>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Accumulated Grams (Optional)</label>
                  <input
                    type="number"
                    step="any"
                    value={formAccumulatedGrams}
                    onChange={e => setFormAccumulatedGrams(e.target.value)}
                    placeholder="Auto-calculated if empty"
                    className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-emerald-400 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Maturity Bonus (12th Month Free) & Start Date */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">12th Month Bonus (₹)</label>
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

              {/* Notes & Perks */}
              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Scheme Notes & Jeweller Perks</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  placeholder="0% Wastage / VA charges, pooja silver articles, redemption showroom..."
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
      {/* 8. MODAL: Edit Chit Scheme (UPDATE)                                      */}
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
                  <label className="text-slate-300 font-bold">Jeweller / Platform</label>
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

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Monthly Installment (₹)</label>
                  <input
                    type="number"
                    required
                    value={formMonthlyAmount}
                    onChange={e => setFormMonthlyAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Total Tenure (Months)</label>
                  <input
                    type="number"
                    required
                    value={formTenureMonths}
                    onChange={e => setFormTenureMonths(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Months Paid So Far</label>
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
                  <label className="text-slate-300 font-bold">12th Month Bonus (₹)</label>
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
                <label className="text-slate-300 font-bold">Notes & Perks</label>
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
      {/* 9. MODAL: Record Installment Payment (UPDATE & VOUCHER ENTRY)             */}
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
                    Month #{(paymentModalChit.chitMonthsPaid || 0) + 1} of {paymentModalChit.chitTenureMonths || 11} · {paymentModalChit.platform}
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
                    onChange={e => {
                      const val = Number(e.target.value);
                      setPayAmount(e.target.value);
                      if (paymentModalChit.category === 'gold_chit') {
                        setPayGrams(Number((val / 7380).toFixed(4)));
                      } else if (paymentModalChit.category === 'silver_chit') {
                        setPayGrams(Number((val / 97.5).toFixed(3)));
                      }
                    }}
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
                  <option value="UPI (Google Pay / PhonePe)">UPI (Google Pay / PhonePe / Paytm)</option>
                  <option value="Net Banking / IMPS">Net Banking / IMPS / NEFT</option>
                  <option value="Debit / Credit Card">Debit / Credit Card</option>
                  <option value="Cash at Showroom">Cash at Showroom</option>
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
                    placeholder="e.g. GRT/SLM/2026/11"
                    className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Grams Credited</label>
                  <input
                    type="number"
                    step="any"
                    value={payGrams}
                    onChange={e => setPayGrams(e.target.value)}
                    placeholder="Grams booked"
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
                  placeholder="Showroom receipt confirmed"
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
      {/* 10. MODAL: Passbook & Voucher Ledger (READ & MANAGE VOUCHERS)              */}
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
                    {passbookModalChit.platform} · {passbookModalChit.chitMonthsPaid || 0} of {passbookModalChit.chitTenureMonths || 11} Installments Paid
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
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Bullion Booked</span>
                <span className="text-base font-black text-amber-300 font-mono">
                  {passbookModalChit.quantity ? `${passbookModalChit.quantity}g` : '—'}
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
                          {tx.weightGrams ? (
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
      {/* 11. MODAL: Delete Chit Scheme Confirmation (DELETE)                      */}
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
