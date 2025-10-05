import type { MedicineSchedule } from "@/types/medicines";
import {
  DEFAULT_MEDICINE_NOTIFICATION_TIME,
  MedicineScheduleTypes,
} from "@/constants/medicines";
import { getDateWithTime } from "@/utils/date/getDateWithTime";
import { isNotNullish } from "@/utils/types/isNotNullish";
import { DAYS_IN_WEEK, MILLISECONDS_IN_DAY } from "@/constants/dates";

export class MedicineScheduleService {
  static getDefaultNextDoseDate() {
    return getDateWithTime(new Date(), DEFAULT_MEDICINE_NOTIFICATION_TIME);
  }

  static getDefaultSchedule() {
    return {
      type: MedicineScheduleTypes.EVERY_DAY,
      everyXDays: 1,
      notificationTimes: [DEFAULT_MEDICINE_NOTIFICATION_TIME],
      userTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      nextDoseDate: MedicineScheduleService.getDefaultNextDoseDate(),
      daysOfWeek: [],
    };
  }

  static getNextDoseDateForSchedule(schedule: MedicineSchedule): Date | null {
    switch (schedule.type) {
      case MedicineScheduleTypes.EVERY_DAY: {
        const { notificationTimes } = schedule;

        if (notificationTimes.length === 0) {
          throw new Error(
            "Notification time is required for every day schedule",
          );
        }

        const notificationTimesSorted = [...notificationTimes].sort();
        const todayDosesEpochs = notificationTimesSorted
          .map((time) => getDateWithTime(new Date(), time))
          .filter(isNotNullish)
          .map((date) => date.valueOf());

        const closestDoseDateEpoch = todayDosesEpochs.find(
          (epoch) => epoch > new Date().valueOf(),
        );

        if (closestDoseDateEpoch) {
          return new Date(closestDoseDateEpoch);
        }

        const tomorrow = new Date(new Date().valueOf() + MILLISECONDS_IN_DAY);
        return getDateWithTime(tomorrow, notificationTimesSorted[0]);
      }
      case MedicineScheduleTypes.EVERY_OTHER_DAY: {
        const { nextDoseDate, notificationTimes } = schedule;

        if (!nextDoseDate || notificationTimes.length === 0) {
          throw new Error(
            "Next dose date and notification time are required for every other day schedule",
          );
        }

        if (notificationTimes.length !== 1) {
          throw new Error(
            "Only one notification time is allowed for every other day schedule",
          );
        }

        return getDateWithTime(new Date(nextDoseDate), notificationTimes[0]);
      }
      case MedicineScheduleTypes.EVERY_X_DAYS: {
        const { nextDoseDate, notificationTimes, everyXDays } = schedule;

        if (!nextDoseDate || notificationTimes.length === 0 || !everyXDays) {
          throw new Error(
            "Next dose date, notification time, and interval are required for every X days schedule",
          );
        }

        if (notificationTimes.length !== 1) {
          throw new Error(
            "Only one notification time is allowed for every X days schedule",
          );
        }

        return getDateWithTime(new Date(nextDoseDate), notificationTimes[0]);
      }
      case MedicineScheduleTypes.SPECIFIC_WEEK_DAYS: {
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

        const today = new Date();
        const daysOfWeekSorted = daysOfWeek.sort();

        const currentWeekDay = today.getDay();

        const closestDoseWeekDay = daysOfWeekSorted.find(
          (weekDay) => weekDay >= currentWeekDay,
        );
        if (typeof closestDoseWeekDay !== "undefined") {
          const daysDiff = closestDoseWeekDay - currentWeekDay;
          const closestDoseDate = getDateWithTime(
            new Date(today.valueOf() + MILLISECONDS_IN_DAY * daysDiff),
            notificationTimes[0],
          );
          if (closestDoseDate > today) return closestDoseDate;
        }

        const nextClosestDoseWeekDay = daysOfWeekSorted.find(
          (weekDay) => weekDay > currentWeekDay,
        );
        if (typeof nextClosestDoseWeekDay !== "undefined") {
          const daysDiff = nextClosestDoseWeekDay - currentWeekDay;
          const closestDoseDate = getDateWithTime(
            new Date(today.valueOf() + MILLISECONDS_IN_DAY * daysDiff),
            notificationTimes[0],
          );
          if (closestDoseDate > today) return closestDoseDate;
        }

        const daysDiff = daysOfWeekSorted[0] + DAYS_IN_WEEK - currentWeekDay;
        return getDateWithTime(
          new Date(today.valueOf() + MILLISECONDS_IN_DAY * daysDiff),
          notificationTimes[0],
        );
      }
      case MedicineScheduleTypes.ONLY_AS_NEEDED:
      default:
        return null;
    }
  }

  static getScheduleForType(
    schedule: MedicineSchedule,
    type: MedicineScheduleTypes,
  ) {
    const base: MedicineSchedule = { ...schedule, type };
    if (type === MedicineScheduleTypes.EVERY_DAY) {
      base.notificationTimes = schedule.notificationTimes.length
        ? schedule.notificationTimes
        : [DEFAULT_MEDICINE_NOTIFICATION_TIME];
      base.nextDoseDate =
        base.nextDoseDate ?? MedicineScheduleService.getDefaultNextDoseDate();
      base.everyXDays = 1;
      base.daysOfWeek = [];
    } else if (type === MedicineScheduleTypes.EVERY_OTHER_DAY) {
      base.notificationTimes = [
        schedule.notificationTimes[0] || DEFAULT_MEDICINE_NOTIFICATION_TIME,
      ];
      base.nextDoseDate =
        base.nextDoseDate ?? MedicineScheduleService.getDefaultNextDoseDate();
      base.everyXDays = 2;
      base.daysOfWeek = [];
    } else if (type === MedicineScheduleTypes.EVERY_X_DAYS) {
      base.notificationTimes = [
        schedule.notificationTimes[0] || DEFAULT_MEDICINE_NOTIFICATION_TIME,
      ];
      base.nextDoseDate =
        base.nextDoseDate ?? MedicineScheduleService.getDefaultNextDoseDate();
      base.everyXDays = Math.min(Math.max(schedule.everyXDays || 1, 1), 365);
      base.daysOfWeek = [];
    } else if (type === MedicineScheduleTypes.SPECIFIC_WEEK_DAYS) {
      base.notificationTimes = [
        schedule.notificationTimes[0] || DEFAULT_MEDICINE_NOTIFICATION_TIME,
      ];
      base.nextDoseDate =
        base.nextDoseDate ?? MedicineScheduleService.getDefaultNextDoseDate();
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
