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
  IdeaNote
} from '../types';

export const INITIAL_SALARY = 34000;

// The 3 Separate Loans: ₹1 Lakh + ₹1 Lakh + ₹40k
export const initialLoanAccounts: LoanAccount[] = [
  {
    id: 'loan-1',
    name: 'Loan 1 (₹1,00,000)',
    originalPrincipal: 100000,
    currentPrincipal: 100000,
    interestPaidTotal: 0,
    principalPaidTotal: 0,
    estimatedEmi: 8000,
    lenderNotes: 'First ₹1 Lakh tranche. When closed, monthly payment decreases by ₹2,000.',
    status: 'active'
  },
  {
    id: 'loan-2',
    name: 'Loan 2 (₹1,00,000)',
    originalPrincipal: 100000,
    currentPrincipal: 100000,
    interestPaidTotal: 0,
    principalPaidTotal: 0,
    estimatedEmi: 8000,
    lenderNotes: 'Second ₹1 Lakh tranche.',
    status: 'active'
  },
  {
    id: 'loan-3',
    name: 'Loan 3 (₹40,000)',
    originalPrincipal: 40000,
    currentPrincipal: 40000,
    interestPaidTotal: 0,
    principalPaidTotal: 0,
    estimatedEmi: 3500,
    lenderNotes: '₹40k separate balance loan.',
    status: 'active'
  }
];

// Clean empty payment history - ready for real user entries
export const initialLoanPayments: LoanPayment[] = [];

// Clean empty transactions - ready for real user entries
export const initialTransactions: Transaction[] = [];

// AI/ML Roadmap Modules (0 practice hours so Jeeva tracks real time)
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
    updatedAt: new Date().toISOString().split('T')[0]
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
    updatedAt: new Date().toISOString().split('T')[0]
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
    updatedAt: new Date().toISOString().split('T')[0]
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
    updatedAt: new Date().toISOString().split('T')[0]
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
    updatedAt: new Date().toISOString().split('T')[0]
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
    updatedAt: new Date().toISOString().split('T')[0]
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
    updatedAt: new Date().toISOString().split('T')[0]
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
    updatedAt: new Date().toISOString().split('T')[0]
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

export const initialFitnessProfile: FitnessProfile = {
  currentWeight: 57,
  height: 160,
  targetWeight: 60,
  weeklyTargetSessions: 3
};

export const initialFitnessLogs: DailyFitnessLog[] = [];

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

export const initialIdeas: IdeaNote[] = [
  {
    id: 'id-1',
    title: 'Daily Micro-Habit Rule for AI Learning',
    category: 'Life Note',
    content: 'Never go to bed without writing at least 15 lines of Python or reading 1 ML paper abstract. Consistency beats intensity every single time.',
    tags: ['Mindset', 'AI/ML', 'Habits'],
    pinned: true,
    createdAt: new Date().toISOString().split('T')[0]
  }
];
