import {
  LoanAccount,
  LoanPayment,
  Transaction,
  SkillModule,
  CareerOverview,
  Task,
  Habit,
  FitnessProfile,
  DailyFitnessLog,
  Project,
  WeeklyReview,
  IdeaNote,
  WorkoutSession,
  Exercise,
  WorkoutRoutine,
  BasicNeedRequirement,
  InvestmentAsset,
  IncomeItem,
} from '../types';
import { getLiveDateString } from '../utils/date-utils';

// =====================
// Salary & Loan Data (unchanged)
// =====================
export const INITIAL_SALARY = 34000;

export const initialIncomeStreams: IncomeItem[] = [
  {
    id: 'inc-salary',
    title: 'Primary Tech Job Fixed Salary',
    category: 'salary',
    sourceOrClient: 'Full-Time Employer (Software & AI)',
    amount: 34000,
    frequency: 'monthly',
    dueDateOrPayday: '1st of every month',
    status: 'received',
    dateReceived: '2026-10-01',
    colorTag: 'emerald',
    notes: 'Guaranteed primary monthly salary inflow. Core engine backing ₹18,000 Loan EMIs and living buffers.'
  },
  {
    id: 'inc-freelance-1',
    title: 'FastAPI Backend & ML Classifier Client Gig',
    category: 'freelancing',
    sourceOrClient: 'Overseas Client / Contract',
    amount: 18500,
    frequency: 'per_project',
    projectMilestone: 'Milestone 2: Docker Container & Endpoint Deployment',
    invoiceNumber: 'INV-2026-08',
    status: 'in_progress',
    dueDateOrPayday: '2026-11-05',
    colorTag: 'cyan',
    notes: 'High-performance API endpoints for e-commerce sentiment classification.'
  },
  {
    id: 'inc-parttime-1',
    title: 'Python & Data Science Mentorship',
    category: 'part_time',
    sourceOrClient: 'CodeLearn Academy / Weekend Cohort',
    amount: 7200,
    frequency: 'hourly',
    hourlyRate: 800,
    hoursWorked: 9,
    status: 'invoiced',
    invoiceNumber: 'INV-PT-1022',
    dueDateOrPayday: '2026-10-28',
    colorTag: 'amber',
    notes: 'Weekend student code reviews & 1-on-1 AI/Python debugging sessions (9 hrs @ ₹800/hr).'
  },
  {
    id: 'inc-freelance-2',
    title: 'React Dashboard & Analytics UI Build',
    category: 'freelancing',
    sourceOrClient: 'SaaS Startup Client',
    amount: 12000,
    frequency: 'per_project',
    projectMilestone: 'Deliverable 1: Interactive Recharts UI Complete',
    invoiceNumber: 'INV-2026-04',
    status: 'received',
    dateReceived: '2026-10-18',
    colorTag: 'indigo',
    notes: 'Modern dark-mode analytics dashboard prototype delivered and client accepted.'
  },
  {
    id: 'inc-dividend',
    title: 'ITC Stock Dividend & Groww Referral Credit',
    category: 'investments_dividend',
    sourceOrClient: 'Groww Demat Account',
    amount: 350,
    frequency: 'one_time',
    status: 'received',
    dateReceived: '2026-10-12',
    colorTag: 'purple',
    notes: 'Interim dividend yield on 5 ITC shares + platform cashback.'
  }
];

