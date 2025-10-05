import type { MedicineFromApi } from "@/types/medicines";

export const isDoseOverdue = (medicine: MedicineFromApi) => {
  const {
    schedule: { nextDoseDate },
  } = medicine;

  if (!nextDoseDate) return false;

  const nextDoseDateAsDate = new Date(nextDoseDate);

  return nextDoseDateAsDate < new Date();
};
