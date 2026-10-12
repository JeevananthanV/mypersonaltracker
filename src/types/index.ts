// Fitness & Wellness Models
export type ExerciseType = 
  | 'Walking + Mobility' 
  | 'Light Skipping' 
  | 'Full Body Movement' 
  | 'Bodyweight' 
  | 'Stretching'
  | 'Cardio'
  | 'Strength'
  | 'Mobility'
  | 'Recovery'
  | 'Rest Day';

export type ExerciseDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type ExerciseCategory = 
  | 'warm-up' 
  | 'cardio' 
  | 'strength' 
  | 'mobility' 
  | 'cool-down';

export type IntensityLevel = 'light' | 'moderate' | 'vigorous';

export interface ExerciseInstruction {
  step: number;
  text: string;
}

export interface ExerciseTargetMuscle {
  name: string;
  focus: string;
}

export interface ExerciseDetail {
  id: string;
  name: string;
  category: ExerciseCategory;
  instructions: ExerciseInstruction[];
  targetMuscles: ExerciseTargetMuscle[];
  difficulty: ExerciseDifficulty;
  equipment: string[];
  defaultDuration: number; // in minutes
  defaultSets: number;
  defaultReps?: number; // if applicable
  restInterval: number; // in seconds
  easierVariation?: string;
  progression?: string;
  formReminders: string[];
  safetyNotes: string[];
}

export interface ExerciseLibraryItem {
  id: string;
  name: string;
  category: ExerciseCategory;
  instructions: ExerciseInstruction[];
  targetMuscles: ExerciseTargetMuscle[];
  difficulty: ExerciseDifficulty;
  equipment: string[];
  defaultDuration: number;
  defaultSets: number;
  defaultReps?: number;
  restInterval: number;
  easierVariation?: string;
  progression?: string;
  formReminders: string[];
  safetyNotes: string[];
  isFavorite: boolean;
}

export interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps?: number;
  duration?: number; // in minutes if not sets/reps
  targetSets: number;
  targetReps?: number;
  targetDuration?: number; // in minutes
  actualSets?: number;
  actualReps?: number;
  actualDuration?: number;
  status: 'planned' | 'in_progress' | 'completed' | 'skipped';
  modification?: string;
  comfortLevel?: 'too_easy' | 'comfortable' | 'too_difficult';
  notes?: string;
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
  active: boolean;
  restDays: string[]; // days that are rest
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutPlanItem {
  id: string;
  planId: string;
  weekday: number; // 0-6 (Sun-Sat) or date string
  exerciseId: string;
  targetSets: number;
  targetReps?: number;
  targetDuration?: number;
  order: number;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  planId?: string; // if derived from a plan
  date: string; // ISO date
  startTime?: string;
  endTime?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
  plannedDuration: number; // in minutes
  actualDuration: number; // in minutes
  exercises: WorkoutExercise[];
  notes?: string;
  rescheduledFrom?: string; // original plan date if rescheduled
  isRescheduled: boolean;
}

export interface DailyFitnessLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  workoutTitle: string;
  exerciseType: ExerciseType;
  durationMin: number;
  actualDurationMin?: number;
  plannedDurationMin?: number;
  walking: boolean;
  skipping: boolean;
  stretching: boolean;
  waterLiters: number;
  sleepHours: number;
  weightKg?: number;
  energy: 'low' | 'medium' | 'high';
  mood?: 'low' | 'medium' | 'high';
  symptoms?: string;
  notes?: string;
  exerciseLogs?: ExerciseLog[];
}

export interface ExerciseLog {
  id: string;
  sessionId: string;
  exerciseId: string;
  exerciseName: string;
  status: 'planned' | 'in_progress' | 'completed' | 'skipped';
  startTime?: string;
  endTime?: string;
  actualDuration?: number;
  actualSets?: number;
  actualReps?: number;
  actualDistance?: number;
  actualIntervals?: number;
  intensity?: IntensityLevel;
  modification?: string;
  comfortLevel?: 'too_easy' | 'comfortable' | 'too_difficult';
  notes?: string;
}

export interface FitnessProfile {
  userId: string;
  currentWeight: number; // kg
  height: number; // cm
  targetWeight: number; // kg
  weeklyTargetSessions: number;
  targetWeeklyMinutes: number; // moderate aerobic minutes
  targetStrengthDays: number;
  targetMobilityDays: number;
  units: 'metric' | 'imperial';
}

