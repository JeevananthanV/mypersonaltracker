import React, { useState, useMemo } from 'react';
import {
  Award,
  Sparkles,
  Flame,
  Brain,
  CheckCircle2,
  Lock,
  Zap,
  TrendingUp,
  Target,
  Trophy,
  Star,
  Compass,
  ArrowRight,
  ShieldAlert,
  Cpu,
  BookOpen
} from 'lucide-react';
import { useLifeOS } from '../../context/LifeOSContext';

export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  requirementText: string;
  category: 'ai_ml' | 'habits' | 'mastery';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  icon: React.ElementType;
  isUnlocked: boolean;
  currentValue: number;
  targetValue: number;
  unit: string;
  unlockedDate?: string;
  motivationQuote: string;
}

const TIER_COLORS = {
  bronze: {
    border: 'border-amber-700/60',
    borderUnlocked: 'border-amber-600',
    bg: 'bg-amber-950/20',
    bgUnlocked: 'bg-gradient-to-br from-amber-950/40 via-amber-900/20 to-slate-900',
    glow: 'shadow-[0_0_20px_rgba(217,119,6,0.15)]',
    text: 'text-amber-400',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    ring: 'ring-amber-500/40',
    label: 'Bronze'
  },
  silver: {
    border: 'border-slate-600/60',
    borderUnlocked: 'border-slate-400',
    bg: 'bg-slate-800/30',
    bgUnlocked: 'bg-gradient-to-br from-slate-800/50 via-slate-700/20 to-slate-900',
    glow: 'shadow-[0_0_20px_rgba(203,213,225,0.15)]',
    text: 'text-slate-200',
    badge: 'bg-slate-400/20 text-slate-200 border-slate-400/30',
    ring: 'ring-slate-400/40',
    label: 'Silver'
  },
  gold: {
    border: 'border-yellow-600/60',
    borderUnlocked: 'border-yellow-400',
    bg: 'bg-yellow-950/20',
    bgUnlocked: 'bg-gradient-to-br from-yellow-950/40 via-amber-800/20 to-slate-900',
    glow: 'shadow-[0_0_25px_rgba(234,179,8,0.2)]',
    text: 'text-yellow-400',
    badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    ring: 'ring-yellow-400/50',
    label: 'Gold'
  },
  platinum: {
    border: 'border-cyan-600/60',
    borderUnlocked: 'border-cyan-400',
    bg: 'bg-cyan-950/20',
    bgUnlocked: 'bg-gradient-to-br from-cyan-950/40 via-blue-900/20 to-slate-900',
    glow: 'shadow-[0_0_30px_rgba(6,182,212,0.25)]',
    text: 'text-cyan-300',
    badge: 'bg-cyan-500/20 text-cyan-200 border-cyan-500/30',
    ring: 'ring-cyan-400/50',
    label: 'Platinum'
  },
  diamond: {
    border: 'border-indigo-600/60',
    borderUnlocked: 'border-indigo-400',
    bg: 'bg-indigo-950/20',
    bgUnlocked: 'bg-gradient-to-br from-purple-950/40 via-indigo-900/30 to-slate-900',
    glow: 'shadow-[0_0_35px_rgba(99,102,241,0.3)]',
    text: 'text-indigo-300',
    badge: 'bg-indigo-500/20 text-indigo-200 border-indigo-500/30',
    ring: 'ring-indigo-400/60',
    label: 'Diamond'
  }
};

