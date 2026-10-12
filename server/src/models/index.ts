import mongoose, { Schema, Document } from 'mongoose';

// 1. Transaction
export interface ITransaction extends Document {
  title: string;
  type: 'salary' | 'expense' | 'loan_payment' | 'savings';
  category: string;
  amount: number;
  date: string;
  month: string;
  notes?: string;
}

const TransactionSchema = new Schema<ITransaction>({
  title: { type: String, required: true },
  type: { type: String, required: true, enum: ['salary', 'expense', 'loan_payment', 'savings'] },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: String, required: true },
  month: { type: String, required: true },
  notes: { type: String, default: '' },
}, { timestamps: true });

export const TransactionModel = mongoose.model<ITransaction>('Transaction', TransactionSchema);

// 2. Loan Account (Separate Loans)
export interface ILoanAccount extends Document {
  name: string;
  originalPrincipal: number;
  currentPrincipal: number;
  interestPaidTotal: number;
  principalPaidTotal: number;
  estimatedEmi?: number;
  lenderNotes?: string;
  status: 'active' | 'closed';
}

const LoanAccountSchema = new Schema<ILoanAccount>({
  name: { type: String, required: true },
  originalPrincipal: { type: Number, required: true },
  currentPrincipal: { type: Number, required: true },
  interestPaidTotal: { type: Number, default: 0 },
  principalPaidTotal: { type: Number, default: 0 },
  estimatedEmi: { type: Number, default: 0 },
  lenderNotes: { type: String, default: '' },
  status: { type: String, default: 'active', enum: ['active', 'closed'] },
}, { timestamps: true });

export const LoanAccountModel = mongoose.model<ILoanAccount>('LoanAccount', LoanAccountSchema);

// 3. Loan Payment
export interface ILoanPayment extends Document {
  loanId: string;
  loanName: string;
  date: string;
  openingBalance: number;
  principalPaid: number;
  interestPaid: number;
  totalPaid: number;
  closingBalance: number;
  notes?: string;
}

const LoanPaymentSchema = new Schema<ILoanPayment>({
  loanId: { type: String, required: true },
  loanName: { type: String, required: true },
  date: { type: String, required: true },
  openingBalance: { type: Number, required: true },
  principalPaid: { type: Number, required: true },
  interestPaid: { type: Number, required: true },
  totalPaid: { type: Number, required: true },
  closingBalance: { type: Number, required: true },
  notes: { type: String, default: '' },
}, { timestamps: true });

export const LoanPaymentModel = mongoose.model<ILoanPayment>('LoanPayment', LoanPaymentSchema);

// 3. AI/ML Skill
export interface ISkill extends Document {
  title: string;
  category: string;
  status: 'not_started' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  practiceHours: number;
  targetHours: number;
  resourceName?: string;
  resourceUrl?: string;
  notes?: string;
}

const SkillSchema = new Schema<ISkill>({
  title: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, default: 'in_progress', enum: ['not_started', 'in_progress', 'completed'] },
  priority: { type: String, default: 'medium', enum: ['high', 'medium', 'low'] },
  practiceHours: { type: Number, default: 0 },
  targetHours: { type: Number, required: true },
  resourceName: { type: String, default: '' },
  resourceUrl: { type: String, default: '' },
  notes: { type: String, default: '' },
}, { timestamps: true });

export const SkillModel = mongoose.model<ISkill>('Skill', SkillSchema);

// 4. Task
export interface ITask extends Document {
  title: string;
  dueDate: string;
  area: 'Work' | 'Learning' | 'Finance' | 'Personal';
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'completed';
  estimatedMinutes: number;
  isTopThree: boolean;
  completedAt?: Date;
}

const TaskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  dueDate: { type: String, required: true },
  area: { type: String, required: true, enum: ['Work', 'Learning', 'Finance', 'Personal'] },
  priority: { type: String, default: 'medium', enum: ['high', 'medium', 'low'] },
  status: { type: String, default: 'todo', enum: ['todo', 'in_progress', 'completed'] },
  estimatedMinutes: { type: Number, default: 30 },
  isTopThree: { type: Boolean, default: false },
  completedAt: { type: Date },
}, { timestamps: true });

export const TaskModel = mongoose.model<ITask>('Task', TaskSchema);

// 5. Habit
export interface IHabit extends Document {
  title: string;
  category: 'career' | 'health' | 'finance' | 'routine';
  streak: number;
  completedToday: boolean;
  history: Record<string, boolean>;
}

const HabitSchema = new Schema<IHabit>({
  title: { type: String, required: true },
  category: { type: String, required: true },
  streak: { type: Number, default: 0 },
  completedToday: { type: Boolean, default: false },
  history: { type: Map, of: Boolean, default: {} },
}, { timestamps: true });