export const initialLoanAccounts: LoanAccount[] = [
  {
    id: 'loan-1',
    name: 'Loan 1 — Primary Personal Tranche',
    lender: 'HDFC Bank',
    accountNumber: 'HDFC-PL-2025-8821',
    loanType: 'Personal Loan',
    originalPrincipal: 100000,
    currentPrincipal: 100000,
    interestPaidTotal: 0,
    principalPaidTotal: 0,
    annualInterestRate: 0,
    interestType: 'fixed_amount',
    fixedInterestAmount: 2000,
    estimatedEmi: 8000,
    monthlyEmi: 8000,
    tenureMonths: 14,
    remainingTenureMonths: 13,
    startDate: '2025-10-01',
    targetPayoffDate: '2026-11-30',
    dueDayOfMonth: 5,
    prepaymentAllowed: true,
    prepaymentCharges: 0,
    lenderNotes: 'First ₹1 Lakh tranche. Monthly fixed ₹2,000 interest. Fixed ₹8,000 EMI (₹6,000 Principal + ₹2,000 Interest). ⭐ Key Rule: When this loan is closed, your monthly payment decreases by ₹2,000!',
    priority: 'high',
    colorTag: 'rose',
    status: 'active'
  },
  {
    id: 'loan-2',
    name: 'Loan 2 — Secondary Tranche',
    lender: 'Canara Bank',
    accountNumber: 'CNRB-LN-44091',
    loanType: 'Personal Loan',
    originalPrincipal: 100000,
    currentPrincipal: 100000,
    interestPaidTotal: 0,
    principalPaidTotal: 0,
    annualInterestRate: 0,
    interestType: 'fixed_amount',
    fixedInterestAmount: 2000,
    estimatedEmi: 8000,
    monthlyEmi: 8000,
    tenureMonths: 14,
    remainingTenureMonths: 14,
    startDate: '2025-11-01',
    targetPayoffDate: '2026-12-31',
    dueDayOfMonth: 10,
    prepaymentAllowed: true,
    prepaymentCharges: 0,
    lenderNotes: 'Second ₹1 Lakh tranche. Monthly fixed ₹2,000 interest. Fixed ₹8,000 EMI (₹6,000 Principal + ₹2,000 Interest). Zero penalty on foreclosure.',
    priority: 'medium',
    colorTag: 'indigo',
    status: 'active'
  },
  {
    id: 'loan-3',
    name: 'Loan 3 — Short-Term / Hand Loan',
    lender: 'Private / Hand Loan',
    accountNumber: 'HL-DIRECT-03',
    loanType: 'Hand Loan',
    originalPrincipal: 40000,
    currentPrincipal: 40000,
    interestPaidTotal: 0,
    principalPaidTotal: 0,
    annualInterestRate: 0,
    interestType: 'fixed_amount',
    fixedInterestAmount: 2000,
    estimatedEmi: 3500,
    monthlyEmi: 3500,
    tenureMonths: 12,
    remainingTenureMonths: 11,
    startDate: '2025-12-01',
    targetPayoffDate: '2026-10-31',
    dueDayOfMonth: 1,
    prepaymentAllowed: true,
    prepaymentCharges: 0,
    lenderNotes: '₹40,000 principal. Monthly fixed ₹2,000 interest. Fixed ₹3,500 EMI (₹1,500 Principal + ₹2,000 Interest). No daily interest calculations.',
    priority: 'high',
    colorTag: 'emerald',
    status: 'active'
  }
];

export const initialLoanPayments: LoanPayment[] = [];

export const initialTransactions: Transaction[] = [];

// =====================
// Monthly Basic Needs & Pay Cycle Requirements (Clean starting state)
// =====================
export const initialBasicNeeds: BasicNeedRequirement[] = [];

// =====================
// AI/ML Roadmap Modules
// =====================
export const initialSkills: SkillModule[] = [
  {
    id: 'sk-1',
    title: 'Python for AI & Modern OOP',
    category: 'Core Language',
    status: 'in_progress',
    priority: 'high',
    practiceHours: 0,
    targetHours: 40,
    resourceName: 'Python Official Docs & Typing',
    resourceUrl: 'https://docs.python.org/3/',
    notes: 'Focus on generators, decorators, async, and typing.',
    updatedAt: getLiveDateString()
  },
  {
    id: 'sk-2',
    title: 'NumPy & Pandas Data Manipulation',
    category: 'Data & Stats',
    status: 'in_progress',
    priority: 'high',
    practiceHours: 0,
    targetHours: 35,
    resourceName: 'Pandas Masterclass & Kaggle',
    resourceUrl: 'https://pandas.pydata.org/',
    notes: 'Vectorization, groupby aggregations, handling missing data.',
    updatedAt: getLiveDateString()
  },
  {
    id: 'sk-3',
    title: 'Probability, Linear Algebra & Statistics',
    category: 'Data & Stats',
    status: 'not_started',
    priority: 'high',
    practiceHours: 0,
    targetHours: 35,
    resourceName: '3Blue1Brown & Khan Academy',
    notes: 'Matrix operations, eigenvalues, probability distributions.',
    updatedAt: getLiveDateString()
  },
  {
    id: 'sk-4',
    title: 'Data Visualization (Matplotlib, Seaborn)',
    category: 'Data & Stats',
    status: 'not_started',
    priority: 'medium',
    practiceHours: 0,
    targetHours: 20,
    resourceName: 'Seaborn Documentation',
    notes: 'EDA correlation heatmaps, pairplots, distribution plots.',
    updatedAt: getLiveDateString()
  },
  {
    id: 'sk-5',
    title: 'Classic Machine Learning & Scikit-Learn',
    category: 'Machine Learning',
    status: 'not_started',
    priority: 'high',
    practiceHours: 0,
    targetHours: 40,
    resourceName: 'Hands-On Machine Learning',
    notes: 'Decision trees, Random Forest, XGBoost, cross-validation.',
    updatedAt: getLiveDateString()
  },
  {
    id: 'sk-6',
    title: 'Deep Learning with PyTorch',
    category: 'Deep Learning',
    status: 'not_started',
    priority: 'high',
    practiceHours: 0,
    targetHours: 50,
    resourceName: 'PyTorch Official Tutorials',
    resourceUrl: 'https://pytorch.org/tutorials/',
    notes: 'Tensors, autograd, building CNNs and custom loss functions.',
    updatedAt: getLiveDateString()
  },
  {
    id: 'sk-7',
    title: 'ML Model Deployment & FastAPI',
    category: 'MLOps & Deployment',
    status: 'not_started',
    priority: 'high',
    practiceHours: 0,
    targetHours: 30,
    resourceName: 'FastAPI + Docker Guide',
    notes: 'Building low-latency inference endpoints, Docker containers.',
    updatedAt: getLiveDateString()
  },
  {
    id: 'sk-8',
    title: 'AI/ML Portfolio Capstone Projects',
    category: 'Portfolio',
    status: 'not_started',
    priority: 'high',
    practiceHours: 0,
    targetHours: 45,
    resourceName: 'End-to-End Production ML Repos',
    notes: 'Build and deploy customer feedback sentiment classifier.',
    updatedAt: getLiveDateString()
  }
];

