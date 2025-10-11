import type { MedicationLogFromApi } from "@/types/medicationLogs";

export const isMedicationLog = (item: any): item is MedicationLogFromApi => {
  return Boolean(item.medicine);
};
