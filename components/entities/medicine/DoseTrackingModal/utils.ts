// import { format } from "date-fns";
import type { DoseRecord } from "@/types/doseTracking";
import { LanguageService } from "@/services/language/LanguageService";

/**
 * Formats a dose record's scheduled time for display
 */
export const formatDoseTime = (dose: DoseRecord): string => {
  const scheduledTime = new Date(dose.scheduledDateTime);
  return scheduledTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Formats a dose record's scheduled date for display
 */
export const formatDoseDate = (dose: DoseRecord): string => {
  const scheduledTime = new Date(dose.scheduledDateTime);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (scheduledTime.toDateString() === today.toDateString()) {
    return LanguageService.translate("Today");
  } else if (scheduledTime.toDateString() === yesterday.toDateString()) {
    return LanguageService.translate("Yesterday");
  } else {
    return scheduledTime.toLocaleDateString([], {
      month: "short",
      day: "2-digit",
    });
  }
};

/**
 * Gets the status text for a dose record
 */
export const getDoseStatusText = (status: DoseRecord["status"]): string => {
  switch (status) {
    case "taken":
      return LanguageService.translate("Taken");
    case "missed":
      return LanguageService.translate("Missed");
    case "rescheduled":
      return LanguageService.translate("Rescheduled");
    case "pending":
      return LanguageService.translate("Pending");
    default:
      return LanguageService.translate("Pending");
  }
};

/**
 * Checks if a dose is overdue
 */
export const isDoseOverdue = (dose: DoseRecord): boolean => {
  const scheduledTime = new Date(dose.scheduledDateTime);
  const now = new Date();
  return scheduledTime < now && dose.status === "pending";
};

/**
 * Gets the next available time slot for rescheduling (5-10 minutes from now)
 */
export const getNextAvailableTimeSlot = (): Date => {
  const now = new Date();
  const nextSlot = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes from now
  return nextSlot;
};

/**
 * Gets the maximum reschedule time (10 minutes from now)
 */
export const getMaxRescheduleTime = (): Date => {
  const now = new Date();
  const maxTime = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes from now
  return maxTime;
};