export const AchievementBadges: React.FC = () => {
  const { skills, habits, navigateToTab, triggerConfetti } = useLifeOS();
  const [filter, setFilter] = useState<'all' | 'ai_ml' | 'habits' | 'unlocked'>('all');
  const [selectedBadge, setSelectedBadge] = useState<BadgeDefinition | null>(null);

  // Derived Metrics from real system state
  const completedSkillsCount = useMemo(() => {
    return skills.filter(s => s.status === 'completed').length;
  }, [skills]);

  const inProgressSkillsCount = useMemo(() => {
    return skills.filter(s => s.status === 'in_progress').length;
  }, [skills]);

  const totalPracticeHours = useMemo(() => {
    return skills.reduce((acc, s) => acc + (s.practiceHours || 0), 0);
  }, [skills]);

  const maxHabitStreak = useMemo(() => {
    if (!habits || habits.length === 0) return 0;
    return Math.max(...habits.map(h => h.streak || 0), 0);
  }, [habits]);

  const habitsCompletedToday = useMemo(() => {
    return habits.filter(h => h.completedToday).length;
  }, [habits]);

  const activeHabitsCount = useMemo(() => {
    return habits.filter(h => (h.streak || 0) > 0 || h.completedToday).length;
  }, [habits]);

  // Comprehensive Badges Catalogue
  const allBadges: BadgeDefinition[] = useMemo(() => {
    const totalSkills = skills.length || 6;

    return [
      // Track 1: AI/ML Course Modules & Knowledge
      {
        id: 'ai-initiate',
        title: 'AI Initiate',
        description: 'Complete your first official AI/ML curriculum module.',
        requirementText: 'Complete 1 AI/ML course module',
        category: 'ai_ml',
        tier: 'bronze',
        icon: Brain,
        isUnlocked: completedSkillsCount >= 1,
        currentValue: Math.min(completedSkillsCount, 1),
        targetValue: 1,
        unit: 'module',
        unlockedDate: completedSkillsCount >= 1 ? 'Milestone Active' : undefined,
        motivationQuote: 'The journey of a thousand AI models begins with a single foundational module.'
      },
      {
        id: 'code-grinder-10h',
        title: 'Code Apprentice',
        description: 'Log 10 hours of focused AI/ML practice and code implementation.',
        requirementText: 'Log 10 practice hours across AI modules',
        category: 'ai_ml',
        tier: 'bronze',
        icon: Cpu,
        isUnlocked: totalPracticeHours >= 10,
        currentValue: Math.min(totalPracticeHours, 10),
        targetValue: 10,
        unit: 'hrs',
        unlockedDate: totalPracticeHours >= 10 ? 'Milestone Active' : undefined,
        motivationQuote: 'Real engineering intuition is forged in continuous hands-on problem solving.'
      },
      {
        id: 'neural-apprentice',
        title: 'Neural Apprentice',
        description: 'Demonstrate sustained technical progression by mastering 2 course modules.',
        requirementText: 'Complete 2 AI/ML modules',
        category: 'ai_ml',
        tier: 'silver',
        icon: BookOpen,
        isUnlocked: completedSkillsCount >= 2,
        currentValue: Math.min(completedSkillsCount, 2),
        targetValue: 2,
        unit: 'modules',
        unlockedDate: completedSkillsCount >= 2 ? 'Milestone Active' : undefined,
        motivationQuote: 'Bridging theory with algorithmic execution creates true deep comprehension.'
      },
      {
        id: 'data-alchemist',
        title: 'Data Alchemist',
        description: 'Master 3 AI/ML curriculum modules and foundational mathematics.',
        requirementText: 'Complete 3 AI/ML modules',
        category: 'ai_ml',
        tier: 'silver',
        icon: Target,
        isUnlocked: completedSkillsCount >= 3,
        currentValue: Math.min(completedSkillsCount, 3),
        targetValue: 3,
        unit: 'modules',
        unlockedDate: completedSkillsCount >= 3 ? 'Milestone Active' : undefined,
        motivationQuote: 'Transform raw data into predictive intelligence with mathematical rigor.'
      },
      {
        id: 'lab-veteran-25h',
        title: 'Lab Veteran',
        description: 'Accumulate 25+ verified practice hours implementing models and pipelines.',
        requirementText: 'Log 25 practice hours',
        category: 'ai_ml',
        tier: 'gold',
        icon: Zap,
        isUnlocked: totalPracticeHours >= 25,
        currentValue: Math.min(totalPracticeHours, 25),
        targetValue: 25,
        unit: 'hrs',
        unlockedDate: totalPracticeHours >= 25 ? 'Milestone Active' : undefined,
        motivationQuote: 'Deep expertise is compound interest on focused hours.'
      },
      {
        id: 'deep-learner',
        title: 'Deep Learner',
        description: 'Complete 4 comprehensive AI/ML modules spanning architectures & transformers.',
        requirementText: 'Complete 4 AI/ML modules',
        category: 'ai_ml',
        tier: 'gold',
        icon: Sparkles,
        isUnlocked: completedSkillsCount >= 4,
        currentValue: Math.min(completedSkillsCount, 4),
        targetValue: 4,
        unit: 'modules',
        unlockedDate: completedSkillsCount >= 4 ? 'Milestone Active' : undefined,
        motivationQuote: 'Neural weights adapt, loss converges — you are mastering high-level machine learning.'
      },
      {
        id: 'llm-architect',
        title: 'LLM Architect',
        description: 'Complete 5 AI/ML modules and deploy scalable intelligent agent solutions.',
        requirementText: 'Complete 5 AI/ML modules',
        category: 'ai_ml',
        tier: 'platinum',
        icon: Compass,
        isUnlocked: completedSkillsCount >= 5,
        currentValue: Math.min(completedSkillsCount, 5),
        targetValue: 5,
        unit: 'modules',
        unlockedDate: completedSkillsCount >= 5 ? 'Milestone Active' : undefined,
        motivationQuote: 'Architecting modern AI systems requires cross-disciplinary mastery.'
      },
      {
        id: 'grandmaster-ai',
        title: 'AI Grandmaster',
        description: 'Complete the entire AI/ML curriculum with 40+ hours of practice.',
        requirementText: `Complete all ${totalSkills} modules & 40+ hrs`,
        category: 'ai_ml',
        tier: 'diamond',
        icon: Trophy,
        isUnlocked: completedSkillsCount >= totalSkills && totalPracticeHours >= 40,
        currentValue: Math.min(completedSkillsCount, totalSkills),
        targetValue: totalSkills,
        unit: 'modules',
        unlockedDate: completedSkillsCount >= totalSkills && totalPracticeHours >= 40 ? 'Mastery Achieved' : undefined,
        motivationQuote: 'Apex knowledge standard: Ready for senior AI engineering and frontier research.'
      },

      // Track 2: Habit Consistency & Daily Discipline
      {
        id: 'daily-spark',
        title: 'Daily Spark',
        description: 'Complete at least one core habit check-in today.',
        requirementText: 'Complete 1 habit today',
        category: 'habits',
        tier: 'bronze',
        icon: Flame,
        isUnlocked: habitsCompletedToday >= 1,
        currentValue: Math.min(habitsCompletedToday, 1),
        targetValue: 1,
        unit: 'habit',
        unlockedDate: habitsCompletedToday >= 1 ? 'Unlocked Today' : undefined,
        motivationQuote: 'Small daily actions build unstoppable long-term identity.'
      },
      {
        id: 'habit-starter',
        title: 'Habit Starter',
        description: 'Maintain a 3-day continuous streak on any core life habit.',
        requirementText: 'Achieve a 3-day streak on any habit',
        category: 'habits',
        tier: 'bronze',
        icon: TrendingUp,
        isUnlocked: maxHabitStreak >= 3,
        currentValue: Math.min(maxHabitStreak, 3),
        targetValue: 3,
        unit: 'days',
        unlockedDate: maxHabitStreak >= 3 ? 'Milestone Active' : undefined,
        motivationQuote: 'The first three days shatter inertia. Momentum begins here.'
      },
      {
        id: 'seven-day-warrior',
        title: '7-Day Warrior',
        description: 'Execute a full consecutive 7-day habit streak with zero skipped days.',
        requirementText: 'Achieve a 7-day streak',
        category: 'habits',
        tier: 'silver',
        icon: Award,
        isUnlocked: maxHabitStreak >= 7,
        currentValue: Math.min(maxHabitStreak, 7),
        targetValue: 7,
        unit: 'days',
        unlockedDate: maxHabitStreak >= 7 ? 'Milestone Active' : undefined,
        motivationQuote: 'One unbroken week. You have successfully broken the resistance barrier.'
      },
      {
        id: 'habit-multitasker',
        title: 'Habit Engine',
        description: 'Keep 3 or more life habits concurrently active and progressing.',
        requirementText: 'Maintain 3 active habits',
        category: 'habits',
        tier: 'silver',
        icon: Zap,
        isUnlocked: activeHabitsCount >= 3,
        currentValue: Math.min(activeHabitsCount, 3),
        targetValue: 3,
        unit: 'habits',
        unlockedDate: activeHabitsCount >= 3 ? 'Milestone Active' : undefined,
        motivationQuote: 'Holistic discipline: Routine, health, and career moving in unified rhythm.'
      },
      {
        id: 'fortnight-focus',
        title: 'Fortnight Focus',
        description: 'Maintain a 14-day consecutive habit streak without falling off.',
        requirementText: 'Achieve a 14-day streak',
        category: 'habits',
        tier: 'gold',
        icon: Star,
        isUnlocked: maxHabitStreak >= 14,
        currentValue: Math.min(maxHabitStreak, 14),
        targetValue: 14,
        unit: 'days',
        unlockedDate: maxHabitStreak >= 14 ? 'Milestone Active' : undefined,
        motivationQuote: 'At 14 days, the habit shifts from conscious effort to automatic reflex.'
      },
      {
        id: 'iron-will-21',
        title: 'Iron Will',
        description: 'Reach a 21-day continuous streak — the scientific neuroplasticity threshold.',
        requirementText: 'Achieve a 21-day streak',
        category: 'habits',
        tier: 'platinum',
        icon: Flame,
        isUnlocked: maxHabitStreak >= 21,
        currentValue: Math.min(maxHabitStreak, 21),
        targetValue: 21,
        unit: 'days',
        unlockedDate: maxHabitStreak >= 21 ? 'Milestone Active' : undefined,
        motivationQuote: 'Neuroplasticity solidified. Your daily routine is now part of who you are.'
      },
      {
        id: 'discipline-titan-30',
        title: 'Discipline Titan',
        description: 'Command a relentless 30-day streak of unwavering daily execution.',
        requirementText: 'Achieve a 30-day streak',
        category: 'habits',
        tier: 'diamond',
        icon: Trophy,
        isUnlocked: maxHabitStreak >= 30,
        currentValue: Math.min(maxHabitStreak, 30),
        targetValue: 30,
        unit: 'days',
        unlockedDate: maxHabitStreak >= 30 ? 'Milestone Active' : undefined,
        motivationQuote: 'A whole month of relentless execution. You have outpaced 99% of people.'
      },

      // Track 3: Synergistic Apex Mastery
      {
        id: 'dual-synergy',
        title: 'Dual Synergy',
        description: 'Complete at least 1 AI module AND sustain a 7-day habit streak.',
        requirementText: '1 AI module + 7-day habit streak',
        category: 'mastery',
        tier: 'silver',
        icon: Target,
        isUnlocked: completedSkillsCount >= 1 && maxHabitStreak >= 7,
        currentValue: (completedSkillsCount >= 1 ? 1 : 0) + (maxHabitStreak >= 7 ? 1 : 0),
        targetValue: 2,
        unit: 'criteria',
        unlockedDate: (completedSkillsCount >= 1 && maxHabitStreak >= 7) ? 'Milestone Active' : undefined,
        motivationQuote: 'Synchronizing mental growth and daily discipline creates exponential life leverage.'
      },
      {
        id: 'apex-operator',
        title: 'Apex Operator',
        description: 'Master 3 AI modules AND sustain a 14-day habit streak concurrently.',
        requirementText: '3 AI modules + 14-day habit streak',
        category: 'mastery',
        tier: 'diamond',
        icon: Trophy,
        isUnlocked: completedSkillsCount >= 3 && maxHabitStreak >= 14,
        currentValue: (completedSkillsCount >= 3 ? 1 : 0) + (maxHabitStreak >= 14 ? 1 : 0),
        targetValue: 2,
        unit: 'criteria',
        unlockedDate: (completedSkillsCount >= 3 && maxHabitStreak >= 14) ? 'Legendary Active' : undefined,
        motivationQuote: 'The highest standard of Jeeva\'s Life OS: Technical excellence powered by ruthless discipline.'
      }
    ];
  }, [skills, completedSkillsCount, totalPracticeHours, habits, maxHabitStreak, habitsCompletedToday, activeHabitsCount]);

  // Filtered badges
  const filteredBadges = useMemo(() => {
    return allBadges.filter(b => {
      if (filter === 'all') return true;
      if (filter === 'ai_ml') return b.category === 'ai_ml';
      if (filter === 'habits') return b.category === 'habits';
      if (filter === 'unlocked') return b.isUnlocked;
      return true;
    });
  }, [allBadges, filter]);

  // Overall player level & completion calculations
  const unlockedCount = useMemo(() => allBadges.filter(b => b.isUnlocked).length, [allBadges]);
  const totalBadges = allBadges.length;
  const overallPercentage = Math.round((unlockedCount / totalBadges) * 100);

  // Determine current player title/rank
  const playerRank = useMemo(() => {
    if (unlockedCount >= 14) return { level: 5, rank: 'Apex Master', color: 'text-indigo-400' };
    if (unlockedCount >= 10) return { level: 4, rank: 'Frontier Engineer', color: 'text-cyan-400' };
    if (unlockedCount >= 6) return { level: 3, rank: 'Consistent Practitioner', color: 'text-yellow-400' };
    if (unlockedCount >= 3) return { level: 2, rank: 'Rising Apprentice', color: 'text-slate-300' };
    return { level: 1, rank: 'Initiate Operator', color: 'text-amber-400' };
  }, [unlockedCount]);

  // Find next achievable badge to display as the immediate objective
  const nextUpBadge = useMemo(() => {
    return allBadges
      .filter(b => !b.isUnlocked)
      .sort((a, b) => {
        const pctA = (a.currentValue / a.targetValue);
        const pctB = (b.currentValue / b.targetValue);
        return pctB - pctA;
      })[0] || null;
  }, [allBadges]);

  const handleBadgeClick = (badge: BadgeDefinition) => {
    setSelectedBadge(badge);
    if (badge.isUnlocked) {
      triggerConfetti();
    }
  };

  return (
    <section className="space-y-6">
      {/* 1. Header & Level Command Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0C1222] via-[#0E162B] to-[#111A35] border border-indigo-500/30 p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold tracking-wide uppercase">
              <Trophy className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Mastery & Achievement Engine</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">AI/ML Modules & Habit Streaks</span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
                Level {playerRank.level}: <span className={playerRank.color}>{playerRank.rank}</span>
              </h2>
              <span className="text-xs font-mono text-slate-400">
                {unlockedCount} of {totalBadges} Badges Unlocked ({overallPercentage}%)
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Gamify your transformation. Unlock distinctive badges as you finish AI/ML curriculum modules, log engineering practice hours, and maintain daily discipline streaks.
            </p>
          </div>

          {/* Quick Metrics Pillar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">AI Modules</div>
              <div className="text-lg font-heading font-black text-cyan-400 mt-0.5">
                {completedSkillsCount} <span className="text-xs text-slate-500 font-normal">/ {skills.length}</span>
              </div>
              <div className="text-[10px] text-slate-400">{totalPracticeHours}h practice</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Max Streak</div>
              <div className="text-lg font-heading font-black text-amber-400 mt-0.5">
                {maxHabitStreak} <span className="text-xs text-slate-500 font-normal">days</span>
              </div>
              <div className="text-[10px] text-slate-400">{habitsCompletedToday} done today</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 col-span-2 sm:col-span-1">
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Total XP</div>
              <div className="text-lg font-heading font-black text-indigo-400 mt-0.5">
                {unlockedCount * 150} <span className="text-xs text-slate-500 font-normal">pts</span>
              </div>
              <div className="text-[10px] text-emerald-400">Active Momentum</div>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
            <span className="text-slate-400">Overall Mastery Completion</span>
            <span className="text-indigo-300 font-semibold">{overallPercentage}% Complete</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-cyan-500 to-indigo-500 transition-all duration-700 ease-out"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>

        {/* Next Achievable Objective Callout */}
        {nextUpBadge && (
          <div className="mt-4 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                <Target className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <span className="text-slate-400">Next Objective: </span>
                <strong className="text-white font-semibold">{nextUpBadge.title}</strong>
                <span className="text-indigo-300 ml-1.5 font-mono">
                  ({nextUpBadge.currentValue}/{nextUpBadge.targetValue} {nextUpBadge.unit})
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">{nextUpBadge.requirementText}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {nextUpBadge.category === 'ai_ml' ? (
                <button
                  onClick={() => navigateToTab('career')}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
                >
                  <span>Go to AI Course</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => navigateToTab('tasks')}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-600/20"
                >
                  <span>Check Habit Log</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 2. Filter Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filter === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Badges ({allBadges.length})
          </button>
          <button
            onClick={() => setFilter('ai_ml')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              filter === 'ai_ml'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>AI/ML Track</span>
          </button>
          <button
            onClick={() => setFilter('habits')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              filter === 'habits'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Habit Streaks</span>
          </button>
          <button
            onClick={() => setFilter('unlocked')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              filter === 'unlocked'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Unlocked ({unlockedCount})</span>
          </button>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span>Click any unlocked badge to trigger celebration</span>
          <span aria-hidden="true">·</span>
          <span className="text-indigo-400 font-mono">150 XP each</span>
        </div>
      </div>

      {/* 3. Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBadges.map((badge) => {
          const tierStyle = TIER_COLORS[badge.tier];
          const Icon = badge.icon;
          const progressPct = Math.min(100, Math.round((badge.currentValue / badge.targetValue) * 100));

          return (
            <div
              key={badge.id}
              onClick={() => handleBadgeClick(badge)}
              className={`group relative rounded-2xl p-4 transition-all duration-200 cursor-pointer border flex flex-col justify-between ${
                badge.isUnlocked
                  ? `${tierStyle.bgUnlocked} ${tierStyle.borderUnlocked} ${tierStyle.glow} hover:scale-[1.02]`
                  : `${tierStyle.bg} border-slate-800/80 hover:border-slate-700 opacity-80 hover:opacity-100`
              }`}
            >
              <div>
                {/* Top Badge Card Meta */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                      badge.isUnlocked
                        ? `bg-slate-900 border ${tierStyle.borderUnlocked} ${tierStyle.text} ring-2 ${tierStyle.ring}`
                        : 'bg-slate-950/80 border border-slate-800 text-slate-500'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] uppercase tracking-wider font-mono font-bold px-2 py-0.5 rounded-full border ${tierStyle.badge}`}>
                      {tierStyle.label}
                    </span>
                    {badge.isUnlocked ? (
                      <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Unlocked</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>Locked</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className={`text-base font-heading font-black tracking-tight ${badge.isUnlocked ? 'text-white' : 'text-slate-300'}`}>
                  {badge.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              {/* Progress & Target Section */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">{badge.requirementText}</span>
                  <span className={badge.isUnlocked ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                    {badge.currentValue} / {badge.targetValue} {badge.unit}
                  </span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      badge.isUnlocked
                        ? 'bg-emerald-400'
                        : 'bg-indigo-500'
                    }`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                {badge.isUnlocked ? (
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                    <span className="text-emerald-400/90 font-mono">Tap for Confetti 🎉</span>
                    <span className="text-slate-400 font-mono">+150 XP</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5 font-mono">
                    <span>{badge.targetValue - badge.currentValue} {badge.unit} remaining</span>
                    <span>{progressPct}%</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Action Banner to Encourage Direct Execution */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h4 className="text-sm font-heading font-bold text-white">Want to unlock higher tiers faster?</h4>
            <p className="text-xs text-slate-400">
              Complete modules in the AI Course Curriculum or check off your daily habits in Tasks to boost your streak.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigateToTab('career')}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/20"
          >
            AI Course Modules
          </button>
          <button
            onClick={() => navigateToTab('tasks')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-semibold text-xs border border-slate-700 transition-all"
          >
            Daily Habits
          </button>
        </div>
      </div>

      {/* 5. Detailed Badge Inspection Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-[#0E1526] border border-slate-700 p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              ✕
            </button>

            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                selectedBadge.isUnlocked
                  ? `${TIER_COLORS[selectedBadge.tier].bgUnlocked} border ${TIER_COLORS[selectedBadge.tier].borderUnlocked} ${TIER_COLORS[selectedBadge.tier].text} ring-2 ${TIER_COLORS[selectedBadge.tier].ring}`
                  : 'bg-slate-900 border border-slate-800 text-slate-500'
              }`}>
                {React.createElement(selectedBadge.icon, { className: 'w-7 h-7' })}
              </div>

              <div>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${TIER_COLORS[selectedBadge.tier].badge}`}>
                  {TIER_COLORS[selectedBadge.tier].label} Tier
                </span>
                <h3 className="text-lg font-heading font-black text-white mt-1">
                  {selectedBadge.title}
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedBadge.description}
            </p>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Unlock Condition:</span>
                <span className="text-white font-semibold">{selectedBadge.requirementText}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Status:</span>
                <span className={selectedBadge.isUnlocked ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {selectedBadge.isUnlocked ? '✓ Unlocked & Earned' : '🔒 In Progress'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Current Progress:</span>
                <span className="text-white font-mono">
                  {selectedBadge.currentValue} / {selectedBadge.targetValue} {selectedBadge.unit} ({Math.min(100, Math.round((selectedBadge.currentValue / selectedBadge.targetValue) * 100))}%)
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-300 italic">
              "{selectedBadge.motivationQuote}"
            </div>

            <div className="flex items-center gap-2 pt-2">
              {selectedBadge.isUnlocked ? (
                <button
                  onClick={() => {
                    triggerConfetti();
                    setSelectedBadge(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Celebrate Achievement!</span>
                </button>
              ) : selectedBadge.category === 'ai_ml' ? (
                <button
                  onClick={() => {
                    setSelectedBadge(null);
                    navigateToTab('career');
                  }}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5"
                >
                  <Brain className="w-4 h-4" />
                  <span>Open AI Course Curriculum</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSelectedBadge(null);
                    navigateToTab('tasks');
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-all shadow-md shadow-amber-600/20 flex items-center justify-center gap-1.5"
                >
                  <Flame className="w-4 h-4" />
                  <span>View Daily Habits & Streaks</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
