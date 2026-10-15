// Fitness Calendar Component
// Displays workout schedule, completion, and streaks by day

import React from 'react';
import { Calendar, Flame, CheckCircle2, TrendingDown, Target } from 'lucide-react';

export interface WorkoutSession {
  id: string;
  date: string; // YYYY-MM-DD
  movementType: 'warm-up' | 'cardio' | 'strength' | 'mobility' | 'cool-down';
  duration: number; // minutes
  completedExercises: number;
  totalExercises: number;
  caloriesBurned: number;
  status: 'planned' | 'started' | 'completed' | 'skipped';
  notes?: string;
}

export interface FitnessGoal {
  id: string;
  title: string;
  targetType: 'sessions_per_month' | 'consecutive_days' | 'total_minutes' | 'exercises_completed';
  targetValue: number;
  currentValue: number;
  targetMonth: string; // YYYY-MM
  achieved: boolean;
}

export interface CalendarDayProps {
  date: string; // YYYY-MM-DD
  sessions: WorkoutSession[];
  isCurrentMonth: boolean;
  isToday: boolean;
  hasGoal: boolean;
  goalProgress?: number;
}

export const FitnessCalendar: React.FC<{
  sessions: WorkoutSession[];
  currentMonth?: string;
}> = ({
  sessions,
  currentMonth = new Date().toISOString().substring(0, 7),
}) => {
  // Compute calendar data
  const calendarData = React.useMemo(() => {
    // Group sessions by date
    const sessionsByDate = sessions.reduce((acc, session) => {
      const date = session.date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(session);
      return acc;
    }, {} as Record<string, WorkoutSession[]>);

    // Get all unique dates
    const dates = Object.keys(sessionsByDate);

    // Compute per-day stats
    const dayData = dates.map((date) => {
      const daySessions = sessionsByDate[date];
      const totalSessions = daySessions.length;
      const completedSessions = daySessions.filter(
        (s) => s.status === 'completed'
      ).length;
      const skippedSessions = daySessions.filter(
        (s) => s.status === 'skipped'
      ).length;
      const totalMinutes = daySessions.reduce(
        (sum, s) => sum + s.duration,
        0
      );
      const totalCalories = daySessions.reduce(
        (sum, s) => sum + s.caloriesBurned,
        0
      );

      return {
        date,
        totalSessions,
        completedSessions,
        skippedSessions,
        totalMinutes,
        totalCalories,
        sessionDetails: daySessions,
      };
    });

    return { sessionsByDate, dayData, dates };
  }, [sessions]);

  // Get unique dates sorted
  const uniqueDates = React.useMemo(() => {
    return [...new Set(calendarData.dates)].sort();
  }, [calendarData.dates]);

  // Current month state
  const month = currentMonth || new Date().toISOString().substring(0, 7);

  // Days in month
  const daysInMonth = (month: string) => {
    const [year, monthNum] = month.split('-').map(Number);
    return new Date(year, monthNum, 0).getDate();
  };

  const firstDayOfMonth = (month: string) => {
    const [year, monthNum] = month.split('-').map(Number);
    return new Date(year, monthNum - 1, 1).getDay();
  };

  const prevMonth = () => {
    const [year, monthNum] = month.split('-').map(Number);
    const newMonth = monthNum === 1 ? 12 : monthNum - 1;
    const newYear = monthNum === 1 ? year - 1 : year;
    // In a real app, would use state management
    return; // Placeholder
  };

  const nextMonth = () => {
    const [year, monthNum] = month.split('-').map(Number);
    const newMonth = monthNum === 12 ? 1 : monthNum + 1;
    const newYear = monthNum === 12 ? year + 1 : year;
    // In a real app, would use state management
    return; // Placeholder
  };

  // Check if date is in current month
  const isCurrentMonthDate = (date: string): boolean =>
    date.substring(0, 7) === month;

  // Check if date is today
  const isToday = (date: string): boolean => {
    const today = new Date().toISOString().substring(0, 10);
    return date === today;
  };

  // Render calendar day
  const renderDay = (
    day: number,
    month: string,
    dayData: any
  ): React.ReactNode => {
    const dayDate = `${month}-${day <= 9 ? '0' + day : day}`;
    const isCurrent = isCurrentMonthDate(dayDate);
    const today = isToday(dayDate);
    const data = dayData.find((d: any) => d.date === dayDate) || {
      totalSessions: 0,
      completedSessions: 0,
      skippedSessions: 0,
      totalMinutes: 0,
      totalCalories: 0,
    };

    const statusColors: Record<string, string> = {
      planned: 'bg-slate-500/30',
      started: 'bg-amber-500/30',
      completed: 'bg-emerald-500/30',
      skipped: 'bg-rose-500/30',
    };

    const statusTextColors: Record<string, string> = {
      planned: 'text-slate-400',
      started: 'text-amber-400',
      completed: 'text-emerald-400',
      skipped: 'text-rose-400',
    };

    const status = data.totalSessions > 0 ? (
      data.completedSessions === data.totalSessions
        ? 'completed'
        : data.skippedSessions > 0
        ? 'skipped'
        : 'started'
    ) : 'planned';

    return (
      <div
        className={`border rounded-sm ${statusColors[status] || 'bg-slate-950/50'}`}
      >
        <p className="text-[10px] font-medium text-slate-300">
          {day}
        </p>
        {data.totalSessions > 0 && (
          <div className="mt-1 text-[8px]">
            <span
              className={`block text-[1] ${statusTextColors[status]} hover:underline`}
            >
              {data.completedSessions}/{data.totalSessions} sess
            </span>
            <span className="block text-[1] text-slate-500 ml-1">
              {data.totalMinutes}min
            </span>
          </div>
        )}
        {data.totalCalories > 0 && (
          <span className="mt-0.5 text-[1] text-emerald-400">
            {data.totalCalories}cal
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="grid grid-cols-7 items-center gap-2 text-xs font-medium text-slate-400 border-b border-slate-700 pb-2">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Navigation */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={prevMonth}
          className="rounded-lg border border-slate-600 bg-slate-950/20 px-2 py-1 text-slate-300 hover:bg-slate-800"
        >
          ← Prev
        </button>
        <button
          onClick={nextMonth}
          className="rounded-lg border border-slate-600 bg-slate-950/20 px-2 py-1 text-slate-300 hover:bg-slate-800"
        >
          Next →
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty days before month starts */}
        {[...Array(firstDayOfMonth(month)).keys()].map(
          (_, i) => (
            <div key={i} className="border rounded-sm bg-slate-950/50"></div>
          )
        )}

        {/* Day numbers with workout data */}
        {[...Array(daysInMonth(month)).keys()].map((day) => {
          const dayNumber = day + 1;
          const dayDate = `${month}-${dayNumber <= 9 ? '0' + dayNumber : dayNumber}`;
          const dayData = calendarData.dayData.find(
            (d: any) => d.date === dayDate
          );

          return renderDay(dayNumber, month, dayData);
        })}

        {/* Empty days after month ends */}
        {[...Array(42 - daysInMonth(month) - firstDayOfMonth(month)).keys()].map(
          (_, i) => (
            <div key={i} className="border rounded-sm bg-slate-950/50"></div>
          )
        )}
      </div>
    </div>
  );
};

export default FitnessCalendar;