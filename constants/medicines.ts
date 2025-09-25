export enum MedicineForms {
  TABLET = "tablet",
  INJECTION = "injection",
  SOLUTION = "solution",
  DROPS = "drops",
  INHALER = "inhaler",
  POWDER = "powder",
  OTHER = "other",
}

export enum MedicationScheduleOption {
  EVERY_DAY = "Every day",
  EVERY_OTHER_DAY = "Every other day",
  EVERY_X_DAYS = "Every X days",
  SPECIFIC_WEEK_DAYS = "On specific days of the week",
  ONLY_AS_NEEDED = "Only as needed",
}

export const DEFAULT_MEDICINE_NOTIFICATION_TIME = "08:00";
