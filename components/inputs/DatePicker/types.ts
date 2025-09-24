import type { ViewStyle } from "react-native";

export interface DatePickerProps {
  value?: Date | null;
  onChange: (value: Date | null) => void;
  minDate?: Date; // inclusive
  placeholder?: string;
  style?: ViewStyle;
  allowClear?: boolean; // show a clear/skip control
}
