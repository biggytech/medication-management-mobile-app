import * as yup from "yup";
import { LanguageService } from "@/services/language/LanguageService";
import { MedicineScheduleTypes, MedicineForms } from "@/constants/medicines";

export const getTitleSchema = () =>
  yup
    .string()
    .required(LanguageService.translate("Title is required"))
    .max(
      255,
      LanguageService.translate("Title cannot be long than 255 characters"),
    );

export const getFormSchema = () =>
  yup
    .string()
    .required(LanguageService.translate("Form is required"))
    .oneOf(Object.values(MedicineForms));

export const getDoseSchema = () =>
  yup
    .number()
    .typeError(LanguageService.translate("Dose is required"))
    .required(LanguageService.translate("Dose is required"))
    .min(1, LanguageService.translate("Dose should be between 1 and 100"))
    .max(100, LanguageService.translate("Dose should be between 1 and 100"));

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

export const getNotesSchema = () =>
  yup
    .string()
    .nullable()
    .max(
      255,
      LanguageService.translate("Notes cannot be long than 255 characters"),
    );

export const getNewMedicineTitleSchema = () =>
  yup.object().shape({
    title: getTitleSchema(),
  });

export const getNewMedicineFormSchema = () =>
  yup.object().shape({
    form: getFormSchema(),
  });

export const getNewMedicineDoseSchema = () =>
  yup.object().shape({
    schedule: yup.object().shape({
      dose: getDoseSchema(),
    }),
  });

export const getNewMedicineEndDateSchema = () =>
  yup.object().shape({
    schedule: yup.object().shape({
      endDate: getOptionalEndDateSchema(),
    }),
  });

// Schedule validation
const isValidTime = (val?: unknown) =>
  typeof val === "string" && /^\d{2}:\d{2}$/.test(val);

export const getScheduleSchema = () =>
  yup
    .object()
    .shape({
      type: yup
        .mixed<MedicineScheduleTypes>()
        .oneOf(Object.values(MedicineScheduleTypes))
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
      nextDoseDate: yup.date().nullable(),
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
          nextDoseDate,
          daysOfWeek,
        } = val as any;

        if (type === MedicineScheduleTypes.ONLY_AS_NEEDED) {
          return (
            everyXDays === 0 &&
            (!notificationTimes || notificationTimes.length === 0) &&
            nextDoseDate === null
          );
        }

        if (!notificationTimes || notificationTimes.length === 0) return false;

        switch (type) {
          case MedicineScheduleTypes.EVERY_DAY:
            return (
              notificationTimes.length >= 1 && notificationTimes.length <= 12
            );
          case MedicineScheduleTypes.EVERY_OTHER_DAY:
            return !!nextDoseDate && notificationTimes.length === 1;
          case MedicineScheduleTypes.EVERY_X_DAYS:
            return (
              !!nextDoseDate &&
              everyXDays >= 1 &&
              everyXDays <= 365 &&
              notificationTimes.length === 1
            );
          case MedicineScheduleTypes.SPECIFIC_WEEK_DAYS:
            return (
              Array.isArray(daysOfWeek) &&
              daysOfWeek.length > 0 &&
              notificationTimes.length === 1
            );
        }
        return false;
      },
    );

export const getNewMedicineScheduleSchema = () =>
  yup.object().shape({
    schedule: getScheduleSchema(),
  });

export const getNewMedicineNotesSchema = () =>
  yup.object().shape({
    notes: getNotesSchema(),
  });