export interface FitnessGoal {
  id: string;
  userId: string;
  title: string;
  category: 'exercise_sessions' | 'walking_minutes' | 'strength_sessions' | 'mobility_consistency' | 'sleep_routine' | 'hydration_consistency' | 'body_measurement' | 'personal_milestone';
  unit: 'sessions' | 'minutes' | 'days' | 'kg' | 'count' | 'custom';
  currentValue: number;
  targetValue: number;
  targetDate: string; // ISO date
  updateFrequency: 'daily' | 'weekly' | 'per_workout';
  active: boolean;
  completed: boolean;
  paused: boolean;
}

export interface FitnessReminder {
  id: string;
  userId: string;
  type: 'workout_start' | 'sleep_log' | 'measurements' | 'movement_break' | 'weekly_review' | 'custom';
  title: string;
  schedule: string; // HH:MM
  timezone: string;
  enabled: boolean;
  snoozeCount: number;
  lastTriggered?: string;
}

export interface BodyMeasurement {
  id: string;
  userId: string;
  date: string;
  type: 'weight' | 'waist' | 'hips' | 'chest' | 'biceps' | 'thigh' | 'body_fat';
  value: number;
  unit: 'kg' | 'cm' | 'inches';
}

export interface WeeklyReport {
  weekStart: string; // ISO date Monday or Sunday
  plannedWorkouts: number;
  completedWorkouts: number;
  partiallyCompleted: number;
  skippedWorkouts: number;
  notLogged: number;
  exerciseCompletion: number; // percentage
  plannedMovementMinutes: number;
  actualMovementMinutes: number;
  moderateAerobicMinutes: number;
  strengthDays: number;
  sleepAverage: number;
  wins: string[];
  blockers: string[];
  nextWeekChanges: string;
}

export interface DashboardSummary {
  today: {
    date: string;
    workout: {
      title: string;
      status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
      plannedDuration: number;
      actualDuration: number;
      completion: number; // percentage
    };
    exerciseCompletion: number; // percentage
    steps: number;
    sleep: {
      duration: number;
      quality?: 'poor' | 'fair' | 'good' | 'excellent';
    };
    hydration: {
      consumed: number;
      goal: number;
      percentage: number;
    };
    energy: 'low' | 'medium' | 'high';
    mood?: 'low' | 'medium' | 'high';
  };
  weekly: {
    activeDays: number;
    totalPlannedMinutes: number;
    totalActualMinutes: number;
    consistency: number; // percentage of planned days completed
  };
}

// API Response Types
export interface ExerciseLibraryResponse {
  exercises: ExerciseLibraryItem[];
  total: number;
  categories: ExerciseCategory[];
}

export interface WorkoutPlansResponse {
  plans: WorkoutPlan[];
  total: number;
}

export interface WorkoutSessionsResponse {
  sessions: WorkoutSession[];
  total: number;
}

export interface DailyLogsResponse {
  logs: DailyFitnessLog[];
  total: number;
}

export interface FitnessGoalsResponse {
  goals: FitnessGoal[];
  total: number;
}

export interface FitnessRemindersResponse {
  reminders: FitnessReminder[];
  total: number;
}

export interface BodyMeasurementsResponse {
  measurements: BodyMeasurement[];
  total: number;
}

export interface WeeklyReportResponse {
  report: WeeklyReport;
}

// Chart Data Types
export interface ChartDailyData {
  date: string;
  plannedMinutes: number;
  actualMinutes: number;
  completedExercises: number;
  plannedExercises: number;
}

export interface ChartWeeklyData {
  weekStart: string;
  days: ChartDailyData[];
  totalPlanned: number;
  totalActual: number;
}

export interface ExerciseCompletionData {
  completed: number;
  planned: number;
  percentage: number;
  byCategory: Record<ExerciseCategory, {
    completed: number;
    planned: number;
    percentage: number;
  }>;
}

export interface StrengthProgressionData {
  exerciseId: string;
  exerciseName: string;
  records: {
    date: string;
    sets: number;
    reps: number;
    weight?: number;
  }[];
}

// Notification/Reminder Types
export interface ReminderSettings {
  workoutStart: boolean;
  sleepLog: boolean;
  movementBreak: boolean;
  weeklyReview: boolean;
  measurements: boolean;
  custom: Array<{
    type: string;
    title: string;
    time: string;
    enabled: boolean;
  }>;
}