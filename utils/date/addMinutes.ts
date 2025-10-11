import { MILLISECONDS_IN_MINUTE } from "@/constants/dates";

export const addMinutes = (date: Date, minutesCount: number) => {
  return new Date(date.valueOf() + MILLISECONDS_IN_MINUTE * minutesCount);
};
