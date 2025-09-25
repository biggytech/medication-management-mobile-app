export enum MedicineForms {
  TABLET = "tablet",
  INJECTION = "injection",
  SOLUTION = "solution",
  DROPS = "drops",
  INHALER = "inhaler",
  POWDER = "powder",
  OTHER = "other",
}

export enum MedicineScheduleTypes {
  EVERY_DAY = "every_day",
  EVERY_OTHER_DAY = "every_other_day",
  EVERY_X_DAYS = "every_x_days",
  SPECIFIC_WEEK_DAYS = "specific_week_days",
  ONLY_AS_NEEDED = "only_as_needed",
}

export const MEDICINE_SCHEDULE_TYPE_LABELS: {
  [K in MedicineScheduleTypes]: string;
} = {
  [MedicineScheduleTypes.EVERY_DAY]: "Every day",
  [MedicineScheduleTypes.EVERY_OTHER_DAY]: "Every other day",
  [MedicineScheduleTypes.EVERY_X_DAYS]: "Every X days",
  [MedicineScheduleTypes.SPECIFIC_WEEK_DAYS]: "On specific days of the week",
  [MedicineScheduleTypes.ONLY_AS_NEEDED]: "Only as needed",
};

export const DEFAULT_MEDICINE_NOTIFICATION_TIME = "08:00";
