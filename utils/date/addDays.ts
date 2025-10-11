import { MILLISECONDS_IN_DAY } from "@/constants/dates";

export const addDays = (date: Date, daysCount: number) => {
  return new Date(date.valueOf() + MILLISECONDS_IN_DAY * daysCount);
};
