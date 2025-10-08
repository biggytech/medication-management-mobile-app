import type { MedicineFromApi } from "@/types/medicines";
import { yyyymmddFromDate } from "@/utils/date/yyyymmddFromDate";

export const isEndingToday = (medicine: MedicineFromApi) => {
  const {
    schedule: { endDate },
  } = medicine;

  if (!endDate) return false;

  const endDateAsDate = new Date(endDate);

  const endDateFormatted = yyyymmddFromDate(endDateAsDate);
  const todayDateFormatted = yyyymmddFromDate(new Date());

  return endDateFormatted === todayDateFormatted;
};
