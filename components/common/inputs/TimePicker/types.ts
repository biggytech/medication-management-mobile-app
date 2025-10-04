export interface TimePickerProps {
  value: string | null; // 'HH:MM' 24-hour
  onChange: (value: string | null) => void;
  placeholder?: string;
  allowClear?: boolean;
  error?: string | null;
  onBlur?: () => void;
  label?: string;
  minuteStep?: number; // Time interval in minutes (default: 15)
}
