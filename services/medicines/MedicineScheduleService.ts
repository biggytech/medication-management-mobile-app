import type { MedicationSchedule } from "@/types/medicines";
import {
  DEFAULT_MEDICINE_NOTIFICATION_TIME,
  MedicineScheduleTypes,
} from "@/constants/medicines";

export class MedicineScheduleService {
  static getDefaultSchedule() {
    return {
      type: MedicineScheduleTypes.EVERY_DAY,
      everyXDays: 1,
      notificationTimes: [DEFAULT_MEDICINE_NOTIFICATION_TIME],
      userTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      nextDoseDate: null,
      daysOfWeek: [],
    };
  }

  static getScheduleForType(
    schedule: MedicationSchedule,
    type: MedicineScheduleTypes,
  ) {
    const base: MedicationSchedule = { ...schedule, type };
    if (type === MedicineScheduleTypes.EVERY_DAY) {
      base.notificationTimes = schedule.notificationTimes.length
        ? schedule.notificationTimes
        : [DEFAULT_MEDICINE_NOTIFICATION_TIME];
      base.nextDoseDate = null;
      base.everyXDays = 1;
      base.daysOfWeek = [];
    } else if (type === MedicineScheduleTypes.EVERY_OTHER_DAY) {
      base.notificationTimes = [
        schedule.notificationTimes[0] || DEFAULT_MEDICINE_NOTIFICATION_TIME,
      ];
      base.nextDoseDate = base.nextDoseDate ?? new Date();
      base.everyXDays = 2;
      base.daysOfWeek = [];
    } else if (type === MedicineScheduleTypes.EVERY_X_DAYS) {
      base.notificationTimes = [
        schedule.notificationTimes[0] || DEFAULT_MEDICINE_NOTIFICATION_TIME,
      ];
      base.nextDoseDate = base.nextDoseDate ?? new Date();
      base.everyXDays = Math.min(Math.max(schedule.everyXDays || 1, 1), 365);
      base.daysOfWeek = [];
    } else if (type === MedicineScheduleTypes.SPECIFIC_WEEK_DAYS) {
      base.notificationTimes = [
        schedule.notificationTimes[0] || DEFAULT_MEDICINE_NOTIFICATION_TIME,
      ];
      base.nextDoseDate = null;
      base.everyXDays = 1;
      base.daysOfWeek = schedule.daysOfWeek?.length ? schedule.daysOfWeek : [1];
    } else if (type === MedicineScheduleTypes.ONLY_AS_NEEDED) {
      base.notificationTimes = [];
      base.nextDoseDate = null;
      base.everyXDays = 0;
      base.daysOfWeek = [];
    }

    return base;
  }
}
