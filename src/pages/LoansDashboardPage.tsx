import React, { useState, useMemo, useEffect } from 'react';
import {
  Layers,
  IndianRupee,
  Calendar,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Download,
  Plus,
  ArrowRight,
  Clock,
  Building,
  CreditCard,
  FileText,
  BarChart3,
  Percent,
  Sliders,
  Award,
  ChevronRight,
  ChevronLeft,
  CalendarDays,
  History,
  HelpCircle,
  Trash2,
  Edit3,
  Flame,
  PieChart as PieIcon,
  RefreshCw,
  Bell,
  BellRing,
  Calculator,
  ArrowDownRight,
  AlertTriangle,
  Wallet,
  Check,
  Settings,
  DollarSign
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { useLifeOS } from '../context/LifeOSContext';
import {
  LoanAccount,
  LoanPayment,
  AmortizationScheduleRow,
  BasicNeedRequirement,
  BasicNeedCategory,
  PayCyclePhase
} from '../types';
import { getLiveDateString, getLiveFormattedDate, getLiveMonthString } from '../utils/date-utils';

export const LoansDashboardPage: React.FC = () => {
  const {
    salary,
    loanAccounts,
    updateLoanAccount,
    addLoanAccount,
    deleteLoanAccount,
    totalOriginalPrincipal,
    outstandingPrincipal,
    totalPrincipalPaid,
    totalInterestPaid,
    loanPayments,
    addLoanPayment,
    updateLoanPayment,
    deleteLoanPayment,
    basicNeeds,
    addBasicNeed,
    updateBasicNeed,
    deleteBasicNeed,
    toggleBasicNeedPaid,
    totalBasicNeedsBudget,
    totalBasicNeedsPaid,
    triggerConfetti,
    activeSubTab: contextActiveSubTab
  } = useLifeOS();

  // Navigation tab within the dedicated loan dashboard
  const [activeSubTab, setActiveSubTab] = useState<
    'dossiers' | 'interest_cashflow' | 'reminders' | 'amortization' | 'simulator' | 'ledger' | 'roadmap'
  >('dossiers');

  useEffect(() => {
    if (contextActiveSubTab && ['dossiers', 'interest_cashflow', 'reminders', 'amortization', 'simulator', 'ledger', 'roadmap'].includes(contextActiveSubTab)) {
      setActiveSubTab(contextActiveSubTab as any);
    }
  }, [contextActiveSubTab]);

  // Modals state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [editLoanModalOpen, setEditLoanModalOpen] = useState(false);
  const [addLoanModalOpen, setAddLoanModalOpen] = useState(false);
  const [editPaymentModalOpen, setEditPaymentModalOpen] = useState(false);
  const [adjustEmiInterestModalOpen, setAdjustEmiInterestModalOpen] = useState(false);
  const [selectedLoanIdForAction, setSelectedLoanIdForAction] = useState<string>(loanAccounts[0]?.id || 'loan-1');

  // Add Loan Form state
  const [newLoanName, setNewLoanName] = useState('');
  const [newLoanLender, setNewLoanLender] = useState('');
  const [newLoanAccountNumber, setNewLoanAccountNumber] = useState('');
  const [newLoanType, setNewLoanType] = useState<LoanAccount['loanType']>('Personal Loan');
  const [newLoanOriginalPrincipal, setNewLoanOriginalPrincipal] = useState<number>(50000);
  const [newLoanMonthlyEmi, setNewLoanMonthlyEmi] = useState<number>(5000);
  const [newLoanFixedInterest, setNewLoanFixedInterest] = useState<number>(2000);
  const [newLoanDueDay, setNewLoanDueDay] = useState<number>(5);
  const [newLoanTenureMonths, setNewLoanTenureMonths] = useState<number>(12);
  const [newLoanNotes, setNewLoanNotes] = useState('');

  // Edit Payment state
  const [editingPayment, setEditingPayment] = useState<LoanPayment | null>(null);
  const [editPayDate, setEditPayDate] = useState(getLiveDateString());
  const [editPayPrincipal, setEditPayPrincipal] = useState<number>(0);
  const [editPayInterest, setEditPayInterest] = useState<number>(0);
  const [editPayMethod, setEditPayMethod] = useState<string>('Auto-Debit UPI');
  const [editPayRef, setEditPayRef] = useState<string>('');
  const [editPayNotes, setEditPayNotes] = useState<string>('');

  // Payment form state
  const [payLoanId, setPayLoanId] = useState(loanAccounts[0]?.id || 'loan-1');
  const [payDate, setPayDate] = useState(getLiveDateString());
  const [payTotalAmount, setPayTotalAmount] = useState<number>(8000);
  const [payPrincipalAmount, setPayPrincipalAmount] = useState<number>(7100);
  const [payInterestAmount, setPayInterestAmount] = useState<number>(900);
  const [payMethod, setPayMethod] = useState<string>('Auto-Debit UPI');
  const [payRef, setPayRef] = useState<string>('');
  const [payNotes, setPayNotes] = useState<string>('Regular monthly EMI');

  // Editing loan state
  const [editForm, setEditForm] = useState<Partial<LoanAccount>>({});

  // Add / Adjust EMI & Interest state
  const [adjustLoanId, setAdjustLoanId] = useState<string>(loanAccounts[0]?.id || 'loan-1');
  const [adjustMonthlyEmi, setAdjustMonthlyEmi] = useState<number>(8000);
  const [adjustInterestType, setAdjustInterestType] = useState<'fixed_amount' | 'reducing_balance'>('reducing_balance');
  const [adjustFixedInterestAmount, setAdjustFixedInterestAmount] = useState<number>(2000);
  const [adjustAnnualRate, setAdjustAnnualRate] = useState<number>(11.5);
  const [adjustTenureMonths, setAdjustTenureMonths] = useState<number>(12);
  const [adjustExtraInterestToAdd, setAdjustExtraInterestToAdd] = useState<number>(0);

  // Amortization selector state
  const [amortSelectedLoanId, setAmortSelectedLoanId] = useState<string>('all');
  const [amortExtraMonthly, setAmortExtraMonthly] = useState<number>(0);
  const [amortLumpSum, setAmortLumpSum] = useState<number>(0);

  // Simulator state
  const [simExtraMonthly, setSimExtraMonthly] = useState<number>(3000);
  const [simLumpSum, setSimLumpSum] = useState<number>(15000);
  const [simStrategy, setSimStrategy] = useState<'snowball' | 'avalanche' | 'drop_rule'>('drop_rule');

  // Foreclosure Simulator state (Tenure vs EMI Reduction)
  const [foreclosureLoanId, setForeclosureLoanId] = useState<string>(loanAccounts[0]?.id || 'loan-1');
  const [foreclosureAmount, setForeclosureAmount] = useState<number>(25000);
  const [foreclosurePreference, setForeclosurePreference] = useState<'reduce_tenure' | 'reduce_emi'>('reduce_tenure');

  // Reminder settings
  const [reminderLeadDays, setReminderLeadDays] = useState<number>(3);

  // Interactive Monthly Calendar View state
  const [calendarViewDate, setCalendarViewDate] = useState<Date>(() => new Date());
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(null);
  const [calendarIncludeNeeds, setCalendarIncludeNeeds] = useState<boolean>(true);

  // Dynamic Basic Needs Modal state
  const [needModalOpen, setNeedModalOpen] = useState(false);
  const [editingNeed, setEditingNeed] = useState<BasicNeedRequirement | null>(null);
  const [needName, setNeedName] = useState('');
  const [needCategory, setNeedCategory] = useState<BasicNeedCategory>('Housing');
  const [needAmount, setNeedAmount] = useState<number>(1000);
  const [needDueDay, setNeedDueDay] = useState<number>(5);
  const [needPhase, setNeedPhase] = useState<PayCyclePhase>('Phase 1 (Day 1-5)');
  const [needPriority, setNeedPriority] = useState<'essential' | 'flexible' | 'discretionary'>('essential');
  const [needNotes, setNeedNotes] = useState('');

  const calYear = calendarViewDate.getFullYear();
  const calMonth = calendarViewDate.getMonth(); // 0-indexed
  const calMonthName = calendarViewDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const daysInCalMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay(); // 0 is Sunday

  // Colors for charts
  const LOAN_COLORS = ['#F43F5E', '#6366F1', '#10B981', '#F59E0B', '#06B6D4'];

  // Current Month String (e.g. "2026-10")
  const currentMonthStr = useMemo(() => getLiveMonthString(), []);

  // Total monthly EMI commitment across all loans
  const totalMonthlyEmi = useMemo(() => {
    return loanAccounts
      .filter(l => l.currentPrincipal > 0 && l.status === 'active')
      .reduce((sum, l) => sum + (l.monthlyEmi || l.estimatedEmi || 0), 0);
  }, [loanAccounts]);

  // Debt-to-Income (DTI) Ratio
  const dtiRatio = salary > 0 ? ((totalMonthlyEmi / salary) * 100).toFixed(1) : '0';
  const overallProgress = totalOriginalPrincipal > 0
    ? Math.min(100, Math.round((totalPrincipalPaid / totalOriginalPrincipal) * 100))
    : 0;

  // Loan 1 (Key for ₹2,000 Drop Rule)
  const loan1 = loanAccounts.find(l => l.id === 'loan-1') || loanAccounts[0];
  const isLoan1Closed = loan1 ? (loan1.currentPrincipal === 0 || loan1.status === 'closed') : false;

  // ==========================================
  // 1. MONTHLY FIXED ₹2,000 INTEREST (NO DAY INTEREST CALCULATION)
  // ==========================================
  const interestMetrics = useMemo(() => {
    let totalMonthlyInterestNow = 0;
    let totalProjectedRemainingInterest = 0;
    const loanBreakdown = loanAccounts.map(loan => {
      const balance = loan.currentPrincipal;
      const emi = loan.monthlyEmi || loan.estimatedEmi || 0;
      const tenureRemaining = loan.remainingTenureMonths || (emi > 0 ? Math.ceil(balance / emi) : 12);

      // Monthly fixed interest rule: "it monthly fixd 2k interst for all"
      // If loan is closed (balance <= 0), monthly interest is 0.
      // Otherwise fixed at ₹2,000 / month (or loan.fixedInterestAmount if customized).
      const monthlyInt = balance > 0
        ? (loan.fixedInterestAmount !== undefined ? loan.fixedInterestAmount : 2000)
        : 0;
      
      const remainingInterest = balance > 0 ? monthlyInt * tenureRemaining : 0;
      const monthlyPrincipal = balance > 0 ? Math.max(0, emi - monthlyInt) : 0;

      totalMonthlyInterestNow += monthlyInt;
      totalProjectedRemainingInterest += remainingInterest;

      return {
        id: loan.id,
        name: loan.name,
        lender: loan.lender,
        currentPrincipal: balance,
        rate: 0,
        isFixedAmount: true,
        fixedAmount: monthlyInt,
        emi,
        monthlyInterest: monthlyInt,
        monthlyPrincipal,
        projectedRemainingInterest: remainingInterest,
        interestPaidTotal: loan.interestPaidTotal || 0,
        principalPaidTotal: loan.principalPaidTotal || (loan.originalPrincipal - loan.currentPrincipal)
      };
    });

    const totalMonthlyPrincipalNow = Math.max(0, totalMonthlyEmi - totalMonthlyInterestNow);
    const totalLifetimeCost = totalOriginalPrincipal + totalInterestPaid + totalProjectedRemainingInterest;

    return {
      totalMonthlyInterestNow,
      totalMonthlyPrincipalNow,
      totalProjectedRemainingInterest,
      totalLifetimeCost,
      loanBreakdown
    };
  }, [loanAccounts, totalMonthlyEmi, totalOriginalPrincipal, totalInterestPaid]);

  // ==========================================
  // 2. CASH FLOW CALCULATIONS
  // ==========================================
  const cashFlowMetrics = useMemo(() => {
    const grossIncome = salary;
    const debtOutflow = totalMonthlyEmi;
    const principalOutflow = interestMetrics.totalMonthlyPrincipalNow;
    const interestOutflow = interestMetrics.totalMonthlyInterestNow;
    const disposableIncomeAfterDebt = Math.max(0, grossIncome - debtOutflow);
    const estimatedLivingBudget = totalBasicNeedsBudget;
    const freeSavingsSurplus = Math.max(0, disposableIncomeAfterDebt - estimatedLivingBudget);

    // Cash flow progression stages
    const stage1_Now = {
      label: 'Stage 1 (Current)',
      desc: 'All 3 loans active',
      emi: totalMonthlyEmi,
      freeCashFlow: grossIncome - totalMonthlyEmi,
      pctOfSalary: Number(((grossIncome - totalMonthlyEmi) / grossIncome * 100).toFixed(1))
    };

    const loan3Obj = loanAccounts.find(l => l.id === 'loan-3');
    const loan3Emi = loan3Obj ? (loan3Obj.monthlyEmi || 3500) : 3500;
    const stage2_Loan3Cleared = {
      label: 'Stage 2 (Hand Loan Cleared)',
      desc: 'Loan 3 (₹40,000 + ₹2k interest) fully cleared',
      emi: Math.max(0, totalMonthlyEmi - loan3Emi),
      freeCashFlow: grossIncome - (totalMonthlyEmi - loan3Emi),
      pctOfSalary: Number(((grossIncome - (totalMonthlyEmi - loan3Emi)) / grossIncome * 100).toFixed(1))
    };

    const stage3_Loan1Cleared = {
      label: 'Stage 3 (Loan 1 + ₹2k Drop Rule)',
      desc: 'Loan 1 (₹1L) cleared + ₹2,000 rule triggered',
      emi: 6000, // Only remaining is Loan 2 with drop
      freeCashFlow: grossIncome - 6000,
      pctOfSalary: Number(((grossIncome - 6000) / grossIncome * 100).toFixed(1))
    };

    const stage4_DebtFree = {
      label: 'Stage 4 (100% Debt Free)',
      desc: 'Zero loan obligations',
      emi: 0,
      freeCashFlow: grossIncome,
      pctOfSalary: 100
    };

    const progressionData = [
      { name: 'Stage 1: Now', FreeCash: stage1_Now.freeCashFlow, LoanEMI: stage1_Now.emi },
      { name: 'Stage 2: Hand Loan Cleared', FreeCash: stage2_Loan3Cleared.freeCashFlow, LoanEMI: stage2_Loan3Cleared.emi },
      { name: 'Stage 3: ₹2k Drop Triggered', FreeCash: stage3_Loan1Cleared.freeCashFlow, LoanEMI: stage3_Loan1Cleared.emi },
      { name: 'Stage 4: 100% Free', FreeCash: stage4_DebtFree.freeCashFlow, LoanEMI: 0 }
    ];

    return {
      grossIncome,
      debtOutflow,
      principalOutflow,
      interestOutflow,
      disposableIncomeAfterDebt,
      estimatedLivingBudget,
      freeSavingsSurplus,
      stages: [stage1_Now, stage2_Loan3Cleared, stage3_Loan1Cleared, stage4_DebtFree],
      progressionData
    };
  }, [salary, totalMonthlyEmi, interestMetrics, loanAccounts, totalBasicNeedsBudget]);

  // Dynamic 4-Phase Pay Cycle Waterfall Data
  const payCyclePhasesData = useMemo(() => {
    // Phase 1: Days 1-5 (Salary Influx)
    const p1Loans = loanAccounts.filter(l => l.currentPrincipal > 0 && (l.dueDayOfMonth || 5) <= 5);
    const p1Needs = basicNeeds.filter(n => n.payCyclePhase === 'Phase 1 (Day 1-5)' || (!n.payCyclePhase && (n.dueDayOfMonth || 5) <= 5));
    const p1LoanOutflow = p1Loans.reduce((sum, l) => sum + (l.monthlyEmi || l.estimatedEmi || 0), 0);
    const p1NeedsOutflow = p1Needs.reduce((sum, n) => sum + (n.amount || 0), 0);
    const p1TotalOutflow = p1LoanOutflow + p1NeedsOutflow;
    const p1BufferLeft = salary - p1TotalOutflow;

    // Phase 2: Days 6-10 (Secondary Outflow)
    const p2Loans = loanAccounts.filter(l => l.currentPrincipal > 0 && (l.dueDayOfMonth || 5) > 5 && (l.dueDayOfMonth || 5) <= 10);
    const p2Needs = basicNeeds.filter(n => n.payCyclePhase === 'Phase 2 (Day 6-10)' || (!n.payCyclePhase && (n.dueDayOfMonth || 5) > 5 && (n.dueDayOfMonth || 5) <= 10));
    const p2LoanOutflow = p2Loans.reduce((sum, l) => sum + (l.monthlyEmi || l.estimatedEmi || 0), 0);
    const p2NeedsOutflow = p2Needs.reduce((sum, n) => sum + (n.amount || 0), 0);
    const p2TotalOutflow = p2LoanOutflow + p2NeedsOutflow;
    const p2BufferLeft = p1BufferLeft - p2TotalOutflow;

    // Phase 3: Days 11-20 (Utilities & Living Buffer)
    const p3Loans = loanAccounts.filter(l => l.currentPrincipal > 0 && (l.dueDayOfMonth || 5) > 10 && (l.dueDayOfMonth || 5) <= 20);
    const p3Needs = basicNeeds.filter(n => n.payCyclePhase === 'Phase 3 (Day 11-20)' || (!n.payCyclePhase && (n.dueDayOfMonth || 5) > 10 && (n.dueDayOfMonth || 5) <= 20));
    const p3LoanOutflow = p3Loans.reduce((sum, l) => sum + (l.monthlyEmi || l.estimatedEmi || 0), 0);
    const p3NeedsOutflow = p3Needs.reduce((sum, n) => sum + (n.amount || 0), 0);
    const p3TotalOutflow = p3LoanOutflow + p3NeedsOutflow;
    const p3BufferLeft = p2BufferLeft - p3TotalOutflow;

    // Phase 4: Days 21-30 (Surplus Margin & Free Cash Retained)
    const p4Loans = loanAccounts.filter(l => l.currentPrincipal > 0 && (l.dueDayOfMonth || 5) > 20);
    const p4Needs = basicNeeds.filter(n => n.payCyclePhase === 'Phase 4 (Day 21-30)' || (!n.payCyclePhase && (n.dueDayOfMonth || 5) > 20));
    const p4LoanOutflow = p4Loans.reduce((sum, l) => sum + (l.monthlyEmi || l.estimatedEmi || 0), 0);
    const p4NeedsOutflow = p4Needs.reduce((sum, n) => sum + (n.amount || 0), 0);
    const p4TotalOutflow = p4LoanOutflow + p4NeedsOutflow;
    const p4SurplusLeft = p3BufferLeft - p4TotalOutflow;

    return {
      p1: { loans: p1Loans, needs: p1Needs, loanOutflow: p1LoanOutflow, needsOutflow: p1NeedsOutflow, totalOutflow: p1TotalOutflow, bufferLeft: p1BufferLeft },
      p2: { loans: p2Loans, needs: p2Needs, loanOutflow: p2LoanOutflow, needsOutflow: p2NeedsOutflow, totalOutflow: p2TotalOutflow, bufferLeft: p2BufferLeft },
      p3: { loans: p3Loans, needs: p3Needs, loanOutflow: p3LoanOutflow, needsOutflow: p3NeedsOutflow, totalOutflow: p3TotalOutflow, bufferLeft: p3BufferLeft },
      p4: { loans: p4Loans, needs: p4Needs, loanOutflow: p4LoanOutflow, needsOutflow: p4NeedsOutflow, totalOutflow: p4TotalOutflow, surplusLeft: p4SurplusLeft }
    };
  }, [salary, loanAccounts, basicNeeds]);

  // ==========================================
  // 3. REMINDERS & DUE DATE CALCULATIONS
  // ==========================================
  const reminderSchedule = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDate();

    return loanAccounts.map(loan => {
      const dueDay = loan.dueDayOfMonth || 5;
      let daysUntilDue = dueDay - currentDay;
      if (daysUntilDue < 0) {
        // Due next month
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, dueDay);
        daysUntilDue = Math.ceil((nextMonth.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      }

      // Check if already paid this month
      const paidThisMonth = loanPayments.some(p => {
        return (p.loanId === loan.id || p.loanName === loan.name) && p.date?.startsWith(currentMonthStr);
      });

      const isUrgent = daysUntilDue <= reminderLeadDays && !paidThisMonth && loan.currentPrincipal > 0;

      return {
        ...loan,
        dueDay,
        daysUntilDue,
        paidThisMonth,
        isUrgent
      };
    }).sort((a, b) => a.daysUntilDue - b.daysUntilDue);
  }, [loanAccounts, loanPayments, currentMonthStr, reminderLeadDays]);

  // Next Upcoming Due Loan
  const nextDueLoan = useMemo(() => {
    return reminderSchedule.find(l => !l.paidThisMonth && l.currentPrincipal > 0) || reminderSchedule[0];
  }, [reminderSchedule]);

  // Distribution chart data
  const loanPieData = useMemo(() => {
    return loanAccounts.map((l, i) => ({
      name: l.name.split('—')[0].trim(),
      fullName: l.name,
      value: l.currentPrincipal,
      color: LOAN_COLORS[i % LOAN_COLORS.length]
    })).filter(d => d.value > 0);
  }, [loanAccounts]);

  // Helper to open payment modal pre-selected
  const openPaymentForLoan = (loanId: string) => {
    const target = loanAccounts.find(l => l.id === loanId);
    if (target) {
      setPayLoanId(target.id);
      const emi = target.monthlyEmi || target.estimatedEmi || 8000;
      setPayTotalAmount(emi);
      const interestEst = target.currentPrincipal > 0
        ? (target.fixedInterestAmount !== undefined ? target.fixedInterestAmount : 2000)
        : 0;
      const principalEst = Math.max(0, emi - interestEst);
      setPayPrincipalAmount(principalEst);
      setPayInterestAmount(interestEst);
    }
    setPaymentModalOpen(true);
  };

  // Helper to open edit loan modal
  const openEditModal = (loan: LoanAccount) => {
    setSelectedLoanIdForAction(loan.id);
    setEditForm({
      ...loan
    });
    setEditLoanModalOpen(true);
  };

  // Helper to open Add / Adjust EMI & Interest Modal
  const openAdjustEmiInterestModal = (loanId?: string) => {
    const targetId = loanId || loanAccounts[0]?.id || 'loan-1';
    const target = loanAccounts.find(l => l.id === targetId) || loanAccounts[0];
    if (target) {
      setAdjustLoanId(target.id);
      setAdjustMonthlyEmi(target.monthlyEmi || target.estimatedEmi || 8000);
      setAdjustInterestType('fixed_amount');
      setAdjustFixedInterestAmount(target.fixedInterestAmount !== undefined ? target.fixedInterestAmount : 2000);
      setAdjustAnnualRate(0);
      setAdjustTenureMonths(target.remainingTenureMonths || 12);
      setAdjustExtraInterestToAdd(0);
    }
    setAdjustEmiInterestModalOpen(true);
  };

  // Handle saving payment
  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const target = loanAccounts.find(l => l.id === payLoanId);
    if (!target) return;

    addLoanPayment({
      loanId: target.id,
      loanName: target.name,
      date: payDate,
      openingBalance: target.currentPrincipal,
      principalPaid: Number(payPrincipalAmount),
      interestPaid: Number(payInterestAmount),
      notes: `${payMethod} • ${payNotes} ${payRef ? `(Ref: ${payRef})` : ''}`
    });

    setPaymentModalOpen(false);
    triggerConfetti();
  };

  // Handle saving edited loan
  const handleSaveLoanEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoanIdForAction) return;
    updateLoanAccount(selectedLoanIdForAction, editForm);
    setEditLoanModalOpen(false);
  };

  // Handle creating new loan account
  const handleCreateLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLoanName.trim() || newLoanOriginalPrincipal <= 0) return;
    addLoanAccount({
      name: newLoanName.trim(),
      lender: newLoanLender.trim() || 'Bank / Lender',
      accountNumber: newLoanAccountNumber.trim() || undefined,
      loanType: newLoanType,
      originalPrincipal: Number(newLoanOriginalPrincipal),
      monthlyEmi: Number(newLoanMonthlyEmi),
      estimatedEmi: Number(newLoanMonthlyEmi),
      interestType: 'fixed_amount',
      fixedInterestAmount: Number(newLoanFixedInterest),
      annualInterestRate: 0,
      dueDayOfMonth: Number(newLoanDueDay),
      tenureMonths: Number(newLoanTenureMonths),
      remainingTenureMonths: Number(newLoanTenureMonths),
      lenderNotes: newLoanNotes.trim() || undefined,
      startDate: getLiveDateString()
    });
    setAddLoanModalOpen(false);
    // Reset form
    setNewLoanName('');
    setNewLoanLender('');
    setNewLoanAccountNumber('');
    setNewLoanOriginalPrincipal(50000);
    setNewLoanMonthlyEmi(5000);
    setNewLoanFixedInterest(2000);
    setNewLoanDueDay(5);
    setNewLoanTenureMonths(12);
    setNewLoanNotes('');
  };

  // Handle opening edit payment modal
  const openEditPaymentModal = (p: LoanPayment) => {
    setEditingPayment(p);
    setEditPayDate(p.date);
    setEditPayPrincipal(p.principalPaid);
    setEditPayInterest(p.interestPaid);
    setEditPayMethod(p.paymentMethod || 'Auto-Debit UPI');
    setEditPayRef(p.referenceNumber || '');
    setEditPayNotes(p.notes || '');
    setEditPaymentModalOpen(true);
  };

  // Handle saving payment edits
  const handleSavePaymentEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPayment) return;
    updateLoanPayment(editingPayment.id, {
      date: editPayDate,
      principalPaid: Number(editPayPrincipal),
      interestPaid: Number(editPayInterest),
      paymentMethod: editPayMethod,
      referenceNumber: editPayRef,
      notes: editPayNotes
    });
    setEditPaymentModalOpen(false);
    setEditingPayment(null);
  };

  // Handle saving EMI & Interest adjustment
  const handleSaveAdjustEmiInterest = (e: React.FormEvent) => {
    e.preventDefault();
    const target = loanAccounts.find(l => l.id === adjustLoanId);
    if (!target) return;

    const updates: Partial<LoanAccount> = {
      monthlyEmi: Number(adjustMonthlyEmi),
      estimatedEmi: Number(adjustMonthlyEmi),
      interestType: 'fixed_amount',
      remainingTenureMonths: Number(adjustTenureMonths),
      fixedInterestAmount: Number(adjustFixedInterestAmount),
      annualInterestRate: 0
    };

    if (adjustExtraInterestToAdd > 0) {
      updates.currentPrincipal = target.currentPrincipal + Number(adjustExtraInterestToAdd);
      updates.fixedInterestAmount = (target.fixedInterestAmount || 2000) + Number(adjustExtraInterestToAdd);
    }

    updateLoanAccount(target.id, updates);
    setAdjustEmiInterestModalOpen(false);
    triggerConfetti();
  };

  // Quick Mark as Paid for Current Month
  const handleQuickMarkPaid = (loan: LoanAccount) => {
    const emi = loan.monthlyEmi || loan.estimatedEmi || 8000;
    const interestEst = loan.currentPrincipal > 0
      ? (loan.fixedInterestAmount !== undefined ? loan.fixedInterestAmount : 2000)
      : 0;
    const principalEst = Math.max(0, emi - interestEst);

    addLoanPayment({
      loanId: loan.id,
      loanName: loan.name,
      date: getLiveDateString(),
      openingBalance: loan.currentPrincipal,
      principalPaid: principalEst,
      interestPaid: interestEst,
      notes: `Auto-logged monthly scheduled EMI for ${currentMonthStr}`
    });

    triggerConfetti();
  };

  // Export iCalendar (.ics) Reminders for Google/Apple Calendar
  const handleExportCalendarReminders = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');

    let icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Jeeva Life OS//Loan EMI Reminders 2026//EN\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\n`;

    loanAccounts.filter(l => l.currentPrincipal > 0).forEach(loan => {
      const dueDay = String(loan.dueDayOfMonth || 5).padStart(2, '0');
      const emi = loan.monthlyEmi || loan.estimatedEmi || 8000;
      icsContent += `BEGIN:VEVENT\nSUMMARY:EMI Due: ${loan.name} (₹${emi.toLocaleString('en-IN')})\nDESCRIPTION:Monthly loan installment for ${loan.lender || 'Lender'}. Account: ${loan.accountNumber || 'N/A'}.\nDTSTART:${year}${month}${dueDay}T090000Z\nDTEND:${year}${month}${dueDay}T100000Z\nRRULE:FREQ=MONTHLY;BYMONTHDAY=${loan.dueDayOfMonth || 5}\nBEGIN:VALARM\nTRIGGER:-P${reminderLeadDays}D\nACTION:DISPLAY\nDESCRIPTION:Upcoming EMI Reminder for ${loan.name}\nEND:VALARM\nEND:VEVENT\n`;
    });

    icsContent += `END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Jeeva_LifeOS_Loan_Reminders_${getLiveDateString()}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Dynamic Basic Needs Handlers
  const handleOpenAddNeed = () => {
    setEditingNeed(null);
    setNeedName('');
    setNeedCategory('Housing');
    setNeedAmount(1000);
    setNeedDueDay(5);
    setNeedPhase('Phase 1 (Day 1-5)');
    setNeedPriority('essential');
    setNeedNotes('');
    setNeedModalOpen(true);
  };

  const handleOpenEditNeed = (need: BasicNeedRequirement) => {
    setEditingNeed(need);
    setNeedName(need.name);
    setNeedCategory(need.category);
    setNeedAmount(need.amount);
    setNeedDueDay(need.dueDayOfMonth);
    setNeedPhase(need.payCyclePhase);
    setNeedPriority(need.priority);
    setNeedNotes(need.notes || '');
    setNeedModalOpen(true);
  };

  const handleSaveNeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!needName.trim()) return;

    if (editingNeed) {
      updateBasicNeed(editingNeed.id, {
        name: needName.trim(),
        category: needCategory,
        amount: Number(needAmount) || 0,
        dueDayOfMonth: Number(needDueDay) || 5,
        payCyclePhase: needPhase,
        priority: needPriority,
        notes: needNotes.trim() || undefined
      });
    } else {
      addBasicNeed({
        name: needName.trim(),
        category: needCategory,
        amount: Number(needAmount) || 0,
        dueDayOfMonth: Number(needDueDay) || 5,
        payCyclePhase: needPhase,
        priority: needPriority,
        isPaid: false,
        notes: needNotes.trim() || undefined
      });
      triggerConfetti();
    }
    setNeedModalOpen(false);
  };

  // Dynamic Amortization Generator
  const amortizationSchedule = useMemo<AmortizationScheduleRow[]>(() => {
    const rows: AmortizationScheduleRow[] = [];
    const targetLoans = amortSelectedLoanId === 'all'
      ? loanAccounts.filter(l => l.currentPrincipal > 0)
      : loanAccounts.filter(l => l.id === amortSelectedLoanId && l.currentPrincipal > 0);

    if (targetLoans.length === 0) return rows;

    let balance = targetLoans.reduce((acc, l) => acc + l.currentPrincipal, 0);
    const monthlyFixedInterest = targetLoans.reduce((acc, l) => {
      const fixed = l.fixedInterestAmount !== undefined ? l.fixedInterestAmount : 2000;
      return acc + fixed;
    }, 0);

    const baseEmi = targetLoans.reduce((acc, l) => acc + (l.monthlyEmi || l.estimatedEmi || 8000), 0);

    let cumulativeInt = 0;
    const today = new Date();

    for (let monthIdx = 1; monthIdx <= 36 && balance > 0; monthIdx++) {
      const rowDate = new Date(today.getFullYear(), today.getMonth() + monthIdx, 1);
      const dateFormatted = rowDate.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });

      const interestComp = balance > 0 ? monthlyFixedInterest : 0;
      let emi = baseEmi;
      let extra = amortExtraMonthly;
      if (monthIdx === 1) {
        extra += amortLumpSum;
      }

      let totalPay = emi + extra;
      let principalComp = totalPay - interestComp;

      if (principalComp >= balance) {
        principalComp = balance;
        totalPay = principalComp + interestComp;
        emi = Math.min(emi, totalPay);
        extra = totalPay - emi;
      }

      const closingBal = Math.max(0, balance - principalComp);
      cumulativeInt += interestComp;

      rows.push({
        monthIndex: monthIdx,
        dateFormatted,
        openingPrincipal: Math.round(balance),
        emi: Math.round(emi),
        principalComponent: Math.round(principalComp),
        interestComponent: Math.round(interestComp),
        extraPrepayment: Math.round(extra),
        closingPrincipal: Math.round(closingBal),
        cumulativeInterest: Math.round(cumulativeInt)
      });

      balance = closingBal;
    }

    return rows;
  }, [loanAccounts, amortSelectedLoanId, amortExtraMonthly, amortLumpSum]);

  // Export Amortization Schedule to CSV
  const exportAmortizationCSV = () => {
    if (amortizationSchedule.length === 0) return;
    const headers = [
      'Month #',
      'Billing Month',
      'Opening Principal (INR)',
      'Scheduled EMI (INR)',
      'Principal Portion (INR)',
      'Interest Portion (INR)',
      'Extra Prepayment (INR)',
      'Closing Principal (INR)',
      'Cumulative Interest (INR)'
    ];

    const csvRows = [headers.join(',')];
    amortizationSchedule.forEach(r => {
      csvRows.push([
        r.monthIndex,
        `"${r.dateFormatted}"`,
        r.openingPrincipal,
        r.emi,
        r.principalComponent,
        r.interestComponent,
        r.extraPrepayment,
        r.closingPrincipal,
        r.cumulativeInterest
      ].join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Loan_Amortization_Schedule_${getLiveDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Simulator calculations
  const simResults = useMemo(() => {
    const totalCurrentDebt = outstandingPrincipal;
    const baseEmiTotal = totalMonthlyEmi || 19500;
    const normalMonths = Math.ceil(totalCurrentDebt / Math.max(1, baseEmiTotal - 1500));
    const acceleratedPayment = baseEmiTotal + simExtraMonthly;
    const effectiveDebt = Math.max(0, totalCurrentDebt - simLumpSum);
    const acceleratedMonths = Math.ceil(effectiveDebt / Math.max(1, acceleratedPayment - 1500));
    const monthsSaved = Math.max(0, normalMonths - acceleratedMonths);
    const interestSavedEst = Math.round(monthsSaved * 1250 + (simLumpSum * 0.115 * (acceleratedMonths / 12)));

    return {
      normalMonths,
      acceleratedMonths,
      monthsSaved,
      interestSavedEst: Math.max(0, interestSavedEst)
    };
  }, [outstandingPrincipal, totalMonthlyEmi, simExtraMonthly, simLumpSum]);

  // Foreclosure Simulator calculations
  const foreclosureComparison = useMemo(() => {
    const target = loanAccounts.find(l => l.id === foreclosureLoanId) || loanAccounts[0];
    if (!target) return null;

    const fixedMonthlyInt = target.fixedInterestAmount !== undefined ? target.fixedInterestAmount : 2000;
    const currentPrincipal = target.currentPrincipal;
    const currentEmi = target.monthlyEmi || target.estimatedEmi || 8000;
    const remainingTenure = target.remainingTenureMonths || 12;

    const prepay = Math.min(foreclosureAmount, currentPrincipal);
    const newPrincipal = Math.max(0, currentPrincipal - prepay);

    // Option A: Reduce Tenure (Keep EMI constant)
    const monthlyPrincipalReduction = Math.max(1, currentEmi - fixedMonthlyInt);
    const newTenure = newPrincipal > 0
      ? Math.ceil(newPrincipal / monthlyPrincipalReduction)
      : 0;
    const tenureMonthsSaved = Math.max(0, remainingTenure - newTenure);
    const interestSavedTenure = Math.round(tenureMonthsSaved * fixedMonthlyInt);

    // Option B: Reduce EMI (Keep Tenure constant)
    const newEmi = newPrincipal > 0
      ? Math.round((newPrincipal / remainingTenure) + fixedMonthlyInt)
      : 0;
    const monthlyCashFlowGain = Math.max(0, currentEmi - newEmi);

    return {
      target,
      prepay,
      newPrincipal,
      currentEmi,
      remainingTenure,
      newTenure,
      tenureMonthsSaved,
      interestSavedTenure,
      newEmi,
      monthlyCashFlowGain
    };
  }, [loanAccounts, foreclosureLoanId, foreclosureAmount]);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* 1. TOP HEADER & ACTIONS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 shadow-xl shadow-indigo-950/20">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
              <span>Financial Freedom 2026</span>
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              3 Distinct Tranches
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center space-x-3">
            <Layers className="w-7 h-7 text-rose-400" />
            <span>Loan Command Center</span>
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Separate interest analytics, ₹2k fixed interest on Hand Loan, proper cash flow modeling, and customizable EMI & interest management.
          </p>
        </div>

        {/* Quick Top Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Add New Loan Account Action */}
          <button
            onClick={() => setAddLoanModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            title="Create a new loan account"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Loan Account</span>
          </button>

          <button
            onClick={() => {
              setPayLoanId(loanAccounts[0]?.id || 'loan-1');
              openPaymentForLoan(loanAccounts[0]?.id || 'loan-1');
            }}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-semibold text-xs shadow-lg shadow-rose-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Record Loan EMI</span>
          </button>

          {/* Add / Adjust EMI & Interest Button (NEW) */}
          <button
            onClick={() => openAdjustEmiInterestModal()}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-xs shadow-lg shadow-amber-950/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Sliders className="w-4 h-4" />
            <span>Add / Adjust EMI & Interest</span>
          </button>

          {/* EMI Calendar Direct Action */}
          <button
            onClick={() => {
              setActiveSubTab('reminders');
              setSelectedCalendarDay(null);
            }}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-950/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            title="Open Interactive Monthly EMI Calendar"
          >
            <Calendar className="w-4 h-4" />
            <span>EMI Calendar</span>
          </button>

          <button
            onClick={handleExportCalendarReminders}
            className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-indigo-950/70 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/30 font-semibold text-xs transition-all hover:scale-[1.02]"
            title="Download calendar (.ics) with automated EMI reminders"
          >
            <BellRing className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Add to Calendar (.ics)</span>
          </button>

          <button
            onClick={exportAmortizationCSV}
            className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all hover:scale-[1.02]"
            title="Download full amortization schedule as CSV"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={triggerConfetti}
            className="flex items-center space-x-1.5 px-3 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold text-xs transition-all"
            title="Celebrate payoff milestone"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Celebrate</span>
          </button>
        </div>
      </div>

      {/* 2. URGENT EMI REMINDER NOTIFICATION BANNER */}
      {nextDueLoan && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              nextDueLoan.daysUntilDue <= 3
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
            }`}>
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Next EMI Reminder</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300">
                  Due {nextDueLoan.dueDay}th of Month
                </span>
                {nextDueLoan.daysUntilDue <= 5 && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    In {nextDueLoan.daysUntilDue} Days!
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                <strong className="text-white">{nextDueLoan.name}</strong> • Scheduled EMI:{' '}
                <strong className="text-rose-400">₹{(nextDueLoan.monthlyEmi || 8000).toLocaleString('en-IN')}</strong>{' '}
                via {nextDueLoan.lender || 'Bank Auto-Debit'}.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-center">
            {nextDueLoan.paidThisMonth ? (
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center space-x-1">
                <Check className="w-4 h-4" />
                <span>Paid for {currentMonthStr}</span>
              </span>
            ) : (
              <button
                onClick={() => handleQuickMarkPaid(nextDueLoan)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark as Paid</span>
              </button>
            )}
            <button
              onClick={() => setActiveSubTab('reminders')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all"
            >
              View Calendar
            </button>
          </div>
        </div>
      )}

      {/* 3. EXECUTIVE METRICS STRIP (5 CARDS WITH TOTAL INTEREST SEPARATE) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1: Total Outstanding Principal */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-rose-500/30 hover:border-rose-500/50 transition-all shadow-lg flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all pointer-events-none" />
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-semibold uppercase tracking-wider text-[11px] text-rose-300">Outstanding Principal</span>
              <Building className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">
              ₹{outstandingPrincipal.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Original: <span className="text-slate-300 font-medium">₹{totalOriginalPrincipal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <div className="flex justify-between text-[11px] mb-1.5">
              <span className="text-slate-400">Principal Cleared:</span>
              <span className="font-bold text-emerald-400">₹{totalPrincipalPaid.toLocaleString('en-IN')} ({overallProgress}%)</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metric 2: TOTAL INTEREST PAID & REMAINING CARD */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-500/50 transition-all shadow-lg flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-semibold uppercase tracking-wider text-[11px] text-amber-300">Total Interest Analysis</span>
              <Percent className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-1">
              ₹{totalInterestPaid.toLocaleString('en-IN')}
              <span className="text-xs font-normal text-slate-400"> paid</span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Projected remaining: <span className="text-rose-400 font-bold">₹{interestMetrics.totalProjectedRemainingInterest.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Lifetime Interest:</span>
              <span className="font-bold text-amber-300">₹{(totalInterestPaid + interestMetrics.totalProjectedRemainingInterest).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Interest Rule:</span>
              <span className="font-bold text-emerald-400">Fixed ₹2,000 / mo (No Day Interest)</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Monthly Total EMI Commitment & Cash Flow */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/30 hover:border-indigo-500/50 transition-all shadow-lg flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all pointer-events-none" />
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-semibold uppercase tracking-wider text-[11px] text-indigo-300">Monthly EMI Outflow</span>
              <CreditCard className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">
              ₹{totalMonthlyEmi.toLocaleString('en-IN')}
              <span className="text-xs font-normal text-slate-400"> /mo</span>
            </div>
            <div className="flex items-center space-x-1.5 mt-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                DTI: {dtiRatio}% of Salary
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] space-y-0.5 text-slate-400">
            <div className="flex justify-between">
              <span>Principal Portion:</span>
              <span className="font-semibold text-emerald-400">₹{interestMetrics.totalMonthlyPrincipalNow.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Interest Portion:</span>
              <span className="font-semibold text-rose-400">₹{interestMetrics.totalMonthlyInterestNow.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Retained Cash Flow After Debt */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-500/50 transition-all shadow-lg flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-semibold uppercase tracking-wider text-[11px] text-emerald-300">Retained Cash Flow</span>
              <Wallet className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
              ₹{cashFlowMetrics.disposableIncomeAfterDebt.toLocaleString('en-IN')}
              <span className="text-xs font-normal text-slate-400"> /mo</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-snug">
              {(100 - Number(dtiRatio)).toFixed(1)}% of salary available for living & savings
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Post-Payoff Potential:</span>
            <span className="font-bold text-cyan-300">₹{salary.toLocaleString('en-IN')}/mo (100%)</span>
          </div>
        </div>

        {/* Metric 5: Loan Dates & Milestone Tracker */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-500/50 transition-all shadow-lg flex flex-col justify-between relative overflow-hidden group sm:col-span-2 lg:col-span-1">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-semibold uppercase tracking-wider text-[11px] text-amber-300">Loan Dates & Target</span>
              <Calendar className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-base sm:text-lg font-black text-white mt-1 flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Next: {nextDueLoan ? `${nextDueLoan.dueDay}th (${nextDueLoan.daysUntilDue}d)` : 'Nov 1'}</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 leading-snug">
              {nextDueLoan?.name.split('—')[0]} • ₹{(nextDueLoan?.monthlyEmi || 8000).toLocaleString('en-IN')}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Target Freedom:</span>
            <span className="font-bold text-emerald-400">Late 2026</span>
          </div>
        </div>
      </div>

      {/* 4. SUB-NAVIGATION TABS */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800/80 pb-3">
        <button
          onClick={() => setActiveSubTab('dossiers')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'dossiers'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>3 Loan Dossiers ({loanAccounts.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('interest_cashflow')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'interest_cashflow'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Percent className="w-3.5 h-3.5" />
          <span>Interest & Cash Flow Intelligence</span>
        </button>

        <button
          onClick={() => setActiveSubTab('reminders')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'reminders'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <CalendarDays className="w-3.5 h-3.5 text-cyan-400" />
          <span>Interactive EMI Calendar & Due Dates</span>
        </button>

        <button
          onClick={() => setActiveSubTab('amortization')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'amortization'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Amortization Schedule Engine</span>
        </button>

        <button
          onClick={() => setActiveSubTab('simulator')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'simulator'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Payoff & Foreclosure Simulator</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ledger')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'ledger'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Payment Ledger ({loanPayments.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('roadmap')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'roadmap'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Debt Freedom Roadmap</span>
        </button>
      </div>

      {/* 5. SUB-TAB CONTENT */}

      {/* TAB A: 3 LOAN DOSSIERS */}
      {activeSubTab === 'dossiers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loanAccounts.map((loan, idx) => {
              const paid = loan.originalPrincipal - loan.currentPrincipal;
              const progress = Math.min(100, Math.round((paid / loan.originalPrincipal) * 100));
              const isClosed = loan.currentPrincipal === 0 || loan.status === 'closed';

              const interestData = interestMetrics.loanBreakdown.find(l => l.id === loan.id);

              return (
                <div
                  key={loan.id}
                  className={`p-6 rounded-3xl border transition-all flex flex-col justify-between relative overflow-hidden ${
                    isClosed
                      ? 'bg-emerald-950/20 border-emerald-500/40 shadow-emerald-950/20'
                      : idx === 0
                      ? 'bg-slate-900/95 border-rose-500/40 shadow-xl shadow-rose-950/20'
                      : idx === 1
                      ? 'bg-slate-900/95 border-indigo-500/40 shadow-xl shadow-indigo-950/20'
                      : 'bg-slate-900/95 border-emerald-500/40 shadow-xl shadow-emerald-950/20'
                  }`}
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between text-xs mb-3">
                      <div className="flex items-center space-x-1.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-extrabold text-[10px] uppercase">
                          Loan #{idx + 1}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300">
                          {loan.loanType || 'Personal Loan'}
                        </span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isClosed
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {isClosed ? 'CLEARED' : 'ACTIVE'}
                      </span>
                    </div>

                    {/* Loan Title & Lender */}
                    <h3 className="text-lg font-black text-white tracking-tight">{loan.name}</h3>
                    <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5 mb-4">
                      <Building className="w-3.5 h-3.5 text-slate-500" />
                      <span>{loan.lender || 'Bank / Lender'}</span>
                      {loan.accountNumber && (
                        <>
                          <span>•</span>
                          <span className="font-mono text-slate-400 text-[11px]">{loan.accountNumber}</span>
                        </>
                      )}
                    </div>

                    {/* Balance Highlight Box */}
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2 text-xs">
                      <div className="flex justify-between items-baseline">
                        <span className="text-slate-400">Outstanding Balance:</span>
                        <span className="text-xl font-black text-rose-400">
                          ₹{loan.currentPrincipal.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Principal Cleared:</span>
                        <span className="font-semibold text-emerald-400">
                          ₹{paid.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Original Principal:</span>
                        <span className="text-slate-300">
                          ₹{loan.originalPrincipal.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Separate Interest & Repayment Breakdown Grid */}
                    <div className="mt-4 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2 text-xs">
                      <div className="flex justify-between py-0.5 border-b border-slate-800/60">
                        <span className="text-slate-400">Monthly EMI Total:</span>
                        <span className="font-bold text-white flex items-center space-x-1.5">
                          <span>₹{(loan.monthlyEmi || loan.estimatedEmi || 0).toLocaleString('en-IN')}</span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-indigo-500/20 text-indigo-300 font-extrabold uppercase border border-indigo-500/30">
                            Fixed EMI
                          </span>
                        </span>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-slate-800/60">
                        <span className="text-emerald-400 font-medium">Principal Portion / mo:</span>
                        <span className="font-semibold text-emerald-400">
                          ₹{(interestData?.monthlyPrincipal || 0).toLocaleString('en-IN')}{' '}
                          <span className="text-[10px] text-emerald-300 font-normal">(↑ Growing)</span>
                        </span>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-slate-800/60">
                        <span className="text-rose-400 font-medium">Interest Portion / mo:</span>
                        <span className="font-semibold text-rose-400">
                          ₹{(interestData?.monthlyInterest || 0).toLocaleString('en-IN')}{' '}
                          <span className="text-[10px] text-rose-300 font-normal">(↓ Shrinking)</span>
                        </span>
                      </div>

                      {/* Visual Dynamic Split Bar: Principal vs Interest */}
                      <div className="pt-1 pb-1">
                        <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden flex">
                          <div
                            className="bg-emerald-500 h-full transition-all"
                            style={{
                              width: `${Math.min(100, Math.max(5, (((interestData?.monthlyPrincipal || 0) / (loan.monthlyEmi || loan.estimatedEmi || 1)) * 100)))}%`
                            }}
                            title={`Principal: ₹${interestData?.monthlyPrincipal || 0}`}
                          />
                          <div
                            className="bg-rose-500 h-full transition-all"
                            style={{
                              width: `${Math.min(100, Math.max(5, (((interestData?.monthlyInterest || 0) / (loan.monthlyEmi || loan.estimatedEmi || 1)) * 100)))}%`
                            }}
                            title={`Interest: ₹${interestData?.monthlyInterest || 0}`}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                          <span className="text-emerald-400">
                            {(((interestData?.monthlyPrincipal || 0) / (loan.monthlyEmi || loan.estimatedEmi || 1)) * 100).toFixed(0)}% Principal
                          </span>
                          <span className="text-rose-400">
                            {(((interestData?.monthlyInterest || 0) / (loan.monthlyEmi || loan.estimatedEmi || 1)) * 100).toFixed(0)}% Interest
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between py-0.5 border-b border-slate-800/60">
                        <span className="text-slate-400">Interest Rule:</span>
                        <span className="font-semibold text-emerald-400">
                          Fixed ₹{(interestData?.monthlyInterest || 2000).toLocaleString('en-IN')}/mo (No Day Math)
                        </span>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-amber-300">Est. Remaining Interest:</span>
                        <span className="font-bold text-amber-300">₹{(interestData?.projectedRemainingInterest || 0).toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* Loan Dates & Historical Interest Paid Box */}
                    <div className="mt-3.5 p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1.5 text-xs">
                      <div className="flex justify-between py-0.5 border-b border-slate-800/60">
                        <span className="text-slate-400">Disbursement Date:</span>
                        <span className="font-semibold text-slate-300">{loan.startDate || '01 Oct 2025'}</span>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-slate-800/60">
                        <span className="text-slate-400">Monthly Due Date:</span>
                        <span className="font-bold text-cyan-300">Due {loan.dueDayOfMonth || 5}th of month</span>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-slate-800/60">
                        <span className="text-slate-400">Target Payoff Date:</span>
                        <span className="font-semibold text-emerald-400">{loan.targetPayoffDate || '30 Nov 2026'}</span>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-slate-800/60">
                        <span className="text-slate-400">Tenure Status:</span>
                        <span className="text-slate-300">{loan.remainingTenureMonths || 12} mos left / {loan.tenureMonths || 14} mos total</span>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-slate-800/60">
                        <span className="text-slate-400">Interest Paid So Far:</span>
                        <span className="font-bold text-amber-300">₹{(loan.interestPaidTotal || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-slate-400">Principal Cleared:</span>
                        <span className="font-bold text-emerald-400">₹{(loan.principalPaidTotal || paid).toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* Special Lender Rule Banner */}
                    {idx === 0 && (
                      <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 leading-snug flex items-start space-x-2">
                        <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-amber-300">⭐ Key Rule:</strong> Clearing this loan reduces your monthly obligation by <strong>₹2,000</strong>!
                        </div>
                      </div>
                    )}

                    {idx === 2 && (
                      <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 leading-snug flex items-start space-x-2">
                        <Percent className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-amber-300">₹2,000 Fixed Interest:</strong> ₹40,000 principal + ₹2,000 fixed interest (Total: ₹42,000). Rapid payoff priority!
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Progress & Bottom Actions */}
                  <div className="mt-6 pt-4 border-t border-slate-800/80">
                    <div className="flex justify-between text-[11px] mb-1.5">
                      <span className="text-slate-400">Repayment Progress:</span>
                      <span className="font-bold text-white">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mb-4">
                      <div
                        className="bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openPaymentForLoan(loan.id)}
                        className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Pay EMI</span>
                      </button>

                      {/* Add / Adjust EMI & Interest Button */}
                      <button
                        onClick={() => openAdjustEmiInterestModal(loan.id)}
                        className="py-2 px-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold text-xs transition-colors flex items-center justify-center space-x-1"
                        title="Adjust EMI amount and Interest"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">EMI/Interest</span>
                      </button>

                      <button
                        onClick={() => openEditModal(loan)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                        title="Edit loan details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete "${loan.name}"? This action will remove the loan and its payment records.`)) {
                            deleteLoanAccount(loan.id);
                          }
                        }}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                        title="Delete loan account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Debt Breakdown Visualizer */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
              <h3 className="text-base font-bold text-white flex items-center space-x-2 mb-4">
                <PieIcon className="w-4 h-4 text-indigo-400" />
                <span>Debt Distribution Among Tranches</span>
              </h3>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={loanPieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                    >
                      {loanPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Outstanding']}
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-2 text-xs">
                {loanPieData.map((d) => (
                  <div key={d.name} className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-slate-300">{d.name}:</span>
                    <span className="font-bold text-white">₹{d.value.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Strategy Cheat Sheet */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2 mb-4">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Jeeva's Debt Elimination Game Plan</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <div className="font-bold text-emerald-300 mb-0.5">Step 1: Eliminate Hand Loan (₹40,000 + ₹2k Interest)</div>
                    <p className="text-slate-400 leading-relaxed">
                      Smallest balance. Knocking this out gives a rapid mental victory and frees up ₹3,500/mo cashflow to redirect to the bigger tranches.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950/70 border border-amber-500/30">
                    <div className="font-bold text-amber-300 mb-0.5">Step 2: Conquer Loan 1 & Unlock ₹2,000 Drop Rule</div>
                    <p className="text-slate-400 leading-relaxed">
                      By redirecting the freed ₹3,500/mo plus bonus prepayments into Loan 1, clearing it completely drops your total monthly obligation by an extra ₹2,000!
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <div className="font-bold text-indigo-300 mb-0.5">Step 3: Total Annihilation of Loan 2</div>
                    <p className="text-slate-400 leading-relaxed">
                      With over ₹13,500/mo now freed, pour everything into the final tranche and achieve 100% debt freedom well before end of 2026.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Total Debt Freedom Target:</span>
                <span className="font-bold text-emerald-400">₹0 Principal by late 2026</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB B: DEDICATED TOTAL INTEREST & CASH FLOW INTELLIGENCE */}
      {activeSubTab === 'interest_cashflow' && (
        <div className="space-y-6">
          {/* Top Interest Breakdown Card */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/30 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Separated Interest Ledger
                </span>
                <h3 className="text-xl font-black text-white mt-1 flex items-center space-x-2">
                  <Percent className="w-5 h-5 text-amber-400" />
                  <span>Total Interest vs Principal Decomposition</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Exact mathematical split between debt principal reduction and lender interest fees.
                </p>
              </div>

              <div className="flex items-center space-x-3 text-right">
                <div>
                  <span className="text-[11px] text-slate-400 block">Interest Computation Model:</span>
                  <span className="text-sm font-black text-emerald-400">Monthly Fixed ₹2,000 / Loan</span>
                  <span className="text-[10px] text-slate-400 block">No Day Pro-Rating (Fixed Per Month)</span>
                </div>
              </div>
            </div>

            {/* Interest Table across all 3 loans */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] text-slate-400 font-semibold uppercase tracking-wider bg-slate-950/60">
                    <th className="py-3 px-3">Loan Account</th>
                    <th className="py-3 px-3">Balance</th>
                    <th className="py-3 px-3">Interest Type</th>
                    <th className="py-3 px-3">Monthly EMI</th>
                    <th className="py-3 px-3 text-emerald-400 font-bold">Principal / mo</th>
                    <th className="py-3 px-3 text-rose-400 font-bold">Interest / mo</th>
                    <th className="py-3 px-3 text-emerald-400 font-bold">Monthly Fixed Rule</th>
                    <th className="py-3 px-3 text-amber-300 font-bold">Total Est. Remaining Interest</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {interestMetrics.loanBreakdown.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-bold text-white">{row.name}</td>
                      <td className="py-3 px-3 text-slate-300">₹{row.currentPrincipal.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 font-semibold text-emerald-400">
                        <span className="text-emerald-400 font-bold">Fixed ₹{row.monthlyInterest.toLocaleString('en-IN')}/mo</span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-white">₹{row.emi.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 text-emerald-400 font-bold">₹{row.monthlyPrincipal.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 text-rose-400 font-bold">₹{row.monthlyInterest.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 text-emerald-300">Fixed ₹{row.monthlyInterest.toLocaleString('en-IN')}/mo (No Day Math)</td>
                      <td className="py-3 px-3 font-bold text-amber-300">₹{row.projectedRemainingInterest.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-950/80 font-bold border-t border-slate-700">
                    <td className="py-3 px-3 text-white">Consolidated Total</td>
                    <td className="py-3 px-3 text-white">₹{outstandingPrincipal.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-emerald-400">Monthly Fixed ₹2,000 for all</td>
                    <td className="py-3 px-3 text-white">₹{totalMonthlyEmi.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-emerald-400">₹{interestMetrics.totalMonthlyPrincipalNow.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-rose-400">₹{interestMetrics.totalMonthlyInterestNow.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-emerald-400">Fixed ₹{interestMetrics.totalMonthlyInterestNow.toLocaleString('en-IN')}/mo Total</td>
                    <td className="py-3 px-3 text-amber-300">₹{interestMetrics.totalProjectedRemainingInterest.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Interest Paid So Far & Historical Performance Box */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/30 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Historical Repayment Audit
                </span>
                <h3 className="text-lg font-black text-white mt-1 flex items-center space-x-2">
                  <History className="w-5 h-5 text-emerald-400" />
                  <span>Interest Paid So Far & Loan Timeline Data</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Verified tracking of every rupee paid toward principal vs interest fees across each tranche.
                </p>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Total Payments Logged:</span>
                <span className="text-sm font-bold text-white">{loanPayments.length} EMI Installments</span>
              </div>
            </div>

            {/* 4 Performance KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Interest Paid To Date</span>
                <span className="text-xl font-black text-rose-400 mt-0.5 block">
                  ₹{totalInterestPaid.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-500">Bank fees paid out</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Principal Cleared</span>
                <span className="text-xl font-black text-emerald-400 mt-0.5 block">
                  ₹{totalPrincipalPaid.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-500">Pure equity gained</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Money Repaid</span>
                <span className="text-xl font-black text-white mt-0.5 block">
                  ₹{(totalPrincipalPaid + totalInterestPaid).toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-500">Principal + Interest</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Interest Drag Ratio</span>
                <span className="text-xl font-black text-amber-300 mt-0.5 block">
                  {totalPrincipalPaid + totalInterestPaid > 0
                    ? ((totalInterestPaid / (totalPrincipalPaid + totalInterestPaid)) * 100).toFixed(1)
                    : '0.0'}%
                </span>
                <span className="text-[10px] text-slate-500">% of paid money lost to interest</span>
              </div>
            </div>

            {/* Comprehensive Per-Loan Timeline & Interest Audit Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[10.5px] text-slate-400 uppercase tracking-wider bg-slate-950/60 font-semibold">
                    <th className="py-2.5 px-3">Loan Account</th>
                    <th className="py-2.5 px-3">Disbursement</th>
                    <th className="py-2.5 px-3">Monthly Due</th>
                    <th className="py-2.5 px-3">Payoff Target</th>
                    <th className="py-2.5 px-3">Original Principal</th>
                    <th className="py-2.5 px-3 text-emerald-400">Principal Paid</th>
                    <th className="py-2.5 px-3 text-rose-400 font-bold">Interest Paid</th>
                    <th className="py-2.5 px-3 text-amber-300">Remaining Interest</th>
                    <th className="py-2.5 px-3">Interest Mode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {loanAccounts.map((l) => {
                    const row = interestMetrics.loanBreakdown.find(b => b.id === l.id);
                    const paidPrin = l.principalPaidTotal || (l.originalPrincipal - l.currentPrincipal);
                    const paidInt = l.interestPaidTotal || 0;
                    return (
                      <tr key={l.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-white">
                          {l.name}
                          <span className="block text-[10px] text-slate-400 font-normal">{l.lender}</span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-300">{l.startDate || '01 Oct 2025'}</td>
                        <td className="py-2.5 px-3 text-cyan-300 font-semibold">Day {l.dueDayOfMonth || 5}th</td>
                        <td className="py-2.5 px-3 text-emerald-400">{l.targetPayoffDate || 'Late 2026'}</td>
                        <td className="py-2.5 px-3 text-slate-300">₹{l.originalPrincipal.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-3 text-emerald-400 font-bold">₹{paidPrin.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-3 text-rose-400 font-bold">₹{paidInt.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-3 text-amber-300 font-bold">₹{(row?.projectedRemainingInterest || 0).toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-3 text-emerald-400 font-semibold">
                          Fixed ₹{(row?.monthlyInterest || 2000).toLocaleString('en-IN')}/mo (Fixed)
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cash Flow Waterfall & Progression */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Monthly Cash Flow Waterfall */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Wallet className="w-5 h-5 text-emerald-400" />
                <span>Monthly Cash Flow Waterfall</span>
              </h3>
              <p className="text-xs text-slate-400">
                Where every rupee of your ₹34,000 monthly income goes under the current repayment plan.
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-emerald-400 block">Total Income (Gross)</span>
                    <span className="text-sm font-bold text-white">Monthly Fixed Salary</span>
                  </div>
                  <span className="text-lg font-black text-emerald-400">+₹{salary.toLocaleString('en-IN')}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-rose-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-rose-400 block">Total Debt Outflow (57.4%)</span>
                    <span className="text-xs text-slate-300">
                      ₹{interestMetrics.totalMonthlyPrincipalNow.toLocaleString('en-IN')} Principal + ₹{interestMetrics.totalMonthlyInterestNow.toLocaleString('en-IN')} Interest
                    </span>
                  </div>
                  <span className="text-lg font-black text-rose-400">-₹{totalMonthlyEmi.toLocaleString('en-IN')}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-indigo-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-indigo-300 block">Retained Cash Flow (42.6%)</span>
                    <span className="text-xs text-slate-300">Net disposable income available for life</span>
                  </div>
                  <span className="text-lg font-black text-white">₹{cashFlowMetrics.disposableIncomeAfterDebt.toLocaleString('en-IN')}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block">Monthly Basic Needs Outflow:</span>
                    <span className="text-slate-300">
                      {totalBasicNeedsBudget > 0 ? `${basicNeeds.length} active basic needs requirements` : 'No basic needs added yet'}
                    </span>
                  </div>
                  <span className="font-bold text-slate-300">-₹{totalBasicNeedsBudget.toLocaleString('en-IN')}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-emerald-300 block">Surplus Prepayment Power</span>
                    <span className="text-xs text-slate-300">Safe extra margin to accelerate debt payoff</span>
                  </div>
                  <span className="text-lg font-black text-emerald-300">₹{cashFlowMetrics.freeSavingsSurplus.toLocaleString('en-IN')} /mo</span>
                </div>
              </div>
            </div>

            {/* Right: The Freedom Curve (Post-Payoff Cash Flow Expansion) */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <span>The Freedom Curve: Post-Payoff Cash Flow</span>
              </h3>
              <p className="text-xs text-slate-400">
                How your disposable income multiplies at every loan elimination stage.
              </p>

              <div className="h-56 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cashFlowMetrics.progressionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                    <YAxis stroke="#64748B" fontSize={11} tickFormatter={(val) => `₹${val / 1000}k`} />
                    <Tooltip
                      formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }}
                    />
                    <Legend />
                    <Bar dataKey="FreeCash" name="Retained Free Cash Flow" fill="#10B981" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="LoanEMI" name="Debt Outflow" fill="#F43F5E" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 pt-2 text-xs">
                {cashFlowMetrics.stages.map((stg, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div>
                      <span className="font-bold text-white block">{stg.label}</span>
                      <span className="text-[11px] text-slate-400">{stg.desc}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-emerald-400 text-sm">₹{stg.freeCashFlow.toLocaleString('en-IN')}/mo</span>
                      <span className="text-[10px] text-slate-500 block">({stg.pctOfSalary}% of salary)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DYNAMIC MONTHLY BASIC NEEDS & 4-PHASE PAY CYCLE ARCHITECTURE */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/30 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Dynamic Pay Cycle System
                  </span>
                  <span className="text-xs text-slate-400 font-mono">₹10,000 Budget Target</span>
                </div>
                <h3 className="text-xl font-black text-white flex items-center space-x-2">
                  <Wallet className="w-5 h-5 text-emerald-400" />
                  <span>Monthly Basic Needs & 4-Phase Pay Cycle Architecture</span>
                </h3>
                <p className="text-xs text-slate-400 max-w-2xl">
                  Strategic cash allocation synchronized with your ₹34,000 salary arrival. Guarantees every critical living expense is fully covered without borrowing.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Needs Budget / Paid:</span>
                  <span className="text-base font-black text-white">
                    ₹{totalBasicNeedsPaid.toLocaleString('en-IN')}{' '}
                    <span className="text-slate-400 text-xs font-normal">/ ₹{totalBasicNeedsBudget.toLocaleString('en-IN')}</span>
                  </span>
                </div>
                <button
                  onClick={handleOpenAddNeed}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition flex items-center space-x-1.5 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Need</span>
                </button>
              </div>
            </div>

            {/* Core Financial Rule Callout: Fixed EMI vs Differing Principal */}
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <div className="font-extrabold text-indigo-300 text-sm flex items-center space-x-2">
                    <span>⭐ Core Financial Rule: Fixed Monthly EMI vs Dynamically Growing Principal</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Active Law</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Total scheduled monthly EMI is strictly fixed at <strong>₹{totalMonthlyEmi.toLocaleString('en-IN')}</strong> ({loanAccounts.filter(l => l.currentPrincipal > 0).map(l => `${l.name.split('—')[0].trim()}: ₹${(l.monthlyEmi || l.estimatedEmi || 0).toLocaleString('en-IN')}`).join(' + ')}). Because interest is calculated on your reducing balance, <em>your interest component shrinks each month and your principal repayment component automatically grows!</em>
                  </p>
                </div>
              </div>
              <div className="shrink-0 p-3 rounded-xl bg-slate-900 border border-indigo-500/30 text-right min-w-[210px]">
                <div className="text-[11px] text-slate-400">Current Month Split:</div>
                <div className="text-xs font-bold text-emerald-400">
                  Principal: ₹{interestMetrics.totalMonthlyPrincipalNow.toLocaleString('en-IN')} (↑ {totalMonthlyEmi > 0 ? ((interestMetrics.totalMonthlyPrincipalNow / totalMonthlyEmi) * 100).toFixed(0) : 0}%)
                </div>
                <div className="text-xs font-bold text-rose-400">
                  Interest: ₹{interestMetrics.totalMonthlyInterestNow.toLocaleString('en-IN')} (↓ {totalMonthlyEmi > 0 ? ((interestMetrics.totalMonthlyInterestNow / totalMonthlyEmi) * 100).toFixed(0) : 0}%)
                </div>
              </div>
            </div>

            {/* 4-Phase Pay Cycle Breakdown Grid (100% Dynamic) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Phase 1: Days 1-5 */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/30 shadow-md space-y-3 relative overflow-hidden flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300">
                      Phase 1: Days 1–5
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold">+₹{salary.toLocaleString('en-IN')} Inflow</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Salary Credit & Primary Outflow</h4>
                    <p className="text-[11px] text-slate-400">First-priority living & debt obligations</p>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    {payCyclePhasesData.p1.loans.map(loan => (
                      <div key={loan.id} className="flex justify-between text-slate-300">
                        <span className="truncate pr-2">{loan.name.split('—')[0].trim()} (Day {loan.dueDayOfMonth || 5}):</span>
                        <span className="font-mono font-bold text-rose-400 shrink-0">-₹{(loan.monthlyEmi || loan.estimatedEmi || 0).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                    {payCyclePhasesData.p1.needs.map(need => (
                      <div key={need.id} className="flex justify-between text-slate-300">
                        <span className="truncate pr-2">{need.name} (Day {need.dueDayOfMonth}):</span>
                        <span className="font-mono font-bold text-rose-400 shrink-0">-₹{need.amount.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                    {payCyclePhasesData.p1.loans.length === 0 && payCyclePhasesData.p1.needs.length === 0 && (
                      <div className="text-[11px] text-slate-500 italic">No scheduled outflows in Phase 1</div>
                    )}
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-bold mt-2">
                  <span className="text-slate-400">Phase Buffer Left:</span>
                  <span className="text-indigo-300 font-mono">₹{payCyclePhasesData.p1.bufferLeft.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Phase 2: Days 6-10 */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 shadow-md space-y-3 relative overflow-hidden flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300">
                      Phase 2: Days 6–10
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      From P1: ₹{payCyclePhasesData.p1.bufferLeft.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Secondary Commitments</h4>
                    <p className="text-[11px] text-slate-400">Secondary tranche & sustenance</p>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    {payCyclePhasesData.p2.loans.map(loan => (
                      <div key={loan.id} className="flex justify-between text-slate-300">
                        <span className="truncate pr-2">{loan.name.split('—')[0].trim()} (Day {loan.dueDayOfMonth || 10}):</span>
                        <span className="font-mono font-bold text-rose-400 shrink-0">-₹{(loan.monthlyEmi || loan.estimatedEmi || 0).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                    {payCyclePhasesData.p2.needs.map(need => (
                      <div key={need.id} className="flex justify-between text-slate-300">
                        <span className="truncate pr-2">{need.name} (Day {need.dueDayOfMonth}):</span>
                        <span className="font-mono font-bold text-rose-400 shrink-0">-₹{need.amount.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                    {payCyclePhasesData.p2.loans.length === 0 && payCyclePhasesData.p2.needs.length === 0 && (
                      <div className="text-[11px] text-slate-500 italic">No scheduled outflows in Phase 2</div>
                    )}
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-bold mt-2">
                  <span className="text-slate-400">Phase Buffer Left:</span>
                  <span className="text-amber-300 font-mono">₹{payCyclePhasesData.p2.bufferLeft.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Phase 3: Days 11-20 */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 shadow-md space-y-3 relative overflow-hidden flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-500/20 text-cyan-300">
                      Phase 3: Days 11–20
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      From P2: ₹{payCyclePhasesData.p2.bufferLeft.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Connectivity & Living Buffer</h4>
                    <p className="text-[11px] text-slate-400">Utilities, transit & health reserves</p>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    {payCyclePhasesData.p3.loans.map(loan => (
                      <div key={loan.id} className="flex justify-between text-slate-300">
                        <span className="truncate pr-2">{loan.name.split('—')[0].trim()} (Day {loan.dueDayOfMonth}):</span>
                        <span className="font-mono font-bold text-rose-400 shrink-0">-₹{(loan.monthlyEmi || loan.estimatedEmi || 0).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                    {payCyclePhasesData.p3.needs.map(need => (
                      <div key={need.id} className="flex justify-between text-slate-300">
                        <span className="truncate pr-2">{need.name} (Day {need.dueDayOfMonth}):</span>
                        <span className="font-mono font-bold text-rose-400 shrink-0">-₹{need.amount.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                    {payCyclePhasesData.p3.loans.length === 0 && payCyclePhasesData.p3.needs.length === 0 && (
                      <div className="text-[11px] text-slate-500 italic">No scheduled outflows in Phase 3</div>
                    )}
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-bold mt-2">
                  <span className="text-slate-400">Phase Buffer Left:</span>
                  <span className="text-cyan-300 font-mono">₹{payCyclePhasesData.p3.bufferLeft.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Phase 4: Days 21-30 */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/40 shadow-md space-y-3 relative overflow-hidden bg-gradient-to-b from-slate-950 to-emerald-950/20 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300">
                      Phase 4: Days 21–30
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold">Surplus Margin</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Retained Liquid Free Cash</h4>
                    <p className="text-[11px] text-slate-400">Unallocated surplus retained in bank</p>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    {payCyclePhasesData.p4.loans.map(loan => (
                      <div key={loan.id} className="flex justify-between text-slate-300">
                        <span className="truncate pr-2">{loan.name.split('—')[0].trim()} (Day {loan.dueDayOfMonth}):</span>
                        <span className="font-mono font-bold text-rose-400 shrink-0">-₹{(loan.monthlyEmi || loan.estimatedEmi || 0).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                    {payCyclePhasesData.p4.needs.map(need => (
                      <div key={need.id} className="flex justify-between text-slate-300">
                        <span className="truncate pr-2">{need.name} (Day {need.dueDayOfMonth}):</span>
                        <span className="font-mono font-bold text-rose-400 shrink-0">-₹{need.amount.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                    {payCyclePhasesData.p4.loans.length === 0 && payCyclePhasesData.p4.needs.length === 0 && (
                      <p className="leading-snug text-slate-400">
                        Zero scheduled debt outflows. ₹{payCyclePhasesData.p4.surplusLeft.toLocaleString('en-IN')} pure retained surplus.
                      </p>
                    )}
                    <p className="text-[11px] text-emerald-300 leading-snug">
                      Use for emergency liquidity buffer or pour as extra debt prepayment!
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-bold mt-2">
                  <span className="text-slate-400">Free Cash Surplus:</span>
                  <span className={`font-mono text-sm ${payCyclePhasesData.p4.surplusLeft >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {payCyclePhasesData.p4.surplusLeft >= 0 ? `+₹${payCyclePhasesData.p4.surplusLeft.toLocaleString('en-IN')}` : `-₹${Math.abs(payCyclePhasesData.p4.surplusLeft).toLocaleString('en-IN')}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic Basic Needs Checklist Table */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Itemized Basic Needs Requirements (Dynamic Checklist)</span>
                </h4>
                <span className="text-xs text-slate-400">
                  Click checkbox to toggle paid status for this month
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4 w-12 text-center">Status</th>
                      <th className="py-3 px-4">Requirement / Expense</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Pay Cycle Phase</th>
                      <th className="py-3 px-4">Due Day</th>
                      <th className="py-3 px-4 text-right">Monthly Budget</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {basicNeeds.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400">
                              <CheckCircle2 className="w-6 h-6 text-slate-500" />
                            </div>
                            <div className="font-semibold text-slate-300">No basic need requirements added yet</div>
                            <p className="text-xs text-slate-500 max-w-sm">
                              Click "+ Add Need" above to dynamically configure your monthly living expenses, rent, groceries, and pay cycle timings.
                            </p>
                            <button
                              onClick={handleOpenAddNeed}
                              className="mt-1 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow transition"
                            >
                              + Add First Basic Need
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      basicNeeds.map(need => (
                      <tr key={need.id} className={`hover:bg-slate-800/30 transition ${need.isPaid ? 'bg-emerald-950/10' : ''}`}>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => toggleBasicNeedPaid(need.id)}
                            className={`w-5 h-5 rounded flex items-center justify-center transition ${
                              need.isPaid
                                ? 'bg-emerald-500 text-slate-950 font-bold'
                                : 'border border-slate-600 hover:border-emerald-400 text-transparent'
                            }`}
                            title={need.isPaid ? 'Mark as Unpaid' : 'Mark as Paid'}
                          >
                            ✓
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{need.name}</div>
                          {need.notes && <div className="text-[11px] text-slate-400 truncate max-w-xs">{need.notes}</div>}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                            {need.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-slate-300 text-xs">{need.payCyclePhase}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-cyan-300 font-semibold">
                          Day {need.dueDayOfMonth}th
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-white">
                          ₹{need.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => handleOpenEditNeed(need)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                              title="Edit Need"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete ${need.name}?`)) {
                                  deleteBasicNeed(need.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                              title="Delete Need"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB C: EMI REMINDERS & DUE DATE CALENDAR */}
      {activeSubTab === 'reminders' && (
        <div className="space-y-6">
          {/* Main Calendar Card */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-indigo-500/30 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Interactive Monthly Schedule
                </span>
                <h3 className="text-xl font-black text-white mt-1 flex items-center space-x-2">
                  <CalendarDays className="w-5 h-5 text-indigo-400" />
                  <span>Interactive EMI Calendar & Payment Schedule</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Visual 31-day calendar mapping every loan installment, due dates, payments, and interest breakdown.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={handleExportCalendarReminders}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-md transition-all hover:scale-105"
                  title="Download .ICS for Google / Apple Calendar"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .ICS Calendar File</span>
                </button>
              </div>
            </div>

            {/* Calendar Controls & Month Switcher */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setCalendarViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <span className="text-base sm:text-lg font-black text-white tracking-wide">
                    {calMonthName}
                  </span>
                </div>
                <button
                  onClick={() => setCalendarViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  title="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    const now = new Date();
                    setCalendarViewDate(now);
                    setSelectedCalendarDay(now.getDate());
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  Today
                </button>
              </div>

              {/* Month Commitments Summary */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <button
                  onClick={() => setCalendarIncludeNeeds(prev => !prev)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center space-x-1.5 shadow-sm ${
                    calendarIncludeNeeds
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                  title="Toggle whether Basic Needs due dates are displayed on the calendar grid"
                >
                  <Check className={`w-3.5 h-3.5 ${calendarIncludeNeeds ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span>{calendarIncludeNeeds ? 'Loans + Basic Needs' : 'Loans Only'}</span>
                </button>
                <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center space-x-1.5">
                  <span className="text-slate-400">Monthly EMI:</span>
                  <span className="font-bold text-white">₹{totalMonthlyEmi.toLocaleString('en-IN')}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center space-x-1.5">
                  <span className="text-slate-400">Principal:</span>
                  <span className="font-bold text-emerald-400">₹{interestMetrics.totalMonthlyPrincipalNow.toLocaleString('en-IN')}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-rose-950/30 border border-rose-500/30 flex items-center space-x-1.5">
                  <span className="text-slate-400">Interest:</span>
                  <span className="font-bold text-rose-400">₹{interestMetrics.totalMonthlyInterestNow.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Visual 7-Column Calendar Grid */}
            <div className="space-y-2">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider py-1.5">
                <div className="text-rose-400">Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div className="text-cyan-400">Sat</div>
              </div>

              {/* Day Cells Grid */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {/* Empty cells for padding */}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-[85px] sm:min-h-[105px] rounded-2xl bg-slate-950/20 border border-slate-900/50 p-2" />
                ))}

                {/* Actual Month Days */}
                {Array.from({ length: daysInCalMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const today = new Date();
                  const isToday =
                    today.getDate() === dayNum &&
                    today.getMonth() === calMonth &&
                    today.getFullYear() === calYear;
                  const isSelected = selectedCalendarDay === dayNum;

                  // Find loans due on this day
                  const dueLoansOnDay = loanAccounts.filter(l => (l.dueDayOfMonth || 5) === dayNum && l.currentPrincipal > 0);

                  // Find payments made on this day in the calendar month
                  const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                  const paymentsOnDay = loanPayments.filter(p => p.date === dateStr);

                  return (
                    <div
                      key={`day-${dayNum}`}
                      onClick={() => setSelectedCalendarDay(dayNum)}
                      className={`min-h-[85px] sm:min-h-[105px] rounded-2xl p-2 sm:p-2.5 transition-all cursor-pointer flex flex-col justify-between border ${
                        isSelected
                          ? 'bg-indigo-950/60 border-indigo-400 shadow-lg shadow-indigo-950/40 ring-1 ring-indigo-400'
                          : isToday
                          ? 'bg-slate-900/95 border-cyan-500/60 shadow-md shadow-cyan-950/20'
                          : dueLoansOnDay.length > 0
                          ? 'bg-slate-900/80 border-slate-700/80 hover:border-indigo-500/50'
                          : 'bg-slate-950/50 border-slate-800/60 hover:bg-slate-900/40 hover:border-slate-700/50'
                      }`}
                    >
                      {/* Top Day Header */}
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-mono font-bold ${isToday ? 'text-cyan-400' : 'text-slate-300'}`}>
                          {dayNum}
                        </span>
                        {isToday && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" title="Today" />
                        )}
                      </div>

                      {/* Due Loans or Payments Badges */}
                      <div className="space-y-1 my-1">
                        {dueLoansOnDay.map(loan => {
                          const isPaidThisMonth = loanPayments.some(p => {
                            const calMonthStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}`;
                            return (p.loanId === loan.id || p.loanName === loan.name) && p.date?.startsWith(calMonthStr);
                          });

                          return (
                            <div
                              key={loan.id}
                              className={`px-1.5 py-0.5 rounded-lg text-[9.5px] sm:text-[10px] font-bold truncate flex items-center justify-between border ${
                                isPaidThisMonth
                                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                                  : loan.id === 'loan-3'
                                  ? 'bg-amber-950/40 text-amber-300 border-amber-500/40'
                                  : loan.id === 'loan-1'
                                  ? 'bg-rose-950/40 text-rose-300 border-rose-500/40'
                                  : 'bg-indigo-950/40 text-indigo-300 border-indigo-500/40'
                              }`}
                              title={`${loan.name} — Due ₹${(loan.monthlyEmi || 8000).toLocaleString('en-IN')}`}
                            >
                              <span className="truncate">
                                {loan.id === 'loan-3' ? 'Hand Ln' : loan.id === 'loan-1' ? 'HDFC' : 'Canara'}
                              </span>
                              <span className="shrink-0 ml-1">
                                {isPaidThisMonth ? '✅' : `₹${Math.round((loan.monthlyEmi || 8000) / 1000)}k`}
                              </span>
                            </div>
                          );
                        })}

                        {paymentsOnDay.map(p => (
                          <div
                            key={p.id}
                            className="px-1.5 py-0.5 rounded-lg text-[9.5px] sm:text-[10px] font-extrabold bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 truncate flex items-center space-x-1"
                          >
                            <span>Paid</span>
                            <span>₹{p.totalPaid.toLocaleString('en-IN')}</span>
                          </div>
                        ))}

                        {/* Basic Needs Due on this Day */}
                        {calendarIncludeNeeds && basicNeeds.filter(n => n.dueDayOfMonth === dayNum).map(need => (
                          <div
                            key={need.id}
                            className={`px-1.5 py-0.5 rounded-lg text-[9px] font-semibold truncate flex items-center justify-between border ${
                              need.isPaid
                                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                                : 'bg-slate-800/90 text-slate-300 border-slate-700'
                            }`}
                            title={`${need.name} — ₹${need.amount.toLocaleString('en-IN')}`}
                          >
                            <span className="truncate">{need.name.split(' ')[0]}</span>
                            <span className="shrink-0 ml-1 font-mono text-[8.5px]">
                              {need.isPaid ? '✓' : `₹${need.amount >= 1000 ? `${Math.round(need.amount / 1000)}k` : need.amount}`}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Bottom Indicator */}
                      <div className="text-[9px] text-right text-slate-500">
                        {dueLoansOnDay.length > 0 ? (
                          <span className="text-amber-400/80 font-semibold">{dueLoansOnDay.length} EMI Due</span>
                        ) : paymentsOnDay.length > 0 ? (
                          <span className="text-emerald-400 font-semibold">{paymentsOnDay.length} Logged</span>
                        ) : calendarIncludeNeeds && basicNeeds.some(n => n.dueDayOfMonth === dayNum) ? (
                          <span className="text-cyan-400/80 font-semibold">Need Due</span>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Day Inspector Panel */}
            {selectedCalendarDay !== null && (
              <div className="p-5 rounded-2xl bg-slate-950/90 border border-indigo-500/40 shadow-xl space-y-4 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {selectedCalendarDay} {calMonthName} — Day Inspector
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Detailed EMI obligation, living expenses, and interest decomposition for this date.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCalendarDay(null)}
                    className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
                  >
                    Close Inspector ✕
                  </button>
                </div>

                {(() => {
                  const dueLoansOnSelected = loanAccounts.filter(l => (l.dueDayOfMonth || 5) === selectedCalendarDay && l.currentPrincipal > 0);
                  const dueNeedsOnSelected = calendarIncludeNeeds ? basicNeeds.filter(n => n.dueDayOfMonth === selectedCalendarDay) : [];
                  const selectedDateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(selectedCalendarDay).padStart(2, '0')}`;
                  const paymentsOnSelected = loanPayments.filter(p => p.date === selectedDateStr);

                  if (dueLoansOnSelected.length === 0 && paymentsOnSelected.length === 0 && dueNeedsOnSelected.length === 0) {
                    return (
                      <div className="text-center py-6 text-slate-400 text-xs">
                        <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                        <p className="font-semibold text-slate-300">No scheduled loan payments or basic needs on {selectedCalendarDay} {calMonthName}.</p>
                        <p className="text-[11px] text-slate-500 mt-1">This is a regular cash flow day. You can still make a principal prepayment at any time.</p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-4">
                      {dueLoansOnSelected.map(loan => {
                        const interestData = interestMetrics.loanBreakdown.find(l => l.id === loan.id);
                        const isPaidThisMonth = loanPayments.some(p => {
                          const calMonthStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}`;
                          return (p.loanId === loan.id || p.loanName === loan.name) && p.date?.startsWith(calMonthStr);
                        });

                        return (
                          <div
                            key={loan.id}
                            className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                          >
                            <div>
                              <div className="flex items-center space-x-2 text-xs mb-1">
                                <span className="font-bold text-white text-sm">{loan.name}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                                  isPaidThisMonth
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                }`}>
                                  {isPaidThisMonth ? 'PAID THIS CYCLE ✅' : 'DUE ON THIS DAY ⏳'}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400">
                                Lender: <span className="text-slate-300">{loan.lender}</span> • Account: <span className="font-mono text-slate-300">{loan.accountNumber || 'N/A'}</span>
                              </p>
                              <div className="flex flex-wrap items-center gap-3 text-xs mt-2 text-slate-300">
                                <div>Total EMI: <strong className="text-white">₹{(loan.monthlyEmi || 8000).toLocaleString('en-IN')}</strong></div>
                                <div>•</div>
                                <div>Principal: <strong className="text-emerald-400">₹{(interestData?.monthlyPrincipal || 0).toLocaleString('en-IN')}</strong></div>
                                <div>•</div>
                                <div>Interest: <strong className="text-rose-400">₹{(interestData?.monthlyInterest || 0).toLocaleString('en-IN')}</strong></div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 shrink-0">
                              {isPaidThisMonth ? (
                                <div className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center space-x-1">
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Payment Verified</span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleQuickMarkPaid(loan)}
                                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Mark as Paid Now</span>
                                </button>
                              )}
                              <button
                                onClick={() => openPaymentForLoan(loan.id)}
                                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold"
                              >
                                Record Custom
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {paymentsOnSelected.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-slate-800">
                          <span className="text-xs font-bold text-cyan-300 block">Payments Logged on this Date:</span>
                          {paymentsOnSelected.map(p => (
                            <div key={p.id} className="p-3 rounded-xl bg-slate-900/60 border border-cyan-500/30 text-xs flex items-center justify-between">
                              <div>
                                <span className="font-bold text-white block">{p.loanName}</span>
                                <span className="text-slate-400 text-[11px]">{p.notes || 'Monthly installment'}</span>
                              </div>
                              <div className="text-right">
                                <span className="font-black text-cyan-400 text-sm">₹{p.totalPaid.toLocaleString('en-IN')}</span>
                                <span className="text-[10px] text-slate-400 block">
                                  (Principal: ₹{p.principalPaid.toLocaleString('en-IN')} | Interest: ₹{p.interestPaid.toLocaleString('en-IN')})
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Basic Needs Due on this Selected Day */}
                      {dueNeedsOnSelected.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-slate-800">
                          <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                            <span>Basic Needs Due on This Date ({dueNeedsOnSelected.length}):</span>
                            <span className="text-slate-400 font-mono">₹{dueNeedsOnSelected.reduce((s, n) => s + n.amount, 0).toLocaleString('en-IN')} Total</span>
                          </div>
                          {dueNeedsOnSelected.map(need => (
                            <div key={need.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-bold text-white text-xs">{need.name}</span>
                                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                                    {need.category}
                                  </span>
                                </div>
                                <span className="text-[11px] text-slate-400">{need.payCyclePhase} • {need.notes || 'Monthly living need'}</span>
                              </div>
                              <div className="flex items-center space-x-3">
                                <span className="font-black text-white text-sm font-mono">₹{need.amount.toLocaleString('en-IN')}</span>
                                <button
                                  onClick={() => toggleBasicNeedPaid(need.id)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                                    need.isPaid
                                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                                  }`}
                                >
                                  <span>{need.isPaid ? 'Paid ✅' : 'Mark as Paid'}</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Monthly Loans Checklist */}
            <div className="space-y-4 pt-4 border-t border-slate-800/80">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>Monthly Due Status for {calMonthName}</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {reminderSchedule.map(loan => (
                  <div
                    key={loan.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                      loan.paidThisMonth
                        ? 'bg-emerald-950/20 border-emerald-500/40'
                        : loan.isUrgent
                        ? 'bg-rose-950/20 border-rose-500/50 shadow-lg shadow-rose-950/30 animate-pulse'
                        : 'bg-slate-950/70 border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-mono text-slate-400 text-[11px]">Due {loan.dueDay}th of month</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          loan.paidThisMonth
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : loan.isUrgent
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {loan.paidThisMonth ? 'PAID ✅' : loan.isUrgent ? 'URGENT ⚠️' : 'PENDING ⏳'}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white">{loan.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Lender: <span className="text-slate-300">{loan.lender || 'Bank'}</span>
                      </p>

                      <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Installment Amount:</span>
                          <span className="font-bold text-white">₹{(loan.monthlyEmi || 8000).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Current Balance:</span>
                          <span className="font-semibold text-rose-400">₹{loan.currentPrincipal.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Status Timeline:</span>
                          <span className={`font-semibold ${loan.daysUntilDue <= 3 ? 'text-rose-400' : 'text-indigo-300'}`}>
                            {loan.paidThisMonth ? 'Cleared for this cycle' : `Due in ${loan.daysUntilDue} days`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center space-x-2">
                      {loan.paidThisMonth ? (
                        <div className="w-full py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold text-xs text-center flex items-center justify-center space-x-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Paid for this Month</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleQuickMarkPaid(loan)}
                          className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-md"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark as Paid Now</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB D: AMORTIZATION SCHEDULE ENGINE */}
      {activeSubTab === 'amortization' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Target Account:</label>
                <select
                  value={amortSelectedLoanId}
                  onChange={(e) => setAmortSelectedLoanId(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">All 3 Loans Combined (Consolidated)</option>
                  {loanAccounts.map(l => (
                    <option key={l.id} value={l.id}>{l.name} (₹{l.currentPrincipal.toLocaleString('en-IN')})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Extra Monthly Payment:</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-500 text-xs">₹</span>
                  <input
                    type="number"
                    value={amortExtraMonthly}
                    onChange={(e) => setAmortExtraMonthly(Number(e.target.value))}
                    step="500"
                    min="0"
                    className="w-32 bg-slate-950 border border-slate-700 rounded-xl pl-6 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">One-Time Lump Sum (Month 1):</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-500 text-xs">₹</span>
                  <input
                    type="number"
                    value={amortLumpSum}
                    onChange={(e) => setAmortLumpSum(Number(e.target.value))}
                    step="1000"
                    min="0"
                    className="w-36 bg-slate-950 border border-slate-700 rounded-xl pl-6 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={exportAmortizationCSV}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md transition-all self-end md:self-auto"
            >
              <Download className="w-4 h-4" />
              <span>Export Schedule to CSV</span>
            </button>
          </div>

          {/* Amortization Table */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  <span>Month-by-Month Amortization Ledger</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Projected timeline for closing balances, interest components, and extra principal prepayments.
                </p>
              </div>
              <div className="text-xs text-slate-400">
                Total Horizon: <span className="text-white font-bold">{amortizationSchedule.length} Months</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] text-slate-400 font-semibold uppercase tracking-wider bg-slate-950/60">
                    <th className="py-3 px-3">#</th>
                    <th className="py-3 px-3">Billing Month</th>
                    <th className="py-3 px-3">Opening Principal</th>
                    <th className="py-3 px-3">Monthly EMI</th>
                    <th className="py-3 px-3 text-emerald-400">Principal Paid</th>
                    <th className="py-3 px-3 text-rose-400">Interest Component</th>
                    <th className="py-3 px-3 text-amber-300">Extra Prepayment</th>
                    <th className="py-3 px-3 font-bold text-white">Closing Principal</th>
                    <th className="py-3 px-3">Cumul. Interest</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {amortizationSchedule.map((row) => (
                    <tr
                      key={row.monthIndex}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        row.closingPrincipal === 0 ? 'bg-emerald-950/30 font-semibold' : ''
                      }`}
                    >
                      <td className="py-3 px-3 font-mono text-slate-500">{row.monthIndex}</td>
                      <td className="py-3 px-3 font-medium text-slate-200">{row.dateFormatted}</td>
                      <td className="py-3 px-3 text-slate-300">₹{row.openingPrincipal.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 text-white font-semibold">₹{row.emi.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 text-emerald-400 font-semibold">₹{row.principalComponent.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 text-rose-400">₹{row.interestComponent.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 text-amber-300 font-medium">
                        {row.extraPrepayment > 0 ? `+₹${row.extraPrepayment.toLocaleString('en-IN')}` : '—'}
                      </td>
                      <td className="py-3 px-3 font-black text-white">
                        {row.closingPrincipal === 0 ? (
                          <span className="text-emerald-400 flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5 inline" />
                            <span>CLEARED (₹0)</span>
                          </span>
                        ) : (
                          `₹${row.closingPrincipal.toLocaleString('en-IN')}`
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-400">₹{row.cumulativeInterest.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB E: PAYOFF & FORECLOSURE SIMULATOR */}
      {activeSubTab === 'simulator' && (
        <div className="space-y-6">
          {/* Strategy Selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setSimStrategy('drop_rule')}
              className={`p-5 rounded-2xl border text-left transition-all ${
                simStrategy === 'drop_rule'
                  ? 'bg-amber-950/20 border-amber-500/60 shadow-lg shadow-amber-950/30'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Strategy A</span>
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <h4 className="text-sm font-extrabold text-white">₹2,000 Drop Rule Maximizer</h4>
              <p className="text-xs text-slate-400 mt-1">
                Target Loan 1 first to drop monthly obligation from ₹19,500 down to ₹11,500 immediately.
              </p>
            </button>

            <button
              onClick={() => setSimStrategy('snowball')}
              className={`p-5 rounded-2xl border text-left transition-all ${
                simStrategy === 'snowball'
                  ? 'bg-emerald-950/20 border-emerald-500/60 shadow-lg shadow-emerald-950/30'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Strategy B</span>
                <Flame className="w-4 h-4 text-emerald-400" />
              </div>
              <h4 className="text-sm font-extrabold text-white">Debt Snowball (Fastest Wins)</h4>
              <p className="text-xs text-slate-400 mt-1">
                Clear Loan 3 (₹40,000 + ₹2k interest) first for an immediate psychological boost.
              </p>
            </button>

            <button
              onClick={() => setSimStrategy('avalanche')}
              className={`p-5 rounded-2xl border text-left transition-all ${
                simStrategy === 'avalanche'
                  ? 'bg-indigo-950/20 border-indigo-500/60 shadow-lg shadow-indigo-950/30'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Strategy C</span>
                <TrendingDown className="w-4 h-4 text-indigo-400" />
              </div>
              <h4 className="text-sm font-extrabold text-white">Debt Avalanche (Max Interest Saved)</h4>
              <p className="text-xs text-slate-400 mt-1">
                Attack Loan 2 (12%) first to minimize rupee leakage on compounded interest charges.
              </p>
            </button>
          </div>

          {/* Interactive Prepayment Sliders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Prepayment Feasibility Controls</span>
              </h3>

              {/* Slider 1: Extra Monthly */}
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-slate-400">Extra Monthly Prepayment from Salary:</span>
                  <span className="font-extrabold text-amber-400 text-sm">₹{simExtraMonthly.toLocaleString('en-IN')}/mo</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15000"
                  step="500"
                  value={simExtraMonthly}
                  onChange={(e) => setSimExtraMonthly(Number(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer h-2"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>₹0</span>
                  <span>₹5,000</span>
                  <span>₹10,000</span>
                  <span>₹15,000</span>
                </div>
              </div>

              {/* Slider 2: Lump Sum Windfall */}
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-slate-400">One-Time Lump Sum (Bonus / Freelance):</span>
                  <span className="font-extrabold text-cyan-400 text-sm">₹{simLumpSum.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="5000"
                  value={simLumpSum}
                  onChange={(e) => setSimLumpSum(Number(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-800 rounded-lg cursor-pointer h-2"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>₹0</span>
                  <span>₹25k</span>
                  <span>₹50k</span>
                  <span>₹100k</span>
                </div>
              </div>
            </div>

            {/* Results Display */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-500/30 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">Simulation Outcome</span>
                <h3 className="text-xl font-black text-white mt-1">Accelerated Payoff Impact</h3>

                <div className="grid grid-cols-2 gap-4 mt-5">
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Months Shaved Off:</span>
                    <span className="text-2xl font-black text-emerald-400 mt-1 block">
                      {simResults.monthsSaved} Months
                    </span>
                    <span className="text-[10px] text-slate-500">Freedom arrives faster</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Est. Interest Saved:</span>
                    <span className="text-2xl font-black text-amber-300 mt-1 block">
                      ₹{simResults.interestSavedEst.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-500">Rupees kept in your pocket</span>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-200">
                  <p>
                    With <strong>+₹{simExtraMonthly.toLocaleString('en-IN')}/mo</strong> and <strong>₹{simLumpSum.toLocaleString('en-IN')}</strong> lump sum, you become 100% debt-free in <strong>{simResults.acceleratedMonths} months</strong> instead of {simResults.normalMonths} months!
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Projected Zero-Debt Month:</span>
                <span className="font-extrabold text-emerald-400">Aug 2026</span>
              </div>
            </div>
          </div>

          {/* ADVANCED FORECLOSURE CALCULATOR */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-xl space-y-6">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
              <Calculator className="w-6 h-6 text-cyan-400" />
              <div>
                <h3 className="text-lg font-black text-white">Foreclosure & Lump Sum Strategy: Tenure vs EMI Reduction</h3>
                <p className="text-xs text-slate-400">
                  Compare whether reducing loan duration (saving interest) or reducing monthly EMI (increasing cash flow) is superior.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Select Loan for Foreclosure / Prepayment:</label>
                  <select
                    value={foreclosureLoanId}
                    onChange={(e) => setForeclosureLoanId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {loanAccounts.map(l => (
                      <option key={l.id} value={l.id}>
                        {l.name} — Balance: ₹{l.currentPrincipal.toLocaleString('en-IN')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">
                    Prepayment Amount: <strong className="text-cyan-300">₹{foreclosureAmount.toLocaleString('en-IN')}</strong>
                  </label>
                  <input
                    type="range"
                    min="5000"
                    max="100000"
                    step="5000"
                    value={foreclosureAmount}
                    onChange={(e) => setForeclosureAmount(Number(e.target.value))}
                    className="w-full accent-cyan-500 bg-slate-800 rounded-lg cursor-pointer h-2"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>₹5,000</span>
                    <span>₹50,000</span>
                    <span>₹1,00,000 (Full Foreclosure)</span>
                  </div>
                </div>
              </div>

              {foreclosureComparison && (
                <div className="grid grid-cols-2 gap-4">
                  {/* Option 1: Reduce Tenure */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/40 flex flex-col justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300">
                        Option A: Reduce Tenure
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1">Keep EMI at ₹{foreclosureComparison.currentEmi.toLocaleString('en-IN')}</h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Finish loan <strong>{foreclosureComparison.tenureMonthsSaved} months earlier</strong>.
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Interest Saved:</span>
                      <span className="text-lg font-black text-emerald-400">₹{foreclosureComparison.interestSavedTenure.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Option 2: Reduce EMI */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/40 flex flex-col justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300">
                        Option B: Reduce EMI
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1">Drop EMI to ₹{foreclosureComparison.newEmi.toLocaleString('en-IN')}</h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Gain <strong>+₹{foreclosureComparison.monthlyCashFlowGain.toLocaleString('en-IN')}/mo</strong> immediate cash flow.
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Monthly Cashflow Gain:</span>
                      <span className="text-lg font-black text-cyan-300">+₹{foreclosureComparison.monthlyCashFlowGain.toLocaleString('en-IN')}/mo</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB F: PAYMENT LEDGER & HISTORY */}
      {activeSubTab === 'ledger' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Verified Loan Payment Ledger</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Permanent record of all EMIs and extra prepayments logged to your personal database.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openAdjustEmiInterestModal()}
                  className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-md transition-all"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Adjust EMI / Interest</span>
                </button>
                <button
                  onClick={() => setPaymentModalOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Record Payment</span>
                </button>
              </div>
            </div>

            {loanPayments.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
                <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-400 font-medium">No loan payments recorded yet.</p>
                <p className="text-xs text-slate-500 mt-1">
                  Click "Record Payment" to log your first EMI or extra principal prepayment!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] text-slate-400 font-semibold uppercase tracking-wider bg-slate-950/60">
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3">Loan Target</th>
                      <th className="py-3 px-3">Opening Bal</th>
                      <th className="py-3 px-3 text-emerald-400 font-bold">Principal Paid</th>
                      <th className="py-3 px-3 text-rose-400">Interest Paid</th>
                      <th className="py-3 px-3 font-bold text-white">Total Paid</th>
                      <th className="py-3 px-3">Closing Bal</th>
                      <th className="py-3 px-3">Notes & Ref</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {loanPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 font-medium text-slate-300">{p.date}</td>
                        <td className="py-3 px-3 font-semibold text-white">{p.loanName}</td>
                        <td className="py-3 px-3 text-slate-400">₹{p.openingBalance.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-3 font-bold text-emerald-400">₹{p.principalPaid.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-3 text-rose-400">₹{p.interestPaid.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-3 font-black text-white">₹{p.totalPaid.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-3 font-mono text-slate-300">₹{p.closingBalance.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-3 text-slate-400 text-[11px] max-w-xs truncate">{p.notes || '—'}</td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => openEditPaymentModal(p)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors"
                              title="Edit payment record"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete payment of ₹${p.totalPaid.toLocaleString('en-IN')} for ${p.loanName}? This will restore the loan's balance.`)) {
                                  deleteLoanPayment(p.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Delete payment record & restore loan balance"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB G: DEBT FREEDOM ROADMAP */}
      {activeSubTab === 'roadmap' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center space-x-2 mb-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Debt Freedom 2026 Milestones</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Track your journey from ₹2,40,000 initial debt to total financial sovereignty.
            </p>

            <div className="space-y-4">
              {/* Milestone 1 */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">First ₹25,000 Cleared</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      The hardest part is getting started. First 10% cleared!
                    </p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                  totalPrincipalPaid >= 25000 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                }`}>
                  {totalPrincipalPaid >= 25000 ? 'ACHIEVED 🎉' : 'IN PROGRESS'}
                </span>
              </div>

              {/* Milestone 2 */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/30 flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Loan 3 Hand Loan Cleared (₹40,000 + ₹2k Interest)</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Eliminate the private hand loan completely. Frees up ₹3,500/mo cashflow.
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-slate-800 text-slate-500">
                  TARGET: APR 2026
                </span>
              </div>

              {/* Milestone 3 */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Loan 1 Cleared: ₹2,000 EMI Drop Triggered!</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      First ₹1 Lakh tranche eliminated. Unlocks ₹2,000 drop in monthly obligation!
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300">
                  CRITICAL MILESTONE
                </span>
              </div>

              {/* Milestone 4 */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-rose-500/30 flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-sm shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">100% Debt Sovereignty (₹0 Principal)</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Full ₹2.40 Lakhs eliminated. Entire ₹34,000 salary is now 100% Jeeva's personal wealth.
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300">
                  ULTIMATE GOAL 2026
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. RECORD PAYMENT MODAL */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700/80 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Plus className="w-4 h-4 text-rose-400" />
                <span>Record Loan Payment</span>
              </h3>
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Select Loan Account:</label>
                <select
                  value={payLoanId}
                  onChange={(e) => {
                    setPayLoanId(e.target.value);
                    const l = loanAccounts.find(acc => acc.id === e.target.value);
                    if (l) {
                      const emi = l.monthlyEmi || l.estimatedEmi || 8000;
                      setPayTotalAmount(emi);
                      const intEst = l.currentPrincipal > 0
                        ? (l.fixedInterestAmount !== undefined ? l.fixedInterestAmount : 2000)
                        : 0;
                      setPayPrincipalAmount(Math.max(0, emi - intEst));
                      setPayInterestAmount(intEst);
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                >
                  {loanAccounts.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.name} — Balance: ₹{l.currentPrincipal.toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300">
                ⭐ <strong>Fixed Monthly Interest Rule:</strong> ₹2,000 monthly fixed interest applied. No day-based interest calculations. Principal portion is dynamically computed (EMI − ₹2,000).
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Payment Date:</label>
                  <input
                    type="date"
                    value={payDate}
                    onChange={(e) => setPayDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Payment Method:</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="Auto-Debit UPI">Auto-Debit UPI (Mandate)</option>
                    <option value="Google Pay / PhonePe">Google Pay / PhonePe UPI</option>
                    <option value="Net Banking / NEFT">Net Banking / NEFT</option>
                    <option value="Direct Cash">Direct Cash</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold text-emerald-400">
                    Principal Portion (Deducted from Debt):
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-500">₹</span>
                    <input
                      type="number"
                      value={payPrincipalAmount}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setPayPrincipalAmount(val);
                        setPayTotalAmount(val + payInterestAmount);
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-6 pr-3 py-2 text-white font-bold focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold text-rose-400">
                    Interest Portion (Lender fee):
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-500">₹</span>
                    <input
                      type="number"
                      value={payInterestAmount}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setPayInterestAmount(val);
                        setPayTotalAmount(payPrincipalAmount + val);
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-6 pr-3 py-2 text-white font-bold focus:outline-none focus:border-rose-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] flex justify-between items-center">
                <span className="text-slate-400">Total Cash Deducted:</span>
                <span className="font-extrabold text-white text-sm">₹{(payPrincipalAmount + payInterestAmount).toLocaleString('en-IN')}</span>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Reference / UTR Number (Optional):</label>
                <input
                  type="text"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  placeholder="e.g. UPI-509214488219"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Notes / Purpose:</label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  placeholder="Regular monthly EMI or extra prepayment"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. DEDICATED ADD / ADJUST EMI & INTEREST MODAL (NEW) */}
      {adjustEmiInterestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-amber-500/40 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                <span>Add / Adjust Loan EMI & Interest</span>
              </h3>
              <button
                onClick={() => setAdjustEmiInterestModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAdjustEmiInterest} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Select Loan Account to Configure:</label>
                <select
                  value={adjustLoanId}
                  onChange={(e) => {
                    const l = loanAccounts.find(acc => acc.id === e.target.value);
                    if (l) {
                      setAdjustLoanId(l.id);
                      setAdjustMonthlyEmi(l.monthlyEmi || l.estimatedEmi || 8000);
                      setAdjustInterestType(l.interestType === 'fixed_amount' || l.id === 'loan-3' ? 'fixed_amount' : 'reducing_balance');
                      setAdjustFixedInterestAmount(l.fixedInterestAmount !== undefined ? l.fixedInterestAmount : (l.id === 'loan-3' ? 2000 : 0));
                      setAdjustAnnualRate(l.annualInterestRate !== undefined ? l.annualInterestRate : 11.5);
                      setAdjustTenureMonths(l.remainingTenureMonths || 12);
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                >
                  {loanAccounts.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.name} — Current EMI: ₹{(l.monthlyEmi || 8000).toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Monthly EMI Input */}
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Monthly EMI Installment (₹):</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-500">₹</span>
                  <input
                    type="number"
                    value={adjustMonthlyEmi}
                    onChange={(e) => setAdjustMonthlyEmi(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-6 pr-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              {/* Interest Mode Selector */}
              <div>
                <label className="text-slate-400 block mb-1.5 font-semibold">Interest Calculation Mode:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustInterestType('fixed_amount')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      adjustInterestType === 'fixed_amount'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Fixed Interest Amount (₹)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustInterestType('reducing_balance')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      adjustInterestType === 'reducing_balance'
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Annual Rate (% p.a.)
                  </button>
                </div>
              </div>

              {/* Conditional Input based on Mode */}
              {adjustInterestType === 'fixed_amount' ? (
                <div>
                  <label className="text-amber-300 block mb-1 font-semibold">
                    Monthly Fixed Interest Amount (₹):
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-500">₹</span>
                    <input
                      type="number"
                      value={adjustFixedInterestAmount}
                      onChange={(e) => setAdjustFixedInterestAmount(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-amber-500/40 rounded-xl pl-6 pr-3 py-2 text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                  <span className="text-[10.5px] text-slate-400 mt-1 block">
                    Fixed ₹{adjustFixedInterestAmount}/month applied with zero day interest calculations. Monthly Principal = EMI − ₹{adjustFixedInterestAmount}.
                  </span>
                </div>
              ) : (
                <div>
                  <label className="text-indigo-300 block mb-1 font-semibold">
                    Annual Interest Rate (% p.a. Reducing Balance):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={adjustAnnualRate}
                    onChange={(e) => setAdjustAnnualRate(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-indigo-500/40 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-indigo-400"
                    required
                  />
                </div>
              )}

              {/* Extra Accrued Interest or Penalty to Add */}
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">
                  Add Extra Accrued Interest / Fee (Optional):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-500">₹</span>
                  <input
                    type="number"
                    value={adjustExtraInterestToAdd}
                    onChange={(e) => setAdjustExtraInterestToAdd(Number(e.target.value))}
                    placeholder="0"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-6 pr-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Instantly adds this interest amount to the loan's total payable obligation.
                </span>
              </div>

              {/* Tenure input */}
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Remaining Tenure (Months):</label>
                <input
                  type="number"
                  value={adjustTenureMonths}
                  onChange={(e) => setAdjustTenureMonths(Number(e.target.value))}
                  min="1"
                  max="60"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setAdjustEmiInterestModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg"
                >
                  Save EMI & Interest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. EDIT LOAN DETAILS MODAL */}
      {editLoanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700/80 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Edit3 className="w-4 h-4 text-indigo-400" />
                <span>Edit Loan Account Specifications</span>
              </h3>
              <button
                onClick={() => setEditLoanModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLoanEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Loan Name:</label>
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Lender / Bank:</label>
                  <input
                    type="text"
                    value={editForm.lender || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, lender: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Account Number:</label>
                  <input
                    type="text"
                    value={editForm.accountNumber || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, accountNumber: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Current Balance (₹):</label>
                  <input
                    type="number"
                    value={editForm.currentPrincipal || 0}
                    onChange={(e) => setEditForm(prev => ({ ...prev, currentPrincipal: Number(e.target.value) }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Monthly EMI (₹):</label>
                  <input
                    type="number"
                    value={editForm.monthlyEmi || editForm.estimatedEmi || 0}
                    onChange={(e) => setEditForm(prev => ({ ...prev, monthlyEmi: Number(e.target.value), estimatedEmi: Number(e.target.value) }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">
                    Monthly Fixed Interest (₹):
                  </label>
                  <input
                    type="number"
                    value={editForm.fixedInterestAmount !== undefined ? editForm.fixedInterestAmount : 2000}
                    onChange={(e) => setEditForm(prev => ({ ...prev, fixedInterestAmount: Number(e.target.value), interestType: 'fixed_amount' }))}
                    className="w-full bg-slate-950 border border-amber-500/40 rounded-xl px-3 py-2 text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">Fixed ₹2,000/mo (No day interest)</span>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Due Day of Month:</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={editForm.dueDayOfMonth || 5}
                    onChange={(e) => setEditForm(prev => ({ ...prev, dueDayOfMonth: Number(e.target.value) }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Lender Notes / Special Conditions:</label>
                <textarea
                  rows={2}
                  value={editForm.lenderNotes || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, lenderNotes: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedLoanIdForAction && window.confirm(`Are you sure you want to delete "${editForm.name || 'this loan'}"? All associated payment history will also be removed.`)) {
                      deleteLoanAccount(selectedLoanIdForAction);
                      setEditLoanModalOpen(false);
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold text-xs flex items-center space-x-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Loan</span>
                </button>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditLoanModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. MODAL: ADD / EDIT BASIC NEED REQUIREMENT */}
      {needModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center space-x-2">
                <Wallet className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-extrabold text-white">
                  {editingNeed ? 'Edit Basic Need Requirement' : 'Add Monthly Basic Need Requirement'}
                </h3>
              </div>
              <button
                onClick={() => setNeedModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNeed} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Requirement / Living Expense Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. House Rent, Groceries, WiFi Broadband"
                  value={needName}
                  onChange={(e) => setNeedName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Category *</label>
                  <select
                    value={needCategory}
                    onChange={(e) => setNeedCategory(e.target.value as BasicNeedCategory)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Housing">Housing / Rent</option>
                    <option value="Food">Food / Groceries</option>
                    <option value="Utilities">Utilities / Bills</option>
                    <option value="Transit">Transit / Fuel</option>
                    <option value="Health">Health / Medicines</option>
                    <option value="Personal">Personal Care</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Monthly Budget (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={needAmount}
                    onChange={(e) => setNeedAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Due Day of Month (1-31) *</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={needDueDay}
                    onChange={(e) => setNeedDueDay(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Pay Cycle Phase *</label>
                  <select
                    value={needPhase}
                    onChange={(e) => setNeedPhase(e.target.value as PayCyclePhase)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Phase 1 (Day 1-5)">Phase 1 (Day 1–5)</option>
                    <option value="Phase 2 (Day 6-10)">Phase 2 (Day 6–10)</option>
                    <option value="Phase 3 (Day 11-20)">Phase 3 (Day 11–20)</option>
                    <option value="Phase 4 (Day 21-30)">Phase 4 (Day 21–30)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Priority Level</label>
                <select
                  value={needPriority}
                  onChange={(e) => setNeedPriority(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="essential">Essential (Non-negotiable)</option>
                  <option value="flexible">Flexible (Can adjust if needed)</option>
                  <option value="discretionary">Discretionary</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Notes & Payment Details</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Direct UPI to owner, paid around 5th"
                  value={needNotes}
                  onChange={(e) => setNeedNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setNeedModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg"
                >
                  {editingNeed ? 'Save Changes' : 'Add Requirement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. ADD NEW LOAN ACCOUNT MODAL */}
      {addLoanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-emerald-500/40 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Add New Loan Account</span>
              </h3>
              <button
                onClick={() => setAddLoanModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLoan} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Loan Name *:</label>
                <input
                  type="text"
                  placeholder="e.g. Loan 4 (Hand Loan / Bajaj Finserv)"
                  value={newLoanName}
                  onChange={(e) => setNewLoanName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Lender / Bank:</label>
                  <input
                    type="text"
                    placeholder="e.g. HDFC Bank, Hand Loan"
                    value={newLoanLender}
                    onChange={(e) => setNewLoanLender(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Loan Type:</label>
                  <select
                    value={newLoanType}
                    onChange={(e) => setNewLoanType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Personal Loan">Personal Loan</option>
                    <option value="Hand Loan">Hand Loan</option>
                    <option value="Vehicle Loan">Vehicle Loan</option>
                    <option value="Education Loan">Education Loan</option>
                    <option value="Consumer Durable">Consumer Durable</option>
                    <option value="Credit Card EMI">Credit Card EMI</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Original Principal (₹) *:</label>
                  <input
                    type="number"
                    min="1000"
                    value={newLoanOriginalPrincipal}
                    onChange={(e) => setNewLoanOriginalPrincipal(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Scheduled Monthly EMI (₹) *:</label>
                  <input
                    type="number"
                    min="100"
                    value={newLoanMonthlyEmi}
                    onChange={(e) => setNewLoanMonthlyEmi(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-amber-300 block mb-1 font-semibold">
                    Monthly Fixed Interest (₹) *:
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newLoanFixedInterest}
                    onChange={(e) => setNewLoanFixedInterest(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-amber-500/40 rounded-xl px-3 py-2 text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                    required
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">Fixed ₹2k/mo rule, zero day-based math</span>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Monthly Due Day (1-31):</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={newLoanDueDay}
                    onChange={(e) => setNewLoanDueDay(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Tenure (Months):</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={newLoanTenureMonths}
                    onChange={(e) => setNewLoanTenureMonths(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Account / Ref Number:</label>
                  <input
                    type="text"
                    placeholder="e.g. ACC-2026-04"
                    value={newLoanAccountNumber}
                    onChange={(e) => setNewLoanAccountNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Lender Notes / Conditions:</label>
                <textarea
                  rows={2}
                  placeholder="Notes, terms, payment instructions..."
                  value={newLoanNotes}
                  onChange={(e) => setNewLoanNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setAddLoanModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg"
                >
                  Create Loan Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 10. EDIT LOAN PAYMENT MODAL */}
      {editPaymentModalOpen && editingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-indigo-500/40 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Edit3 className="w-4 h-4 text-indigo-400" />
                <span>Edit Payment Record ({editingPayment.loanName})</span>
              </h3>
              <button
                onClick={() => setEditPaymentModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePaymentEdit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Payment Date *:</label>
                  <input
                    type="date"
                    value={editPayDate}
                    onChange={(e) => setEditPayDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Payment Method:</label>
                  <select
                    value={editPayMethod}
                    onChange={(e) => setEditPayMethod(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Auto-Debit UPI">Auto-Debit UPI</option>
                    <option value="Direct UPI">Direct UPI</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-emerald-400 block mb-1 font-semibold">Principal Paid (₹) *:</label>
                  <input
                    type="number"
                    min="0"
                    value={editPayPrincipal}
                    onChange={(e) => setEditPayPrincipal(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-emerald-500/40 rounded-xl px-3 py-2 text-emerald-400 font-bold focus:outline-none focus:border-emerald-400"
                    required
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">Directly knocks down principal</span>
                </div>
                <div>
                  <label className="text-rose-400 block mb-1 font-semibold">Interest Paid (₹) *:</label>
                  <input
                    type="number"
                    min="0"
                    value={editPayInterest}
                    onChange={(e) => setEditPayInterest(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-rose-500/40 rounded-xl px-3 py-2 text-rose-400 font-bold focus:outline-none focus:border-rose-400"
                    required
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">Fixed interest component</span>
                </div>
              </div>

              {/* Total Paid Preview */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Total Cash Paid:</span>
                <span className="text-base font-black text-white">
                  ₹{(Number(editPayPrincipal) + Number(editPayInterest)).toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Reference Number / UTR:</label>
                <input
                  type="text"
                  placeholder="e.g. UPI-2026-9908"
                  value={editPayRef}
                  onChange={(e) => setEditPayRef(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Notes:</label>
                <textarea
                  rows={2}
                  placeholder="Additional payment notes..."
                  value={editPayNotes}
                  onChange={(e) => setEditPayNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditPaymentModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg"
                >
                  Save Payment & Adjust Balance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
