/**
 * Date utility functions
 * Centralizes date-related operations
 */

/**
 * Day names array (Sunday = 0, Saturday = 6)
 */
export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

/**
 * Calculates the ISO week number for a given date
 * @param date - The date to calculate week number for
 * @returns The week number (1-53)
 */
export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/**
 * Gets the weekday name for a given date
 * @param date - The date to get weekday for
 * @returns The weekday name (e.g., "Monday", "Tuesday")
 */
export function getWeekdayName(date: Date): string {
  return DAY_NAMES[date.getDay()];
}

/**
 * Calculates the start and end dates of a week for a given date
 * @param date - The date within the week
 * @returns Object with startDate and endDate
 */
export function getWeekDates(date: Date): { startDate: Date; endDate: Date } {
  const startDate = new Date(date);
  startDate.setDate(date.getDate() - date.getDay());
  
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  
  return { startDate, endDate };
}

/**
 * Normalizes a date to ISO string format
 * Handles both Date objects and ISO strings
 * @param date - Date to normalize
 * @returns ISO string representation
 */
export function normalizeDate(date: Date | string): string {
  if (date instanceof Date) {
    return date.toISOString();
  }
  return date;
}

/**
 * Converts various date formats to Date object
 * @param date - Date in various formats
 * @returns Date object
 */
export function toDate(date: Date | string | number): Date {
  if (date instanceof Date) {
    return date;
  }
  return new Date(date);
}
