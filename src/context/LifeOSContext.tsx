import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  fetchDashboardFromBackend,
  saveTransactionToBackend,
  deleteTransactionFromBackend,
  saveLoanPaymentToBackend,
  saveTaskToBackend,
  saveFitnessLogToBackend
} from '../services/api';
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
  NavTab
} from '../types';
import {
  INITIAL_SALARY,
  initialLoanAccounts,
  initialLoanPayments,
  initialTransactions,
  initialSkills,
  initialCareerOverview,
  initialTasks,
  initialHabits,
  initialFitnessProfile,
  initialFitnessLogs,
  initialProjects,
  initialWeeklyReviews,
  initialIdeas
} from '../data/initialData';

interface LifeOSContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  salary: number;
  setSalary: (salary: number) => void;

  // Separate Loans
  loanAccounts: LoanAccount[];
  addLoanAccount: (account: Omit<LoanAccount, 'id' | 'currentPrincipal' | 'interestPaidTotal' | 'principalPaidTotal' | 'status'>) => void;
  updateLoanAccount: (id: string, updates: Partial<LoanAccount>) => void;
  deleteLoanAccount: (id: string) => void;
  totalOriginalPrincipal: number;
  outstandingPrincipal: number;
  totalPrincipalPaid: number;
  totalInterestPaid: number;
  firstLakhReductionAchieved: boolean;
  firstLakhProgress: number; // 0 to 100

  // Loan Payments
  loanPayments: LoanPayment[];
  addLoanPayment: (payment: Omit<LoanPayment, 'id' | 'totalPaid' | 'closingBalance'>) => void;
  deleteLoanPayment: (id: string) => void;

  // Transactions
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'month'>) => void;
  deleteTransaction: (id: string) => void;

  // Career
  skills: SkillModule[];
  careerOverview: CareerOverview;
  updateSkill: (id: string, updates: Partial<SkillModule>) => void;
  addSkill: (skill: Omit<SkillModule, 'id' | 'updatedAt'>) => void;
  deleteSkill: (id: string) => void;
  logPracticeHours: (skillId: string, hours: number) => void;
  updateCareerOverview: (updates: Partial<CareerOverview>) => void;

  // Tasks & Habits
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  toggleTopThree: (id: string) => void;
  habits: Habit[];
  toggleHabitToday: (id: string) => void;

  // Fitness
  fitnessProfile: FitnessProfile;
  updateFitnessProfile: (profile: Partial<FitnessProfile>) => void;
  fitnessLogs: DailyFitnessLog[];
  addFitnessLog: (log: Omit<DailyFitnessLog, 'id'>) => void;
  deleteFitnessLog: (id: string) => void;
  bmi: number;
  weeklyWorkoutsCount: number;

  // Projects
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Reviews
  weeklyReviews: WeeklyReview[];
  addWeeklyReview: (review: Omit<WeeklyReview, 'id' | 'createdAt'>) => void;
  deleteWeeklyReview: (id: string) => void;

  // Ideas & Notes
  ideas: IdeaNote[];
  addIdea: (idea: Omit<IdeaNote, 'id' | 'createdAt'>) => void;
  updateIdea: (id: string, updates: Partial<IdeaNote>) => void;
  deleteIdea: (id: string) => void;
  togglePinIdea: (id: string) => void;

  // Utilities
  triggerConfetti: () => void;
  exportDataToJson: () => void;
  importDataFromJson: (jsonStr: string) => boolean;
  resetToCleanRealState: () => void;
}

// Version 2 storage key to ensure no legacy mock data is loaded
const STORAGE_KEY = 'jeeva_life_os_real_v2';

const LifeOSContext = createContext<LifeOSContextType | undefined>(undefined);

