import type { MedicineSchedule } from "@/types/medicines";
import { getDateWithTime } from "@/utils/date/getDateWithTime";
import { DAYS_IN_WEEK, MILLISECONDS_IN_DAY } from "@/constants/dates";
import { addDays } from "@/utils/date/addDays";
import { startOfDay } from "@/utils/date/startOfDay";
import { getClosestTodayDoseDate } from "@/utils/entities/medicine/getClosestTodayDoseDate";
import {
  DEFAULT_SCHEDULE_NOTIFICATION_TIME,
  ScheduleTypes,
} from "@/constants/schedules";

export class MedicineScheduleService {
  static getDefaultNextDoseDate() {
    return getDateWithTime(new Date(), DEFAULT_SCHEDULE_NOTIFICATION_TIME);
  }

  static getDefaultSchedule() {
    return {
      type: ScheduleTypes.EVERY_DAY,
      everyXDays: 1,
      notificationTimes: [DEFAULT_SCHEDULE_NOTIFICATION_TIME],
      userTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      nextDoseDate: MedicineScheduleService.getDefaultNextDoseDate(),
      daysOfWeek: [],
    };
  }

  static getNextDoseDateForSchedule(
    schedule: MedicineSchedule,
    takenDate?: Date,
  ): Date | null {
    switch (schedule.type) {
      case ScheduleTypes.EVERY_DAY: {
        const { notificationTimes, nextDoseDate } = schedule;

        const fromDate = takenDate ? (nextDoseDate ?? takenDate) : new Date();

        if (notificationTimes.length === 0) {
          throw new Error(
            "Notification time is required for every day schedule",
          );
        }

        const notificationTimesSorted = [...notificationTimes].sort();

        const closestTodayDoseDate = getClosestTodayDoseDate(
          schedule,
          fromDate,
        );

        if (closestTodayDoseDate) {
          return closestTodayDoseDate;
        }

        const dayAfter = addDays(new Date(), 1);
        return getDateWithTime(dayAfter, notificationTimesSorted[0]);
      }
      case ScheduleTypes.EVERY_OTHER_DAY: {
        const { notificationTimes } = schedule;

        if (!schedule.nextDoseDate || notificationTimes.length === 0) {
          throw new Error(
            "Next dose date and notification time are required for every other day schedule",
          );
        }

        if (notificationTimes.length !== 1) {
          throw new Error(
            "Only one notification time is allowed for every other day schedule",
          );
        }

        const nextDoseDate = takenDate
          ? startOfDay(addDays(takenDate, 2))
          : schedule.nextDoseDate;

        return getDateWithTime(new Date(nextDoseDate), notificationTimes[0]);
      }
      case ScheduleTypes.EVERY_X_DAYS: {
        const { notificationTimes, everyXDays } = schedule;

        if (
          !schedule.nextDoseDate ||
          notificationTimes.length === 0 ||
          !everyXDays
        ) {
          throw new Error(
            "Next dose date, notification time, and interval are required for every X days schedule",
          );
        }

        if (notificationTimes.length !== 1) {
          throw new Error(
            "Only one notification time is allowed for every X days schedule",
          );
        }

        const nextDoseDate = takenDate
          ? startOfDay(addDays(takenDate, everyXDays))
          : schedule.nextDoseDate;

        return getDateWithTime(new Date(nextDoseDate), notificationTimes[0]);
      }
      case ScheduleTypes.SPECIFIC_WEEK_DAYS: {
        const { daysOfWeek, notificationTimes } = schedule;

        if (
          !daysOfWeek ||
          daysOfWeek.length === 0 ||
          notificationTimes.length === 0
        ) {
          throw new Error(
            "Days of week and notification time are required for specific week days schedule",
          );
        }

        if (notificationTimes.length !== 1) {
          throw new Error(
            "Only one notification time is allowed for specific week days schedule",
          );
        }

        const startFromDate = takenDate
          ? getDateWithTime(takenDate, notificationTimes[0])
          : new Date();
        const daysOfWeekSorted = daysOfWeek.sort();

        const startFromDateWeekDay = startFromDate.getDay();

        const closestDoseWeekDay = daysOfWeekSorted.find(
          (weekDay) => weekDay >= startFromDateWeekDay,
        );
        if (typeof closestDoseWeekDay !== "undefined") {
          const daysDiff = closestDoseWeekDay - startFromDateWeekDay;
          const closestDoseDate = getDateWithTime(
            new Date(startFromDate.valueOf() + MILLISECONDS_IN_DAY * daysDiff),
            notificationTimes[0],
          );
          if (closestDoseDate > startFromDate) return closestDoseDate;
        }

        const nextClosestDoseWeekDay = daysOfWeekSorted.find(
          (weekDay) => weekDay > startFromDateWeekDay,
        );
        if (typeof nextClosestDoseWeekDay !== "undefined") {
          const daysDiff = nextClosestDoseWeekDay - startFromDateWeekDay;
          const closestDoseDate = getDateWithTime(
            new Date(startFromDate.valueOf() + MILLISECONDS_IN_DAY * daysDiff),
            notificationTimes[0],
          );
          if (closestDoseDate > startFromDate) return closestDoseDate;
        }

        const daysDiff =
          daysOfWeekSorted[0] + DAYS_IN_WEEK - startFromDateWeekDay;
        return getDateWithTime(
          new Date(startFromDate.valueOf() + MILLISECONDS_IN_DAY * daysDiff),
          notificationTimes[0],
        );
      }
      case ScheduleTypes.ONLY_AS_NEEDED:
      default:
        return null;
    }
  }

