import type { MedicineFromApi } from "@/types/medicines";

export const isMedicine = (item: any): item is MedicineFromApi => {
  return Boolean(item.form);
};
