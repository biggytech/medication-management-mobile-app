import { addDays } from "./addDays";
import { startOfDay } from "./startOfDay";

/**
 * Gets the Monday of the week for a given date
 * Monday is considered day 1 (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
 */
export const getMondayOfWeek = (date: Date): Date => {
  const dateCopy = startOfDay(new Date(date));
  const dayOfWeek = dateCopy.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // Calculate days to subtract to get to Monday
  // If it's Sunday (0), we go back 6 days to get Monday
  // If it's Monday (1), we go back 0 days
  // If it's Tuesday (2), we go back 1 day, etc.
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  return addDays(dateCopy, -daysToSubtract);
};
