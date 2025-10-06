export interface Last7DaysProps {
  activeDate: Date;
  onActiveDateChange: (date: Date) => void;
}

export interface DayData {
  date: Date;
  dayName: string;
  dayNumber: number;
  isActive: boolean;
  isToday: boolean;
}
