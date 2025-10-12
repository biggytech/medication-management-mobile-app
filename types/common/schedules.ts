import { ScheduleTypes } from "@/constants/schedules";

export interface Schedule<DateType = Date> {
  type: ScheduleTypes;
  everyXDays: number; // 1...365, 0 for "Only as needed"
  notificationTimes: string[]; // 'HH:MM'
  userTimeZone: string; // e.g. "Europe/Berlin"
  nextTakeDate: DateType | null;
  // For SPECIFIC_WEEK_DAYS, store selected week days as 0..6 (Sun..Sat)
  daysOfWeek?: number[];
  endDate?: DateType | null;
}

export interface SchedulableEntity<DateType = Date> {
  schedule: Schedule<DateType>;
}
