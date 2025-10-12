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
      nextTakeDate: medicine.schedule.nextTakeDate
        ? new Date(medicine.schedule.nextTakeDate)
        : null,
    },
    notes: medicine.notes || "",
  };
};
