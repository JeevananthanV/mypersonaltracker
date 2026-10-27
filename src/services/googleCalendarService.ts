import { getAccessToken } from './googleAuthService';

export interface CalendarEventReminder {
  method: 'popup' | 'email';
  minutes: number;
}

export interface GoogleCalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  colorId?: string; // 1: Blue, 2: Green, 3: Purple, 4: Red, 5: Yellow, 6: Orange, 7: Turquoise, 8: Graphite, 9: Bold Blue, 10: Basil (Emerald), 11: Bold Red
  reminders?: {
    useDefault: boolean;
    overrides?: CalendarEventReminder[];
  };
  htmlLink?: string;
  status?: string;
  extendedProperties?: {
    private?: {
      lifeos_category?: 'chit' | 'ai_course' | 'task' | 'workout' | 'work_milestone' | 'other';
      lifeos_source_id?: string;
      lifeos_completed?: 'true' | 'false';
      completed_at?: string;
      [key: string]: string | undefined;
    };
  };
}

const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

/**
 * Fetch events from the primary calendar within a time range.
 */
export const listCalendarEvents = async (options?: {
  timeMin?: string;
  timeMax?: string;
  maxResults?: number;
  q?: string;
}): Promise<GoogleCalendarEvent[]> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated with Google. Please sign in to access your calendar.');
  }

  const params = new URLSearchParams({
    singleEvents: 'true',
    orderBy: 'startTime',
    maxResults: (options?.maxResults || 100).toString(),
  });

  if (options?.timeMin) {
    params.set('timeMin', options.timeMin);
  } else {
    // Default: 30 days in the past
    const past = new Date();
    past.setDate(past.getDate() - 30);
    params.set('timeMin', past.toISOString());
  }

  if (options?.timeMax) {
    params.set('timeMax', options.timeMax);
  } else {
    // Default: 90 days in the future
    const future = new Date();
    future.setDate(future.getDate() + 90);
    params.set('timeMax', future.toISOString());
  }

  if (options?.q) {
    params.set('q', options.q);
  }

  const response = await fetch(`${CALENDAR_API_BASE}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody?.error?.message || `Failed to fetch events: HTTP ${response.status}`);
  }

  const data = await response.json();
  return (data.items || []) as GoogleCalendarEvent[];
};

/**
 * Create a new event on Google Calendar.
 */
export const createCalendarEvent = async (event: GoogleCalendarEvent): Promise<GoogleCalendarEvent> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated with Google.');
  }

  const response = await fetch(CALENDAR_API_BASE, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody?.error?.message || `Failed to create calendar event: HTTP ${response.status}`);
  }

  return response.json();
};

/**
 * Update an existing event on Google Calendar.
 */
export const updateCalendarEvent = async (
  eventId: string,
  event: Partial<GoogleCalendarEvent>
): Promise<GoogleCalendarEvent> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated with Google.');
  }

  const response = await fetch(`${CALENDAR_API_BASE}/${encodeURIComponent(eventId)}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody?.error?.message || `Failed to update calendar event: HTTP ${response.status}`);
  }

  return response.json();
};

/**
 * Delete an event from Google Calendar.
 */
