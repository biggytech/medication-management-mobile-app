import { yyyymmddFromDate } from "@/utils/date/yyyymmddFromDate";
import type { SchedulableEntity } from "@/types/common/schedules";

export const isDueToday = ({ schedule }: SchedulableEntity<string>) => {
  const { nextTakeDate } = schedule;

  if (!nextTakeDate) return false;

  const nextTakeDateAsDate = new Date(nextTakeDate);

  const nextTakeDateFormatted = yyyymmddFromDate(nextTakeDateAsDate);
  const todayDateFormatted = yyyymmddFromDate(new Date());

  return nextTakeDateFormatted === todayDateFormatted;
};
