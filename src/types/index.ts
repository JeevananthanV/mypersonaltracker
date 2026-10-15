// Navigation Tabs
export type NavTab = 
  | 'dashboard' 
  | 'finance' 
  | 'career' 
  | 'tasks' 
  | 'fitness' 
  | 'projects' 
  | 'review' 
  | 'ideas';

// 3 Separate Loan Accounts
export interface LoanAccount {
  id: string;
  name: string; // e.g., 'Loan 1 (₹1,00,000)', 'Loan 2 (₹1,00,000)', 'Loan 3 (₹40,000)'
  originalPrincipal: number; // 100000, 100000, 40000
  currentPrincipal: number;
  interestPaidTotal: number;
  principalPaidTotal: number;
  estimatedEmi?: number;
  lenderNotes?: string;
  status: 'active' | 'closed';
}

export interface LoanPayment {
  id: string;
  loanId?: string;
  loanName?: string;
  date: string;
  openingBalance: number;
  principalPaid: number;
  interestPaid: number;
  totalPaid: number;
  closingBalance: number;
  notes?: string;
  totalCashPaid?: number;
}

// Transactions & Expenses
export type TransactionType = 'expense' | 'salary' | 'loan_payment';

export type ExpenseCategory = 
  | 'Food & Groceries'
  | 'Rent & Utilities'
  | 'Learning & Courses'
  | 'Transit & Fuel'
  | 'Health & Wellness'
  | 'Personal & Leisure'
  | 'Family & Commitments'
  | 'Loan Principal'
  | 'Loan Interest'
  | 'Salary'
  | 'Other';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: ExpenseCategory;
  date: string;
  month: string; // YYYY-MM
  loanId?: string;
  notes?: string;
}

// AI/ML Career Center
export type SkillStatus = 'not_started' | 'in_progress' | 'completed';

export interface SkillModule {
  id: string;
  title: string;
  category: string;
  status: SkillStatus;
  priority: 'low' | 'medium' | 'high';
  practiceHours: number;
  targetHours: number;
  resourceName?: string;
  resourceUrl?: string;
  notes?: string;
  updatedAt: string;
}

export interface CareerOverview {
  currentModule: string;
  skillsToImprove: string[];
  currentProject: string;
  githubUrl: string;
  portfolioUrl: string;
  biggestBlocker: string;
  nextMilestone: string;
}

// Tasks & Habits Models
export type TaskArea = 'Work' | 'Learning' | 'Finance' | 'Personal';
export type PriorityLevel = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  area: TaskArea;
  priority: PriorityLevel;
  status: TaskStatus;
  estimatedMinutes: number;
  isTopThree: boolean;
  completedAt?: string;
}

export interface Habit {
  id: string;
  title: string;
  category: 'career' | 'health' | 'finance' | 'routine';
  streak: number;
  completedToday: boolean;
  history: Record<string, boolean>; // date string -> boolean
}

// Fitness & Wellness Models
export type ExerciseType = 
  | 'Walking + Mobility' 
  | 'Light Skipping' 
  | 'Full Body Movement' 
  | 'Bodyweight' 
  | 'Rest Day' 
  | 'Stretching';

export type EnergyLevel = 'low' | 'medium' | 'high';

export interface FitnessProfile {
  currentWeight: number; // kg (57)
  height: number; // cm (160)
  targetWeight: number; // kg (60)
  weeklyTargetSessions: number; // 3
}

export interface DailyFitnessLog {
  id: string;
  date: string;
  dayOfWeek?: string;
  workoutTitle?: string;
  exerciseType?: ExerciseType;
  durationMin?: number;
  skipping?: boolean;
  walking?: boolean;
  stretching?: boolean;
  waterLiters?: number;
  sleepHours?: number;
  weightKg?: number;
  energy?: EnergyLevel;
  notes?: string;
  workoutRoutineId?: string;
  sessions?: any[];
  exercises?: any[];
  totalDuration?: number;
  totalCalories?: number;
  status?: string;
  streak?: number;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  targetMuscles: string[];
  instructions: string;
  durationMinutes?: number;
  calorieBurnPerMinute?: number;
  sets?: number;
  reps?: number;
  restSeconds?: number;
}

export interface WorkoutRoutine {
  id: string;
  name: string;
  category?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  daysOfWeek?: string[];
  exercises: any[];
  durationMinutes?: number;
  estimatedDuration?: number;
  totalCalories?: number;
  description?: string;
}

export interface WorkoutSession {
  id: string;
  routineId?: string;
  date: string;
  exercises: any[];
  totalDuration?: number;
  totalCalories?: number;
  status?: string;
  notes?: string;
}

// Software Projects
export type ProjectType = 'Work' | 'AI/ML' | 'Personal' | 'Portfolio';
export type ProjectStatus = 'Planning' | 'In Progress' | 'Completed' | 'On Hold' | 'Deployed';

export interface Project {
  id: string;
  title: string;
  type: ProjectType;
  status: ProjectStatus;
  priority: PriorityLevel;
  startDate: string;
  deadline: string;
  description: string;
  technologies?: string[];
  techStack?: string[];
  progressPercent: number;
  nextAction?: string;
  liveUrl?: string;
  repoUrl?: string;
}

