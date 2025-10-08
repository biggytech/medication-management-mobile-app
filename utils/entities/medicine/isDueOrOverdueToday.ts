import type { MedicineFromApi } from "@/types/medicines";
import { isOverdue } from "@/utils/entities/medicine/isOverdue";
import { isDueToday } from "@/utils/entities/medicine/isDueToday";

export const isDueOrOverdueToday = (medicine: MedicineFromApi) => {
  return isDueToday(medicine) || isOverdue(medicine);
};