export const initialCareerOverview: CareerOverview = {
  currentModule: 'Machine Learning & PyTorch Deep Dive',
  skillsToImprove: [
    'Model Evaluation Metrics (Precision/Recall Tradeoffs, ROC-AUC)',
    'PyTorch custom Dataset & DataLoader pipelines',
    'Dockerizing FastAPI endpoints for cloud deployment'
  ],
  currentProject: 'Production AI Sentiment & Topic Analyzer',
  githubUrl: 'https://github.com/jeeva-developer',
  portfolioUrl: 'https://jeeva.dev',
  biggestBlocker: 'Balancing client work with deep focused PyTorch practice sessions.',
  nextMilestone: 'Finish FastAPI deployment container and publish live demo.'
};

export const initialTasks: Task[] = [];

export const initialHabits: Habit[] = [
  {
    id: 'h-1',
    title: 'Morning review of top 3 daily priorities',
    category: 'routine',
    streak: 0,
    completedToday: false,
    history: {}
  },
  {
    id: 'h-2',
    title: 'Dedicated 60 mins AI/ML code practice',
    category: 'career',
    streak: 0,
    completedToday: false,
    history: {}
  },
  {
    id: 'h-3',
    title: 'Log daily expenses before sleep',
    category: 'finance',
    streak: 0,
    completedToday: false,
    history: {}
  },
  {
    id: 'h-4',
    title: 'Drink 2.5L water & light movement',
    category: 'health',
    streak: 0,
    completedToday: false,
    history: {}
  },
  {
    id: 'h-5',
    title: 'Sunday weekly review and next week setup',
    category: 'routine',
    streak: 0,
    completedToday: false,
    history: {}
  }
];

// =====================
// FITNESS SEEDED DATA - Daily Workout Tasks
// =====================

// Exercise library - 15+ exercises across categories
export const initialExercises: Exercise[] = [
  // Warm-up
  {
    id: 'ex-1',
    name: 'Dynamic Stretch',
    category: 'warm-up',
    difficulty: 'easy',
    targetMuscles: ['full-body'],
    instructions: 'Perform 10 arm circles, 10 leg swings each side, 10 torso twists',
    durationMinutes: 5,
    calorieBurnPerMinute: 3,
  },
  {
    id: 'ex-2',
    name: 'Jumping Jacks',
    category: 'warm-up',
    difficulty: 'easy',
    targetMuscles: ['full-body'],
    instructions: 'Standard jumping jacks for 2 minutes',
    durationMinutes: 2,
    calorieBurnPerMinute: 8,
  },
  // Cardio
  {
    id: 'ex-3',
    name: 'Running',
    category: 'cardio',
    difficulty: 'medium',
    targetMuscles: ['legs', 'core'],
    instructions: '30 minutes at moderate pace',
    durationMinutes: 30,
    calorieBurnPerMinute: 12,
  },
  {
    id: 'ex-4',
    name: 'Skipping',
    category: 'cardio',
    difficulty: 'medium',
    targetMuscles: ['legs', 'cardio'],
    instructions: '15 minutes continuous skipping',
    durationMinutes: 15,
    calorieBurnPerMinute: 10,
  },
  // Strength
  {
    id: 'ex-5',
    name: 'Push-ups',
    category: 'strength',
    difficulty: 'medium',
    targetMuscles: ['chest', 'triceps', 'shoulders'],
    instructions: '3 sets of 12 reps with 60s rest between sets',
    durationMinutes: 10,
    calorieBurnPerMinute: 8,
  },
  {
    id: 'ex-6',
    name: 'Squats',
    category: 'strength',
    difficulty: 'easy',
    targetMuscles: ['quads', 'glutes', 'hamstrings'],
    instructions: '3 sets of 15 reps with 45s rest between sets',
    durationMinutes: 8,
    calorieBurnPerMinute: 7,
  },
  {
    id: 'ex-7',
    name: 'Lunges',
    category: 'strength',
    difficulty: 'medium',
    targetMuscles: ['quads', 'glutes', 'hamstrings'],
    instructions: '3 sets of 12 reps per leg with 60s rest',
    durationMinutes: 10,
    calorieBurnPerMinute: 7,
  },
  // Mobility
  {
    id: 'ex-6',
    name: 'Cat-Cow stretch',
    category: 'mobility',
    difficulty: 'easy',
    targetMuscles: ['spine', 'back'],
    instructions: '10 rounds of cat-cow flow',
    durationMinutes: 3,
    calorieBurnPerMinute: 2,
  },
  {
    id: 'ex-8',
    name: 'Hip Circles',
    category: 'mobility',
    difficulty: 'easy',
    targetMuscles: ['hips', 'lower back'],
    instructions: '10 circles each direction',
    durationMinutes: 3,
    calorieBurnPerMinute: 2,
  },
  // Cool-down
  {
    id: 'ex-9',
    name: 'Child\'s Pose',
    category: 'cool-down',
    difficulty: 'easy',
    targetMuscles: ['back', 'hips'],
    instructions: 'Hold for 30 seconds, repeat 3 times',
    durationMinutes: 3,
    calorieBurnPerMinute: 1,
  },
  {
    id: 'ex-10',
    name: 'Foam Rolling',
    category: 'cool-down',
    difficulty: 'easy',
    targetMuscles: ['full-body'],
    instructions: 'Roll major muscle groups for 10 minutes',
    durationMinutes: 10,
    calorieBurnPerMinute: 2,
  },
];

