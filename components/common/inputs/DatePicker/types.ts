import type { StyleProp, ViewStyle } from "react-native";

export interface DatePickerProps {
  value?: Date | null;
  onChange: (value: Date | null) => void;
  minDate?: Date; // inclusive
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  allowSkip?: boolean; // show a clear/skip control
  showTodayButton?: boolean;
  onSkipClick?: () => void;
  error?: string | null;
  onBlur?: () => void;
}
