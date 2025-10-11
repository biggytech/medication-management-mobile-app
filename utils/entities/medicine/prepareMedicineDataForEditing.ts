import type { MedicineData, MedicineFromApi } from "@/types/medicines";

export const prepareMedicineDataForEditing = (
  medicine: MedicineFromApi,
): MedicineData => {
  return {
    ...medicine,
    schedule: {
      ...medicine.schedule,
      endDate: medicine.schedule.endDate
        ? new Date(medicine.schedule.endDate)
        : null,
      nextDoseDate: medicine.schedule.nextDoseDate
        ? new Date(medicine.schedule.nextDoseDate)
        : null,
    },
    notes: medicine.notes || "",
  };
};
