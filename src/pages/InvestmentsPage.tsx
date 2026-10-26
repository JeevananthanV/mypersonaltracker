import React, { useState, useEffect } from 'react';
import {
  Coins,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  IndianRupee,
  HelpCircle,
  Clock,
  PieChart as PieIcon,
  BarChart3,
  ExternalLink,
  ChevronRight,
  Award,
  RefreshCw,
  Sliders,
  LayoutDashboard,
  ArrowLeft,
  Building2,
  Wallet,
  FileSpreadsheet,
  Flame
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useLifeOS } from '../context/LifeOSContext';
import { InvestmentAsset, InvestmentCategory, BullionTransaction } from '../types';
import { getLiveDateString } from '../utils/date-utils';
import { DigiGoldDashboard } from '../components/investments/DigiGoldDashboard';
import { DigiSilverDashboard } from '../components/investments/DigiSilverDashboard';
import { GrowwStocksDashboard } from '../components/investments/GrowwStocksDashboard';
import { ChitSchemesDashboard } from '../components/investments/ChitSchemesDashboard';
import { MutualFundsDashboard } from '../components/investments/MutualFundsDashboard';
import { DailyPayChitDashboard } from '../components/investments/DailyPayChitDashboard';
import { SalemGoldSchemeSheet } from '../components/investments/SalemGoldSchemeSheet';
import { Card3D } from '../components/ui/Card3D';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { ScrollReveal } from '../components/ui/ScrollReveal';

const formatCurrency = (val: number) => `₹${Math.round(val || 0).toLocaleString('en-IN')}`;
const formatPercentage = (val: number) => `${(val || 0).toFixed(2)}%`;

