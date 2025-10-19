import { ddmmyyyyFromDate } from "./ddmmyyyyFromDate";
import { hhmmFromDate } from "./hhmmFromDate";

/**
 * Format a date to display in a user-friendly format
 * Shows relative time for recent dates, full date for older ones
 * @param date - The date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const inputDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  if (inputDate.getTime() === today.getTime()) {
    // Today - show time
    return hhmmFromDate(date);
  } else if (inputDate.getTime() === yesterday.getTime()) {
    // Yesterday
    return "Yesterday";
  } else {
    // Older dates - show full date
    return ddmmyyyyFromDate(date);
  }
};