export const deleteCalendarEvent = async (eventId: string): Promise<boolean> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated with Google.');
  }

  const response = await fetch(`${CALENDAR_API_BASE}/${encodeURIComponent(eventId)}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok && response.status !== 404) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody?.error?.message || `Failed to delete calendar event: HTTP ${response.status}`);
  }

  return true;
};

/**
 * Toggle event completion status on Google Calendar.
 * Adds or removes '✅ ' checkmark prefix and switches color to Basil (10) or original.
 */
export const toggleEventCompleted = async (
  event: GoogleCalendarEvent
): Promise<GoogleCalendarEvent> => {
  if (!event.id) {
    throw new Error('Event ID is required to mark completion.');
  }

  const isCurrentlyCompleted =
    event.extendedProperties?.private?.lifeos_completed === 'true' ||
    event.summary.startsWith('✅') ||
    event.summary.includes('[COMPLETED]');

  const now = new Date().toISOString();
  let newSummary = event.summary;
  let newColorId = event.colorId;

  if (!isCurrentlyCompleted) {
    // Mark as completed
    if (!newSummary.startsWith('✅')) {
      newSummary = `✅ ${newSummary.replace(/\[COMPLETED\]\s*/g, '')}`;
    }
    newColorId = '10'; // Basil / Green
  } else {
    // Unmark as completed
    newSummary = newSummary.replace(/^✅\s*/, '').replace(/\[COMPLETED\]\s*/g, '');
    // Reset to default or appropriate category color
    const cat = event.extendedProperties?.private?.lifeos_category;
    if (cat === 'chit') newColorId = '5'; // Yellow / Amber
    else if (cat === 'ai_course') newColorId = '3'; // Grape / Purple
    else if (cat === 'workout') newColorId = '2'; // Sage / Green
    else if (cat === 'task') newColorId = '7'; // Peacock / Cyan
    else newColorId = '1'; // Blue
  }

  const updatedPrivateProps = {
    ...(event.extendedProperties?.private || {}),
    lifeos_completed: (!isCurrentlyCompleted ? 'true' : 'false') as 'true' | 'false',
    completed_at: !isCurrentlyCompleted ? now : '',
  };

  return updateCalendarEvent(event.id, {
    summary: newSummary,
    colorId: newColorId,
    extendedProperties: {
      private: updatedPrivateProps,
    },
  });
};

/**
 * Helper to build an event for Chit Payment Reminders.
 */
export const buildChitCalendarEvent = (params: {
  chitName: string;
  amount: number;
  dueDay: number;
  monthDate?: Date;
  isPaid?: boolean;
  chitId: string;
}): GoogleCalendarEvent => {
  const targetDate = params.monthDate || new Date();
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth();
  const dueDay = Math.min(params.dueDay, 28); // Safe day of month

  const eventDate = new Date(year, month, dueDay, 10, 0, 0); // 10:00 AM
  const endDate = new Date(year, month, dueDay, 10, 30, 0); // 10:30 AM

  const prefix = params.isPaid ? '✅ ' : '💰 ';
  const summary = `${prefix}Chit Payment Due: ${params.chitName} (₹${params.amount.toLocaleString('en-IN')})`;

  return {
    summary,
    description: `Life OS Chit Scheme Reminder\nScheme: ${params.chitName}\nAmount Due: ₹${params.amount.toLocaleString('en-IN')}\nDue Day: ${params.dueDay}th of the month\nStatus: ${params.isPaid ? 'PAID' : 'PENDING'}\n\nManaged in Jeeva's Life OS.`,
    start: {
      dateTime: eventDate.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
    },
    colorId: params.isPaid ? '10' : '5', // Yellow for pending, Basil for paid
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 1440 }, // 1 day before
        { method: 'popup', minutes: 120 },  // 2 hours before
        { method: 'popup', minutes: 15 },   // 15 mins before
      ],
    },
    extendedProperties: {
      private: {
        lifeos_category: 'chit',
        lifeos_source_id: params.chitId,
        lifeos_completed: params.isPaid ? 'true' : 'false',
      },
    },
  };
};

/**
 * Helper to build an event for AI Course & Learning Sessions.
 */
export const buildAICourseCalendarEvent = (params: {
  moduleName: string;
  topic: string;
  date: Date;
  durationMinutes?: number;
  moduleId: string;
}): GoogleCalendarEvent => {
  const duration = params.durationMinutes || 90;
  const endDate = new Date(params.date.getTime() + duration * 60 * 1000);

  return {
    summary: `🧠 AI/ML Study: ${params.moduleName} - ${params.topic}`,
    description: `Life OS AI/ML Career Center Focus Session\nModule: ${params.moduleName}\nTopic: ${params.topic}\nTarget Focus: ${duration} minutes deep work\n\nManaged in Jeeva's Life OS.`,
    start: {
      dateTime: params.date.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
    },
    colorId: '3', // Grape / Violet for AI & Engineering
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 30 },
        { method: 'popup', minutes: 10 },
      ],
    },
    extendedProperties: {
      private: {
        lifeos_category: 'ai_course',
        lifeos_source_id: params.moduleId,
        lifeos_completed: 'false',
      },
    },
  };
};

/**
 * Helper to build an event for Workout & Physical Fitness.
 */