export const InvestmentsPage: React.FC = () => {
  const {
    investments,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    payChitInstallment,
    addBullionTransaction,
    deleteBullionTransaction,
    recordDailyChitPayment,
    recordDualChitPayment,
    batchPayChitDays,
    updateStockPrice,
    growwSummary,
    totalInvestedCapital,
    totalPortfolioValue,
    totalInvestmentReturns,
    totalInvestmentReturnsPct,
    monthlyInvestmentOutflow,
    triggerConfetti,
    activeSubTab,
    setActiveSubTab
  } = useLifeOS();

  // Groww Live Real-Time Stock Engine State
  const itcAsset = investments.find(i => i.id === 'groww-itc');
  const tatagoldAsset = investments.find(i => i.id === 'groww-tatagold');

  const [itcLiveCmp, setItcLiveCmp] = useState<number>(itcAsset?.currentPrice || 257.90);
  const [tatagoldLiveCmp, setTatagoldLiveCmp] = useState<number>(tatagoldAsset?.currentPrice || 13.63);
  const [isGrowwUpdating, setIsGrowwUpdating] = useState<boolean>(false);
  const [growwSortBy, setGrowwSortBy] = useState<'current' | 'invested' | 'returns' | '1d'>('current');

  const handleUpdateStockCMP = (assetId: string, newPrice: number) => {
    updateStockPrice(assetId, Number(newPrice));
  };

  const handleSyncGrowwLive = () => {
    setIsGrowwUpdating(true);
    updateStockPrice('groww-itc', itcLiveCmp);
    updateStockPrice('groww-tatagold', tatagoldLiveCmp);
    setTimeout(() => {
      setIsGrowwUpdating(false);
      triggerConfetti();
    }, 300);
  };

  const handleResetGrowwOfficial = () => {
    setItcLiveCmp(257.90);
    setTatagoldLiveCmp(13.63);
    updateStockPrice('groww-itc', 257.90);
    updateStockPrice('groww-tatagold', 13.63);
    triggerConfetti();
  };

  // Filter state
  const [activeDashboardTab, setActiveDashboardTab] = useState<
    'overview' | 'daily_chit' | 'salem_gold_sheet' | 'digi_gold' | 'digi_silver' | 'groww_stocks' | 'chits' | 'mutual_funds'
  >('overview');

  useEffect(() => {
    if (activeSubTab && ['overview', 'daily_chit', 'salem_gold_sheet', 'digi_gold', 'digi_silver', 'groww_stocks', 'chits', 'mutual_funds'].includes(activeSubTab)) {
      setActiveDashboardTab(activeSubTab as any);
    }
  }, [activeSubTab]);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<InvestmentAsset | null>(null);
  const [payingChitAsset, setPayingChitAsset] = useState<InvestmentAsset | null>(null);

  // Bullion Transaction & Scheme Modals State
  const [selectedBullionAsset, setSelectedBullionAsset] = useState<InvestmentAsset | null>(null);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositAssetId, setDepositAssetId] = useState<string>('pothys-digi-gold');
  const [depositAmount, setDepositAmount] = useState<number>(500);
  const [depositRate, setDepositRate] = useState<number>(13515);
  const [depositBonusPct, setDepositBonusPct] = useState<number>(7);
  const [depositDocNo, setDepositDocNo] = useState<string>('');
  const [depositPromoCode, setDepositPromoCode] = useState<string>('');
  const [depositDate, setDepositDate] = useState<string>(getLiveDateString());
  const [depositNotes, setDepositNotes] = useState<string>('Gold Saving Plan - 22K gold instant bonus');
  const [isSchemeRulesModalOpen, setIsSchemeRulesModalOpen] = useState(false);

  // Form State for Add / Edit
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<InvestmentCategory>('digi_gold');
  const [formPlatform, setFormPlatform] = useState('Groww / MMTC-PAMP');
  const [formSymbol, setFormSymbol] = useState('');
  const [formInvestedAmount, setFormInvestedAmount] = useState<number>(5000);
  const [formCurrentValue, setFormCurrentValue] = useState<number>(5500);
  const [formQuantity, setFormQuantity] = useState<number>(1);
  const [formUnitType, setFormUnitType] = useState<'grams' | 'shares' | 'units' | 'chit_tokens' | 'lot'>('grams');
  const [formBuyPrice, setFormBuyPrice] = useState<number>(5000);
  const [formCurrentPrice, setFormCurrentPrice] = useState<number>(5500);
  const [formIsMonthlySip, setFormIsMonthlySip] = useState(false);
  const [formMonthlySipAmount, setFormMonthlySipAmount] = useState<number>(1000);
  const [formChitMonthlyAmount, setFormChitMonthlyAmount] = useState<number>(2000);
  const [formChitTenureMonths, setFormChitTenureMonths] = useState<number>(11);
  const [formChitMonthsPaid, setFormChitMonthsPaid] = useState<number>(1);
  const [formMaturityBonus, setFormMaturityBonus] = useState<number>(2000);
  const [formNotes, setFormNotes] = useState('');
  const [formColorTag, setFormColorTag] = useState('amber');

  // Live Dynamic Bullion Spot Rates (₹ / gram)
  const [goldSpotRate, setGoldSpotRate] = useState<number>(7380);
  const [silverSpotRate, setSilverSpotRate] = useState<number>(97.5);
  const [isSpotUpdating, setIsSpotUpdating] = useState(false);

  // Calculated live values for deposit modal
  const calcBaseWeight = depositRate > 0 ? Number((depositAmount / depositRate).toFixed(5)) : 0;
  const calcBonusWeight = Number(((calcBaseWeight * depositBonusPct) / 100).toFixed(5));
  const calcTotalCreditWeight = Number((calcBaseWeight + calcBonusWeight).toFixed(5));

  const handleOpenDepositModal = (assetId: 'pothys-digi-gold' | 'pothys-digi-silver') => {
    setDepositAssetId(assetId);
    if (assetId === 'pothys-digi-gold') {
      setDepositAmount(500);
      setDepositRate(13515);
      setDepositBonusPct(7);
      setDepositDocNo(`APP27SCTM/${Math.floor(1900000 + Math.random() * 99999)}`);
      setDepositNotes('Gold Saving Plan - 22K gold instant bonus');
    } else {
      setDepositAmount(500);
      setDepositRate(230);
      setDepositBonusPct(7);
      setDepositDocNo(`APP27SCTM/${Math.floor(1900000 + Math.random() * 99999)}`);
      setDepositNotes('App online transfer • 7% Instant Bonus');
    }
    setDepositDate(getLiveDateString());
    setDepositPromoCode('');
    setIsDepositModalOpen(true);
  };

  const handleSaveBullionDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositAssetId || depositAmount <= 0 || depositRate <= 0) return;

    addBullionTransaction(depositAssetId, {
      date: depositDate || getLiveDateString(),
      amount: Number(depositAmount),
      rate: Number(depositRate),
      weightGrams: calcBaseWeight,
      bonusWeightGrams: calcBonusWeight,
      bonusPercentage: Number(depositBonusPct),
      docNo: depositDocNo.trim() || undefined,
      promoCode: depositPromoCode.trim() || undefined,
      notes: depositNotes.trim() || undefined
    });

    setIsDepositModalOpen(false);
  };

  // Bullion calculations
  const totalGoldGrams = investments
    .filter(i => (i.category === 'digi_gold' || i.category === 'gold_chit') && i.quantity)
    .reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);

  const totalSilverGrams = investments
    .filter(i => (i.category === 'silver_chit' || i.name.toLowerCase().includes('silver')) && i.quantity)
    .reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);

  // Dynamic Spot Rate Valuation Recalculator
  const handleRecalculateBullionValuations = () => {
    setIsSpotUpdating(true);
    investments.forEach(item => {
      if (item.category === 'digi_gold' || item.category === 'gold_chit') {
        if (item.quantity && item.quantity > 0) {
          const newVal = Math.round(item.quantity * goldSpotRate);
          const gain = newVal - item.investedAmount;
          const gainPct = item.investedAmount > 0 ? (gain / item.investedAmount) * 100 : 0;
          updateInvestment(item.id, {
            currentValue: newVal,
            currentPrice: goldSpotRate,
            unrealizedGain: gain,
            unrealizedGainPct: Number(gainPct.toFixed(2)),
            updatedAt: getLiveDateString()
          });
        }
      } else if (item.category === 'silver_chit' || item.name.toLowerCase().includes('silver')) {
        if (item.quantity && item.quantity > 0) {
          const newVal = Math.round(item.quantity * silverSpotRate);
          const gain = newVal - item.investedAmount;
          const gainPct = item.investedAmount > 0 ? (gain / item.investedAmount) * 100 : 0;
          updateInvestment(item.id, {
            currentValue: newVal,
            currentPrice: silverSpotRate,
            unrealizedGain: gain,
            unrealizedGainPct: Number(gainPct.toFixed(2)),
            updatedAt: getLiveDateString()
          });
        }
      }
    });
    setTimeout(() => {
      setIsSpotUpdating(false);
      triggerConfetti();
    }, 300);
  };

  // Chit schemes
  const chitSchemes = investments.filter(
    i =>
      i.category === 'gold_chit' ||
      i.category === 'silver_chit' ||
      i.category === 'offline_chit' ||
      i.category === 'digi_gold' ||
      i.id === 'pothys-digi-gold' ||
      i.id === 'pothys-digi-silver' ||
      i.chitTenureMonths !== undefined
  );

  // Filtered investments
  const filteredInvestments = investments.filter(item => {
    const matchesCategory =
      activeCategory === 'all'
        ? true
        : activeCategory === 'chits'
        ? item.category === 'gold_chit' || item.category === 'silver_chit' || item.category === 'offline_chit' || item.chitTenureMonths
        : activeCategory === 'bullion'
        ? item.category === 'digi_gold' || item.category === 'gold_chit' || item.category === 'silver_chit' || item.category === 'offline_chit'
        : activeCategory === 'groww_stocks'
        ? item.category === 'groww_stocks'
        : activeCategory === 'funds'
        ? item.category === 'mutual_funds' || item.category === 'etf'
        : item.category === activeCategory;

    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.symbolOrCode && item.symbolOrCode.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Recharts Data
  const categoryAllocationData = [
    {
      name: 'Digital Gold',
      value: investments.filter(i => i.category === 'digi_gold').reduce((s, i) => s + i.currentValue, 0),
      color: '#F59E0B'
    },
    {
      name: 'Gold Chit (Shett)',
      value: investments.filter(i => i.category === 'gold_chit').reduce((s, i) => s + i.currentValue, 0),
      color: '#EAB308'
    },
    {
      name: 'Silver Chit (Shett)',
      value: investments.filter(i => i.category === 'silver_chit').reduce((s, i) => s + i.currentValue, 0),
      color: '#94A3B8'
    },
    {
      name: 'Groww Stocks',
      value: investments.filter(i => i.category === 'groww_stocks').reduce((s, i) => s + i.currentValue, 0),
      color: '#10B981'
    },
    {
      name: 'Mutual Funds',
      value: investments.filter(i => i.category === 'mutual_funds').reduce((s, i) => s + i.currentValue, 0),
      color: '#6366F1'
    },
    {
      name: 'Gold ETFs',
      value: investments.filter(i => i.category === 'etf').reduce((s, i) => s + i.currentValue, 0),
      color: '#D97706'
    }
  ].filter(d => d.value > 0);

  const capitalVsValueData = investments.map(i => ({
    name: i.symbolOrCode || i.name.slice(0, 10),
    fullName: i.name,
    invested: i.investedAmount,
    current: i.currentValue,
    gain: i.currentValue - i.investedAmount
  }));

  // Category-specific asset subsets for dedicated dashboards
  const pothysGold = investments.find(i => i.id === 'pothys-digi-gold');
  const pothysSilver = investments.find(i => i.id === 'pothys-digi-silver');
  const itc = investments.find(i => i.id === 'groww-itc');
  const tatagold = investments.find(i => i.id === 'groww-tatagold');

  const goldInvestments = investments.filter(
    i => i.category === 'digi_gold' || i.id === 'pothys-digi-gold' || (i.name.toLowerCase().includes('gold') && !i.category.includes('chit') && i.category !== 'etf')
  );
  const silverInvestments = investments.filter(
    i => i.id === 'pothys-digi-silver' || (i.name.toLowerCase().includes('silver') && !i.category.includes('chit'))
  );
  const growwInvestments = investments.filter(
    i => i.category === 'groww_stocks' || i.id.startsWith('groww-') || i.category === 'etf' || i.platform.toLowerCase().includes('groww')
  );
  const mutualFundInvestments = investments.filter(
    i => i.category === 'mutual_funds' || i.category === 'etf'
  );

  const handleOpenAddModal = (presetCategory?: InvestmentCategory) => {
    setEditingAsset(null);
    setFormName('');
    setFormCategory(presetCategory || 'digi_gold');
    setFormPlatform(
      presetCategory === 'groww_stocks' || presetCategory === 'mutual_funds'
        ? 'Groww App'
        : presetCategory === 'gold_chit'
        ? 'GRT Jewellers / Tanishq'
        : presetCategory === 'silver_chit'
        ? 'Lalitha Thanga Maligai'
        : 'Groww / MMTC-PAMP'
    );
    setFormSymbol('');
    setFormInvestedAmount(5000);
    setFormCurrentValue(5500);
    setFormQuantity(presetCategory === 'digi_gold' ? 0.75 : presetCategory === 'groww_stocks' ? 10 : 1);
    setFormUnitType(
      presetCategory === 'groww_stocks'
        ? 'shares'
        : presetCategory === 'mutual_funds' || presetCategory === 'etf'
        ? 'units'
        : 'grams'
    );
    setFormBuyPrice(5000);
    setFormCurrentPrice(5500);
    setFormIsMonthlySip(presetCategory === 'gold_chit' || presetCategory === 'silver_chit');
    setFormMonthlySipAmount(2000);
    setFormChitMonthlyAmount(2000);
    setFormChitTenureMonths(11);
    setFormChitMonthsPaid(1);
    setFormMaturityBonus(2000);
    setFormNotes('');
    setFormColorTag('amber');
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (asset: InvestmentAsset) => {
    setEditingAsset(asset);
    setFormName(asset.name);
    setFormCategory(asset.category);
    setFormPlatform(asset.platform);
    setFormSymbol(asset.symbolOrCode || '');
    setFormInvestedAmount(asset.investedAmount);
    setFormCurrentValue(asset.currentValue);
    setFormQuantity(asset.quantity || 1);
    setFormUnitType(asset.unitType || 'grams');
    setFormBuyPrice(asset.buyPriceAverage || asset.investedAmount);
    setFormCurrentPrice(asset.currentPrice || asset.currentValue);
    setFormIsMonthlySip(Boolean(asset.isMonthlySip));
    setFormMonthlySipAmount(asset.monthlySipAmount || 1000);
    setFormChitMonthlyAmount(asset.chitMonthlyAmount || asset.monthlySipAmount || 2000);
    setFormChitTenureMonths(asset.chitTenureMonths || 11);
    setFormChitMonthsPaid(asset.chitMonthsPaid || 1);
    setFormMaturityBonus(asset.maturityBonus || 0);
    setFormNotes(asset.notes || '');
    setFormColorTag(asset.colorTag || 'amber');
    setIsAddModalOpen(true);
  };

  const handleSaveAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const gain = Number(formCurrentValue) - Number(formInvestedAmount);
    const gainPct = formInvestedAmount > 0 ? (gain / formInvestedAmount) * 100 : 0;

    const assetData: Omit<InvestmentAsset, 'id'> = {
      name: formName.trim(),
      category: formCategory,
      platform: formPlatform.trim() || 'Groww',
      symbolOrCode: formSymbol.trim() || undefined,
      investedAmount: Number(formInvestedAmount) || 0,
      currentValue: Number(formCurrentValue) || 0,
      quantity: Number(formQuantity) || undefined,
      unitType: formUnitType,
      buyPriceAverage: Number(formBuyPrice) || undefined,
      currentPrice: Number(formCurrentPrice) || undefined,
      isMonthlySip: formIsMonthlySip,
      monthlySipAmount: formIsMonthlySip ? Number(formMonthlySipAmount) || undefined : undefined,
      chitMonthlyAmount:
        formCategory === 'gold_chit' || formCategory === 'silver_chit'
          ? Number(formChitMonthlyAmount) || undefined
          : undefined,
      chitTenureMonths:
        formCategory === 'gold_chit' || formCategory === 'silver_chit'
          ? Number(formChitTenureMonths) || 11
          : undefined,
      chitMonthsPaid:
        formCategory === 'gold_chit' || formCategory === 'silver_chit'
          ? Number(formChitMonthsPaid) || 1
          : undefined,
      maturityBonus:
        formCategory === 'gold_chit' || formCategory === 'silver_chit'
          ? Number(formMaturityBonus) || 0
          : undefined,
      unrealizedGain: gain,
      unrealizedGainPct: Number(gainPct.toFixed(2)),
      status: 'active',
      notes: formNotes.trim() || undefined,
      colorTag: formColorTag,
      updatedAt: getLiveDateString()
    };

    if (editingAsset) {
      updateInvestment(editingAsset.id, assetData);
    } else {
      addInvestment(assetData);
    }

    setIsAddModalOpen(false);
  };

  const handlePayChitQuick = (asset: InvestmentAsset) => {
    payChitInstallment(asset.id);
  };

  const getCategoryBadge = (category: InvestmentCategory) => {
    switch (category) {
      case 'digi_gold':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            Digital Gold (24K)
          </span>
        );
      case 'gold_chit':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-yellow-500/15 text-yellow-300 border border-yellow-500/30 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-yellow-400" />
            Gold Chit (Shett)
          </span>
        );
      case 'silver_chit':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-400/15 text-slate-200 border border-slate-400/30 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-300" />
            Silver Chit (Shett)
          </span>
        );
      case 'groww_stocks':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            Groww Stocks
          </span>
        );
      case 'mutual_funds':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Mutual Fund SIP
          </span>
        );
      case 'etf':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            Gold ETF
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
            {category}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#0C1222] via-[#0E172E] to-[#121B3A] border border-amber-500/20 shadow-xl relative overflow-hidden">
        {/* Glow ambient circle */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-400/20 to-yellow-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Coins className="w-3 h-3 text-amber-400" />
              Wealth & Portfolio Center
            </span>
            <span className="text-xs text-slate-400 font-mono">Live Sync</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Investment Portfolio & Wealth Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Unified management for <span className="text-amber-300 font-medium">Digital Gold</span>,{' '}
            <span className="text-yellow-300 font-medium">Gold & Silver Chits ("Shett" 11-Month Schemes)</span>, and{' '}
            <span className="text-emerald-300 font-medium">Groww App Direct Stocks & SIPs</span>.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => handleOpenAddModal('gold_chit')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 border border-amber-500/30 transition flex items-center space-x-1.5 shadow-sm"
          >
            <Coins className="w-4 h-4 text-amber-400" />
            <span>+ Add Gold / Silver Shett</span>
          </button>
          <button
            onClick={() => handleOpenAddModal('groww_stocks')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-200 border border-emerald-500/30 transition flex items-center space-x-1.5 shadow-sm"
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>+ Add Groww Stock</span>
          </button>
          <button
            onClick={() => handleOpenAddModal()}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 transition shadow-lg shadow-amber-500/20 flex items-center space-x-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Asset</span>
          </button>
        </div>
      </div>

      {/* 2. Category Dashboard Navigation Tabs */}
      <div className="bg-[#0C1222]/95 p-1.5 rounded-2xl border border-slate-800 shadow-xl flex items-center overflow-x-auto gap-2 scrollbar-thin">
        {[
          {
            id: 'overview',
            label: 'Portfolio Overview',
            icon: LayoutDashboard,
            badge: `${investments.length} Assets`,
            activeBg: 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/20'
          },
          {
            id: 'daily_chit',
            label: 'Daily Pay Chit Record',
            icon: Flame,
            badge: '₹100/day Target',
            activeBg: 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/20'
          },
          {
            id: 'salem_gold_sheet',
            label: 'Salem Gold Sheet & Rates',
            icon: FileSpreadsheet,
            badge: 'Salem Live',
            activeBg: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
          },
          {
            id: 'digi_gold',
            label: 'Digital Gold (22K)',
            icon: Coins,
            badge: `${totalGoldGrams.toFixed(4)}g`,
            activeBg: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
          },
          {
            id: 'digi_silver',
            label: 'Digital Silver (999)',
            icon: ShieldCheck,
            badge: `${totalSilverGrams.toFixed(2)}g`,
            activeBg: 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-black shadow-lg shadow-cyan-500/20'
          },
          {
            id: 'groww_stocks',
            label: 'Groww Stocks & ETFs',
            icon: TrendingUp,
            badge: formatCurrency(growwSummary?.totalCurrent || 1821),
            activeBg: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
          },
          {
            id: 'chits',
            label: 'Gold & Silver Chits (Shett)',
            icon: Award,
            badge: `${chitSchemes.length} Schemes`,
            activeBg: 'bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 font-black shadow-lg shadow-yellow-500/20'
          },
          {
            id: 'mutual_funds',
            label: 'Mutual Funds & SIPs',
            icon: Sparkles,
            badge: `${mutualFundInvestments.length} SIPs`,
            activeBg: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-black shadow-lg shadow-indigo-500/20'
          },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeDashboardTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveDashboardTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 shrink-0 active:scale-95 ${
                isActive
                  ? tab.activeBg
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? '' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                isActive ? 'bg-black/25 text-current' : 'bg-slate-800 text-slate-400'
              }`}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* DASHBOARD 1: PORTFOLIO EXECUTIVE OVERVIEW */}
      {activeDashboardTab === 'overview' && (
        <div className="space-y-8 animate-fade-in">
          {/* Executive KPI Cards Row */}
          {/* Executive KPI Cards Row with 3D Perspective Tilt & ScrollTrigger */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 perspective-1000">
            {/* Card 1: Total Portfolio Value */}
            <ScrollReveal animation="fade-up" delay={50}>
              <Card3D glowColor="amber" className="h-full">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl shadow-xl h-full flex flex-col justify-between hover:border-amber-500/50 transition-colors group">
                  <div className="flex items-center justify-between text-slate-400 mb-3">
                    <span className="text-xs font-bold tracking-wide uppercase text-slate-300">Portfolio Valuation</span>
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-inner group-hover:scale-110 transition-transform">
                      <Coins className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white tracking-tight">
                      <AnimatedCounter value={totalPortfolioValue} prefix="₹" />
                    </div>
                    <div className="mt-2 flex items-center space-x-1.5 text-xs">
                      <span className="text-emerald-400 font-bold flex items-center">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        +<AnimatedCounter value={totalInvestmentReturnsPct} decimals={2} suffix="%" />
                      </span>
                      <span className="text-slate-400">all-time returns</span>
                    </div>
                  </div>
                  <div className="mt-3 w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 h-full rounded-full w-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                  </div>
                </div>
              </Card3D>
            </ScrollReveal>

            {/* Card 2: Total Invested Capital */}
            <ScrollReveal animation="fade-up" delay={100}>
              <Card3D glowColor="indigo" className="h-full">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl shadow-xl h-full flex flex-col justify-between hover:border-indigo-500/50 transition-colors group">
                  <div className="flex items-center justify-between text-slate-400 mb-3">
                    <span className="text-xs font-bold tracking-wide uppercase text-slate-300">Invested Capital</span>
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-inner group-hover:scale-110 transition-transform">
                      <IndianRupee className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white tracking-tight">
                      <AnimatedCounter value={totalInvestedCapital} prefix="₹" />
                    </div>
                    <p className="mt-2 text-xs text-slate-400 font-medium">
                      Total principal deployed
                    </p>
                  </div>
                  <div className="mt-3 w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-blue-400 h-full rounded-full w-full shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                  </div>
                </div>
              </Card3D>
            </ScrollReveal>

            {/* Card 3: Unrealized Profit / Loss */}
            <ScrollReveal animation="fade-up" delay={150}>
              <Card3D glowColor="emerald" className="h-full">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-xl shadow-xl h-full flex flex-col justify-between hover:border-emerald-500/60 transition-colors group">
                  <div className="flex items-center justify-between text-slate-400 mb-3">
                    <span className="text-xs font-bold tracking-wide uppercase text-emerald-400">Unrealized Gain</span>
                    <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 shadow-inner group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-emerald-400 tracking-tight">
                      +<AnimatedCounter value={totalInvestmentReturns} prefix="₹" />
                    </div>
                    <div className="mt-2 flex items-center space-x-1.5 text-xs text-emerald-300 font-medium">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Net profit on holdings</span>
                    </div>
                  </div>
                  <div className="mt-3 w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full w-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  </div>
                </div>
              </Card3D>
            </ScrollReveal>

            {/* Card 4: Monthly Outflow (Chits + SIPs) */}
            <ScrollReveal animation="fade-up" delay={200}>
              <Card3D glowColor="amber" className="h-full">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl shadow-xl h-full flex flex-col justify-between hover:border-yellow-500/50 transition-colors group">
                  <div className="flex items-center justify-between text-slate-400 mb-3">
                    <span className="text-xs font-bold tracking-wide uppercase text-slate-300">Monthly Commitment</span>
                    <div className="p-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 shadow-inner group-hover:scale-110 transition-transform">
                      <Calendar className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white tracking-tight flex items-baseline">
                      <AnimatedCounter value={monthlyInvestmentOutflow} prefix="₹" />
                      <span className="text-xs font-normal text-slate-400 ml-1">/mo</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-400 font-medium">
                      Gold Chit + Silver + SIP
                    </p>
                  </div>
                  <div className="mt-3 w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full w-3/4 shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                  </div>
                </div>
              </Card3D>
            </ScrollReveal>

            {/* Card 5: Bullion Reserves (Gold & Silver) */}
            <ScrollReveal animation="fade-up" delay={250}>
              <Card3D glowColor="amber" className="h-full">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/30 backdrop-blur-xl shadow-xl h-full flex flex-col justify-between hover:border-amber-500/60 transition-colors group">
                  <div className="flex items-center justify-between text-slate-400 mb-3">
                    <span className="text-xs font-bold tracking-wide uppercase text-amber-300">Bullion Reserves</span>
                    <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/25 text-amber-400 shadow-inner group-hover:scale-110 transition-transform">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-baseline space-x-3">
                      <div>
                        <span className="text-xl font-black text-amber-300">
                          <AnimatedCounter value={totalGoldGrams} decimals={4} suffix="g" />
                        </span>
                        <span className="text-[10px] text-amber-400/80 ml-1 font-bold">Gold (22K)</span>
                      </div>
                      <div className="border-l border-slate-700 pl-3">
                        <span className="text-lg font-black text-slate-200">
                          <AnimatedCounter value={totalSilverGrams} decimals={2} suffix="g" />
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1 font-bold">Silver</span>
                      </div>
                    </div>
                    <p className="mt-2 text-[11px] text-slate-400 font-medium">
                      Pothys Swarna Mahal DigiGold
                    </p>
                  </div>
                  <div className="mt-3 w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-slate-300 h-full rounded-full w-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                  </div>
                </div>
              </Card3D>
            </ScrollReveal>
          </div>

      {/* 2B. Live Bullion Spot Price Ticker Bar & Dynamic Valuation Engine */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-950 border border-amber-500/30 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0">
            <Coins className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-extrabold text-white">Live Bullion Spot Rates & Dynamic Valuation Engine</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                Live Dynamic
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Adjust spot market rates per gram below to dynamically re-evaluate your Digital Gold, Gold Chits, and Silver Chits based on accumulated weight.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Gold Rate Input */}
          <div className="flex items-center space-x-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-amber-500/30">
            <span className="text-xs font-bold text-amber-400">Gold 24K:</span>
            <span className="text-xs text-slate-400 font-mono">₹</span>
            <input
              type="number"
              value={goldSpotRate}
              onChange={e => setGoldSpotRate(Number(e.target.value) || 0)}
              className="w-16 bg-transparent text-xs font-mono font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-500 rounded px-1"
            />
            <span className="text-[10px] text-slate-500">/g</span>
          </div>

          {/* Silver Rate Input */}
          <div className="flex items-center space-x-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-700">
            <span className="text-xs font-bold text-slate-300">Silver 999:</span>
            <span className="text-xs text-slate-400 font-mono">₹</span>
            <input
              type="number"
              step="0.5"
              value={silverSpotRate}
              onChange={e => setSilverSpotRate(Number(e.target.value) || 0)}
              className="w-14 bg-transparent text-xs font-mono font-bold text-white focus:outline-none focus:ring-1 focus:ring-slate-400 rounded px-1"
            />
            <span className="text-[10px] text-slate-500">/g</span>
          </div>

          {/* Recalculate Button */}
          <button
            onClick={handleRecalculateBullionValuations}
            disabled={isSpotUpdating}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition flex items-center space-x-1.5 shadow-md active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSpotUpdating ? 'animate-spin' : ''}`} />
            <span>{isSpotUpdating ? 'Recalculating...' : 'Recalculate Valuations'}</span>
          </button>
        </div>
      </div>

      {/* Category Hub Quick-Jump Navigator (5 Cards) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            Category Hubs & Dedicated Command Centers
          </h3>
          <span className="text-[11px] text-slate-500">Click any card to open its dedicated dashboard</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {/* Hub 0: Daily Pay Chit Record */}
          <div
            onClick={() => setActiveDashboardTab('daily_chit')}
            className="p-4 rounded-xl bg-gradient-to-br from-[#201509] via-[#160E05] to-[#0A0703] border border-amber-500/50 hover:border-amber-400 shadow-lg cursor-pointer transition group relative flex flex-col justify-between active:scale-95 ring-1 ring-amber-500/20"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 flex items-center gap-1 shadow-sm">
                  <Flame className="w-3 h-3" />
                  Daily Pay Chit
                </span>
                <span className="text-[10px] text-amber-300 font-bold bg-amber-500/15 px-1.5 py-0.5 rounded border border-amber-500/30">
                  ₹100/day
                </span>
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition flex items-center gap-1.5">
                <span>Pothys 22K Saving Plan</span>
              </h4>
              <div className="text-xl font-black text-amber-300 font-mono">
                Day 11 <span className="text-xs text-amber-400/80 font-normal">/ 300</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Target: <strong className="text-slate-200">₹100/day</strong> · Start: <strong className="text-amber-300">15-Oct-2026</strong>
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-amber-500/20 flex items-center justify-between text-xs text-amber-400 font-bold group-hover:translate-x-0.5 transition">
              <span>Open Daily Terminal</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Hub 1: Digi Gold */}
          <div
            onClick={() => setActiveDashboardTab('digi_gold')}
            className="p-4 rounded-xl bg-gradient-to-br from-[#121B33] to-[#0A0F21] border border-amber-500/30 hover:border-amber-400/60 shadow-lg cursor-pointer transition group relative flex flex-col justify-between active:scale-95"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Digital Gold
                </span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  +7% Bonus
                </span>
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                Pothys 22K Gold Saving
              </h4>
              <div className="text-xl font-black text-amber-300 font-mono">
                {totalGoldGrams.toFixed(5)} <span className="text-xs text-amber-400/80">gms</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Invested: <strong className="text-slate-200">{formatCurrency(pothysGold?.investedAmount || 500)}</strong> · Value: <strong className="text-emerald-400">{formatCurrency(pothysGold?.currentValue || 292)}</strong>
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-amber-400 font-bold group-hover:translate-x-0.5 transition">
              <span>Open Gold Dashboard</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Hub 2: Digi Silver */}
          <div
            onClick={() => setActiveDashboardTab('digi_silver')}
            className="p-4 rounded-xl bg-gradient-to-br from-[#0F1E33] to-[#0A1221] border border-cyan-500/30 hover:border-cyan-400/60 shadow-lg cursor-pointer transition group relative flex flex-col justify-between active:scale-95"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  Digital Silver
                </span>
                <span className="text-[10px] text-cyan-300 font-mono">999 Pure</span>
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                Pothys Silver Saving
              </h4>
              <div className="text-xl font-black text-slate-100 font-mono">
                {totalSilverGrams.toFixed(5)} <span className="text-xs text-cyan-300/80">gms</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Invested: <strong className="text-slate-200">{formatCurrency(pothysSilver?.investedAmount || 1100)}</strong> · Value: <strong className="text-emerald-400">{formatCurrency(pothysSilver?.currentValue || 483)}</strong>
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-cyan-400 font-bold group-hover:translate-x-0.5 transition">
              <span>Open Silver Dashboard</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Hub 3: Groww Stocks */}
          <div
            onClick={() => setActiveDashboardTab('groww_stocks')}
            className="p-4 rounded-xl bg-gradient-to-br from-[#0C1F1E] to-[#071214] border border-emerald-500/30 hover:border-emerald-400/60 shadow-lg cursor-pointer transition group relative flex flex-col justify-between active:scale-95"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Groww Stocks
                </span>
                <span className="text-[10px] text-rose-400 font-mono font-bold">
                  1D: -₹12.02
                </span>
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition">
                ITC & TATAGOLD
              </h4>
              <div className="text-xl font-black text-emerald-400 font-mono">
                ₹{(growwSummary?.totalCurrent || 1821.07).toFixed(2)}
              </div>
              <p className="text-[11px] text-slate-400">
                Invested: <strong className="text-slate-200">₹{(growwSummary?.totalInvested || 1977.28).toFixed(2)}</strong> (2 Holdings)
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-emerald-400 font-bold group-hover:translate-x-0.5 transition">
              <span>Open Groww Terminal</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Hub 4: Chit Schemes */}
          <div
            onClick={() => setActiveDashboardTab('chits')}
            className="p-4 rounded-xl bg-gradient-to-br from-[#1A180E] to-[#0E0F14] border border-yellow-500/30 hover:border-yellow-400/60 shadow-lg cursor-pointer transition group relative flex flex-col justify-between active:scale-95"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">
                  Jewellery Chits
                </span>
                <span className="text-[10px] text-yellow-400 font-bold">11-Month Shett</span>
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-yellow-300 transition">
                GRT & Lalitha Schemes
              </h4>
              <div className="text-xl font-black text-yellow-300 font-mono">
                {formatCurrency(chitSchemes.reduce((s, c) => s + (c.chitMonthlyAmount || c.monthlySipAmount || 0), 0))}<span className="text-xs text-slate-400">/mo</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {chitSchemes.length} Schemes Active · 1/11 Paid · Month 12 Bonus
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-yellow-400 font-bold group-hover:translate-x-0.5 transition">
              <span>Open Chit Dashboard</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Hub 5: Mutual Funds */}
          <div
            onClick={() => setActiveDashboardTab('mutual_funds')}
            className="p-4 rounded-xl bg-gradient-to-br from-[#14122E] to-[#0A0A17] border border-indigo-500/30 hover:border-indigo-400/60 shadow-lg cursor-pointer transition group relative flex flex-col justify-between active:scale-95"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  Mutual Funds
                </span>
                <span className="text-[10px] text-indigo-300 font-mono">SIP Tracker</span>
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition">
                PPFAS & Nifty 50
              </h4>
              <div className="text-xl font-black text-indigo-300 font-mono">
                ₹2,000<span className="text-xs text-slate-400">/mo</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {mutualFundInvestments.length} SIP Portfolios · Disciplined Auto-Debit
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-indigo-400 font-bold group-hover:translate-x-0.5 transition">
              <span>Open MF Dashboard</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* 2.75 Specialized Showcase: Groww App — Real-Time Equity & Gold ETF Command Terminal */}
      {(() => {
        const itc = investments.find(i => i.id === 'groww-itc');
        const tatagold = investments.find(i => i.id === 'groww-tatagold');

        const itcQty = itc?.quantity || 5;
        const itcInvested = itc?.investedAmount || 1450.00;
        const itcCurrent = itc?.currentValue || 1289.50;
        const itcCmp = itc?.currentPrice || 257.90;
        const itcBuyAvg = itc?.buyPriceAverage || 290.00;
        const itcReturn = itc?.unrealizedGain !== undefined ? itc.unrealizedGain : -160.50;
        const itcReturnPct = itc?.unrealizedGainPct !== undefined ? itc.unrealizedGainPct : -11.07;
        const itcOneDay = itc?.oneDayReturn !== undefined ? itc.oneDayReturn : -10.50;
        const itcOneDayPct = itc?.oneDayReturnPct !== undefined ? itc.oneDayReturnPct : -0.81;

        const tataQty = tatagold?.quantity || 39;
        const tataInvested = tatagold?.investedAmount || 527.28;
        const tataCurrent = tatagold?.currentValue || 531.57;
        const tataCmp = tatagold?.currentPrice || 13.63;
        const tataBuyAvg = tatagold?.buyPriceAverage || 13.52;
        const tataReturn = tatagold?.unrealizedGain !== undefined ? tatagold.unrealizedGain : 4.29;
        const tataReturnPct = tatagold?.unrealizedGainPct !== undefined ? tatagold.unrealizedGainPct : 0.81;
        const tataOneDay = tatagold?.oneDayReturn !== undefined ? tatagold.oneDayReturn : -1.52;
        const tataOneDayPct = tatagold?.oneDayReturnPct !== undefined ? tatagold.oneDayReturnPct : -0.29;

        const totalGrowwInvested = growwSummary?.totalInvested || 1977.28;
        const totalGrowwCurrent = growwSummary?.totalCurrent || 1821.07;
        const totalGrowwReturns = growwSummary?.totalReturns || -156.21;
        const totalGrowwReturnsPct = growwSummary?.totalReturnsPct || -7.90;
        const totalGrowwOneDay = growwSummary?.oneDayReturns || -12.02;
        const totalGrowwOneDayPct = growwSummary?.oneDayReturnsPct || -0.66;

        return (
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0B1E1C] via-[#081717] to-[#050D11] border border-emerald-500/40 shadow-2xl space-y-6 relative overflow-hidden">
            {/* Ambient Background glows */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Groww Header Banner */}
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 flex items-center gap-1.5 shadow-md">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Groww App
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    HOLDINGS (2)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    NSE Live Real-Time Feed
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>Groww App — Real-Time Equity & Gold ETF Portfolio</span>
                </h2>
                <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
                  Real-time synchronization for your direct equity shares and exchange traded funds. Monitor daily 1D return fluctuations, overall unrealized profit/loss, and test live market price scenarios dynamically.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={handleResetGrowwOfficial}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 transition flex items-center space-x-1.5"
                  title="Reset to official Groww statement figures"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Reset to Groww Statement</span>
                </button>
                <button
                  onClick={handleSyncGrowwLive}
                  disabled={isGrowwUpdating}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 transition flex items-center space-x-1.5 shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGrowwUpdating ? 'animate-spin' : ''}`} />
                  <span>{isGrowwUpdating ? 'Syncing...' : 'Sync Live CMP'}</span>
                </button>
                <button
                  onClick={() => handleOpenAddModal('groww_stocks')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 transition flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Stock</span>
                </button>
              </div>
            </div>

            {/* Groww App Executive KPI Strip (Exact Groww app metrics) */}
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

            {/* Individual Stock Cards Grid (2 Columns: ITC & TATAGOLD) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card 1: ITC Limited */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0C1F1E] via-[#091717] to-[#071214] border border-emerald-500/30 shadow-xl space-y-4 relative flex flex-col justify-between">
                <div className="space-y-3.5">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          NSE: ITC
                        </span>
                        <span className="text-xs font-semibold text-slate-400 font-mono">FMCG & Conglomerate</span>
                      </div>
                      <h3 className="text-lg font-extrabold text-white mt-1.5 flex items-center gap-2">
                        <span>ITC Limited</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                          {itcQty} shares
                        </span>
                      </h3>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase">Invested</span>
                      <div className="text-base font-bold text-slate-300 font-mono">
                        (₹{itcInvested.toLocaleString('en-IN', { minimumFractionDigits: 2 })})
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">Avg: ₹{itcBuyAvg.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Primary Highlight: Current Valuation & Returns */}
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

                  {/* Dynamic Real-Time CMP Modifier */}
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5 text-emerald-400" />
                        Live Current Market Price (CMP / Share):
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Previous Close: ₹260.00</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-2 text-xs font-mono text-slate-400">₹</span>
                        <input
                          type="number"
                          step="0.10"
                          value={itcLiveCmp}
                          onChange={e => {
                            const val = Number(e.target.value) || 0;
                            setItcLiveCmp(val);
                            handleUpdateStockCMP('groww-itc', val);
                          }}
                          className="w-full pl-7 pr-3 py-1.5 rounded-lg text-xs bg-[#090D18] border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      {/* Stepper Buttons */}
                      <button
                        onClick={() => {
                          const next = Number((itcLiveCmp - 1).toFixed(2));
                          setItcLiveCmp(next);
                          handleUpdateStockCMP('groww-itc', next);
                        }}
                        className="px-2 py-1.5 rounded-lg text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                        title="Decrease by ₹1"
                      >
                        -₹1
                      </button>
                      <button
                        onClick={() => {
                          const next = Number((itcLiveCmp + 1).toFixed(2));
                          setItcLiveCmp(next);
                          handleUpdateStockCMP('groww-itc', next);
                        }}
                        className="px-2 py-1.5 rounded-lg text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                        title="Increase by ₹1"
                      >
                        +₹1
                      </button>
                      <button
                        onClick={() => {
                          const next = Number((itcLiveCmp + 5).toFixed(2));
                          setItcLiveCmp(next);
                          handleUpdateStockCMP('groww-itc', next);
                        }}
                        className="px-2 py-1.5 rounded-lg text-[10px] font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40"
                        title="Increase by ₹5"
                      >
                        +₹5
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-slate-800/90 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-[11px]">Holdings: 5 × ₹{itcCmp.toFixed(2)}</span>
                  <button
                    onClick={() => handleOpenAddModal('groww_stocks')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Buy More ITC</span>
                  </button>
                </div>
              </div>

              {/* Card 2: Tata Gold ETF */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1A1A12] via-[#14150E] to-[#0D0F08] border border-amber-500/30 shadow-xl space-y-4 relative flex flex-col justify-between">
                <div className="space-y-3.5">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          NSE: TATAGOLD
                        </span>
                        <span className="text-xs font-semibold text-slate-400 font-mono">Commodity Gold ETF</span>
                      </div>
                      <h3 className="text-lg font-extrabold text-white mt-1.5 flex items-center gap-2">
                        <span>Tata Gold ETF</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                          {tataQty} shares
                        </span>
                      </h3>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase">Invested</span>
                      <div className="text-base font-bold text-slate-300 font-mono">
                        (₹{tataInvested.toLocaleString('en-IN', { minimumFractionDigits: 2 })})
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">Avg: ₹{tataBuyAvg.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Primary Highlight: Current Valuation & Returns */}
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

                  {/* Dynamic Real-Time CMP Modifier */}
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5 text-amber-400" />
                        Live Current Market Price (CMP / Unit):
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
                            handleUpdateStockCMP('groww-tatagold', val);
                          }}
                          className="w-full pl-7 pr-3 py-1.5 rounded-lg text-xs bg-[#090D18] border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      {/* Stepper Buttons */}
                      <button
                        onClick={() => {
                          const next = Number((tatagoldLiveCmp - 0.05).toFixed(2));
                          setTatagoldLiveCmp(next);
                          handleUpdateStockCMP('groww-tatagold', next);
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
                          handleUpdateStockCMP('groww-tatagold', next);
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
                          handleUpdateStockCMP('groww-tatagold', next);
                        }}
                        className="px-2 py-1.5 rounded-lg text-[10px] font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40"
                        title="Increase by ₹0.20"
                      >
                        +0.20
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-slate-800/90 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-[11px]">Holdings: 39 × ₹{tataCmp.toFixed(2)}</span>
                  <button
                    onClick={() => handleOpenAddModal('etf')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Buy More TATAGOLD</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 3. Specialized Showcase: "11-Month Jeweller Scheme ("Gold & Silver Shett") Tracker" */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0E1528] to-[#0A0F1D] border border-amber-500/30 shadow-xl space-y-5 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                11-Month Jewellery Scheme ("Gold & Silver Shett") Tracker
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Traditional Indian jeweller gold and silver savings schemes (GRT, Tanishq, Lalitha) with monthly tenure steps, accumulated weight, and 1-month maturity bonus.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleOpenAddModal('gold_chit')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Enroll New Chit Scheme</span>
            </button>
          </div>
        </div>

        {/* Chit Scheme Progress Cards Grid */}
        {chitSchemes.length === 0 ? (
          <div className="p-8 rounded-xl bg-[#090D18] border border-dashed border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white">No Jewellery Chit Schemes Active</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Track 11-month gold or silver schemes (GRT, Tanishq, Lalitha) with installment tracking, gram accrual, and jeweller bonus tracking.
            </p>
            <button
              onClick={() => handleOpenAddModal('gold_chit')}
              className="mt-2 inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Enroll New Chit Scheme</span>
            </button>
          </div>
        ) : (
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
                    {/* Top Bar */}
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

                    {/* Progress Step Bubbles (1 to 11) */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-semibold">
                          Installments: <span className="text-amber-400 font-bold">{paid} of {tenure} Paid</span>
                        </span>
                        <span className="text-amber-400 font-mono font-bold">{progressPct}% Complete</span>
                      </div>

                      {/* Step Visualizer */}
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
                        onClick={() => handleOpenEditModal(chit)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        title="Edit Scheme Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handlePayChitQuick(chit)}
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
        )}
      </div>

      {/* 4. Visual Analytics: Asset Allocation & Capital vs Current Value */}
      {investments.length === 0 ? (
        <div className="p-8 rounded-2xl bg-[#0C1222]/90 border border-dashed border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <PieIcon className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white">Portfolio Analytics Ready</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Dynamic asset allocation charts and capital growth analytics will activate automatically once you record your first real investment asset.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => handleOpenAddModal('digi_gold')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
            >
              + Add Gold / Silver
            </button>
            <button
              onClick={() => handleOpenAddModal('groww_stocks')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
            >
              + Add Groww Stock
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Donut Chart: Asset Allocation */}
          <div className="p-6 rounded-2xl bg-[#0C1222]/90 border border-slate-800/90 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-indigo-400" />
                Portfolio Allocation
              </h3>
              <span className="text-xs text-slate-400">{investments.length} Assets</span>
            </div>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryAllocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryAllocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#0B101D" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [formatCurrency(Number(val)), 'Current Value']}
                    contentStyle={{ backgroundColor: '#0B101D', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/80">
              {categoryAllocationData.map(d => (
                <div key={d.name} className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-300 truncate">{d.name}:</span>
                  <span className="font-bold text-white ml-auto">
                    {totalPortfolioValue > 0 ? `${Math.round((d.value / totalPortfolioValue) * 100)}%` : '0%'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart: Invested Capital vs Current Value */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0C1222]/90 border border-slate-800/90 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  Capital Invested vs Current Valuation
                </h3>
                <p className="text-xs text-slate-400">Comparison of acquisition cost against current market price</p>
              </div>
              <div className="flex items-center space-x-3 text-xs">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" />
                  <span className="text-slate-300">Invested</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
                  <span className="text-slate-300">Current Value</span>
                </div>
              </div>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={capitalVsValueData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                  <Tooltip
                    formatter={(val: any, name: any) => [
                      formatCurrency(Number(val)),
                      name === 'invested' ? 'Invested Capital' : 'Current Value'
                    ]}
                    contentStyle={{ backgroundColor: '#0B101D', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                  />
                  <Bar dataKey="invested" fill="#6366F1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="current" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 5. Filter Navigation & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Assets', count: investments.length },
            { id: 'chits', label: 'Gold & Silver Chits (Shett)', count: chitSchemes.length },
            { id: 'bullion', label: 'Gold & Silver', count: investments.filter(i => i.category === 'digi_gold' || i.category === 'gold_chit' || i.category === 'silver_chit').length },
            { id: 'groww_stocks', label: 'Groww Stocks', count: investments.filter(i => i.category === 'groww_stocks').length },
            { id: 'funds', label: 'Mutual Funds & ETFs', count: investments.filter(i => i.category === 'mutual_funds' || i.category === 'etf').length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                activeCategory === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/70 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeCategory === tab.id ? 'bg-slate-950 text-amber-300' : 'bg-slate-700 text-slate-300'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search by asset, platform, ticker..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-1.5 rounded-xl text-xs bg-[#0B101D] border border-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* 6. Holdings Table & Interactive Grid */}
      <div className="rounded-2xl bg-[#0C1222]/90 border border-slate-800/90 shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Asset Holdings & Valuations
            </h3>
            <span className="text-xs text-slate-400 font-mono">({filteredInvestments.length} Records)</span>
          </div>

          <div className="text-xs text-slate-400">
            Total Shown: <strong className="text-white font-mono">{formatCurrency(filteredInvestments.reduce((s, i) => s + i.currentValue, 0))}</strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#090D18] text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Asset / Holding</th>
                <th className="px-4 py-3.5">Platform / Merchant</th>
                <th className="px-4 py-3.5">Quantity / Units</th>
                <th className="px-4 py-3.5">Avg Buy Price</th>
                <th className="px-4 py-3.5">Current Price</th>
                <th className="px-4 py-3.5">Invested Capital</th>
                <th className="px-4 py-3.5">Current Value</th>
                <th className="px-4 py-3.5">Gain / Loss</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredInvestments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-slate-400">
                    <p className="text-sm font-medium">No investments found matching this filter.</p>
                    <button
                      onClick={() => handleOpenAddModal()}
                      className="mt-3 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 inline-flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add First Asset</span>
                    </button>
                  </td>
                </tr>
              ) : (
                filteredInvestments.map(asset => {
                  const gain = asset.currentValue - asset.investedAmount;
                  const gainPct = asset.investedAmount > 0 ? (gain / asset.investedAmount) * 100 : 0;
                  const isPositive = gain >= 0;

                  return (
                    <tr key={asset.id} className="hover:bg-slate-800/30 transition">
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white text-sm">{asset.name}</span>
                            {asset.symbolOrCode && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                                {asset.symbolOrCode}
                              </span>
                            )}
                          </div>
                          <div>{getCategoryBadge(asset.category)}</div>
                          {asset.notes && (
                            <p className="text-[11px] text-slate-400 max-w-xs truncate">{asset.notes}</p>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-1.5 text-slate-300">
                          <span className="font-semibold">{asset.platform}</span>
                        </div>
                        {asset.isMonthlySip && (
                          <span className="text-[10px] text-indigo-400 font-semibold block mt-0.5">
                            Monthly SIP: {formatCurrency(asset.monthlySipAmount || asset.chitMonthlyAmount || 0)}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-mono font-semibold text-slate-200">
                          {asset.quantity !== undefined
                            ? `${Number(asset.quantity).toFixed(asset.category === 'digi_gold' || asset.category === 'silver_chit' ? 5 : 2)} ${asset.unitType || 'units'}`
                            : '—'}
                        </div>
                        {asset.transactions && asset.transactions.length > 0 && (
                          <button
                            onClick={() => setSelectedBullionAsset(asset)}
                            className="text-[10px] text-amber-400 hover:text-amber-300 font-semibold block mt-0.5 underline text-left"
                          >
                            {asset.transactions.length} Transactions (Ledger)
                          </button>
                        )}
                        {asset.chitTenureMonths && (
                          <span className="text-[10px] text-amber-400 font-semibold block">
                            Month {asset.chitMonthsPaid} / {asset.chitTenureMonths}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4 font-mono text-slate-300">
                        {asset.buyPriceAverage ? formatCurrency(asset.buyPriceAverage) : '—'}
                      </td>

                      <td className="px-4 py-4 font-mono text-slate-200">
                        {asset.currentPrice ? formatCurrency(asset.currentPrice) : '—'}
                      </td>

                      <td className="px-4 py-4 font-mono font-semibold text-white">
                        {formatCurrency(asset.investedAmount)}
                      </td>

                      <td className="px-4 py-4 font-mono font-bold text-white">
                        {formatCurrency(asset.currentValue)}
                      </td>

                      <td className="px-4 py-4">
                        <div className={`font-mono font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isPositive ? '+' : ''}{formatCurrency(gain)}
                        </div>
                        <div className={`text-[11px] font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isPositive ? '+' : ''}{formatPercentage(gainPct)}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {asset.transactions && asset.transactions.length > 0 && (
                            <>
                              <button
                                onClick={() => setSelectedBullionAsset(asset)}
                                className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-bold text-[11px] transition"
                                title="View Document & Transaction Ledger"
                              >
                                Ledger ({asset.transactions.length})
                              </button>
                              <button
                                onClick={() => handleOpenDepositModal(asset.id as 'pothys-digi-gold' | 'pothys-digi-silver')}
                                className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 font-bold text-[11px] transition"
                                title="Deposit / Buy Weight"
                              >
                                + Buy
                              </button>
                            </>
                          )}
                          {(asset.category === 'gold_chit' || asset.category === 'silver_chit') && !asset.transactions && (
                            <button
                              onClick={() => handlePayChitQuick(asset)}
                              className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-bold text-[11px] transition"
                              title="Record Chit Payment"
                            >
                              + Pay Chit
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenEditModal(asset)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete ${asset.name} from portfolio?`)) {
                                deleteInvestment(asset.id);
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
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
        </div>
      )}

      {/* DASHBOARD: DAILY PAY CHIT RECORD (POTHYS 22K GOLD & 999 SILVER 300-DAY SCHEME) COMMAND CENTER */}
      {activeDashboardTab === 'daily_chit' && (
        <DailyPayChitDashboard
          goldAsset={investments.find(i => i.id === 'pothys-digi-gold' || i.category === 'digi_gold')}
          silverAsset={investments.find(i => i.id === 'pothys-digi-silver' || i.category === 'silver_chit')}
          goldSpotRate={goldSpotRate}
          silverSpotRate={silverSpotRate}
          onRecordDailyPay={(assetId, amount, date, notes, customRate, docNo) => {
            recordDailyChitPayment(assetId, amount, date, notes, customRate, docNo);
          }}
          onRecordDualPay={(goldAmount, silverAmount, date, notes, gRate, sRate) => {
            recordDualChitPayment(goldAmount, silverAmount, date, notes, gRate || goldSpotRate, sRate || silverSpotRate);
          }}
          onBatchPay={(payments) => {
            batchPayChitDays(payments);
          }}
          onBackToOverview={() => setActiveDashboardTab('overview')}
          onOpenRulesModal={() => setIsSchemeRulesModalOpen(true)}
        />
      )}

      {/* DASHBOARD: SALEM GOLD SHEET & LIVE MARKET RATES */}
      {activeDashboardTab === 'salem_gold_sheet' && (
        <SalemGoldSchemeSheet
          goldAsset={investments.find(i => i.id === 'pothys-digi-gold' || i.category === 'digi_gold')}
          silverAsset={investments.find(i => i.id === 'pothys-digi-silver' || i.category === 'silver_chit')}
          onRecordDailyPay={(assetId, amount, date, notes, customRate, docNo) => {
            recordDailyChitPayment(assetId, amount, date, notes, customRate, docNo);
          }}
          onRecordDualPay={(goldAmount, silverAmount, date, notes, gRate, sRate) => {
            recordDualChitPayment(goldAmount, silverAmount, date, notes, gRate || goldSpotRate, sRate || silverSpotRate);
          }}
          onOpenQuickDeposit={(dayNum, dateStr, metal) => {
            handleOpenDepositModal(metal === 'silver' ? 'pothys-digi-silver' : 'pothys-digi-gold');
          }}
          onBackToOverview={() => setActiveDashboardTab('overview')}
        />
      )}

      {/* DASHBOARD 2: DIGITAL GOLD (22K) DEDICATED COMMAND CENTER */}
      {activeDashboardTab === 'digi_gold' && (
        <DigiGoldDashboard
          investments={investments}
          goldSpotRate={goldSpotRate}
          onOpenDepositModal={handleOpenDepositModal}
          onOpenRulesModal={() => setIsSchemeRulesModalOpen(true)}
          onBackToOverview={() => setActiveDashboardTab('overview')}
          onDeleteTransaction={(assetId, txId) => deleteBullionTransaction(assetId, txId)}
          onOpenEditModal={handleOpenEditModal}
        />
      )}

      {/* DASHBOARD 3: DIGITAL SILVER (999 PURE) DEDICATED COMMAND CENTER */}
      {activeDashboardTab === 'digi_silver' && (
        <DigiSilverDashboard
          investments={investments}
          silverSpotRate={silverSpotRate}
          onOpenDepositModal={handleOpenDepositModal}
          onOpenRulesModal={() => setIsSchemeRulesModalOpen(true)}
          onBackToOverview={() => setActiveDashboardTab('overview')}
          onDeleteTransaction={(assetId, txId) => deleteBullionTransaction(assetId, txId)}
          onOpenEditModal={handleOpenEditModal}
        />
      )}

      {/* DASHBOARD 4: GROWW STOCKS & ETFS DEDICATED APP TERMINAL */}
      {activeDashboardTab === 'groww_stocks' && (
        <GrowwStocksDashboard
          investments={investments}
          growwSummary={growwSummary}
          itcLiveCmp={itcLiveCmp}
          tatagoldLiveCmp={tatagoldLiveCmp}
          setItcLiveCmp={setItcLiveCmp}
          setTatagoldLiveCmp={setTatagoldLiveCmp}
          onUpdateStockCMP={handleUpdateStockCMP}
          onResetGrowwOfficial={handleResetGrowwOfficial}
          onSyncGrowwLive={handleSyncGrowwLive}
          isGrowwUpdating={isGrowwUpdating}
          onOpenAddModal={handleOpenAddModal}
          onOpenEditModal={handleOpenEditModal}
          onDeleteInvestment={deleteInvestment}
          onBackToOverview={() => setActiveDashboardTab('overview')}
        />
      )}

      {/* DASHBOARD 5: GOLD & SILVER CHIT SCHEMES ("SHETT") COMMAND CENTER */}
      {activeDashboardTab === 'chits' && (
        <ChitSchemesDashboard
          chitSchemes={chitSchemes}
          onPayChitQuick={handlePayChitQuick}
          onOpenAddModal={handleOpenAddModal}
          onOpenEditModal={handleOpenEditModal}
          onDeleteInvestment={deleteInvestment}
          onBackToOverview={() => setActiveDashboardTab('overview')}
        />
      )}

      {/* DASHBOARD 6: MUTUAL FUNDS & SIPS DEDICATED COMMAND CENTER */}
      {activeDashboardTab === 'mutual_funds' && (
        <MutualFundsDashboard
          mutualFundInvestments={mutualFundInvestments}
          onOpenAddModal={handleOpenAddModal}
          onOpenEditModal={handleOpenEditModal}
          onDeleteInvestment={deleteInvestment}
          onBackToOverview={() => setActiveDashboardTab('overview')}
        />
      )}

      {/* 7. Modal: Add / Edit Investment Asset */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0E1526] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0B101D]">
              <div className="flex items-center space-x-2">
                <Coins className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-extrabold text-white">
                  {editingAsset ? 'Edit Investment Asset' : 'Add New Investment Asset'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAsset} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Asset / Holding Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GRT 11-Month Gold Chit, Tata Motors, Digi Gold"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Investment Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => {
                      const cat = e.target.value as InvestmentCategory;
                      setFormCategory(cat);
                      if (cat === 'gold_chit' || cat === 'silver_chit') {
                        setFormIsMonthlySip(true);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="digi_gold">Digital Gold (24K MMTC-PAMP / Jar)</option>
                    <option value="gold_chit">Gold Chit Scheme ("Gold Shett" 11M)</option>
                    <option value="silver_chit">Silver Chit Scheme ("Silver Shett")</option>
                    <option value="groww_stocks">Groww Stocks (Direct Equity)</option>
                    <option value="mutual_funds">Mutual Funds SIP</option>
                    <option value="etf">Exchange Traded Fund (ETF)</option>
                    <option value="fixed_deposit">Fixed Deposit / Safe Reserve</option>
                    <option value="other">Other Asset</option>
                  </select>
                </div>

                {/* Platform / Merchant */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Platform / Merchant
                  </label>
                  <input
                    type="text"
                    placeholder="Groww, GRT, Tanishq, Jar, Zerodha..."
                    value={formPlatform}
                    onChange={(e) => setFormPlatform(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Symbol / Ticker */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Symbol / Code (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TATAMOTORS, GOLDBEES"
                    value={formSymbol}
                    onChange={(e) => setFormSymbol(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Unit Type */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Unit Type
                  </label>
                  <select
                    value={formUnitType}
                    onChange={(e) => setFormUnitType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="grams">Grams (Gold / Silver)</option>
                    <option value="shares">Shares (Groww Equity)</option>
                    <option value="units">Units (Mutual Funds / ETF)</option>
                    <option value="chit_tokens">Chit Schemes</option>
                    <option value="lot">Lot</option>
                  </select>
                </div>

                {/* Invested Capital */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Total Invested Capital (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formInvestedAmount}
                    onChange={(e) => setFormInvestedAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Current Value */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Current Market Valuation (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formCurrentValue}
                    onChange={(e) => setFormCurrentValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Quantity */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Quantity / Weight ({formUnitType})
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Average Buy Price */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Avg Buy Price / Unit (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formBuyPrice}
                    onChange={(e) => setFormBuyPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Current Price */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Current Market Price / Unit (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formCurrentPrice}
                    onChange={(e) => setFormCurrentPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Chit Scheme Specifics ("Gold / Silver Shett") */}
              {(formCategory === 'gold_chit' || formCategory === 'silver_chit') && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-3">
                  <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>11-Month Jeweller Scheme ("Shett") Configurations</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                        Monthly (₹)
                      </label>
                      <input
                        type="number"
                        value={formChitMonthlyAmount}
                        onChange={(e) => setFormChitMonthlyAmount(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#090D18] border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                        Tenure Months
                      </label>
                      <input
                        type="number"
                        value={formChitTenureMonths}
                        onChange={(e) => setFormChitTenureMonths(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#090D18] border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                        Months Paid
                      </label>
                      <input
                        type="number"
                        value={formChitMonthsPaid}
                        onChange={(e) => setFormChitMonthsPaid(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#090D18] border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                        Bonus Perk (₹)
                      </label>
                      <input
                        type="number"
                        value={formMaturityBonus}
                        onChange={(e) => setFormMaturityBonus(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#090D18] border border-slate-700 text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Notes & Details
                </label>
                <textarea
                  rows={2}
                  placeholder="Redemption perks, gold purity, demat account info..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-[#090D18] border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 transition shadow-lg shadow-amber-500/20 active:scale-95"
                >
                  {editingAsset ? 'Update Asset' : 'Save Investment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Modal: Pothys Swarna Mahal — New Bullion Deposit / Buy Transaction */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0E1526] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0B101D]">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    Pothys Swarna Mahal · Add Deposit / Buy
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Instant Live Rate Conversion with Tiered Bonus Weight
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDepositModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBullionDeposit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              {/* Asset Selector Tabs */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Select Saving Plan *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDepositAssetId('pothys-digi-gold');
                      setDepositRate(13515);
                      setDepositNotes('Gold Saving Plan - 22K gold instant bonus');
                    }}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center space-x-1.5 transition ${
                      depositAssetId === 'pothys-digi-gold'
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'bg-slate-800/80 text-slate-300 border border-slate-700'
                    }`}
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>Digi Gold (22K)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDepositAssetId('pothys-digi-silver');
                      setDepositRate(230);
                      setDepositNotes('App online transfer • 7% Instant Bonus');
                    }}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center space-x-1.5 transition ${
                      depositAssetId === 'pothys-digi-silver'
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-800/80 text-slate-300 border border-slate-700'
                    }`}
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>Digi Silver (999)</span>
                  </button>
                </div>
              </div>

              {/* Amount & Live Rate */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Deposit Amount (₹) *</label>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    required
                    value={depositAmount}
                    onChange={e => setDepositAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-amber-500"
                    placeholder="Min ₹100"
                  />
                  <span className="text-[10px] text-slate-400">Starting from ₹100 daily</span>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Live Rate / Gram (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={depositRate}
                    onChange={e => setDepositRate(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-slate-400">Board rate at transaction</span>
                </div>
              </div>

              {/* Bonus Percentage */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-300">Instant Bonus Percentage (%)</label>
                  <span className="text-[10px] text-amber-400 font-mono font-bold">Days 0-75 Tier (7%)</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[7, 5, 3, 0].map(pct => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setDepositBonusPct(pct)}
                      className={`py-1.5 rounded-lg font-bold text-xs transition ${
                        depositBonusPct === pct
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {pct === 0 ? '0% (Base)' : `+${pct}% Bonus`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Live Weight Calculation Display Box */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-emerald-500/10 border border-amber-500/30 space-y-2">
                <span className="text-[10px] uppercase font-extrabold text-amber-300 tracking-wider block">
                  Live Dynamic Weight Crediting Summary
                </span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800">
                    <span className="text-[9px] text-slate-400 block uppercase">Base Weight</span>
                    <span className="text-xs font-mono font-bold text-white">{calcBaseWeight.toFixed(5)}g</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800">
                    <span className="text-[9px] text-emerald-400 block uppercase">+{depositBonusPct}% Bonus</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">+{calcBonusWeight.toFixed(5)}g</span>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/40">
                    <span className="text-[9px] text-amber-300 block uppercase font-extrabold">Total Credited</span>
                    <span className="text-xs font-mono font-black text-amber-300">{calcTotalCreditWeight.toFixed(5)}g</span>
                  </div>
                </div>
              </div>

              {/* Document Number & Promo Code */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Document No (DocNo)</label>
                  <input
                    type="text"
                    value={depositDocNo}
                    onChange={e => setDepositDocNo(e.target.value)}
                    placeholder="e.g. APP27SCTM/1998979"
                    className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Promo Code (Optional)</label>
                  <input
                    type="text"
                    value={depositPromoCode}
                    onChange={e => setDepositPromoCode(e.target.value)}
                    placeholder="e.g. PROMO CODE"
                    className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Date & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Transaction Date *</label>
                  <input
                    type="date"
                    required
                    value={depositDate}
                    onChange={e => setDepositDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Payment Notes</label>
                  <input
                    type="text"
                    value={depositNotes}
                    onChange={e => setDepositNotes(e.target.value)}
                    placeholder="e.g. App online transfer • 7% Instant Bonus"
                    className="w-full px-3 py-2 rounded-xl bg-[#090D18] border border-slate-700 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsDepositModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 transition shadow-lg shadow-amber-500/20 active:scale-95"
                >
                  Credit Weight to Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. Modal: Itemized Bullion Document & Transaction History Ledger */}
      {selectedBullionAsset && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-[#0E1526] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0B101D] shrink-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-extrabold text-white">
                      {selectedBullionAsset.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-amber-300 border border-slate-700">
                      {selectedBullionAsset.platform}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Official Document Register & Instant Bonus Credit Ledger
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    handleOpenDepositModal(selectedBullionAsset.id as 'pothys-digi-gold' | 'pothys-digi-silver');
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition flex items-center space-x-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Deposit</span>
                </button>
                <button
                  onClick={() => setSelectedBullionAsset(null)}
                  className="text-slate-400 hover:text-white text-sm p-1.5 rounded-lg hover:bg-slate-800"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Summary KPI Strip */}
            <div className="px-6 py-3 bg-[#090D18] border-b border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs shrink-0">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Total Invested</span>
                <span className="text-sm font-black text-white font-mono">
                  {formatCurrency(selectedBullionAsset.investedAmount)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Accumulated Weight</span>
                <span className="text-sm font-black text-amber-300 font-mono">
                  {Number(selectedBullionAsset.quantity || 0).toFixed(5)} gms
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Current Market Value</span>
                <span className="text-sm font-black text-emerald-400 font-mono">
                  {formatCurrency(selectedBullionAsset.currentValue)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Bonus Status</span>
                <span className="text-xs font-bold text-amber-400">
                  7% Instant Bonus Active
                </span>
              </div>
            </div>

            {/* Transactions Table Body */}
            <div className="p-6 overflow-y-auto space-y-3">
              {(!selectedBullionAsset.transactions || selectedBullionAsset.transactions.length === 0) ? (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <p className="text-sm">No transactions logged yet for this asset.</p>
                  <button
                    onClick={() => handleOpenDepositModal(selectedBullionAsset.id as any)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-slate-950"
                  >
                    + Log First Transaction
                  </button>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#090D18] text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Doc Number / Ref</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Rate (₹/g)</th>
                        <th className="px-4 py-3">Base Weight</th>
                        <th className="px-4 py-3">Bonus Weight</th>
                        <th className="px-4 py-3">Total Credited</th>
                        <th className="px-4 py-3">Notes</th>
                        <th className="px-3 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {selectedBullionAsset.transactions.map(tx => {
                        const totalCredited = tx.weightGrams + (tx.bonusWeightGrams || 0);
                        return (
                          <tr key={tx.id} className="hover:bg-slate-800/30 transition">
                            <td className="px-4 py-3 text-slate-300 font-medium whitespace-nowrap">
                              {tx.date}
                            </td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-amber-300 font-bold border border-slate-700">
                                {tx.docNo || 'APP27SCTM'}
                              </span>
                              {tx.promoCode && (
                                <span className="ml-1.5 px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                                  {tx.promoCode}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 font-bold text-white">
                              {formatCurrency(tx.amount)}
                            </td>
                            <td className="px-4 py-3 text-slate-300">
                              ₹{tx.rate.toLocaleString('en-IN')}
                            </td>
                            <td className="px-4 py-3 text-slate-200">
                              {tx.weightGrams.toFixed(5)}g
                            </td>
                            <td className="px-4 py-3 text-emerald-400 font-bold">
                              {tx.bonusWeightGrams ? `+${tx.bonusWeightGrams.toFixed(5)}g (${tx.bonusPercentage}%)` : '0.00000g'}
                            </td>
                            <td className="px-4 py-3 text-amber-300 font-black">
                              {totalCredited.toFixed(5)}g
                            </td>
                            <td className="px-4 py-3 font-sans text-slate-400 max-w-xs truncate text-[11px]">
                              {tx.notes || '—'}
                            </td>
                            <td className="px-3 py-3 text-right">
                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete transaction #${tx.docNo || tx.id} of ₹${tx.amount}?`)) {
                                    deleteBullionTransaction(selectedBullionAsset.id, tx.id);
                                    // Update local modal state
                                    setSelectedBullionAsset(prev => prev ? {
                                      ...prev,
                                      transactions: prev.transactions?.filter(t => t.id !== tx.id)
                                    } : null);
                                  }
                                }}
                                className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                                title="Delete Transaction"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-[#0B101D] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
              <span>
                Tenure: <strong className="text-white">300 Days Advance</strong> · Lock-in: <strong className="text-white">330 Days</strong>
              </span>
              <button
                onClick={() => setSelectedBullionAsset(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition"
              >
                Close Ledger
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. Modal: Pothys Swarna Mahal — Scheme Rules, T&C, and Physical Redemption Guide */}
      {isSchemeRulesModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0E1526] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0B101D] shrink-0">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    Pothys Swarna Mahal · DigiGold & DigiSilver Plan Rules
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Official Terms, Tiered Bonus Schedule & Physical Redemption Guide
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSchemeRulesModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm p-1.5 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed">
              {/* Pillar 1 */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <h4 className="font-extrabold text-amber-400 text-sm flex items-center gap-1.5">
                  <Coins className="w-4 h-4" />
                  1. Flexible Daily Investments & Live Rate Booking
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs">
                  <li><strong>Starting Amount:</strong> Invest as low as <strong>₹100</strong> per transaction.</li>
                  <li><strong>No Maximum Cap:</strong> Unlimited payments can be made at your convenience.</li>
                  <li><strong>Flexible Accumulation:</strong> No forced monthly EMI; deposit whenever you want.</li>
                  <li><strong>Recommended Goal:</strong> Pothys recommends accumulating at least <strong>₹11,000</strong> over 300 days to realize meaningful value appreciation.</li>
                  <li><strong>Instant Conversion:</strong> Every transaction locks physical 22K gold / 999 pure silver based on live board rates at that exact second.</li>
                </ul>
              </div>

              {/* Pillar 2 */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <h4 className="font-extrabold text-emerald-400 text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  2. Tiered Instant Bonus Weight Architecture
                </h4>
                <p className="text-slate-400">
                  Bonus gold/silver weight is credited directly into your ledger upon deposit according to the tenure phase:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono">
                  <div className="p-2 rounded bg-amber-500/15 border border-amber-500/40 text-center">
                    <span className="text-[10px] text-amber-400 block font-sans">Days 0 to 75</span>
                    <strong className="text-sm text-white">+7% Weight</strong>
                    <span className="text-[9px] text-amber-300 block font-sans mt-0.5 font-bold">[ACTIVE NOW]</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block font-sans">Days 76 to 150</span>
                    <strong className="text-sm text-white">+5% Weight</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block font-sans">Days 151 to 225</span>
                    <strong className="text-sm text-white">+3% Weight</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block font-sans">Days 226 to 300</span>
                    <strong className="text-sm text-white">+1% Weight</strong>
                  </div>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <h4 className="font-extrabold text-indigo-400 text-sm flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  3. Physical Redemption & What You Can Buy
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs">
                  <li><strong>Tenure & Lock-in:</strong> Advance deposit period runs for 300 days; scheme matures on the <strong>330th day</strong> (11 months).</li>
                  <li><strong>Gold Redemption:</strong> Convert total gold weight against 22K antique jewellery, bridal collections, everyday items, or gold coins.</li>
                  <li><strong>Silver Redemption:</strong> Convert silver weight against silver antique jewelry, pooja articles, nagas, bridal ornaments, or 999 coins & bars.</li>
                  <li><strong>Where to Redeem:</strong> Any physical Pothys Swarna Mahal showroom or online with live video shopping.</li>
                </ul>
              </div>

              {/* Pillar 4 */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <h4 className="font-extrabold text-rose-400 text-sm flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" />
                  4. Important Rules & Regulatory Terms
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs">
                  <li><strong>No Cash Refunds:</strong> Cash refunds are strictly prohibited under Indian bullion regulations.</li>
                  <li><strong>Pre-closure:</strong> Premature account closure allows retrieval of principal weight, but all accumulated bonus weight is forfeited.</li>
                  <li><strong>KYC & PAN:</strong> Standard ID proof required. A PAN copy is mandatory if redemption exceeds ₹2 Lakhs.</li>
                </ul>
              </div>
            </div>

            <div className="px-6 py-3 bg-[#0B101D] border-t border-slate-800 flex items-center justify-end shrink-0">
              <button
                onClick={() => setIsSchemeRulesModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition text-xs shadow-md"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