// Weekly Review
export interface WeeklyReview {
  id: string;
  weekEndingDate?: string;
  weekRange?: string;
  wins?: string[];
  completedSummary?: string;
  blockers?: string[];
  skillsLearned?: string[] | string;
  aiHoursLogged?: number;
  totalExpensesLogged?: number;
  workoutsLogged?: number;
  totalSpent?: number;
  totalRepaid?: number;
  exerciseSessions?: number;
  whatWentWrong?: string;
  rating?: number;
  nextWeekPriorities?: string[];
  notes?: string;
  createdAt: string;
}

// Ideas & Notes
export interface IdeaNote {
  id: string;
  title: string;
  category: 'AI Prompt' | 'App Idea' | 'Automation' | 'Life Note';
  content: string;
  tags: string[];
  isPinned?: boolean;
  pinned?: boolean;
  createdAt: string;
}

// FINANCIAL TRACKER MODELS (from spec)
export type Currency = 'INR';

export type IncomeType = 'salary' | 'bonus' | 'freelance' | 'other' | 'transfer';

export type ExpenseSubCategory = 
  | 'rent' 
  | 'maintenance' 
  | 'groceries' 
  | 'dining' 
  | 'fuel' 
  | 'public_transit' 
  | 'own_vehicle' 
  | 'electricity' 
  | 'internet' 
  | 'mobile' 
  | 'medical' 
  | 'pharmacy' 
  | 'clothing' 
  | 'personal_care' 
  | 'courses' 
  | 'books' 
  | 'software' 
  | 'streaming' 
  | 'subscriptions' 
  | 'household' 
  | 'electronics' 
  | 'other';

export interface IncomeRecord {
  id: string;
  userId: string;
  source: string; // Employer or income source
  type: IncomeType;
  expectedAmount: number;
  actualAmount?: number;
  expectedDate: string; // YYYY-MM-DD
  actualDate?: string;
  accountCredited?: string;
  referenceNumber?: string;
  status: 'expected' | 'partially_received' | 'received' | 'overdue';
  difference: number; // expected - actual
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseRecord {
  id: string;
  userId: string;
  description: string;
  amount: number;
  type: 'expense' | 'loan_payment' | 'transfer';
  category: ExpenseCategory;
  subCategory?: ExpenseSubCategory;
  account: string; // Bank account, cash, UPI
  paymentMethod: 'UPI' | 'NEFT' | 'cash' | 'card' | 'bank_transfer' | 'other';
  date: string; // YYYY-MM-DD
  month: string; // YYYY-MM
  recurring: boolean;
  receipt?: string; // Reference to stored receipt
  notes?: string;
  isRefundAgainst?: string; // If refund, original transaction ID
  createdAt: string;
  updatedAt: string;
}

export interface LoanAccountDetail {
  id: string;
  name: string; // e.g., 'Loan 1 (₹1 Lakh)', 'Loan 2 (₹1 Lakh)', 'Loan 3 (₹40,000)'
  originalPrincipal: number; // 100000, 100000, 40000
  currentPrincipal: number;
  interestPaidTotal: number;
  principalPaidTotal: number;
  estimatedEmi?: number;
  lenderNotes?: string;
  status: 'active' | 'closed';
  interestType: 'fixed' | 'floating' | 'fixed_amount';
  interestRate?: number; // Annual rate if fixed, or monthly amount
  interestMethod: 'reducing_balance' | 'flat_rate' | 'fixed_amount_arrangement';
  paymentDueDate: string; // Next payment deadline
  regularPayment: number; // Scheduled instalment
  extraPrincipal?: number; // Additional amount paid toward principal
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
    targetMonth: string; // YYYY-MM
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
  targetDate: string; // YYYY-MM-DD
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
  month: string; // YYYY-MM
  salaryAllocated: number;
  essentialLiving: number;
  loanRepayment: number;
  savings: number;
  personalSpending: number;
  unallocatedBalance: number;
  categoryAllocations: Record<ExpenseCategory, number>;
  createdAt: string;
  updatedAt: string;
}

export interface BillRecord {
  id: string;
  userId: string;
  name: string; // e.g., 'Electricity Bill', 'EMI Payment'
  category: ExpenseCategory;
  amountDue: number;
  dueDate: string; // YYYY-MM-DD
  recurrence: 'monthly' | 'quarterly' | 'annual' | 'one_time';
  linkedAccount?: string;
  paymentStatus: 'upcoming' | 'partial' | 'paid' | 'overdue';
  paidDate?: string;
  reminderLeadTime: number; // days before due date
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
  targetDate: string; // YYYY-MM-DD
  startDate: string; // YYYY-MM-DD
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
  breakdown: Record<string, number>; // by category
}

export interface ReportData {
  monthlyIncomeStatement: Record<string, number>;
  monthlyExpenseBreakdown: Record<ExpenseCategory, number>;
  budgetVersusActual: Record<ExpenseCategory, { budget: number; actual: number; variance: number }>;
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

// Badge & Achievement types (existing)
export type BadgeCategory = 'workout' | 'consistency' | 'milestone' | 'special' | 'hydration_consistency' | 'sleep_routine' | 'challenge';
export type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  icon: string;
  requirement: string;
  requirementValue: number | string;
  earnedAt: string;
  isSecret: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  icon: string;
  target: string;
  currentProgress: number;
  maxProgress: number;
  earned: boolean;
  earnedAt?: string;
}