  static getScheduleForType(schedule: MedicineSchedule, type: ScheduleTypes) {
    const base: MedicineSchedule = { ...schedule, type };
    if (type === ScheduleTypes.EVERY_DAY) {
      base.notificationTimes = schedule.notificationTimes.length
        ? schedule.notificationTimes
        : [DEFAULT_SCHEDULE_NOTIFICATION_TIME];
      base.nextDoseDate =
        base.nextDoseDate ?? MedicineScheduleService.getDefaultNextDoseDate();
      base.everyXDays = 1;
      base.daysOfWeek = [];
    } else if (type === ScheduleTypes.EVERY_OTHER_DAY) {
      base.notificationTimes = [
        schedule.notificationTimes[0] || DEFAULT_SCHEDULE_NOTIFICATION_TIME,
      ];
      base.nextDoseDate =
        base.nextDoseDate ?? MedicineScheduleService.getDefaultNextDoseDate();
      base.everyXDays = 2;
      base.daysOfWeek = [];
    } else if (type === ScheduleTypes.EVERY_X_DAYS) {
      base.notificationTimes = [
        schedule.notificationTimes[0] || DEFAULT_SCHEDULE_NOTIFICATION_TIME,
      ];
      base.nextDoseDate =
        base.nextDoseDate ?? MedicineScheduleService.getDefaultNextDoseDate();
      base.everyXDays = Math.min(Math.max(schedule.everyXDays || 1, 1), 365);
      base.daysOfWeek = [];
    } else if (type === ScheduleTypes.SPECIFIC_WEEK_DAYS) {
      base.notificationTimes = [
        schedule.notificationTimes[0] || DEFAULT_SCHEDULE_NOTIFICATION_TIME,
      ];
      base.nextDoseDate =
        base.nextDoseDate ?? MedicineScheduleService.getDefaultNextDoseDate();
      base.everyXDays = 1;
      base.daysOfWeek = schedule.daysOfWeek?.length ? schedule.daysOfWeek : [1];
    } else if (type === ScheduleTypes.ONLY_AS_NEEDED) {
      base.notificationTimes = [];
      base.nextDoseDate = null;
      base.everyXDays = 0;
      base.daysOfWeek = [];
    }

    return base;
  }
}