export const HabitModel = mongoose.model<IHabit>('Habit', HabitSchema);

// 6. Daily Fitness Log
export interface IFitnessLog extends Document {
  date: string;
  workoutTitle: string;
  exerciseType: string;
  durationMin: number;
  skipping: boolean;
  walking: boolean;
  stretching: boolean;
  waterLiters: number;
  sleepHours: number;
  weightKg: number;
  energy: 'low' | 'medium' | 'high';
  notes?: string;
}

const FitnessLogSchema = new Schema<IFitnessLog>({
  date: { type: String, required: true },
  workoutTitle: { type: String, required: true },
  exerciseType: { type: String, required: true },
  durationMin: { type: Number, default: 20 },
  skipping: { type: Boolean, default: false },
  walking: { type: Boolean, default: true },
  stretching: { type: Boolean, default: true },
  waterLiters: { type: Number, default: 2.5 },
  sleepHours: { type: Number, default: 7.5 },
  weightKg: { type: Number, default: 57.0 },
  energy: { type: String, default: 'high', enum: ['low', 'medium', 'high'] },
  notes: { type: String, default: '' },
}, { timestamps: true });

export const FitnessLogModel = mongoose.model<IFitnessLog>('FitnessLog', FitnessLogSchema);

// 7. Project
export interface IProject extends Document {
  title: string;
  type: 'Work' | 'Portfolio' | 'Personal';
  status: 'Planning' | 'In Progress' | 'Deployed' | 'On Hold';
  priority: 'high' | 'medium' | 'low';
  startDate: string;
  deadline?: string;
  nextAction: string;
  repoUrl?: string;
  liveUrl?: string;
  techStack: string[];
  progressPercent: number;
  description: string;
}

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  type: { type: String, required: true, enum: ['Work', 'Portfolio', 'Personal'] },
  status: { type: String, default: 'In Progress', enum: ['Planning', 'In Progress', 'Deployed', 'On Hold'] },
  priority: { type: String, default: 'medium', enum: ['high', 'medium', 'low'] },
  startDate: { type: String, required: true },
  deadline: { type: String },
  nextAction: { type: String, required: true },
  repoUrl: { type: String },
  liveUrl: { type: String },
  techStack: [{ type: String }],
  progressPercent: { type: Number, default: 0 },
  description: { type: String, default: '' },
}, { timestamps: true });

export const ProjectModel = mongoose.model<IProject>('Project', ProjectSchema);

// 8. Weekly Review
export interface IWeeklyReview extends Document {
  weekRange: string;
  completedSummary: string;
  skillsLearned: string;
  totalSpent: number;
  totalRepaid: number;
  exerciseSessions: number;
  whatWentWrong: string;
  nextWeekPriorities: string[];
  wins: string[];
  rating: number;
}

const WeeklyReviewSchema = new Schema<IWeeklyReview>({
  weekRange: { type: String, required: true },
  completedSummary: { type: String, required: true },
  skillsLearned: { type: String, required: true },
  totalSpent: { type: Number, default: 0 },
  totalRepaid: { type: Number, default: 0 },
  exerciseSessions: { type: Number, default: 0 },
  whatWentWrong: { type: String, default: '' },
  nextWeekPriorities: [{ type: String }],
  wins: [{ type: String }],
  rating: { type: Number, default: 5 },
}, { timestamps: true });

export const WeeklyReviewModel = mongoose.model<IWeeklyReview>('WeeklyReview', WeeklyReviewSchema);

// 9. Idea / Note
export interface IIdea extends Document {
  title: string;
  category: 'AI Prompt' | 'App Idea' | 'Automation' | 'Life Note';
  content: string;
  tags: string[];
  pinned: boolean;
}

const IdeaSchema = new Schema<IIdea>({
  title: { type: String, required: true },
  category: { type: String, required: true, enum: ['AI Prompt', 'App Idea', 'Automation', 'Life Note'] },
  content: { type: String, required: true },
  tags: [{ type: String }],
  pinned: { type: Boolean, default: false },
}, { timestamps: true });

export const IdeaModel = mongoose.model<IIdea>('Idea', IdeaSchema);

// 10. Profile Settings
export interface IProfile extends Document {
  userName: string;
  salary: number;
  initialLoanPrincipal: number;
  weightKg: number;
  heightCm: number;
  careerFocus: string;
}

const ProfileSchema = new Schema<IProfile>({
  userName: { type: String, default: 'Jeeva' },
  salary: { type: Number, default: 34000 },
  initialLoanPrincipal: { type: Number, default: 250000 },
  weightKg: { type: Number, default: 57 },
  heightCm: { type: Number, default: 160 },
  careerFocus: { type: String, default: 'AI/ML Engineer' },
}, { timestamps: true });

export const ProfileModel = mongoose.model<IProfile>('Profile', ProfileSchema);
