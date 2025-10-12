import { yyyymmddFromDate } from "@/utils/date/yyyymmddFromDate";
import type { SchedulableEntity } from "@/types/common/schedules";

export const isEndingToday = (entity: SchedulableEntity<string>) => {
  const {
    schedule: { endDate },
  } = entity;

  if (!endDate) return false;

  const endDateAsDate = new Date(endDate);

  const endDateFormatted = yyyymmddFromDate(endDateAsDate);
  const todayDateFormatted = yyyymmddFromDate(new Date());

  return endDateFormatted === todayDateFormatted;
};