export const buildWorkoutCalendarEvent = (params: {
  title: string;
  exerciseType: string;
  date: Date;
  durationMinutes?: number;
  routineId?: string;
}): GoogleCalendarEvent => {
  const duration = params.durationMinutes || 45;
  const endDate = new Date(params.date.getTime() + duration * 60 * 1000);

  return {
    summary: `⚡ Fitness Workout: ${params.title}`,
    description: `Life OS Fitness & Health Routine\nType: ${params.exerciseType}\nDuration: ${duration} mins\nGoal: Reach 57kg lean athletic weight\n\nStay consistent! Track completion in Life OS.`,
    start: {
      dateTime: params.date.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
    },
    colorId: '2', // Sage / Green for Fitness
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 15 },
      ],
    },
    extendedProperties: {
      private: {
        lifeos_category: 'workout',
        lifeos_source_id: params.routineId || 'workout-routine',
        lifeos_completed: 'false',
      },
    },
  };
};

/**
 * Helper to build an event for Tasks with Due Dates.
 */
export const buildTaskCalendarEvent = (params: {
  title: string;
  dueDate: string;
  priority: string;
  area: string;
  taskId: string;
  isCompleted?: boolean;
}): GoogleCalendarEvent => {
  const [yearStr, monthStr, dayStr] = params.dueDate.split('-');
  const y = parseInt(yearStr, 10);
  const m = parseInt(monthStr, 10) - 1;
  const d = parseInt(dayStr, 10);

  const start = new Date(y, m, d, 9, 0, 0);
  const end = new Date(y, m, d, 9, 45, 0);

  const prefix = params.isCompleted ? '✅ ' : '📋 ';
  const summary = `${prefix}[${params.area}] ${params.title}`;

  return {
    summary,
    description: `Life OS Daily Task\nTitle: ${params.title}\nArea: ${params.area}\nPriority: ${params.priority.toUpperCase()}\nStatus: ${params.isCompleted ? 'Completed' : 'Pending'}\n\nManaged in Jeeva's Life OS.`,
    start: {
      dateTime: start.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
    },
    end: {
      dateTime: end.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
    },
    colorId: params.isCompleted ? '10' : params.priority === 'high' ? '11' : '7',
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 60 },
        { method: 'popup', minutes: 15 },
      ],
    },
    extendedProperties: {
      private: {
        lifeos_category: 'task',
        lifeos_source_id: params.taskId,
        lifeos_completed: params.isCompleted ? 'true' : 'false',
      },
    },
  };
};

/**
 * Helper to build an event for Work & Freelance Milestones.
 */
export const buildWorkMilestoneCalendarEvent = (params: {
  title: string;
  clientOrSource: string;
  amount: number;
  dueDate: string;
  milestoneId: string;
  isPaid?: boolean;
}): GoogleCalendarEvent => {
  const [yearStr, monthStr, dayStr] = params.dueDate.split('-');
  const y = parseInt(yearStr, 10);
  const m = parseInt(monthStr, 10) - 1;
  const d = parseInt(dayStr, 10);

  const start = new Date(y, m, d, 11, 0, 0);
  const end = new Date(y, m, d, 12, 0, 0);

  const prefix = params.isPaid ? '✅ ' : '💼 ';
  const summary = `${prefix}Work Milestone: ${params.title} (${params.clientOrSource} · ₹${params.amount.toLocaleString('en-IN')})`;

  return {
    summary,
    description: `Life OS Work & Freelance Milestone\nProject/Client: ${params.clientOrSource}\nExpected Inflow: ₹${params.amount.toLocaleString('en-IN')}\nDue Date: ${params.dueDate}\nStatus: ${params.isPaid ? 'Received' : 'Pending'}\n\nManaged in Jeeva's Life OS.`,
    start: {
      dateTime: start.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
    },
    end: {
      dateTime: end.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
    },
    colorId: params.isPaid ? '10' : '9', // Bold Blue
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 1440 }, // 1 day before
        { method: 'popup', minutes: 120 },
      ],
    },
    extendedProperties: {
      private: {
        lifeos_category: 'work_milestone',
        lifeos_source_id: params.milestoneId,
        lifeos_completed: params.isPaid ? 'true' : 'false',
      },
    },
  };
};
