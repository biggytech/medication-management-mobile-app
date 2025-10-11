import type { MedicineFromApi } from "@/types/medicines";

export enum MedicationLogTypes {
  TAKEN = "taken",
  SKIPPED = "skipped",
}

export enum MedicationLogSkipReasons {
  FORGOT = "forgot",
  RAN_OUT = "ran_out",
  NO_NEED = "no_need",
  SIDE_EFFECTS = "side_effects",
  COST_CONCERNS = "cost_concerns",
  NOT_AVAILABLE = "not_available",
  OTHER = "other",
}

export interface MedicationLogData<DateType = Date> {
  date: DateType;
  type: MedicationLogTypes;
  skipReason?: MedicationLogSkipReasons | null;
}

export interface MedicationLogDataWithId<DateType = Date>
  extends MedicationLogData<DateType> {
  id: number;
}

export type MedicationLogDataForInsert = Omit<MedicationLogData, "type">;
export interface MedicationLogFromApi extends MedicationLogDataWithId<string> {
  medicine: MedicineFromApi;
}
