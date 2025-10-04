import {
  MedicineScheduleTypes,
  type MedicineForms,
} from "@/constants/medicines";

export interface MedicineData<DateType = Date> {
  title: string;
  form: MedicineForms;
  schedule: MedicationSchedule<DateType>;
  notes?: string;
}

export interface MedicineFromApi extends MedicineData<string> {
  id: number;
}

export interface MedicationSchedule<DateType = Date> {
  type: MedicineScheduleTypes;
  everyXDays: number; // 1...365, 0 for "Only as needed"
  notificationTimes: string[]; // 'HH:MM'
  userTimeZone: string; // e.g. "Europe/Berlin"
  nextDoseDate: DateType | null; // midnight date or null
  // For SPECIFIC_WEEK_DAYS, store selected week days as 0..6 (Sun..Sat)
  daysOfWeek?: number[];
  dose: number;
  endDate?: DateType | null;
}
