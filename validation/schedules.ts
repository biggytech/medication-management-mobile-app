import * as yup from "yup";
import { ScheduleTypes } from "@/constants/schedules";
import { LanguageService } from "@/services/language/LanguageService";

// Schedule validation
const isValidTime = (val?: unknown) =>
  typeof val === "string" && /^\d{2}:\d{2}$/.test(val);

export const getScheduleSchema = () =>
  yup
    .object()
    .shape({
      type: yup
        .mixed<ScheduleTypes>()
        .oneOf(Object.values(ScheduleTypes))
        .required(),
      everyXDays: yup.number().required().min(0).max(365),
      notificationTimes: yup
        .array()
        .of(
          yup
            .string()
            .test(
              "time-format",
              LanguageService.translate("Invalid time format"),
              (v) => isValidTime(v),
            ),
        )
        .required(),
      userTimeZone: yup.string().required(),
      nextTakeDate: yup.date().nullable(),
      daysOfWeek: yup.array().of(yup.number().min(0).max(6)),
    })
    .test(
      "by-type",
      LanguageService.translate("Schedule data is invalid"),
      (val) => {
        if (!val) return false;
        const {
          type,
          everyXDays,
          notificationTimes,
          nextTakeDate,
          daysOfWeek,
        } = val as any;

        if (type === ScheduleTypes.ONLY_AS_NEEDED) {
          return (
            everyXDays === 0 &&
            (!notificationTimes || notificationTimes.length === 0) &&
            nextTakeDate === null
          );
        }

        if (!notificationTimes || notificationTimes.length === 0) return false;

        switch (type) {
          case ScheduleTypes.EVERY_DAY:
            return (
              notificationTimes.length >= 1 && notificationTimes.length <= 12
            );
          case ScheduleTypes.EVERY_OTHER_DAY:
            return !!nextTakeDate && notificationTimes.length === 1;
          case ScheduleTypes.EVERY_X_DAYS:
            return (
              !!nextTakeDate &&
              everyXDays >= 1 &&
              everyXDays <= 365 &&
              notificationTimes.length === 1
            );
          case ScheduleTypes.SPECIFIC_WEEK_DAYS:
            return (
              Array.isArray(daysOfWeek) &&
              daysOfWeek.length > 0 &&
              notificationTimes.length === 1
            );
        }
        return false;
      },
    );

export const getSchedulableEntityScheduleSchema = () =>
  yup.object().shape({
    schedule: getScheduleSchema(),
  });

const getTodayAtMidnight = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const getOptionalEndDateSchema = () =>
  yup
    .date()
    .nullable()
    .min(
      getTodayAtMidnight(),
      LanguageService.translate("End date cannot be in the past"),
    );

export const getSchedulableEntityEndDateSchema = () =>
  yup.object().shape({
    schedule: yup.object().shape({
      endDate: getOptionalEndDateSchema(),
    }),
  });
