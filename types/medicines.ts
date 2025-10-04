import {
  MedicineScheduleTypes,
  type MedicineForms,
} from "@/constants/medicines";

export interface MedicineData {
  title: string;
  form: MedicineForms;
  schedule: MedicationSchedule;
  notes?: string;
}

export interface Medicine extends MedicineData {
  id: number;
}

export interface MedicationSchedule {
  type: MedicineScheduleTypes;
  everyXDays: number; // 1...365, 0 for "Only as needed"
  notificationTimes: string[]; // 'HH:MM'
  userTimeZone: string; // e.g. "Europe/Berlin"
  nextDoseDate: Date | null; // midnight date or null
  // For SPECIFIC_WEEK_DAYS, store selected week days as 0..6 (Sun..Sat)
  daysOfWeek?: number[];
  dose: number;
  endDate?: Date | null;
}
