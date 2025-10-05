import {
  type MedicineForms,
  MedicineScheduleTypes,
} from "@/constants/medicines";

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

export interface MedicineSchedule<DateType = Date> {
  type: MedicineScheduleTypes;
  everyXDays: number; // 1...365, 0 for "Only as needed"
  notificationTimes: string[]; // 'HH:MM'
  userTimeZone: string; // e.g. "Europe/Berlin"
  nextDoseDate: DateType | null; // TODO: rename to nextDoseDateTime?
  // For SPECIFIC_WEEK_DAYS, store selected week days as 0..6 (Sun..Sat)
  daysOfWeek?: number[];
  dose: number;
  endDate?: DateType | null;
}
