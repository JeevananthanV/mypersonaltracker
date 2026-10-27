import React, { useState } from 'react';
import {
  BrainCircuit,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Plus,
  RefreshCw,
  Award,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useLifeOS } from '../../context/LifeOSContext';
import { SkillModule, SkillStatus } from '../../types';
import { hasValidCalendarAuth } from '../../services/googleAuthService';
import {
  buildAICourseCalendarEvent,
  createCalendarEvent,
  updateCalendarEvent,
  listCalendarEvents
} from '../../services/googleCalendarService';
import { CalendarConfirmationModal } from '../calendar/CalendarConfirmationModal';

interface AICourseProgressDashboardProps {
  onNavigateToCalendar?: () => void;
}

export const AICourseProgressDashboard: React.FC<AICourseProgressDashboardProps> = ({
  onNavigateToCalendar
}) => {
  const { skills, updateSkill, logPracticeHours, triggerConfetti } = useLifeOS();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Confirmation modal state
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: 'sync' | 'mark_complete';
    module: SkillModule;
  } | null>(null);

  const categories = ['all', 'Core Language', 'Data & Stats', 'Machine Learning', 'Deep Learning', 'MLOps & Deployment'];

  const filteredSkills = skills.filter(skill => {
    if (selectedCategory === 'all') return true;
    return skill.category === selectedCategory;
  });

  const totalPracticeHours = skills.reduce((sum, s) => sum + s.practiceHours, 0);
  const totalTargetHours = skills.reduce((sum, s) => sum + s.targetHours, 0);
  const completedCount = skills.filter(s => s.status === 'completed').length;
  const inProgressCount = skills.filter(s => s.status === 'in_progress').length;
  const completionPercentage = totalTargetHours > 0 
    ? Math.min(100, Math.round((totalPracticeHours / totalTargetHours) * 100))
    : 0;

  // Handle status cycle: not_started -> in_progress -> completed -> not_started
  const handleToggleStatus = async (skill: SkillModule) => {
    let nextStatus: SkillStatus = 'in_progress';
    if (skill.status === 'not_started') nextStatus = 'in_progress';
    else if (skill.status === 'in_progress') nextStatus = 'completed';
    else if (skill.status === 'completed') nextStatus = 'not_started';

    const updates: Partial<SkillModule> = {
      status: nextStatus,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    if (nextStatus === 'completed') {
      updates.practiceHours = skill.targetHours;
      triggerConfetti();
    }

    updateSkill(skill.id, updates);

    // If user has Google Calendar connected and event is mapped, update on calendar as well
    if (hasValidCalendarAuth() && skill.calendarEventId) {
      try {
        await updateCalendarEvent(skill.calendarEventId, {
          summary: nextStatus === 'completed' 
            ? `✅ AI/ML Study: ${skill.title} [COMPLETED]` 
            : `🧠 AI/ML Study: ${skill.title}`,
          colorId: nextStatus === 'completed' ? '10' : '3',
          extendedProperties: {
            private: {
              lifeos_category: 'ai_course',
              lifeos_source_id: skill.id,
              lifeos_completed: nextStatus === 'completed' ? 'true' : 'false'
            }
          }
        });
      } catch (e) {
        console.warn('Could not sync status to Google Calendar:', e);
      }
    }
  };

  const handleUpdateCompletionDate = (skillId: string, dateStr: string) => {
    updateSkill(skillId, {
      estimatedCompletionDate: dateStr,
      updatedAt: new Date().toISOString().split('T')[0]
    });
  };

  const promptSyncToCalendar = (module: SkillModule) => {
    if (!hasValidCalendarAuth()) {
      if (onNavigateToCalendar) {
        onNavigateToCalendar();
      } else {
        setErrorMessage('Please connect your Google Calendar first from the Calendar page.');
      }
      return;
    }

    setPendingAction({ type: 'sync', module });
    setConfirmModalOpen(true);
  };

  const executeSyncToCalendar = async () => {
    if (!pendingAction) return;
    const { module } = pendingAction;
    setSyncingId(module.id);
    setConfirmModalOpen(false);

    try {
      const scheduledDate = module.estimatedCompletionDate 
        ? new Date(module.estimatedCompletionDate)
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      
      scheduledDate.setHours(19, 0, 0, 0); // 7:00 PM study block

      const eventPayload = buildAICourseCalendarEvent({
        moduleName: module.title,
        topic: module.notes || 'Mastery practice session',
        date: scheduledDate,
        durationMinutes: 90,
        moduleId: module.id
      });

      const created = await createCalendarEvent(eventPayload);

      updateSkill(module.id, {
        calendarEventId: created.id,
        lastCalendarSync: new Date().toISOString(),
        estimatedCompletionDate: module.estimatedCompletionDate || scheduledDate.toISOString().split('T')[0]
      });

      setSuccessMessage(`Scheduled "${module.title}" study milestone on your Google Calendar!`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to sync module to Google Calendar');
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setSyncingId(null);
      setPendingAction(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Header & High-Level Summary Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0B101D] via-[#10182C] to-[#0D1322] border border-cyan-500/30 p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-2.5">
              <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI/ML Curriculum & Calendar Synchronization</span>
            </div>
            <h2 className="font-heading font-black text-2xl text-white tracking-tight flex items-center gap-2">
              <span>AI/ML Learning Roadmap</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Track your hands-on mastery in Python, PyTorch, Linear Algebra, and Deep Learning. Set target completion dates and sync study sessions directly to your Google Calendar with automated reminders.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 font-medium">Completed</div>
              <div className="font-mono text-xl font-bold text-emerald-400 mt-0.5">
                {completedCount}<span className="text-xs text-slate-500">/{skills.length}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 font-medium">In Progress</div>
              <div className="font-mono text-xl font-bold text-cyan-400 mt-0.5">
                {inProgressCount}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 font-medium">Logged Hours</div>
              <div className="font-mono text-xl font-bold text-indigo-400 mt-0.5">
                {totalPracticeHours}<span className="text-xs text-slate-500">/{totalTargetHours}h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              Total Curriculum Completion Progress
            </span>
            <span className="font-mono font-bold text-cyan-300">{completionPercentage}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-800/80 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 transition-all duration-500 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60'
              }`}
            >
              {category === 'all' ? 'All Modules' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSkills.map(skill => {
          const progressPct = skill.targetHours > 0 
            ? Math.min(100, Math.round((skill.practiceHours / skill.targetHours) * 100))
            : 0;

          const isCompleted = skill.status === 'completed';
          const isInProgress = skill.status === 'in_progress';

          return (
            <div
              key={skill.id}
              className={`rounded-3xl p-5 border transition-all relative overflow-hidden flex flex-col justify-between ${
                isCompleted
                  ? 'bg-emerald-950/15 border-emerald-500/30 hover:border-emerald-500/50'
                  : isInProgress
                  ? 'bg-[#0E1526] border-cyan-500/30 hover:border-cyan-500/50'
                  : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Top Row: Category & Status Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-lg bg-slate-800/80 text-[11px] font-medium text-slate-300 border border-slate-700">
                    {skill.category}
                  </span>

                  {/* Status Toggle Button */}
                  <button
                    onClick={() => handleToggleStatus(skill)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                        : isInProgress
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200'
                    }`}
                    title="Click to toggle status (Not Started ➔ In Progress ➔ Completed)"
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Completed</span>
                      </>
                    ) : isInProgress ? (
                      <>
                        <Clock className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                        <span>In Progress</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-slate-500" />
                        <span>Not Started</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Course Title & Resource */}
                <h3 className="font-heading font-bold text-base text-white leading-snug">
                  {skill.title}
                </h3>
                {skill.resourceName && (
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <span>Source: {skill.resourceName}</span>
                    {skill.resourceUrl && (
                      <a
                        href={skill.resourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:text-cyan-300"
                        title="Open Resource"
                      >
                        <ExternalLink className="w-3 h-3 inline" />
                      </a>
                    )}
                  </p>
                )}

                {/* Progress Hours Bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Practice Progress</span>
                    <span className="font-mono text-slate-200 font-bold">
                      {skill.practiceHours} / {skill.targetHours} hrs ({progressPct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isCompleted
                          ? 'bg-emerald-400'
                          : isInProgress
                          ? 'bg-cyan-400'
                          : 'bg-slate-600'
                      }`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Quick Add Practice Hour Button */}
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => logPracticeHours(skill.id, 1)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold border border-slate-700 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3 text-cyan-400" />
                    <span>+1h Study</span>
                  </button>
                  <button
                    onClick={() => logPracticeHours(skill.id, 2)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold border border-slate-700 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3 text-cyan-400" />
                    <span>+2h Deep Work</span>
                  </button>
                </div>
              </div>

              {/* Bottom Section: Estimated Completion Date & Google Calendar Sync */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                  <label className="text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Estimated Completion:</span>
                  </label>
                  <input
                    type="date"
                    value={skill.estimatedCompletionDate || ''}
                    onChange={e => handleUpdateCompletionDate(skill.id, e.target.value)}
                    className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Calendar Sync Status or Sync Action */}
                <div className="flex items-center justify-between gap-2">
                  {skill.calendarEventId ? (
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Synced to Google Calendar</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-500">
                      Not scheduled on Google Calendar
                    </span>
                  )}

                  <button
                    onClick={() => promptSyncToCalendar(skill)}
                    disabled={syncingId === skill.id}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 hover:text-white text-xs font-semibold border border-indigo-500/40 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {syncingId === skill.id ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin text-indigo-400" />
                        <span>Syncing...</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="w-3 h-3 text-indigo-400" />
                        <span>{skill.calendarEventId ? 'Re-sync' : 'Add to Calendar'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal for Google Calendar sync */}
      {pendingAction && (
        <CalendarConfirmationModal
          isOpen={confirmModalOpen}
          title="Schedule AI Course Session on Google Calendar"
          description={`Add a study session and milestone reminder for "${pendingAction.module.title}" onto your primary Google Calendar (at 7:00 PM with 30m reminders).`}
          itemCount={1}
          confirmLabel="Add to Google Calendar"
          confirmVariant="primary"
          onConfirm={executeSyncToCalendar}
          onCancel={() => {
            setConfirmModalOpen(false);
            setPendingAction(null);
          }}
          isProcessing={syncingId === pendingAction.module.id}
        />
      )}
    </div>
  );
};
