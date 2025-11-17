import { LanguageService } from "@/services/language/LanguageService";
import { DAY_NAMES, MONTH_NAMES } from "./constants";
import type { DayData } from "./types";

/**
 * Generates an array of 7 consecutive days starting from the given start date
 * If no start date is provided, defaults to 6 days ago (so today is the last day)
 */
export function generateLast7Days(startDate?: Date): Date[] {
  const today = new Date();
  const baseDate =
    startDate ||
    (() => {
      const date = new Date(today);
      date.setDate(today.getDate() - 6);
      return date;
    })();

  const days: Date[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i);
    days.push(date);
  }

  return days;
}

/**
 * Creates day data for the Last7Days component
 */
export function createDayData(date: Date, activeDate: Date): DayData {
  const today = new Date();
  const isToday = isSameDay(date, today);
  const isActive = isSameDay(date, activeDate);

  return {
    date,
    dayName: DAY_NAMES[date.getDay()],
    dayNumber: date.getDate(),
    isActive,
    isToday,
  };
}

/**
 * Checks if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Gets the relative date text (Today, Yesterday, or formatted date)
 */
export function getRelativeDateText(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) {
    return LanguageService.translate("Today");
  }

  if (isSameDay(date, yesterday)) {
    return LanguageService.translate("Yesterday");
  }

  // Format as "Day, Month" (e.g., "6 Oct")
  const day = date.getDate();
  const monthName = LanguageService.translate(MONTH_NAMES[date.getMonth()]);

  return `${day} ${monthName}`;
}

/**
 * Gets the translated day name
 */
export function getTranslatedDayName(dayName: string): string {
  return LanguageService.translate(dayName);
}
