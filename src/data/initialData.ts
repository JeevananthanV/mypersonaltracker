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
} from '../types';
import { getLiveDateString } from '../utils/date-utils';

// =====================
// Salary & Loan Data (unchanged)
// =====================
export const INITIAL_SALARY = 34000;

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

export const initialLoanPayments: LoanPayment[] = [];

export const initialTransactions: Transaction[] = [];

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
export const initialDailyFitnessLogs: DailyFitnessLog[] = [
  // Week 1: Days 1-7
  {
    id: 'log-1',
    date: '2026-10-10',
    dayOfWeek: 'sunday',
    workoutRoutineId: 'routine-7', // Rest day
    sessions: [
      {
        exerciseId: 'ex-1',
        sets: 0,
        reps: 0,
        durationMinutes: 5,
        caloriesBurned: 15,
        status: 'completed',
        notes: 'Rest day - focused on recovery',
      }
    ],
    totalDuration: 5,
    totalCalories: 15,
    status: 'completed',
    streak: 1,
    notes: 'Started fitness journey - rest day',
  },
  {
    id: 'log-2',
    date: '2026-10-11',
    dayOfWeek: 'monday',
    workoutRoutineId: 'routine-1', // Monday Full-Body
    sessions: [
      {
        exerciseId: 'ex-1',
        sets: 3,
        reps: 10,
        durationMinutes: 8,
        caloriesBurned: 40,
        status: 'completed',
      },
      {
        exerciseId: 'ex-3',
        sets: 0,
        reps: 0,
        durationMinutes: 15,
        caloriesBurned: 180,
        status: 'completed',
      },
      {
        exerciseId: 'ex-5',
        sets: 3,
        reps: 12,
        durationMinutes: 10,
        caloriesBurned: 80,
        status: 'completed',
      }
    ],
    totalDuration: 33,
    totalCalories: 300,
    status: 'completed',
    streak: 2,
    notes: 'Monday Full-Body session completed',
  },
  {
    id: 'log-3',
    date: '2026-10-12',
    dayOfWeek: 'tuesday',
    workoutRoutineId: 'routine-2', // Tuesday Cardio
    sessions: [
      {
        exerciseId: 'ex-2',
        sets: 0,
        reps: 0,
        durationMinutes: 8,
        caloriesBurned: 80,
        status: 'completed',
      },
      {
        exerciseId: 'ex-4',
        sets: 0,
        reps: 0,
        durationMinutes: 8,
        caloriesBurned: 80,
        status: 'completed',
      }
    ],
    totalDuration: 16,
    totalCalories: 200,
    status: 'completed',
    streak: 3,
    notes: 'Cardio session - jumping jacks + skipping',
  },
  {
    id: 'log-4',
    date: '2026-10-13',
    dayOfWeek: 'wednesday',
    workoutRoutineId: 'routine-3', // Wednesday Strength
    sessions: [
      {
        exerciseId: 'ex-5',
        sets: 3,
        reps: 12,
        durationMinutes: 10,
        caloriesBurned: 80,
        status: 'completed',
      },
      {
        exerciseId: 'ex-6',
        sets: 3,
        reps: 15,
        durationMinutes: 8,
        caloriesBurned: 56,
        status: 'completed',
      },
      {
        exerciseId: 'ex-7',
        sets: 3,
        reps: 12,
        durationMinutes: 8,
        caloriesBurned: 56,
        status: 'completed',
      }
    ],
    totalDuration: 26,
    totalCalories: 192,
    status: 'completed',
    streak: 4,
    notes: 'Wednesday Strength - Pushups, Squats, Lunges',
  },
  {
    id: 'log-5',
    date: '2026-10-14',
    dayOfWeek: 'thursday',
    workoutRoutineId: 'routine-4', // Thursday Mobility
    sessions: [
      {
        exerciseId: 'ex-6',
        sets: 0,
        reps: 0,
        durationMinutes: 8,
        caloriesBurned: 16,
        status: 'completed',
      },
      {
        exerciseId: 'ex-7',
        sets: 0,
        reps: 0,
        durationMinutes: 8,
        caloriesBurned: 16,
        status: 'completed',
      }
    ],
    totalDuration: 16,
    totalCalories: 32,
    status: 'completed',
    streak: 5,
    notes: 'Mobility session - Cat-Cow and Hip Circles',
  },
  {
    id: 'log-6',
    date: '2026-10-15',
    dayOfWeek: 'friday',
    workoutRoutineId: 'routine-5', // Friday Full-Body
    sessions: [
      {
        exerciseId: 'ex-1',
        sets: 3,
        reps: 10,
        durationMinutes: 8,
        caloriesBurned: 40,
        status: 'completed',
      },
      {
        exerciseId: 'ex-5',
        sets: 3,
        reps: 12,
        durationMinutes: 10,
        caloriesBurned: 80,
        status: 'completed',
      },
      {
        exerciseId: 'ex-6',
        sets: 3,
        reps: 15,
        durationMinutes: 8,
        caloriesBurned: 56,
        status: 'completed',
      },
      {
        exerciseId: 'ex-9',
        sets: 0,
        reps: 0,
        durationMinutes: 5,
        caloriesBurned: 10,
        status: 'completed',
      }
    ],
    totalDuration: 33,
    totalCalories: 230,
    status: 'completed',
    streak: 6,
    notes: 'Friday Full-Body - finished the first week strong!',
  },
  {
    id: 'log-7',
    date: '2026-10-16',
    dayOfWeek: 'saturday',
    workoutRoutineId: 'routine-6', // Saturday Active Recovery
    sessions: [
      {
        exerciseId: 'ex-8',
        sets: 0,
        reps: 0,
        durationMinutes: 8,
        caloriesBurned: 16,
        status: 'completed',
      },
      {
        exerciseId: 'ex-9',
        sets: 0,
        reps: 0,
        durationMinutes: 5,
        caloriesBurned: 5,
        status: 'completed',
      }
    ],
    totalDuration: 13,
    totalCalories: 21,
    status: 'completed',
    streak: 6, // Saturday doesn't increase streak count typically, or resets
    notes: 'Active recovery - light mobility and stretching',
  },
  // Week 2: Days 8-14
  {
    id: 'log-8',
    date: '2026-10-17',
    dayOfWeek: 'sunday',
    workoutRoutineId: 'routine-7', // Rest day
    sessions: [
      {
        exerciseId: 'ex-1',
        sets: 0,
        reps: 0,
        durationMinutes: 5,
        caloriesBurned: 15,
        status: 'completed',
        notes: 'Rest day - recovery focus',
      }
    ],
    totalDuration: 5,
    totalCalories: 15,
    status: 'completed',
    streak: 6, // Rest day preserves streak or resets - depends on system
    notes: 'Rest day for recovery',
  },
  {
    id: 'log-9',
    date: '2026-10-18',
    dayOfWeek: 'monday',
    workoutRoutineId: 'routine-1', // Monday Full-Body
    sessions: [
      {
        exerciseId: 'ex-1',
        sets: 3,
        reps: 12,
        durationMinutes: 9,
        caloriesBurned: 45,
        status: 'completed',
      },
      {
        exerciseId: 'ex-3',
        sets: 0,
        reps: 0,
        durationMinutes: 20,
        caloriesBurned: 240,
        status: 'completed',
      },
      {
        exerciseId: 'ex-5',
        sets: 4,
        reps: 10,
        durationMinutes: 12,
        caloriesBurned: 96,
        status: 'completed',
      }
    ],
    totalDuration: 41,
    totalCalories: 421,
    status: 'completed',
    streak: 7, // 7-day streak achieved!
    notes: 'Week 2 Monday - streak reached 7 days!',
  },
  {
    id: 'log-10',
    date: '2026-10-19',
    dayOfWeek: 'tuesday',
    workoutRoutineId: 'routine-2', // Tuesday Cardio
    sessions: [
      {
        exerciseId: 'ex-2',
        sets: 0,
        reps: 0,
        durationMinutes: 10,
        caloriesBurned: 100,
        status: 'completed',
      },
      {
        exerciseId: 'ex-4',
        sets: 0,
        reps: 0,
        durationMinutes: 10,
        caloriesBurned: 100,
        status: 'completed',
      }
    ],
    totalDuration: 20,
    totalCalories: 250,
    status: 'completed',
    streak: 7, // Streak continues (rest day or same day logic)
    notes: 'Cardio session continued',
  },
  {
    id: 'log-10',
    date: '2026-10-20',
    dayOfWeek: 'wednesday',
    workoutRoutineId: 'routine-3', // Wednesday Strength
    sessions: [
      {
        exerciseId: 'ex-5',
        sets: 4,
        reps: 10,
        durationMinutes: 12,
        caloriesBurned: 96,
        status: 'completed',
      },
      {
        exerciseId: 'ex-6',
        sets: 3,
        reps: 15,
        durationMinutes: 10,
        caloriesBurned: 70,
        status: 'completed',
      },
      {
        exerciseId: 'ex-7',
        sets: 3,
        reps: 12,
        durationMinutes: 10,
        caloriesBurned: 70,
        status: 'completed',
      }
    ],
    totalDuration: 32,
    totalCalories: 266,
    status: 'completed',
    streak: 8,
    notes: 'Strength session continued',
  },
  {
    id: 'log-11',
    date: '2026-10-21',
    dayOfWeek: 'thursday',
    workoutRoutineId: 'routine-4', // Thursday Mobility
    sessions: [
      {
        exerciseId: 'ex-8',
        sets: 0,
        reps: 0,
        durationMinutes: 10,
        caloriesBurned: 20,
        status: 'completed',
      },
      {
        exerciseId: 'ex-7',
        sets: 0,
        reps: 0,
        durationMinutes: 8,
        caloriesBurned: 16,
        status: 'completed',
      }
    ],
    totalDuration: 18,
    totalCalories: 36,
    status: 'completed',
    streak: 9,
    notes: 'Mobility session continued',
  },
  {
    id: 'log-12',
    date: '2026-10-22',
    dayOfWeek: 'friday',
    workoutRoutineId: 'routine-5', // Friday Full-Body
    sessions: [
      {
        exerciseId: 'ex-1',
        sets: 3,
        reps: 12,
        durationMinutes: 9,
        caloriesBurned: 45,
        status: 'completed',
      },
      {
        exerciseId: 'ex-5',
        sets: 4,
        reps: 10,
        durationMinutes: 12,
        caloriesBurned: 96,
        status: 'completed',
      },
      {
        exerciseId: 'ex-6',
        sets: 3,
        reps: 15,
        durationMinutes: 10,
        caloriesBurned: 70,
        status: 'completed',
      }
    ],
    totalDuration: 31,
    totalCalories: 284,
    status: 'completed',
    streak: 10,
    notes: 'Week 3 Friday - continuing the streak',
  },
  {
    id: 'log-13',
    date: '2026-10-23',
    dayOfWeek: 'saturday',
    workoutRoutineId: 'routine-6', // Saturday Active Recovery
    sessions: [
      {
        exerciseId: 'ex-8',
        sets: 0,
        reps: 0,
        durationMinutes: 10,
        caloriesBurned: 20,
        status: 'completed',
      }
    ],
    totalDuration: 10,
    totalCalories: 20,
    status: 'completed',
    streak: 10,
    notes: 'Active recovery continued',
  },
  // Week 3: Days 15-21
  {
    id: 'log-14',
    date: '2026-10-24',
    dayOfWeek: 'sunday',
    workoutRoutineId: 'routine-7', // Rest day
    sessions: [
      {
        exerciseId: 'ex-1',
        sets: 0,
        reps: 0,
        durationMinutes: 5,
        caloriesBurned: 15,
        status: 'completed',
        notes: 'Rest day',
      }
    ],
    totalDuration: 5,
    totalCalories: 15,
    status: 'completed',
    streak: 10,
    notes: 'Rest day',
  },
  {
    id: 'log-15',
    date: '2026-10-25',
    dayOfWeek: 'monday',
    workoutRoutineId: 'routine-1', // Monday Full-Body
    sessions: [
      {
        exerciseId: 'ex-1',
        sets: 3,
        reps: 15,
        durationMinutes: 10,
        caloriesBurned: 50,
        status: 'completed',
      },
      {
        exerciseId: 'ex-3',
        sets: 0,
        reps: 0,
        durationMinutes: 25,
        caloriesBurned: 300,
        status: 'completed',
      },
      {
        exerciseId: 'ex-5',
        sets: 5,
        reps: 10,
        durationMinutes: 15,
        caloriesBurned: 120,
        status: 'completed',
      }
    ],
    totalDuration: 50,
    totalCalories: 420,
    status: 'completed',
    streak: 11,
    notes: 'Week 4 Monday - streak continues',
  },
  {
    id: 'log-16',
    date: '2026-10-26',
    dayOfWeek: 'tuesday',
    workoutRoutineId: 'routine-2', // Tuesday Cardio
    sessions: [
      {
        exerciseId: 'ex-2',
        sets: 0,
        reps: 0,
        durationMinutes: 12,
        caloriesBurned: 120,
        status: 'completed',
      },
      {
        exerciseId: 'ex-4',
        sets: 0,
        reps: 0,
        durationMinutes: 12,
        caloriesBurned: 120,
        status: 'completed',
      }
    ],
    totalDuration: 24,
    totalCalories: 300,
    status: 'completed',
    streak: 11,
    notes: 'Cardio session',
  },
  {
    id: 'log-17',
    date: '2026-10-27',
    dayOfWeek: 'wednesday',
    workoutRoutineId: 'routine-3', // Wednesday Strength
    sessions: [
      {
        exerciseId: 'ex-5',
        sets: 5,
        reps: 8,
        durationMinutes: 15,
        caloriesBurned: 120,
        status: 'completed',
      },
      {
        exerciseId: 'ex-6',
        sets: 4,
        reps: 20,
        durationMinutes: 12,
        caloriesBurned: 90,
        status: 'completed',
      },
      {
        exerciseId: 'ex-7',
        sets: 4,
        reps: 10,
        durationMinutes: 12,
        caloriesBurned: 90,
        status: 'completed',
      }
    ],
    totalDuration: 37,
    totalCalories: 370,
    status: 'completed',
    streak: 12,
    notes: 'Strength session',
  },
  {
    id: 'log-18',
    date: '2026-10-28',
    dayOfWeek: 'thursday',
    workoutRoutineId: 'routine-4', // Thursday Mobility
    sessions: [
      {
        exerciseId: 'ex-8',
        sets: 0,
        reps: 0,
        durationMinutes: 12,
        caloriesBurned: 24,
        status: 'completed',
      },
      {
        exerciseId: 'ex-6',
        sets: 0,
        reps: 0,
        durationMinutes: 10,
        caloriesBurned: 20,
        status: 'completed',
      }
    ],
    totalDuration: 22,
    totalCalories: 44,
    status: 'completed',
    streak: 13,
    notes: 'Mobility session',
  },
  {
    id: 'log-19',
    date: '2026-10-29',
    dayOfWeek: 'friday',
    workoutRoutineId: 'routine-5', // Friday Full-Body
    sessions: [
      {
        exerciseId: 'ex-1',
        sets: 3,
        reps: 15,
        durationMinutes: 10,
        caloriesBurned: 50,
        status: 'completed',
      },
      {
        exerciseId: 'ex-5',
        sets: 5,
        reps: 12,
        durationMinutes: 15,
        caloriesBurned: 130,
        status: 'completed',
      },
      {
        exerciseId: 'ex-6',
        sets: 4,
        reps: 15,
        durationMinutes: 12,
        caloriesBurned: 95,
        status: 'completed',
      }
    ],
    totalDuration: 42,
    totalCalories: 435,
    status: 'completed',
    streak: 14, // 14-day streak achieved!
    notes: 'Two weeks completed - 14-day streak milestone!',
  },
  // Week 4: Days 22-28 (continuing)
  {
    id: 'log-20',
    date: '2026-10-30',
    dayOfWeek: 'saturday',
    workoutRoutineId: 'routine-6', // Saturday Active Recovery
    sessions: [
      {
        exerciseId: 'ex-8',
        sets: 0,
        reps: 0,
        durationMinutes: 8,
        caloriesBurned: 16,
        status: 'completed',
      }
    ],
    totalDuration: 8,
    totalCalories: 16,
    status: 'completed',
    streak: 13,
    notes: 'Active recovery',
  },
  {
    id: 'log-21',
    date: '2026-10-31',
    dayOfWeek: 'sunday',
    workoutRoutineId: 'routine-7', // Rest day
    sessions: [
      {
        exerciseId: 'ex-1',
        sets: 0,
        reps: 0,
        durationMinutes: 5,
        caloriesBurned: 15,
        status: 'completed',
        notes: 'Rest day - weekly reset',
      }
    ],
    totalDuration: 5,
    totalCalories: 15,
    status: 'completed',
    streak: 13, // Rest day resets streak or maintains - system dependent
    notes: 'Weekly rest day',
  }
];

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

export const initialIdeas: IdeaNote[] = [
  {
    id: 'id-1',
    title: 'Daily Micro-Habit Rule for AI Learning',
    category: 'Life Note',
    content: 'Never go to bed without writing at least 15 lines of Python or reading 1 ML paper abstract. Consistency beats intensity every single time.',
    tags: ['Mindset', 'AI/ML', 'Habits'],
    pinned: true,
    createdAt: getLiveDateString()
  }
];

export const initialFitnessProfile: FitnessProfile = {
  currentWeight: 57,
  height: 160,
  targetWeight: 60,
  weeklyTargetSessions: 3
};

export const initialFitnessLogs: DailyFitnessLog[] = [];

// =====================
// Default Export
// =====================
export const seededData = {
  initialFitnessProfile,
  initialExercises,
  initialWorkoutRoutines,
  initialDailyFitnessLogs,
};