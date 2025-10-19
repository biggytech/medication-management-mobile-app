import { hhmmFromDate } from "./hhmmFromDate";

/**
 * Format a date to display time in HH:MM format
 * @param date - The date to format
 * @returns Formatted time string (HH:MM)
 */
export const formatTime = (date: Date): string => {
  return hhmmFromDate(date);
};
