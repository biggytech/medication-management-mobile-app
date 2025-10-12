import { type MedicineForms } from "@/constants/medicines";
import type { Schedule } from "@/types/common/schedules";

export interface MedicineData<DateType = Date> {
  title: string;
  form: MedicineForms;
  schedule: MedicineSchedule<DateType>;
  notes?: string;
}

export interface MedicineDataWithId<DateType = Date>
  extends MedicineData<DateType> {
  id: number;
}

export type MedicineFromApi = MedicineDataWithId<string>;

export type MedicineSchedule<DateType = Date> = Schedule<DateType>;
