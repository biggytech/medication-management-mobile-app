import {
  MedicationScheduleOption,
  type MedicineForms,
} from "@/constants/medicines";

export interface NewMedicine {
  title: string;
  form: MedicineForms;
  setting: {
    dose: number;
    endDate?: Date | null;
    schedule: MedicationSchedule;
  };
}

export interface Medicine extends NewMedicine {
  id: number;
}

export interface MedicationSchedule {
  type: MedicationScheduleOption;
  everyXDays: number; // 1...365, 0 for "Only as needed"
  notificationTimes: string[]; // 'HH:MM'
  userTimeZone: string; // e.g. "Europe/Berlin"
  nextDoseDate: Date | null; // midnight date or null
  // For SPECIFIC_WEEK_DAYS, store selected week days as 0..6 (Sun..Sat)
  daysOfWeek?: number[];
}