// Daily workout routines (7-day plan)
export const initialWorkoutRoutines: WorkoutRoutine[] = [
  {
    id: 'routine-1',
    name: 'Monday Full-Body',
    daysOfWeek: ['monday'],
    exercises: ['ex-1', 'ex-3', 'ex-5', 'ex-8', 'ex-9'],
    description: 'Full body workout starting the week',
    difficulty: 'medium',
    estimatedDuration: 45,
  },
  {
    id: 'routine-2',
    name: 'Tuesday Cardio',
    daysOfWeek: ['tuesday'],
    exercises: ['ex-2', 'ex-4'],
    description: 'Cardio-focused workout',
    difficulty: 'easy',
    estimatedDuration: 20,
  },
  {
    id: 'routine-3',
    name: 'Wednesday Strength',
    daysOfWeek: ['wednesday'],
    exercises: ['ex-5', 'ex-6', 'ex-7'],
    description: 'Strength training mid-week',
    difficulty: 'medium',
    estimatedDuration: 25,
  },
  {
    id: 'routine-4',
    name: 'Thursday Mobility',
    daysOfWeek: ['thursday'],
    exercises: ['ex-6', 'ex-7'],
    description: 'Mobility and flexibility session',
    difficulty: 'easy',
    estimatedDuration: 15,
  },
  {
    id: 'routine-5',
    name: 'Friday Full-Body',
    daysOfWeek: ['friday'],
    exercises: ['ex-1', 'ex-5', 'ex-6', 'ex-9'],
    description: 'Finishing strong with full body',
    difficulty: 'medium',
    estimatedDuration: 40,
  },
  {
    id: 'routine-6',
    name: 'Saturday Active Recovery',
    daysOfWeek: ['saturday'],
    exercises: ['ex-8', 'ex-9'],
    description: 'Light mobility and stretching',
    difficulty: 'easy',
    estimatedDuration: 15,
  },
  {
    id: 'routine-7',
    name: 'Sunday Rest',
    daysOfWeek: ['sunday'],
    exercises: [],
    description: 'Rest day - no structured workout',
    difficulty: 'easy',
    estimatedDuration: 0,
  }
];

// Seeded daily workout logs for 30 days (simulated)
export const initialDailyFitnessLogs: DailyFitnessLog[] = [];

// =====================
// Projects
// =====================
export const initialProjects: Project[] = [
  {
    id: 'prj-1',
    title: 'Ethiroli Portal',
    type: 'Work',
    status: 'In Progress',
    priority: 'high',
    startDate: '2026-07-01',
    deadline: '2026-11-15',
    nextAction: 'Finalize payment reconciliation webhooks and auth security tests',
    repoUrl: 'https://github.com/jeeva-developer/ethiroli-portal',
    liveUrl: 'https://ethiroli.org',
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    progressPercent: 70,
    description: 'Community and administrative portal for Ethiroli.'
  },
  {
    id: 'prj-2',
    title: 'Jai Varahi Peedam Official Website',
    type: 'Personal',
    status: 'Deployed',
    priority: 'medium',
    startDate: '2026-05-10',
    deadline: '2026-08-30',
    nextAction: 'Upload monthly event calendar and optimize banner images for mobile speed',
    repoUrl: 'https://github.com/jeeva-developer/jai-varahi-peedam',
    liveUrl: 'https://jaivarahipeedam.org',
    techStack: ['HTML5', 'CSS3', 'Modern JS', 'Vercel'],
    progressPercent: 95,
    description: 'Devotional portal for Jai Varahi Peedam temple trust.'
  },
  {
    id: 'prj-3',
    title: 'Production AI Sentiment & Topic Analyzer',
    type: 'Portfolio',
    status: 'In Progress',
    priority: 'high',
    startDate: '2026-09-15',
    deadline: '2026-10-30',
    nextAction: 'Wrap PyTorch inference pipeline into FastAPI with Swagger UI and Dockerfile',
    repoUrl: 'https://github.com/jeeva-developer/ai-topic-sentiment-analyzer',
    techStack: ['Python', 'PyTorch', 'FastAPI', 'Docker', 'React'],
    progressPercent: 60,
    description: 'Flagship AI/ML engineer portfolio project.'
  }
];

