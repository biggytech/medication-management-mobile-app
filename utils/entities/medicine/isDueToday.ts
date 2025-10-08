import type { MedicineFromApi } from "@/types/medicines";
import { yyyymmddFromDate } from "@/utils/date/yyyymmddFromDate";

export const isDueToday = (medicine: MedicineFromApi) => {
  const {
    schedule: { nextDoseDate },
  } = medicine;

  if (!nextDoseDate) return false;

  const nextDoseDateAsDate = new Date(nextDoseDate);

  const nextDoseDateFormatted = yyyymmddFromDate(nextDoseDateAsDate);
  const todayDateFormatted = yyyymmddFromDate(new Date());

  return nextDoseDateFormatted === todayDateFormatted;
};
