import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Plus,
  RefreshCw,
  Trash2,
  ExternalLink,
  Coins,
  BrainCircuit,
  Activity,
  CheckSquare,
  Briefcase,
  AlertCircle,
  Filter,
  Sparkles,
  ChevronRight,
  Bell
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  auth,
  initAuth,
  googleSignIn,
  logoutGoogle,
  hasValidCalendarAuth,
  getAccessToken
} from '../services/googleAuthService';
import {
  GoogleCalendarEvent,
  listCalendarEvents,
  createCalendarEvent,
  deleteCalendarEvent,
  toggleEventCompleted,
  buildChitCalendarEvent,
  buildAICourseCalendarEvent,
  buildWorkoutCalendarEvent,
  buildTaskCalendarEvent,
  buildWorkMilestoneCalendarEvent
} from '../services/googleCalendarService';
import { GoogleSignInBanner } from '../components/calendar/GoogleSignInBanner';
import { CalendarConfirmationModal } from '../components/calendar/CalendarConfirmationModal';
import { AICourseProgressDashboard } from '../components/career/AICourseProgressDashboard';
import { useLifeOS } from '../context/LifeOSContext';

export const GoogleCalendarPage: React.FC = () => {
  const {
    investments,
    skills,
    tasks,
    fitnessProfile,
    incomeStreams,
    triggerConfetti
  } = useLifeOS();

  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  // Calendar Events State
  const [events, setEvents] = useState<GoogleCalendarEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'chit' | 'ai_course' | 'workout' | 'task' | 'work_milestone'>('all');
  const [activeTab, setActiveTab] = useState<'calendar_view' | 'ai_modules' | 'sync_center'>('calendar_view');

  // Status & Feedback
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Confirmation Modal State (MANDATORY for modifying/deleting Workspace data)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    itemCount?: number;
    confirmLabel: string;
    confirmVariant: 'danger' | 'warning' | 'primary' | 'success';
    action: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    description: '',
    confirmLabel: '',
    confirmVariant: 'primary',
    action: async () => {},
  });
  const [isProcessingAction, setIsProcessingAction] = useState<boolean>(false);

  // Manual Quick Add Event state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCategory, setNewEventCategory] = useState<'chit' | 'ai_course' | 'workout' | 'task' | 'work_milestone'>('ai_course');
  const [newEventDate, setNewEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [newEventTime, setNewEventTime] = useState('19:00');
  const [newEventReminder, setNewEventReminder] = useState<number>(30); // minutes

  // Initialize Auth listener on mount
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setIsAuthenticated(true);
        loadEvents();
      },
      () => {
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setErrorMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setCurrentUser(result.user);
        setIsAuthenticated(true);
        setSuccessMessage('Successfully connected to Google Calendar!');
        setTimeout(() => setSuccessMessage(null), 3500);
        await loadEvents();
      }
    } catch (err: any) {
      console.error('Failed to sign in to Google Calendar:', err);
      setErrorMessage(err.message || 'Google Calendar authentication failed.');
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    await logoutGoogle();
    setCurrentUser(null);
    setIsAuthenticated(false);
    setEvents([]);
  };

  // Fetch events from Google Calendar
  const loadEvents = useCallback(async () => {
    if (!hasValidCalendarAuth()) return;
    setIsLoadingEvents(true);
    setErrorMessage(null);
    try {
      const fetched = await listCalendarEvents();
      setEvents(fetched);
    } catch (err: any) {
      console.error('Failed to load events:', err);
      setErrorMessage(err.message || 'Failed to load Google Calendar events.');
    } finally {
      setIsLoadingEvents(false);
    }
  }, []);

  // Filter 3 active chits from investments
  const activeChits = investments.filter(
    i => i.category === 'gold_chit' || i.category === 'offline_chit' || i.isMonthlySip
  );

  // Trigger Confirmation Modal for Deleting an event
  const promptDeleteEvent = (event: GoogleCalendarEvent) => {
    if (!event.id) return;
    setConfirmModal({
      isOpen: true,
      title: 'Delete Google Calendar Event',
      description: `Are you sure you want to delete "${event.summary}" from your primary Google Calendar? This action cannot be undone.`,
      itemCount: 1,
      confirmLabel: 'Delete Event',
      confirmVariant: 'danger',
      action: async () => {
        setIsProcessingAction(true);
        try {
          await deleteCalendarEvent(event.id!);
          setEvents(prev => prev.filter(e => e.id !== event.id));
          setSuccessMessage('Event deleted from Google Calendar.');
          setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
          setErrorMessage(err.message || 'Failed to delete event.');
        } finally {
          setIsProcessingAction(false);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  // Trigger Confirmation Modal for Toggling Completion
  const promptToggleCompleted = (event: GoogleCalendarEvent) => {
    if (!event.id) return;
    const isCurrentlyDone =
      event.extendedProperties?.private?.lifeos_completed === 'true' ||
      event.summary.startsWith('✅') ||
      event.summary.includes('[COMPLETED]');

    const targetAction = isCurrentlyDone ? 'unmark' : 'mark as completed';

    setConfirmModal({
      isOpen: true,
      title: isCurrentlyDone ? 'Unmark Event as Completed' : 'Mark Event as Completed',
      description: `Do you want to update "${event.summary}" in Google Calendar to ${targetAction}?`,
      itemCount: 1,
      confirmLabel: isCurrentlyDone ? 'Unmark' : 'Mark Completed ✅',
      confirmVariant: isCurrentlyDone ? 'warning' : 'success',
      action: async () => {
        setIsProcessingAction(true);
        try {
          const updated = await toggleEventCompleted(event);
          setEvents(prev => prev.map(e => (e.id === updated.id ? updated : e)));
          if (!isCurrentlyDone) triggerConfetti();
          setSuccessMessage(`Updated status for "${event.summary}" in Google Calendar.`);
          setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
          setErrorMessage(err.message || 'Failed to toggle event completion.');
        } finally {
          setIsProcessingAction(false);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  // Bulk Sync All Life OS Milestones with Confirmation Modal
  const promptSyncAllMilestones = () => {
    if (!isAuthenticated) {
      setErrorMessage('Please sign in with Google Calendar first.');
      return;
    }

    const totalToSync = activeChits.length + skills.length + tasks.filter(t => t.status !== 'completed').length + 3; // + workouts

    setConfirmModal({
      isOpen: true,
      title: 'Sync All Life OS Milestones to Google Calendar',
      description: `This will schedule:
• 3 Chit due dates (GRT 11-M on 10th, Saravana 20-M on 15th, Offline on 14th)
• ${skills.length} AI/ML course study sessions & milestone deadlines
• Active daily tasks with due dates
• Fitness workout routine sessions (Walking, Mobility, Skipping)
Each event will be set with popup notifications & reminders.`,
      itemCount: totalToSync,
      confirmLabel: 'Sync All to Calendar',
      confirmVariant: 'primary',
      action: async () => {
        setIsProcessingAction(true);
        try {
          const createdList: GoogleCalendarEvent[] = [];

          // 1. Sync 3 Active Chits
          for (const chit of activeChits) {
            const dueDay = chit.dueDayOfMonth || 10;
            const amount = chit.chitMonthlyAmount || chit.monthlySipAmount || 3000;
            const isPaid = (chit.chitMonthsPaid || 0) >= (chit.chitTenureMonths || 11);
            const payload = buildChitCalendarEvent({
              chitName: chit.name,
              amount,
              dueDay,
              isPaid,
              chitId: chit.id,
            });
            const created = await createCalendarEvent(payload);
            createdList.push(created);
          }

          // 2. Sync AI Course Modules (Study sessions & deadlines)
          for (let i = 0; i < skills.length; i++) {
            const skill = skills[i];
            const studyDate = new Date();
            studyDate.setDate(studyDate.getDate() + (i * 2 + 1));
            studyDate.setHours(19, 0, 0, 0); // 7:00 PM

            const payload = buildAICourseCalendarEvent({
              moduleName: skill.title,
              topic: skill.notes || 'Mastery study session',
              date: studyDate,
              durationMinutes: 90,
              moduleId: skill.id,
            });
            const created = await createCalendarEvent(payload);
            createdList.push(created);
          }

          // 3. Sync Active Tasks
          const pendingTasks = tasks.filter(t => t.status !== 'completed').slice(0, 5);
          for (const task of pendingTasks) {
            const payload = buildTaskCalendarEvent({
              title: task.title,
              dueDate: task.dueDate,
              priority: task.priority,
              area: task.area,
              taskId: task.id,
              isCompleted: false,
            });
            const created = await createCalendarEvent(payload);
            createdList.push(created);
          }

          // 4. Sync Workouts (Next 3 sessions: Mon, Wed, Fri)
          const workoutTypes = [
            { title: 'Walking + Mobility (Salem Park)', type: 'Walking + Mobility', duration: 45 },
            { title: 'Light Skipping & Core', type: 'Light Skipping', duration: 30 },
            { title: 'Full Body Movement & Stretches', type: 'Full Body Movement', duration: 40 },
          ];
          for (let i = 0; i < 3; i++) {
            const wDate = new Date();
            wDate.setDate(wDate.getDate() + (i + 1));
            wDate.setHours(6, 30, 0, 0); // 6:30 AM morning workout

            const payload = buildWorkoutCalendarEvent({
              title: workoutTypes[i].title,
              exerciseType: workoutTypes[i].type,
              date: wDate,
              durationMinutes: workoutTypes[i].duration,
              routineId: `workout-${i}`,
            });
            const created = await createCalendarEvent(payload);
            createdList.push(created);
          }

          // 5. Sync Work / Freelance Milestones
          for (const stream of incomeStreams.filter(s => s.status !== 'received').slice(0, 2)) {
            const payload = buildWorkMilestoneCalendarEvent({
              title: stream.title,
              clientOrSource: stream.sourceOrClient,
              amount: stream.amount,
              dueDate: stream.dueDateOrPayday || new Date().toISOString().split('T')[0],
              milestoneId: stream.id,
              isPaid: false,
            });
            const created = await createCalendarEvent(payload);
            createdList.push(created);
          }

          triggerConfetti();
          setSuccessMessage(`Successfully synced ${createdList.length} events to your Google Calendar!`);
          setTimeout(() => setSuccessMessage(null), 4000);
          await loadEvents();
        } catch (err: any) {
          console.error('Batch sync error:', err);
          setErrorMessage(err.message || 'Error syncing events to Google Calendar.');
        } finally {
          setIsProcessingAction(false);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  // Handle Custom Quick Add Event
  const handleCreateCustomEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    try {
      const [hours, mins] = newEventTime.split(':').map(n => parseInt(n, 10));
      const [y, m, d] = newEventDate.split('-').map(n => parseInt(n, 10));
      const start = new Date(y, m - 1, d, hours, mins, 0);
      const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour

      let prefix = '📅 ';
      let colorId = '1';
      if (newEventCategory === 'chit') { prefix = '💰 '; colorId = '5'; }
      else if (newEventCategory === 'ai_course') { prefix = '🧠 '; colorId = '3'; }
      else if (newEventCategory === 'workout') { prefix = '⚡ '; colorId = '2'; }
      else if (newEventCategory === 'task') { prefix = '📋 '; colorId = '7'; }
      else if (newEventCategory === 'work_milestone') { prefix = '💼 '; colorId = '9'; }

      const payload: GoogleCalendarEvent = {
        summary: `${prefix}${newEventTitle}`,
        description: `Created from Jeeva's Life OS Personal Command Center.\nCategory: ${newEventCategory}`,
        start: {
          dateTime: start.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
        },
        end: {
          dateTime: end.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
        },
        colorId,
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: newEventReminder },
          ],
        },
        extendedProperties: {
          private: {
            lifeos_category: newEventCategory,
            lifeos_completed: 'false',
          },
        },
      };

      await createCalendarEvent(payload);
      setSuccessMessage(`Created event "${newEventTitle}" in Google Calendar!`);
      setTimeout(() => setSuccessMessage(null), 3000);
      setIsAddModalOpen(false);
      setNewEventTitle('');
      await loadEvents();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create event.');
    }
  };

  // Filter events by category
  const filteredEvents = events.filter(event => {
    if (activeFilter === 'all') return true;
    const cat = event.extendedProperties?.private?.lifeos_category;
    if (cat === activeFilter) return true;

    // Fallback detection from summary
    if (activeFilter === 'chit' && (event.summary.includes('Chit') || event.summary.includes('💰'))) return true;
    if (activeFilter === 'ai_course' && (event.summary.includes('AI/ML') || event.summary.includes('Study') || event.summary.includes('🧠'))) return true;
    if (activeFilter === 'workout' && (event.summary.includes('Fitness') || event.summary.includes('Workout') || event.summary.includes('⚡'))) return true;
    if (activeFilter === 'task' && (event.summary.includes('Task') || event.summary.includes('📋'))) return true;
    if (activeFilter === 'work_milestone' && (event.summary.includes('Milestone') || event.summary.includes('💼'))) return true;

    return false;
  });

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-1.5">
            <CalendarIcon className="w-3.5 h-3.5 text-indigo-400" />
            <span>Google Workspace Calendar</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
            Schedule, Reminders & Milestone Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time synchronization for 3 chits, AI/ML study curriculum, daily tasks, and workout load with automated Google alerts.
          </p>
        </div>

        {isAuthenticated && (
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              <span>Quick Event</span>
            </button>

            <button
              onClick={promptSyncAllMilestones}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sync Life OS to Calendar</span>
            </button>
          </div>
        )}
      </div>

      {/* Google Auth Status Banner */}
      <GoogleSignInBanner
        user={currentUser}
        isAuthenticated={isAuthenticated}
        isAuthenticating={isAuthenticating}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onRefresh={loadEvents}
        isRefreshing={isLoadingEvents}
        totalSyncedEvents={events.length}
      />

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

      {/* Primary Navigation Tabs within Calendar */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('calendar_view')}
          className={`pb-3 px-4 text-xs font-bold transition-all relative ${
            activeTab === 'calendar_view'
              ? 'text-indigo-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            <span>Calendar Timeline & Events ({events.length})</span>
          </span>
          {activeTab === 'calendar_view' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('ai_modules')}
          className={`pb-3 px-4 text-xs font-bold transition-all relative ${
            activeTab === 'ai_modules'
              ? 'text-cyan-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="flex items-center gap-2">
            <BrainCircuit className="w-4 h-4" />
            <span>AI/ML Course Modules & Deadlines</span>
          </span>
          {activeTab === 'ai_modules' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('sync_center')}
          className={`pb-3 px-4 text-xs font-bold transition-all relative ${
            activeTab === 'sync_center'
              ? 'text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Life OS Sync Hub</span>
          </span>
          {activeTab === 'sync_center' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Tab 1: Live Calendar Timeline & Events */}
      {activeTab === 'calendar_view' && (
        <div className="space-y-6">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  activeFilter === 'all'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-900/60 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                All Events ({events.length})
              </button>
              <button
                onClick={() => setActiveFilter('chit')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                  activeFilter === 'chit'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-900/60 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                <Coins className="w-3 h-3 text-amber-400" />
                <span>3 Chits</span>
              </button>
              <button
                onClick={() => setActiveFilter('ai_course')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                  activeFilter === 'ai_course'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-900/60 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                <BrainCircuit className="w-3 h-3 text-cyan-400" />
                <span>AI Courses</span>
              </button>
              <button
                onClick={() => setActiveFilter('workout')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                  activeFilter === 'workout'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-900/60 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                <Activity className="w-3 h-3 text-emerald-400" />
                <span>Workouts</span>
              </button>
              <button
                onClick={() => setActiveFilter('task')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                  activeFilter === 'task'
                    ? 'bg-violet-500 text-slate-950 font-bold'
                    : 'bg-slate-900/60 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                <CheckSquare className="w-3 h-3 text-violet-400" />
                <span>Tasks</span>
              </button>
            </div>

            {isAuthenticated && (
              <span className="text-xs text-slate-500 font-mono">
                Showing {filteredEvents.length} events
              </span>
            )}
          </div>

          {/* Events List */}
          {!isAuthenticated ? (
            <div className="rounded-3xl bg-[#0E1526]/60 border border-slate-800 p-12 text-center">
              <CalendarIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">Google Calendar Disconnected</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-5">
                Sign in above with your Google account to fetch and synchronize your live schedule, reminders, and completed tasks.
              </p>
              <button
                onClick={handleSignIn}
                className="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-lg hover:bg-slate-100 transition-all cursor-pointer"
              >
                Sign in with Google
              </button>
            </div>
          ) : isLoadingEvents ? (
            <div className="rounded-3xl bg-[#0E1526]/60 border border-slate-800 p-12 text-center">
              <RefreshCw className="w-8 h-8 text-indigo-400 mx-auto animate-spin mb-3" />
              <p className="text-xs text-slate-300">Fetching events from Google Calendar...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="rounded-3xl bg-[#0E1526]/60 border border-slate-800 p-12 text-center">
              <CheckCircle2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No Events in this Category</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-5">
                No matching events found on your Google Calendar. Use "Sync Life OS to Calendar" or create a new event.
              </p>
              <button
                onClick={promptSyncAllMilestones}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all cursor-pointer"
              >
                Sync Life OS Milestones Now
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEvents.map(event => {
                const isCompleted =
                  event.extendedProperties?.private?.lifeos_completed === 'true' ||
                  event.summary.startsWith('✅') ||
                  event.summary.includes('[COMPLETED]');

                const rawDate = event.start.dateTime || event.start.date || '';
                const dateObj = new Date(rawDate);
                const dateFormatted = !isNaN(dateObj.getTime())
                  ? dateObj.toLocaleDateString('en-GB', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    })
                  : rawDate;

                const timeFormatted = event.start.dateTime && !isNaN(dateObj.getTime())
                  ? dateObj.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })
                  : 'All Day';

                return (
                  <div
                    key={event.id || event.summary}
                    className={`rounded-2xl p-4 sm:p-5 border transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                      isCompleted
                        ? 'bg-emerald-950/20 border-emerald-500/30'
                        : 'bg-[#0E1526] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Mark Completed Button */}
                      <button
                        onClick={() => promptToggleCompleted(event)}
                        className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400'
                            : 'bg-slate-800 border border-slate-700 text-slate-500 hover:text-white hover:border-emerald-500'
                        }`}
                        title={isCompleted ? 'Mark Pending' : 'Mark Completed on Google Calendar'}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4
                            className={`font-semibold text-sm leading-tight ${
                              isCompleted ? 'text-emerald-200 line-through opacity-80' : 'text-white'
                            }`}
                          >
                            {event.summary}
                          </h4>

                          {isCompleted && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                              Completed
                            </span>
                          )}
                        </div>

                        {event.description && (
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2 max-w-xl">
                            {event.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
                          <span className="flex items-center gap-1 font-mono text-slate-300">
                            <Clock className="w-3.5 h-3.5 text-indigo-400" />
                            {dateFormatted} · {timeFormatted}
                          </span>

                          {event.reminders?.overrides && event.reminders.overrides.length > 0 && (
                            <span className="flex items-center gap-1 text-amber-400 text-[11px]">
                              <Bell className="w-3 h-3" />
                              {event.reminders.overrides.map(r => `${r.minutes}m`).join(', ')} alert
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions: Open in Google Calendar & Delete */}
                    <div className="flex items-center justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                      {event.htmlLink && (
                        <a
                          href={event.htmlLink}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Open event in Google Calendar web app"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}

                      <button
                        onClick={() => promptDeleteEvent(event)}
                        className="p-2 rounded-xl bg-slate-800/60 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Delete from Google Calendar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: AI Course Progress Dashboard */}
      {activeTab === 'ai_modules' && (
        <AICourseProgressDashboard onNavigateToCalendar={() => setActiveTab('calendar_view')} />
      )}

      {/* Tab 3: Life OS Sync Hub */}
      {activeTab === 'sync_center' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-[#0E1526] border border-slate-800 p-6 shadow-xl">
            <h3 className="font-heading font-bold text-lg text-white">
              Life OS Milestones Eligible for Calendar Sync
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Select or batch-sync recurring chits, AI course study slots, fitness sessions, and freelance payment milestones into Google Calendar.
            </p>

            {/* Chits Section */}
            <div className="mt-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Coins className="w-4 h-4" />
                <span>3 Active Chit Schemes</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {activeChits.map(chit => (
                  <div key={chit.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="font-semibold text-white text-sm">{chit.name}</div>
                      <div className="text-xs text-amber-300 font-mono mt-1">
                        ₹{(chit.chitMonthlyAmount || chit.monthlySipAmount || 0).toLocaleString('en-IN')}/month
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Due: <strong className="text-slate-200">{chit.dueDayOfMonth || 10}th</strong> of every month
                      </div>
                    </div>
                    <div className="mt-3 text-[11px] text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Ready to sync with 24h & 2h alerts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Courses Section */}
            <div className="mt-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <BrainCircuit className="w-4 h-4" />
                <span>AI/ML Learning Roadmap Sessions</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {skills.slice(0, 4).map(skill => (
                  <div key={skill.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white text-sm">{skill.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Progress: {skill.practiceHours}/{skill.targetHours}h · {skill.status.replace('_', ' ')}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-mono">
                      7:00 PM Slots
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Workouts Section */}
            <div className="mt-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4" />
                <span>Fitness & Weight Progression (57 kg Target)</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="font-semibold text-white text-xs">Walking + Mobility</div>
                  <div className="text-xs text-slate-400 mt-1">Mon, Wed, Fri · 6:30 AM</div>
                  <div className="text-[11px] text-emerald-400 mt-2 font-mono">45 mins session</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="font-semibold text-white text-xs">Light Skipping & Core</div>
                  <div className="text-xs text-slate-400 mt-1">Tue, Thu, Sat · 6:30 AM</div>
                  <div className="text-[11px] text-emerald-400 mt-2 font-mono">30 mins interval</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="font-semibold text-white text-xs">Active Recovery & Stretches</div>
                  <div className="text-xs text-slate-400 mt-1">Sunday · 7:30 AM</div>
                  <div className="text-[11px] text-emerald-400 mt-2 font-mono">20 mins reset</div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-8 pt-5 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Syncing replaces or refreshes all events in your Google Calendar safely.
              </span>
              <button
                onClick={promptSyncAllMilestones}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 hover:scale-102 active:scale-98 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Execute 1-Click Sync</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Add Custom Event Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#0E1526] border border-slate-700 p-6 shadow-2xl text-slate-100">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-indigo-400" />
              <span>Create Google Calendar Event</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Add a custom reminder or work milestone directly to your primary calendar.
            </p>

            <form onSubmit={handleCreateCustomEvent} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chit EMI Payment or PyTorch Deep Dive"
                  value={newEventTitle}
                  onChange={e => setNewEventTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={newEventCategory}
                    onChange={e => setNewEventCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="chit">💰 Chit Payment</option>
                    <option value="ai_course">🧠 AI/ML Study</option>
                    <option value="workout">⚡ Workout</option>
                    <option value="task">📋 Daily Task</option>
                    <option value="work_milestone">💼 Work Milestone</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Reminder Alert</label>
                  <select
                    value={newEventReminder}
                    onChange={e => setNewEventReminder(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value={15}>15 minutes before</option>
                    <option value={30}>30 minutes before</option>
                    <option value={60}>1 hour before</option>
                    <option value={1440}>1 day before (24h)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newEventDate}
                    onChange={e => setNewEventDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Time</label>
                  <input
                    type="time"
                    required
                    value={newEventTime}
                    onChange={e => setNewEventTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30"
                >
                  Save to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mandatory User Confirmation Dialog for modifying/deleting Google Calendar events */}
      <CalendarConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        description={confirmModal.description}
        itemCount={confirmModal.itemCount}
        confirmLabel={confirmModal.confirmLabel}
        confirmVariant={confirmModal.confirmVariant}
        onConfirm={confirmModal.action}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        isProcessing={isProcessingAction}
      />
    </div>
  );
};
