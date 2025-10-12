import { type MedicineForms } from "@/constants/medicines";
import type { SchedulableEntity, Schedule } from "@/types/common/schedules";
import { NotableEntity } from "@/types/common/notes";
import { IdableEntity } from "@/types/common/ids";

export interface MedicineData<DateType = Date>
  extends SchedulableEntity<DateType>,
    NotableEntity {
  title: string;
  form: MedicineForms;
  schedule: MedicineSchedule<DateType>;
}

export type MedicineDataWithId<DateType = Date> = MedicineData<DateType> &
  IdableEntity;

export type MedicineFromApi = MedicineDataWithId<string>;

export interface MedicineSchedule<DateType = Date> extends Schedule<DateType> {
  dose: number;
}
