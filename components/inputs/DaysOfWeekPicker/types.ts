export interface DaysOfWeekPickerProps {
  values: number[]; // 0..6 (Sun..Sat)
  onChange: (values: number[]) => void;
}