export const LifeOSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [salary, setSalary] = useState<number>(INITIAL_SALARY);

  // Load state from local storage
  const loadState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse localStorage', e);
    }
    return null;
  };

  const savedData = loadState();

  const [loanAccounts, setLoanAccounts] = useState<LoanAccount[]>(savedData?.loanAccounts || initialLoanAccounts);
  const [loanPayments, setLoanPayments] = useState<LoanPayment[]>(savedData?.loanPayments || initialLoanPayments);
  const [transactions, setTransactions] = useState<Transaction[]>(savedData?.transactions || initialTransactions);
  const [skills, setSkills] = useState<SkillModule[]>(savedData?.skills || initialSkills);
  const [careerOverview, setCareerOverview] = useState<CareerOverview>(savedData?.careerOverview || initialCareerOverview);
  const [tasks, setTasks] = useState<Task[]>(savedData?.tasks || initialTasks);
  const [habits, setHabits] = useState<Habit[]>(savedData?.habits || initialHabits);
  const [fitnessProfile, setFitnessProfile] = useState<FitnessProfile>(savedData?.fitnessProfile || initialFitnessProfile);
  const [fitnessLogs, setFitnessLogs] = useState<DailyFitnessLog[]>(savedData?.fitnessLogs || initialFitnessLogs);
  const [projects, setProjects] = useState<Project[]>(savedData?.projects || initialProjects);
  const [weeklyReviews, setWeeklyReviews] = useState<WeeklyReview[]>(savedData?.weeklyReviews || initialWeeklyReviews);
  const [ideas, setIdeas] = useState<IdeaNote[]>(savedData?.ideas || initialIdeas);

  // Sync to localStorage
  useEffect(() => {
    const dataToSave = {
      salary,
      loanAccounts,
      loanPayments,
      transactions,
      skills,
      careerOverview,
      tasks,
      habits,
      fitnessProfile,
      fitnessLogs,
      projects,
      weeklyReviews,
      ideas
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (err) {
      console.error('Could not save to localStorage', err);
    }
  }, [salary, loanAccounts, loanPayments, transactions, skills, careerOverview, tasks, habits, fitnessProfile, fitnessLogs, projects, weeklyReviews, ideas]);

  // Initial load from MongoDB Atlas backend if reachable
  useEffect(() => {
    fetchDashboardFromBackend().then((data) => {
      if (data) {
        if (data.loanAccounts?.length) setLoanAccounts(data.loanAccounts);
        if (data.transactions) setTransactions(data.transactions);
        if (data.loanPayments) setLoanPayments(data.loanPayments);
        if (data.skills?.length) setSkills(data.skills);
        if (data.tasks) setTasks(data.tasks);
        if (data.projects?.length) setProjects(data.projects);
        if (data.fitnessLogs) setFitnessLogs(data.fitnessLogs);
        if (data.ideas?.length) setIdeas(data.ideas);
        if (data.weeklyReviews) setWeeklyReviews(data.weeklyReviews);
        if (data.profile?.salary) setSalary(data.profile.salary);
      }
    }).catch(() => {});
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.warn('Confetti error', e);
    }
  };

  // Computations for Separate Loans
  const totalOriginalPrincipal = loanAccounts.reduce((acc, l) => acc + (l.originalPrincipal || 0), 0);
  const outstandingPrincipal = loanAccounts.reduce((acc, l) => acc + (l.currentPrincipal || 0), 0);
  const totalPrincipalPaid = loanPayments.reduce((acc, p) => acc + (p.principalPaid || 0), 0);
  const totalInterestPaid = loanPayments.reduce((acc, p) => acc + (p.interestPaid || 0), 0);

  // ₹1 Lakh Milestone (Loan 1 cleared triggers ₹2,000 EMI discount)
  const loan1 = loanAccounts.find(l => l.id === 'loan-1');
  const loan1Paid = loan1 ? (loan1.originalPrincipal - loan1.currentPrincipal) : 0;
  const firstLakhReductionAchieved = loan1Paid >= 100000 || totalPrincipalPaid >= 100000;
  const firstLakhProgress = Math.min(100, Math.round(((loan1Paid || totalPrincipalPaid) / 100000) * 100));

  // BMI
  const heightM = fitnessProfile.height / 100;
  const bmi = heightM > 0 ? Number((fitnessProfile.currentWeight / (heightM * heightM)).toFixed(1)) : 22.3;

  // Workouts this week
  const weeklyWorkoutsCount = fitnessLogs.filter(l => l.exerciseType !== 'Rest Day').length;

  // Separate Loan Account Operations
  const addLoanAccount = (account: Omit<LoanAccount, 'id' | 'currentPrincipal' | 'interestPaidTotal' | 'principalPaidTotal' | 'status'>) => {
    const newAccount: LoanAccount = {
      ...account,
      id: 'loan-' + Date.now(),
      currentPrincipal: account.originalPrincipal,
      interestPaidTotal: 0,
      principalPaidTotal: 0,
      status: 'active'
    };
    setLoanAccounts(prev => [...prev, newAccount]);
  };

  const updateLoanAccount = (id: string, updates: Partial<LoanAccount>) => {
    setLoanAccounts(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const deleteLoanAccount = (id: string) => {
    setLoanAccounts(prev => prev.filter(l => l.id !== id));
  };

  // Loan Payment Operations (Separate per loan)
  const addLoanPayment = (payment: Omit<LoanPayment, 'id' | 'totalPaid' | 'closingBalance'>) => {
    const totalPaid = payment.principalPaid + payment.interestPaid;
    const closingBalance = Math.max(0, payment.openingBalance - payment.principalPaid);
    
    const newPayment: LoanPayment = {
      ...payment,
      id: 'lp-' + Date.now(),
      totalPaid,
      closingBalance
    };

    setLoanPayments(prev => [newPayment, ...prev]);

    // Update the specific loan account balance
    setLoanAccounts(prev => prev.map(acc => {
      if (acc.id === payment.loanId || acc.name === payment.loanName) {
        const nextCurrent = Math.max(0, acc.currentPrincipal - payment.principalPaid);
        return {
          ...acc,
          currentPrincipal: nextCurrent,
          principalPaidTotal: acc.principalPaidTotal + payment.principalPaid,
          interestPaidTotal: acc.interestPaidTotal + payment.interestPaid,
          status: nextCurrent === 0 ? 'closed' : 'active'
        };
      }
      return acc;
    }));

    // Auto log to transactions
    addTransaction({
      date: payment.date,
      title: `EMI Payment: ${payment.loanName}`,
      type: 'loan_payment',
      category: 'Loan Principal',
      amount: payment.principalPaid,
      notes: payment.notes || `Principal repayment for ${payment.loanName}`,
      loanId: payment.loanId
    });

    if (payment.interestPaid > 0) {
      addTransaction({
        date: payment.date,
        title: `Interest: ${payment.loanName}`,
        type: 'loan_payment',
        category: 'Loan Interest',
        amount: payment.interestPaid,
        notes: `Interest fee on ${payment.loanName}`,
        loanId: payment.loanId
      });
    }

    // Persist to MongoDB Atlas backend
    saveLoanPaymentToBackend(newPayment).catch(() => {});
    triggerConfetti();
  };

  const deleteLoanPayment = (id: string) => {
    setLoanPayments(prev => prev.filter(p => p.id !== id));
  };

  // Transaction operations
  const addTransaction = (tx: Omit<Transaction, 'id' | 'month'>) => {
    const month = tx.date.substring(0, 7);
    const newTx: Transaction = {
      ...tx,
      id: 'tx-' + Date.now(),
      month
    };
    setTransactions(prev => [newTx, ...prev]);
    saveTransactionToBackend(newTx).catch(() => {});
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    deleteTransactionFromBackend(id).catch(() => {});
  };

  // Skills
  const updateSkill = (id: string, updates: Partial<SkillModule>) => {
    setSkills(prev => prev.map(s => s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : s));
  };

  const addSkill = (skill: Omit<SkillModule, 'id' | 'updatedAt'>) => {
    const newSkill: SkillModule = {
      ...skill,
      id: 'sk-' + Date.now(),
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setSkills(prev => [...prev, newSkill]);
  };

  const deleteSkill = (id: string) => {
    setSkills(prev => prev.filter(s => s.id !== id));
  };

  const logPracticeHours = (skillId: string, hours: number) => {
    setSkills(prev => prev.map(s => {
      if (s.id === skillId) {
        const newHours = s.practiceHours + hours;
        const newStatus = newHours >= s.targetHours ? 'completed' : 'in_progress';
        return {
          ...s,
          practiceHours: newHours,
          status: newStatus,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return s;
    }));
    triggerConfetti();
  };

  const updateCareerOverview = (updates: Partial<CareerOverview>) => {
    setCareerOverview(prev => ({ ...prev, ...updates }));
  };

  // Tasks
  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: 't-' + Date.now()
    };
    setTasks(prev => [newTask, ...prev]);
    saveTaskToBackend(newTask).catch(() => {});
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'completed' ? 'todo' : 'completed';
        if (nextStatus === 'completed') triggerConfetti();
        return {
          ...t,
          status: nextStatus,
          completedAt: nextStatus === 'completed' ? new Date().toISOString() : undefined
        };
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTopThree = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isTopThree: !t.isTopThree } : t));
  };

  // Habits
  const toggleHabitToday = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const nextCompleted = !h.completedToday;
        const nextStreak = nextCompleted ? h.streak + 1 : Math.max(0, h.streak - 1);
        if (nextCompleted) triggerConfetti();
        return {
          ...h,
          completedToday: nextCompleted,
          streak: nextStreak,
          history: { ...h.history, [today]: nextCompleted }
        };
      }
      return h;
    }));
  };

  // Fitness
  const updateFitnessProfile = (profile: Partial<FitnessProfile>) => {
    setFitnessProfile(prev => ({ ...prev, ...profile }));
  };

  const addFitnessLog = (log: Omit<DailyFitnessLog, 'id'>) => {
    const newLog: DailyFitnessLog = {
      ...log,
      id: 'fit-' + Date.now()
    };
    setFitnessLogs(prev => [newLog, ...prev]);
    if (log.weightKg) {
      setFitnessProfile(prev => ({ ...prev, currentWeight: log.weightKg }));
    }
    saveFitnessLogToBackend(newLog).catch(() => {});
    triggerConfetti();
  };

  const deleteFitnessLog = (id: string) => {
    setFitnessLogs(prev => prev.filter(f => f.id !== id));
  };

  // Projects
  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...project,
      id: 'prj-' + Date.now()
    };
    setProjects(prev => [newProject, ...prev]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  // Weekly reviews
  const addWeeklyReview = (review: Omit<WeeklyReview, 'id' | 'createdAt'>) => {
    const newReview: WeeklyReview = {
      ...review,
      id: 'wr-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setWeeklyReviews(prev => [newReview, ...prev]);
    triggerConfetti();
  };

  const deleteWeeklyReview = (id: string) => {
    setWeeklyReviews(prev => prev.filter(r => r.id !== id));
  };

  // Ideas
  const addIdea = (idea: Omit<IdeaNote, 'id' | 'createdAt'>) => {
    const newIdea: IdeaNote = {
      ...idea,
      id: 'id-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setIdeas(prev => [newIdea, ...prev]);
  };

  const updateIdea = (id: string, updates: Partial<IdeaNote>) => {
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  };

  const deleteIdea = (id: string) => {
    setIdeas(prev => prev.filter(i => i.id !== id));
  };

  const togglePinIdea = (id: string) => {
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, pinned: !i.pinned } : i));
  };

  // Data import / export
  const exportDataToJson = () => {
    const data = {
      salary,
      loanAccounts,
      loanPayments,
      transactions,
      skills,
      careerOverview,
      tasks,
      habits,
      fitnessProfile,
      fitnessLogs,
      projects,
      weeklyReviews,
      ideas,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jeeva_life_os_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDataFromJson = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.loanAccounts) setLoanAccounts(data.loanAccounts);
      if (data.transactions) setTransactions(data.transactions);
      if (data.loanPayments) setLoanPayments(data.loanPayments);
      if (data.skills) setSkills(data.skills);
      if (data.careerOverview) setCareerOverview(data.careerOverview);
      if (data.tasks) setTasks(data.tasks);
      if (data.habits) setHabits(data.habits);
      if (data.fitnessProfile) setFitnessProfile(data.fitnessProfile);
      if (data.fitnessLogs) setFitnessLogs(data.fitnessLogs);
      if (data.projects) setProjects(data.projects);
      if (data.weeklyReviews) setWeeklyReviews(data.weeklyReviews);
      if (data.ideas) setIdeas(data.ideas);
      if (data.salary) setSalary(data.salary);
      return true;
    } catch (e) {
      console.error('Import error', e);
      return false;
    }
  };

  const resetToCleanRealState = () => {
    if (window.confirm('Reset all to clean real-time state with the 3 separate loans (₹1L + ₹1L + ₹40k) and empty transactions?')) {
      setSalary(INITIAL_SALARY);
      setLoanAccounts(initialLoanAccounts);
      setLoanPayments([]);
      setTransactions([]);
      setSkills(initialSkills);
      setCareerOverview(initialCareerOverview);
      setTasks([]);
      setHabits(initialHabits);
      setFitnessProfile(initialFitnessProfile);
      setFitnessLogs([]);
      setProjects(initialProjects);
      setWeeklyReviews([]);
      setIdeas(initialIdeas);
      localStorage.removeItem(STORAGE_KEY);
      triggerConfetti();
    }
  };

  return (
    <LifeOSContext.Provider
      value={{
        activeTab,
        setActiveTab,
        salary,
        setSalary,
        loanAccounts,
        addLoanAccount,
        updateLoanAccount,
        deleteLoanAccount,
        totalOriginalPrincipal,
        outstandingPrincipal,
        totalPrincipalPaid,
        totalInterestPaid,
        firstLakhReductionAchieved,
        firstLakhProgress,
        loanPayments,
        addLoanPayment,
        deleteLoanPayment,
        transactions,
        addTransaction,
        deleteTransaction,
        skills,
        careerOverview,
        updateSkill,
        addSkill,
        deleteSkill,
        logPracticeHours,
        updateCareerOverview,
        tasks,
        addTask,
        updateTask,
        toggleTask,
        deleteTask,
        toggleTopThree,
        habits,
        toggleHabitToday,
        fitnessProfile,
        updateFitnessProfile,
        fitnessLogs,
        addFitnessLog,
        deleteFitnessLog,
        bmi,
        weeklyWorkoutsCount,
        projects,
        addProject,
        updateProject,
        deleteProject,
        weeklyReviews,
        addWeeklyReview,
        deleteWeeklyReview,
        ideas,
        addIdea,
        updateIdea,
        deleteIdea,
        togglePinIdea,
        triggerConfetti,
        exportDataToJson,
        importDataFromJson,
        resetToCleanRealState
      }}
    >
      {children}
    </LifeOSContext.Provider>
  );
};

export const useLifeOS = () => {
  const context = useContext(LifeOSContext);
  if (!context) {
    throw new Error('useLifeOS must be used within a LifeOSProvider');
  }
  return context;
};
