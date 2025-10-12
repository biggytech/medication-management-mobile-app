import type { MedicineFromApi } from "@/types/medicines";
import { isOverdue } from "@/utils/entities/medicine/isOverdue";
import { isDueToday } from "@/utils/schedules/isDueToday";

export const isDueOrOverdueToday = (medicine: MedicineFromApi) => {
  return isDueToday(medicine) || isOverdue(medicine);
};
