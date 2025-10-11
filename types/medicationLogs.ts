import type { MedicineFromApi } from "@/types/medicines";

export enum DoseStatus {
  TAKEN = "taken",
  MISSED = "missed",
  RESCHEDULED = "rescheduled",
  PENDING = "pending",
}

export enum MissedDoseReason {
  FORGOT = "forgot",
  RAN_OUT = "ran_out",
  NO_NEED = "no_need",
  SIDE_EFFECTS = "side_effects",
  COST_CONCERNS = "cost_concerns",
  NOT_AVAILABLE = "not_available",
  OTHER = "other",
}

export enum MedicationLogTypes {
  TAKEN = "taken",
  SKIPPED = "skipped",
}

export interface MedicationLogData<DateType = Date> {
  date: DateType;
  type: MedicationLogTypes;
}

export interface MedicationLogDataWithId<DateType = Date>
  extends MedicationLogData<DateType> {
  id: number;
}

export type MedicationLogDataForInsert = Pick<MedicationLogData, "date">;
export interface MedicationLogFromApi extends MedicationLogDataWithId<string> {
  medicine: MedicineFromApi;
}

export interface DoseRecord {
  id: number;
  medicineId: MedicineFromApi["id"];
  scheduledDateTime: string; // ISO string
  actualDateTime?: string; // ISO string - when actually taken
  status: DoseStatus;
  missedReason?: MissedDoseReason;
  rescheduledTo?: string; // ISO string - when rescheduled to
  notes?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface DoseTrackingData {
  medicineId: number;
  lastDose?: DoseRecord;
  nextDose?: DoseRecord;
  todayDoses: DoseRecord[];
  overdueDoses: DoseRecord[];
}

export interface SkipDoseRequest {
  medicineId: number;
  reason: MissedDoseReason;
  notes?: string;
}

export interface RescheduleDoseRequest {
  medicineId: number;
  rescheduledTo: string; // ISO string
  notes?: string;
}

export interface CancelDoseRequest {
  doseId: number;
}
