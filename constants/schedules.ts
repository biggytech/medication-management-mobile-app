export enum ScheduleTypes {
  EVERY_DAY = "every_day",
  EVERY_OTHER_DAY = "every_other_day",
  EVERY_X_DAYS = "every_x_days",
  SPECIFIC_WEEK_DAYS = "specific_week_days",
  ONLY_AS_NEEDED = "only_as_needed",
}

export const SCHEDULE_TYPE_LABELS: {
  [K in ScheduleTypes]: string;
} = {
  [ScheduleTypes.EVERY_DAY]: "Every day",
  [ScheduleTypes.EVERY_OTHER_DAY]: "Every other day",
  [ScheduleTypes.EVERY_X_DAYS]: "Every X days",
  [ScheduleTypes.SPECIFIC_WEEK_DAYS]: "On specific days of the week",
  [ScheduleTypes.ONLY_AS_NEEDED]: "Only as needed",
};

export const DEFAULT_SCHEDULE_NOTIFICATION_TIME = "08:00";
