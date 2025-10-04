import type { StyleProp, ViewStyle } from "react-native";

export interface TimesEditorProps {
  values: string[]; // 'HH:MM'
  onChange: (values: string[]) => void;
  min?: number;
  max?: number;
  allowDuplicates?: boolean;
  label?: string;
  style?: StyleProp<ViewStyle>;
  showAddButton?: boolean;
}
