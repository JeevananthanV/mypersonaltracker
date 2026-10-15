/**
 * Date and Time Utilities for Jeeva's Life OS
 * Ensures all calculations, defaults, and displays use the user's LIVE LOCAL system date/time
 * Avoids UTC timezone shift bugs where midnight to 5:30 AM shifted to yesterday.
 */

/**
 * Returns YYYY-MM-DD for the given Date (defaults to current live Date) in local timezone
 */
export const getLiveDateString = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Returns YYYY-MM for the current live month in local timezone
 */
export const getLiveMonthString = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

/**
 * Returns formatted month title, e.g. "Oct 2026" or "October 2026"
 */
export const getLiveMonthFormatted = (d: Date = new Date(), monthFormat: 'short' | 'long' = 'short'): string => {
  return d.toLocaleDateString('en-GB', { month: monthFormat, year: 'numeric' });
};

/**
 * Returns yesterday's date string YYYY-MM-DD in local timezone
 */
export const getYesterdayDateString = (d: Date = new Date()): string => {
  const yesterday = new Date(d);
  yesterday.setDate(yesterday.getDate() - 1);
  return getLiveDateString(yesterday);
};

/**
 * Returns N days ago date string YYYY-MM-DD in local timezone
 */
export const getDaysAgoDateString = (days: number, d: Date = new Date()): string => {
  const target = new Date(d);
  target.setDate(target.getDate() - days);
  return getLiveDateString(target);
};

/**
 * Returns formatted live time e.g. "11:28:45 AM"
 */
export const getLiveTimeString = (d: Date = new Date(), includeSeconds: boolean = true): string => {
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: includeSeconds ? '2-digit' : undefined,
    hour12: true
  });
};

/**
 * Returns formatted live date e.g. "Thu, 15 Oct 2026"
 */
export const getLiveFormattedDate = (
  d: Date = new Date(),
  style: 'short' | 'medium' | 'full' = 'short'
): string => {
  if (style === 'full') {
    return d.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
  if (style === 'medium') {
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Returns current week range e.g. "Oct 12 - Oct 18, 2026" (Monday to Sunday)
 */
export const getLiveWeekRange = (d: Date = new Date()): string => {
  const day = d.getDay(); // 0 is Sunday, 1 is Monday
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const mMonth = monday.toLocaleDateString('en-US', { month: 'short' });
  const sMonth = sunday.toLocaleDateString('en-US', { month: 'short' });
  const mDay = monday.getDate();
  const sDay = sunday.getDate();
  const year = sunday.getFullYear();

  if (mMonth === sMonth) {
    return `${mMonth} ${mDay} - ${sDay}, ${year}`;
  }
  return `${mMonth} ${mDay} - ${sMonth} ${sDay}, ${year}`;
};

/**
 * Returns current week number of the year
 */
export const getLiveWeekNumber = (d: Date = new Date()): number => {
  const startOfYear = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((((d.getTime() - startOfYear.getTime()) / 86400000) + startOfYear.getDay() + 1) / 7);
};

/**
 * Compares date string with today's live date
 */
export const isToday = (dateStr: string): boolean => {
  return dateStr === getLiveDateString();
};

/**
 * Compares date string with yesterday's live date
 */
export const isYesterday = (dateStr: string): boolean => {
  return dateStr === getYesterdayDateString();
};

/**
 * Returns human-readable relative label or formatted date
 */
export const getRelativeDateLabel = (dateStr: string): string => {
  if (!dateStr) return '';
  if (isToday(dateStr)) return 'Today';
  if (isYesterday(dateStr)) return 'Yesterday';

  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }
  return dateStr;
};
