// Finance Module Types

export type { ExpenseCategory, ExpenseSubCategory } from './index';
export type Currency = 'INR';

export type IncomeType = 
  | 'salary' 
  | 'freelance' 
  | 'project' 
  | 'other' 
  | 'transfer';

export type ExpenseType = 
  | 'income' 
  | 'expense' 
  | 'loan_repayment' 
  | 'transfer' 
  | 'refund' 
  | 'reimbursement' 
  | 'adjustment';

export type TransactionType = 'expense' | 'salary' | 'loan_payment' | 'income' | 'loan_repayment' | 'transfer';

export interface IncomeRecord {
  id: string;
  userId?: string;
  description: string;
  amount: number;
  type: 'salary' | 'freelance' | 'bonus' | 'investment' | 'other' | string;
  date: string;
  month?: string;
  source?: string;
  account?: string;
  taxDeducted?: number;
  receipt?: string;
  referenceNumber?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MonthlyCashFlow {
  month: string; // YYYY-MM format
  totalIncome: number;
  totalExpenses: number;
  netFlow: number;
  loanPayments: number;
  savingsContribution: number;
  breakdown: Record<string, number>; // category -> amount
}

export interface MonthlyLoanProgress {
  month: string;
  openingPrincipal: number;
  principalPaid: number;
  interestPaid: number;
  closingPrincipal: number;
 emi: number;
  balanceRemaining: number;
}

export interface MonthlyIncomeBreakdown {
  month: string;
  salary: number;
  freelance: number;
  partTime: number;
  other: number;
  total: number;
}

export interface MonthlyExpenseBreakdown {
  month: string;
  housing: number;
  food: number;
  transport: number;
  utilities: number;
  health: number;
  education: number;
  shopping: number;
  travel: number;
  other: number;
  total: number;
}

export interface ExpenseRecord {
  id: string;
  userId: string;
  description: string;
  amount: number;
  type: ExpenseType;
  category: string;
  subCategory?: string;
  account: string;
  paymentMethod: 'UPI' | 'NEFT' | 'cash' | 'card' | 'bank_transfer' | 'other';
  date: string;
  month: string;
  recurring: boolean;
  receipt?: string;
  notes?: string;
  isRefundAgainst?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoanAccount {
  id: string;
  name: string;
  originalPrincipal: number;
  currentPrincipal: number;
  interestPaidTotal: number;
  principalPaidTotal: number;
  estimatedEmi?: number;
  lenderNotes?: string;
  status: 'active' | 'closed';
  interestType: 'fixed' | 'floating' | 'fixed_amount';
  interestRate?: number;
  interestMethod: 'reducing_balance' | 'flat_rate' | 'fixed_amount_arrangement';
  paymentDueDate: string;
  regularPayment: number;
  extraPrincipal?: number;
  prepaymentConditions?: {
    fees?: boolean;
    minimumAmount?: number;
    terms?: string;
  };
  closureChecklist?: {
    zeroBalanceConfirmed: boolean;
    finalStatementReceived: boolean;
    lenderClosureConfirmation: boolean;
    completedAt?: string;
  };
  eightMonthTarget: {
    targetMonth: string;
    verified: boolean;
    actualMonth?: string;
    notes?: string;
  };
  '₹2kDropRule': {
    activated: boolean;
    previousMonthlyPayment: number;
    newMonthlyPayment: number;
    triggeredAt?: string;
  };
}

export interface LoanPaymentRecord {
  id: string;
  loanId: string;
  loanName: string;
  date: string;
  openingPrincipal: number;
  totalCashPaid: number;
  interestPaid: number;
  fees: number;
  principalPaid: number;
  closingPrincipal: number;
  paymentReference?: string;
  notes?: string;
  createdAt: string;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
  account: string;
  monthlyContribution: number;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetAllocation {
  id: string;
  userId: string;
  month: string;
  salaryAllocated: number;
  essentialLiving: number;
  loanRepayment: number;
  savings: number;
  personalSpending: number;
  unallocatedBalance: number;
  categoryAllocations: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

export interface BillRecord {
  id: string;
  userId: string;
  name: string;
  category: string;
  amountDue: number;
  dueDate: string;
  recurrence: 'monthly' | 'quarterly' | 'annual' | 'one_time';
  linkedAccount?: string;
  paymentStatus: 'upcoming' | 'partial' | 'paid' | 'overdue';
  paidDate?: string;
  reminderLeadTime: number;
  reference?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialGoal {
  id: string;
  userId: string;
  title: string;
  category: 'debt_free' | 'emergency_fund' | 'expense_reduction' | 'savings' | 'financial_discipline';
  measurement: 'principal_zero' | 'savings_target' | 'spending_below_budget' | 'monthly_contribution' | 'reviews_completed';
  targetValue: number;
  currentValue: number;
  targetDate: string;
  startDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'completed' | 'paused';
  progressCalculation: 'actual_records' | 'manual_entry';
  createdAt: string;
  updatedAt: string;
}

export interface NetWorthSnapshot {
  id: string;
  userId: string;
  date: string;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  assetsBreakdown: Record<string, number>;
  liabilitiesBreakdown: Record<string, number>;
  createdAt: string;
}

export interface CashFlowMonthly {
  month: string;
  totalIncome: number;
  totalExpenses: number;
  netFlow: number;
  loanPayments: number;
  savingsTransfers: number;
  breakdown: Record<string, number>;
}

export interface ReportData {
  monthlyIncomeStatement: Record<string, number>;
  monthlyExpenseBreakdown: Record<string, number>;
  budgetVersusActual: Record<string, { budget: number; actual: number; variance: number }>;
  salaryReceiptHistory: IncomeRecord[];
  loanPrincipalInterestHistory: LoanPaymentRecord[];
  loanPayoffForecast: {
    currentMonth: string;
    monthsToZero: number;
    scenarios: {
      monthlyPayment: number;
      monthsToZero: number;
      remainingPrincipal: number;
    }[];
  };
  savingsGrowth: SavingsGoal[];
  netWorthReport: NetWorthSnapshot[];
  cashFlowStatement: CashFlowMonthly[];
  yearToDateSummary: {
    dateRange: string;
    totalIncome: number;
    totalExpenses: number;
    totalSavings: number;
    totalLoanPayments: number;
    netChange: number;
  };
}

// UI State types
export type BudgetType = 'Fixed' | 'Variable' | 'Savings' | 'Debt Repayment';
export type AlertThreshold = '80%' | '100%' | 'custom';
export type ReminderType = 'bill_due' | 'salary_expected' | 'loan_emi' | 'savings_contribution' | 'custom';