export const initialWeeklyReviews: WeeklyReview[] = [];

export const initialIdeas: IdeaNote[] = [];

export const initialFitnessProfile: FitnessProfile = {
  currentWeight: 57,
  height: 160,
  targetWeight: 60,
  weeklyTargetSessions: 3
};

export const initialFitnessLogs: DailyFitnessLog[] = [];

export const initialInvestments: InvestmentAsset[] = [
  {
    id: 'pothys-digi-gold',
    name: 'Pothys Swarna Mahal — Digi Gold (22K Plan)',
    category: 'digi_gold',
    platform: 'Pothys Swarna Mahal',
    investedAmount: 500,
    currentValue: 292,
    quantity: 0.03954,
    unitType: 'grams',
    buyPriceAverage: 12645,
    currentPrice: 7380,
    isMonthlySip: false,
    symbolOrCode: '22K-POTHYS-GOLD',
    status: 'active',
    purchaseDate: '2026-10-15',
    colorTag: 'amber',
    notes: 'Pothys Swarna Mahal 22K Gold Saving Plan. 300 days deposit tenure, 330 days maturity lock-in. Tiered instant gold bonus (7% in Days 0-75). Convert to physical 22K jewellery or coins.',
    updatedAt: getLiveDateString(),
    schemeDetails: {
      planName: 'Pothys Swarna Mahal — 22K Gold Saving Plan',
      purity: '22K (916 Hallmarked) Gold',
      startDate: '2026-10-15',
      depositTenureDays: 300,
      lockInDays: 330,
      maturityDate: '2027-09-10',
      recommendedTarget: 11000,
      baseWeightGrams: 0.03696,
      bonusWeightGrams: 0.00258,
      totalWeightGrams: 0.03954,
      currentBonusTierPct: 7,
      activeDayIndex: 11,
      jewellerName: 'Pothys Swarna Mahal'
    },
    transactions: [
      {
        id: 'tx-gold-1',
        date: '2026-10-15',
        amount: 400,
        rate: 13515,
        weightGrams: 0.02960,
        bonusWeightGrams: 0.00207,
        bonusPercentage: 7,
        docNo: 'APP27SCTM/1936226',
        notes: 'Gold Saving Plan - 22K gold in 24 seconds'
      },
      {
        id: 'tx-gold-2',
        date: '2026-10-15',
        amount: 100,
        rate: 13590,
        weightGrams: 0.00736,
        bonusWeightGrams: 0.00052,
        bonusPercentage: 7,
        docNo: 'APP27SCTM Schemes Detail',
        notes: 'Instant 7% Gold Bonus Credited'
      }
    ]
  },
  {
    id: 'pothys-digi-silver',
    name: 'Pothys Swarna Mahal — Digi Silver (999 Pure)',
    category: 'silver_chit',
    platform: 'Pothys Swarna Mahal',
    investedAmount: 1100,
    currentValue: 483,
    quantity: 4.95431,
    unitType: 'grams',
    buyPriceAverage: 222,
    currentPrice: 97.5,
    isMonthlySip: false,
    symbolOrCode: '999-POTHYS-SILVER',
    status: 'active',
    purchaseDate: '2026-10-14',
    colorTag: 'cyan',
    notes: 'Pothys Swarna Mahal 999 Pure Silver Saving Plan. 300 days deposit tenure, 330 days maturity lock-in. Tiered instant silver bonus (7% in Days 0-75). Convert to physical silver antique jewellery, pooja items, or 999 coins.',
    updatedAt: getLiveDateString(),
    schemeDetails: {
      planName: 'Pothys Swarna Mahal — 999 Pure Silver Saving Plan',
      purity: '999 Pure Silver',
      startDate: '2026-10-14',
      depositTenureDays: 300,
      lockInDays: 330,
      maturityDate: '2027-09-09',
      recommendedTarget: 11000,
      baseWeightGrams: 4.65690,
      bonusWeightGrams: 0.29741,
      totalWeightGrams: 4.95431,
      currentBonusTierPct: 7,
      activeDayIndex: 12,
      jewellerName: 'Pothys Swarna Mahal'
    },
    transactions: [
      {
        id: 'tx-silver-1',
        date: '2026-10-21',
        amount: 500,
        rate: 230,
        weightGrams: 2.17391,
        bonusWeightGrams: 0.15217,
        bonusPercentage: 7,
        docNo: 'APP27SCTM/1998979',
        notes: 'App online transfer • 7% Instant Bonus'
      },
      {
        id: 'tx-silver-2',
        date: '2026-10-15',
        amount: 400,
        rate: 240,
        weightGrams: 1.66667,
        bonusWeightGrams: 0.11667,
        bonusPercentage: 7,
        docNo: 'APP27SCTM/1936258',
        notes: 'App online transfer • 7% Instant Bonus'
      },
      {
        id: 'tx-silver-3',
        date: '2026-10-14',
        amount: 100,
        rate: 245,
        weightGrams: 0.40816,
        bonusWeightGrams: 0.00000,
        bonusPercentage: 0,
        docNo: 'APP27SCTM/1920578',
        notes: 'Initial enrolment deposit'
      },
      {
        id: 'tx-silver-4',
        date: '2026-10-14',
        amount: 100,
        rate: 245,
        weightGrams: 0.40816,
        bonusWeightGrams: 0.02857,
        bonusPercentage: 7,
        docNo: 'APP27SCTM',
        promoCode: 'PROMO CODE',
        notes: 'Special Promo Code bonus deposit'
      }
    ]
  },
  {
    id: 'groww-itc',
    name: 'ITC Limited',
    category: 'groww_stocks',
    platform: 'Groww',
    investedAmount: 1450.00,
    currentValue: 1289.50,
    quantity: 5,
    unitType: 'shares',
    buyPriceAverage: 290.00,
    currentPrice: 257.90,
    previousClosePrice: 260.00,
    isMonthlySip: false,
    symbolOrCode: 'ITC',
    unrealizedGain: -160.50,
    unrealizedGainPct: -11.07,
    oneDayReturn: -10.50,
    oneDayReturnPct: -0.81,
    status: 'active',
    purchaseDate: '2026-09-15',
    colorTag: 'emerald',
    notes: 'Groww App Equity Holdings: 5 shares of ITC Limited @ ₹290.00 buy price. Current market price ₹257.90.',
    updatedAt: getLiveDateString()
  },
  {
    id: 'groww-tatagold',
    name: 'Tata Gold ETF',
    category: 'etf',
    platform: 'Groww',
    investedAmount: 527.28,
    currentValue: 531.57,
    quantity: 39,
    unitType: 'shares',
    buyPriceAverage: 13.52,
    currentPrice: 13.63,
    previousClosePrice: 13.67,
    isMonthlySip: false,
    symbolOrCode: 'TATAGOLD',
    unrealizedGain: 4.29,
    unrealizedGainPct: 0.81,
    oneDayReturn: -1.52,
    oneDayReturnPct: -0.29,
    status: 'active',
    purchaseDate: '2026-10-01',
    colorTag: 'amber',
    notes: 'Groww App Gold ETF Holdings: 39 shares of TATAGOLD @ ₹13.52 buy price. Current market price ₹13.63.',
    updatedAt: getLiveDateString()
  },
  {
    id: 'chit-grt-gold-11m',
    name: 'GRT Jewellers — Golden Eleven (11-Month Gold Scheme)',
    category: 'gold_chit',
    platform: 'GRT Jewellers',
    investedAmount: 12000,
    currentValue: 14850,
    quantity: 2.012,
    unitType: 'grams',
    buyPriceAverage: 5964,
    currentPrice: 7380,
    isMonthlySip: true,
    monthlySipAmount: 2000,
    chitMonthlyAmount: 2000,
    chitTenureMonths: 11,
    chitMonthsPaid: 6,
    maturityBonus: 2000,
    symbolOrCode: 'GRT-GE-884219',
    status: 'active',
    purchaseDate: '2026-05-10',
    maturityDate: '2027-04-10',
    colorTag: 'amber',
    notes: 'GRT Golden Eleven 11-Month Jeweller Scheme. Customer pays 11 monthly installments of ₹2,000; GRT pays the 12th month installment as bonus (₹2,000 credit). Guaranteed 0% Wastage / Value Addition charges up to 18% on purchase of 22K hallmarked gold jewellery.',
    updatedAt: getLiveDateString(),
    transactions: [
      {
        id: 'tx-grt-1',
        date: '2026-05-10',
        amount: 2000,
        rate: 6850,
        weightGrams: 0.292,
        bonusWeightGrams: 0,
        bonusPercentage: 0,
        docNo: 'GRT/SLM/2026/0510',
        notes: 'Month #1 Enrollment Installment (UPI)'
      },
      {
        id: 'tx-grt-2',
        date: '2026-06-10',
        amount: 2000,
        rate: 6920,
        weightGrams: 0.289,
        bonusWeightGrams: 0,
        bonusPercentage: 0,
        docNo: 'GRT/SLM/2026/0610',
        notes: 'Month #2 Installment (GPay)'
      },
      {
        id: 'tx-grt-3',
        date: '2026-07-10',
        amount: 2000,
        rate: 7050,
        weightGrams: 0.284,
        bonusWeightGrams: 0,
        bonusPercentage: 0,
        docNo: 'GRT/SLM/2026/0710',
        notes: 'Month #3 Installment (NetBanking)'
      },
      {
        id: 'tx-grt-4',
        date: '2026-08-10',
        amount: 2000,
        rate: 7180,
        weightGrams: 0.278,
        bonusWeightGrams: 0,
        bonusPercentage: 0,
        docNo: 'GRT/SLM/2026/0810',
        notes: 'Month #4 Installment (UPI)'
      },
      {
        id: 'tx-grt-5',
        date: '2026-09-10',
        amount: 2000,
        rate: 7260,
        weightGrams: 0.275,
        bonusWeightGrams: 0,
        bonusPercentage: 0,
        docNo: 'GRT/SLM/2026/0910',
        notes: 'Month #5 Installment (GPay)'
      },
      {
        id: 'tx-grt-6',
        date: '2026-10-10',
        amount: 2000,
        rate: 7380,
        weightGrams: 0.271,
        bonusWeightGrams: 0,
        bonusPercentage: 0,
        docNo: 'GRT/SLM/2026/1010',
        notes: 'Month #6 Installment (UPI) — Next Due Month #7 on 10-Nov-2026'
      }
    ]
  },
  {
    id: 'chit-lalitha-silver-11m',
    name: 'Lalitha Thanga Maligai — 11-Month Silver Jewel Scheme',
    category: 'silver_chit',
    platform: 'Lalitha Thanga Maligai',
    investedAmount: 12000,
    currentValue: 13200,
    quantity: 135.38,
    unitType: 'grams',
    buyPriceAverage: 88.64,
    currentPrice: 97.5,
    isMonthlySip: true,
    monthlySipAmount: 3000,
    chitMonthlyAmount: 3000,
    chitTenureMonths: 11,
    chitMonthsPaid: 4,
    maturityBonus: 3000,
    symbolOrCode: 'LTM-SLV-309114',
    status: 'active',
    purchaseDate: '2026-07-05',
    maturityDate: '2027-06-05',
    colorTag: 'cyan',
    notes: 'Lalitha Thanga Maligai 11-Month Silver Jewel Savings Scheme ("Shett"). ₹3,000/month installment. Full 12th month installment paid by Lalitha as maturity bonus (+₹3,000). 0% Wastage / Making charges on all silver articles, pooja silver idols, and ornaments.',
    updatedAt: getLiveDateString(),
    transactions: [
      {
        id: 'tx-ltm-1',
        date: '2026-07-05',
        amount: 3000,
        rate: 88.5,
        weightGrams: 33.90,
        bonusWeightGrams: 0,
        bonusPercentage: 0,
        docNo: 'LTM/SLM/2026/0705',
        notes: 'Month #1 Enrollment Silver Shett (UPI)'
      },
      {
        id: 'tx-ltm-2',
        date: '2026-08-05',
        amount: 3000,
        rate: 89.2,
        weightGrams: 33.63,
        bonusWeightGrams: 0,
        bonusPercentage: 0,
        docNo: 'LTM/SLM/2026/0805',
        notes: 'Month #2 Installment (GPay)'
      },
      {
        id: 'tx-ltm-3',
        date: '2026-09-05',
        amount: 3000,
        rate: 93.0,
        weightGrams: 32.26,
        bonusWeightGrams: 0,
        bonusPercentage: 0,
        docNo: 'LTM/SLM/2026/0905',
        notes: 'Month #3 Installment (NetBanking)'
      },
      {
        id: 'tx-ltm-4',
        date: '2026-10-05',
        amount: 3000,
        rate: 97.5,
        weightGrams: 30.77,
        bonusWeightGrams: 0,
        bonusPercentage: 0,
        docNo: 'LTM/SLM/2026/1005',
        notes: 'Month #4 Installment (UPI) — Next Due Month #5 on 05-Nov-2026'
      }
    ]
  },
  {
    id: 'chit-saravana-fund-20m',
    name: 'Sri Saravana Chits — 20-Month Family Chit Fund',
    category: 'other',
    platform: 'Sri Saravana Chits (Salem)',
    investedAmount: 35000,
    currentValue: 38500,
    quantity: 7,
    unitType: 'chit_tokens',
    buyPriceAverage: 5000,
    currentPrice: 5500,
    isMonthlySip: true,
    monthlySipAmount: 5000,
    chitMonthlyAmount: 5000,
    chitTenureMonths: 20,
    chitMonthsPaid: 7,
    maturityBonus: 3500,
    symbolOrCode: 'SSC-CHIT-1L-20M',
    status: 'active',
    purchaseDate: '2026-04-15',
    maturityDate: '2027-11-15',
    colorTag: 'emerald',
    notes: 'Registered Tamil Nadu 20-Month Chit Fund (₹1,00,000 chit pool with 20 members @ ₹5,000/mo). Auction dividend is deducted from monthly calls; payout target in Month 18-20 for lump sum debt clearance.',
    updatedAt: getLiveDateString(),
    transactions: [
      {
        id: 'tx-ssc-1',
        date: '2026-04-15',
        amount: 5000,
        rate: 5000,
        weightGrams: 1,
        bonusWeightGrams: 0,
        bonusPercentage: 0,
        docNo: 'SSC-SLM-M01',
        notes: 'Month #1 Chit Call (Cash Deposit)'
      },
      {
        id: 'tx-ssc-2',
        date: '2026-05-15',
        amount: 5000,
        rate: 5000,
        weightGrams: 1,
        bonusWeightGrams: 0,
        bonusPercentage: 0,
        docNo: 'SSC-SLM-M02',
        notes: 'Month #2 Chit Call (UPI)'
      },
      {
        id: 'tx-ssc-3',
        date: '2026-06-15',
        amount: 5000,
        rate: 5000,
        weightGrams: 1,
        bonusWeightGrams: 0,
        bonusPercentage: 0,
        docNo: 'SSC-SLM-M03',
        notes: 'Month #3 Chit Call (UPI)'
      },
      {
        id: 'tx-ssc-4',
        date: '2026-07-15',
        amount: 5000,
        rate: 5000,
        weightGrams: 1,
        bonusWeightGrams: 0,
        bonusPercentage: 0,
        docNo: 'SSC-SLM-M04',
        notes: 'Month #4 Chit Call (GPay)'
      },
      {
        id: 'tx-ssc-5',
        date: '2026-08-15',
        amount: 5000,
        rate: 5000,
        weightGrams: 1,
        bonusWeightGrams: 0,
        bonusPercentage: 0,
        docNo: 'SSC-SLM-M05',
        notes: 'Month #5 Chit Call (NetBanking)'
      },
      {
        id: 'tx-ssc-6',
        date: '2026-09-15',
        amount: 5000,
        rate: 5000,
        weightGrams: 1,
        bonusWeightGrams: 0,
        bonusPercentage: 0,
        docNo: 'SSC-SLM-M06',
        notes: 'Month #6 Chit Call (UPI)'
      },
      {
        id: 'tx-ssc-7',
        date: '2026-10-15',
        amount: 5000,
        rate: 5000,
        weightGrams: 1,
        bonusWeightGrams: 0,
        bonusPercentage: 0,
        docNo: 'SSC-SLM-M07',
        notes: 'Month #7 Chit Call (UPI) — Next Due Month #8 on 15-Nov-2026'
      }
    ]
  },
  {
    id: 'chit-offline-monthly-1000',
    name: 'Offline Monthly Chit (₹1,000 / 14-Oct)',
    category: 'offline_chit',
    platform: 'Offline Physical Chit / Local Committee (Salem)',
    investedAmount: 1000,
    currentValue: 1000,
    quantity: 1,
    unitType: 'chit_tokens',
    buyPriceAverage: 1000,
    currentPrice: 1000,
    isMonthlySip: true,
    monthlySipAmount: 1000,
    chitMonthlyAmount: 1000,
    chitTenureMonths: 12,
    chitMonthsPaid: 1,
    dueDayOfMonth: 14,
    maturityBonus: 1000,
    symbolOrCode: 'OFFLINE-CHIT-1000',
    status: 'active',
    purchaseDate: '2026-10-14',
    maturityDate: '2027-10-14',
    colorTag: 'purple',
    notes: 'Offline physical savings chit fund started on 14-Oct-2026. Monthly installment ₹1,000 due on the 14th of every month. Month #1 paid on 14-Oct-2026; Next Due: Month #2 on 14-Nov-2026.',
    updatedAt: getLiveDateString(),
    transactions: [
      {
        id: 'tx-offline-1',
        date: '2026-10-14',
        amount: 1000,
        rate: 1000,
        weightGrams: 1,
        bonusWeightGrams: 0,
        bonusPercentage: 0,
        docNo: 'OFFLINE-RCPT-M01',
        notes: 'Month #1 Enrollment Installment paid in cash (Physical passbook entry on 14-Oct-2026)'
      }
    ]
  }
];

// =====================
// Default Export
// =====================
export const seededData = {
  initialFitnessProfile,
  initialExercises,
  initialWorkoutRoutines,
  initialDailyFitnessLogs,
  initialBasicNeeds,
  initialInvestments,
};